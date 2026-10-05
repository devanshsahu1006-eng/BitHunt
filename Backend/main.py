from flask import Flask, render_template, redirect, flash, abort, url_for, request, jsonify
from flask_bootstrap import Bootstrap5
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey, Boolean, Float
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sys
import json
import random
from time import time
from dotenv import load_dotenv

# ---------------------------------------------------------------
# Load env from same directory as this file regardless of cwd
# ---------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DEVELOPER_EMAILS = [
    email.strip().lower()
    for email in os.environ.get("DEVELOPER_EMAILS", "").split(",") if email.strip()
]

ROUND_DURATION_SECONDS = int(os.environ.get("ROUND_DURATION_SECONDS", 1800))

# Allow form.py import from the Backend directory
sys.path.insert(0, BASE_DIR)
from form import SignUpForm, LoginForm, DevLoginForm, AddQuestionForm, SubmitMCQForm, JoinTeamForm

# ------ Defining Database ------ #
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# ------ Database Models -------- #
class EventConfig(Base):
    """Global master switches controlled by the developer."""
    __tablename__ = "event_config"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    round_1_active: Mapped[bool] = mapped_column(Boolean, default=False)
    round_2_active: Mapped[bool] = mapped_column(Boolean, default=False)

class Team(Base):
    __tablename__ = "teams"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    leader_id: Mapped[int] = mapped_column(Integer, nullable=True)

    # Venue Attendance Flag (Must be True for the team to play)
    is_present: Mapped[bool] = mapped_column(Boolean, default=False)

    round_1_score: Mapped[int] = mapped_column(Integer, default=0)
    round_2_score: Mapped[int] = mapped_column(Integer, default=0)

    current_round: Mapped[int] = mapped_column(Integer, default=1)
    r1_question_order: Mapped[str] = mapped_column(Text, default="[]")
    r2_question_order: Mapped[str] = mapped_column(Text, default="[]")
    current_question_index: Mapped[int] = mapped_column(Integer, default=0)
    round_start_time: Mapped[float] = mapped_column(Float, nullable=True)

    members: Mapped[list["User"]] = relationship(back_populates="team")
    submissions: Mapped[list["TeamSubmission"]] = relationship(back_populates="team", cascade="all, delete-orphan")

    @property
    def total_score(self):
        return self.round_1_score + self.round_2_score

class User(Base, UserMixin):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String, unique=True)
    role: Mapped[str] = mapped_column(String, default="participant")
    is_disqualified: Mapped[bool] = mapped_column(Boolean, default=False)

    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=True)
    team: Mapped["Team"] = relationship(back_populates="members")

class Question(Base):
    __tablename__ = "questions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    round_number: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    option_a: Mapped[str] = mapped_column(String)
    option_b: Mapped[str] = mapped_column(String)
    option_c: Mapped[str] = mapped_column(String)
    option_d: Mapped[str] = mapped_column(String)
    correct_option: Mapped[str] = mapped_column(String(1))
    points: Mapped[int] = mapped_column(Integer, default=10)

class TeamSubmission(Base):
    __tablename__ = "team_submissions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"))
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"))
    submitted_by_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    chosen_option: Mapped[str] = mapped_column(String(1))
    is_correct: Mapped[bool] = mapped_column(Boolean)

    team: Mapped["Team"] = relationship(back_populates="submissions")

# ------ App Configuration ------ #
app = Flask(__name__, template_folder=os.path.join(BASE_DIR, "templates"))
Bootstrap5(app)

# CORS: allow the React dev server and any production origin
cors_origins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
]
frontend_url_env = os.environ.get("FRONTEND_URL", "")
if frontend_url_env:
    for o in frontend_url_env.split(","):
        if o.strip():
            cors_origins.append(o.strip())

CORS(
    app,
    supports_credentials=True,
    origins=cors_origins,
    origin_regex=r"^https:\/\/.*\.vercel\.app$"
)

app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "fallback_secret_key")

# Database URI configuration: supports DATABASE_URL (e.g. Postgres in production) or local SQLite
database_url = os.environ.get("DATABASE_URL")
if database_url:
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'bithunt.db')}"

# Production cookie configuration for cross-site fetch with credentials
is_production = os.environ.get("FLASK_ENV") == "production" or os.environ.get("VERCEL") == "1"
if is_production:
    app.config["SESSION_COOKIE_SAMESITE"] = os.environ.get("SESSION_COOKIE_SAMESITE", "None")
    app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE", "True").lower() == "true"

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# ------ Helper Functions ------ #
def get_event_config() -> EventConfig:
    """Retrieves or initializes the singleton EventConfig row."""
    config = db.session.get(EventConfig, 1)
    if not config:
        config = EventConfig(id=1, round_1_active=False, round_2_active=False)
        db.session.add(config)
        db.session.commit()
    return config

def seed_questions():
    """Seed sample MCQ questions for testing if none exist."""
    count = db.session.execute(db.select(db.func.count(Question.id))).scalar()
    if count > 0:
        return
    sample = [
        Question(
            round_number=1,
            content="What is the time complexity of binary search?",
            option_a="O(n)", option_b="O(log n)", option_c="O(n log n)", option_d="O(1)",
            correct_option="B", points=10
        ),
        Question(
            round_number=1,
            content="Which data structure uses LIFO (Last In First Out)?",
            option_a="Queue", option_b="Heap", option_c="Stack", option_d="Linked List",
            correct_option="C", points=10
        ),
        Question(
            round_number=1,
            content="What does 'DFS' stand for?",
            option_a="Direct File Search", option_b="Depth First Search",
            option_c="Dynamic Function Scan", option_d="Data Frame Stack",
            correct_option="B", points=10
        ),
        Question(
            round_number=2,
            content="Which sorting algorithm has average case O(n log n) and is in-place?",
            option_a="Merge Sort", option_b="Quick Sort", option_c="Heap Sort", option_d="Bubble Sort",
            correct_option="B", points=20
        ),
        Question(
            round_number=2,
            content="What is the maximum number of edges in a simple graph with n vertices?",
            option_a="n", option_b="n-1", option_c="n(n-1)/2", option_d="n^2",
            correct_option="C", points=20
        ),
        Question(
            round_number=2,
            content="Which algorithm finds the shortest path in a weighted graph with non-negative edges?",
            option_a="BFS", option_b="DFS", option_c="Dijkstra's", option_d="Bellman-Ford",
            correct_option="C", points=20
        ),
    ]
    db.session.add_all(sample)
    db.session.commit()

with app.app_context():
    os.makedirs(os.path.join(BASE_DIR, 'instance'), exist_ok=True)
    db.create_all()
    get_event_config()
    seed_questions()

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return redirect(url_for('login'))
            if current_user.role not in roles:
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def api_login_required(f):
    """JSON-returning equivalent of @login_required for /api/* routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({"error": "Not authenticated"}), 401
        return f(*args, **kwargs)
    return decorated

def start_team_round_session(team: Team, round_num: int):
    """Called ONLY when a team clicks Play/Start. Shuffles questions and starts their timer."""
    questions = db.session.execute(
        db.select(Question.id).where(Question.round_number == round_num)
    ).scalars().all()

    shuffled_ids = list(questions)
    random.shuffle(shuffled_ids)

    if round_num == 1:
        team.r1_question_order = json.dumps(shuffled_ids)
    elif round_num == 2:
        team.r2_question_order = json.dumps(shuffled_ids)

    team.current_question_index = 0
    team.current_round = round_num
    team.round_start_time = time() if shuffled_ids else None
    db.session.commit()

def promote_team_to_round_2(team: Team):
    """Moves a team to Round 2 WITHOUT starting their timer or shuffling questions yet."""
    team.current_round = 2
    team.r2_question_order = "[]"
    team.current_question_index = 0
    team.round_start_time = None
    team.is_present = False  # Requires venue attendance re-verification on Round 2 day

def cleanup_team_after_member_leaves(team: Team, leaving_user_id: int):
    remaining_members = [m for m in team.members if m.id != leaving_user_id]
    if not remaining_members:
        db.session.delete(team)
    elif team.leader_id == leaving_user_id:
        team.leader_id = remaining_members[0].id

# ================================================================
# JSON HELPER
# ================================================================
def user_to_dict(user: User) -> dict:
    team = user.team
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "is_disqualified": user.is_disqualified,
        "teamId": user.team_id,
        "teamName": team.name if team else None,
        "college": "IIT Dharwad",  # stored implicitly; extend if you add a college field
    }

# ================================================================
# REST JSON API (/api/*)
# ================================================================

# ---- Auth -------------------------------------------------------
@app.route("/api/auth/login", methods=["POST"])
def api_login():
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = db.session.execute(db.select(User).where(User.email == email)).scalar()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password."}), 401

    login_user(user, remember=True)
    return jsonify({"message": "Login successful.", "user": user_to_dict(user)}), 200


@app.route("/api/auth/register", methods=["POST"])
def api_register():
    data = request.get_json(force=True, silent=True) or {}

    name      = (data.get("name") or "").strip()
    email     = (data.get("email") or "").strip().lower()
    password  = data.get("password") or ""
    phone     = (data.get("phone") or "").strip()
    team_name = (data.get("teamName") or data.get("team_name") or "").strip()

    # Basic validation
    if not all([name, email, password, phone, team_name]):
        return jsonify({"error": "All fields are required: name, email, password, phone, teamName."}), 400
    if len(phone) != 10 or not phone.isdigit():
        return jsonify({"error": "Phone must be exactly 10 digits."}), 400
    if len(password) <= 8:
        return jsonify({"error": "Password must be more than 8 characters."}), 400

    existing = db.session.execute(
        db.select(User).where((User.email == email) | (User.phone == phone))
    ).scalar()
    if existing:
        return jsonify({"error": "Email or phone already registered."}), 409

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256", salt_length=8)
    assigned_role = "developer" if email in DEVELOPER_EMAILS else "participant"

    team = None
    is_new_team = False
    if assigned_role == "participant":
        team = db.session.execute(db.select(Team).where(Team.name == team_name)).scalar()
        if team:
            if len(team.members) >= 4:
                return jsonify({"error": f"Team '{team_name}' is full (max 4 members)."}), 409
        else:
            team = Team(name=team_name)
            db.session.add(team)
            db.session.commit()
            is_new_team = True

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        phone=phone,
        role=assigned_role,
        team_id=team.id if team else None
    )
    db.session.add(new_user)
    db.session.commit()

    if is_new_team and team:
        team.leader_id = new_user.id
        db.session.commit()

    login_user(new_user, remember=True)
    return jsonify({"message": "Registration successful.", "user": user_to_dict(new_user)}), 201


@app.route("/api/auth/me", methods=["GET"])
def api_me():
    if not current_user.is_authenticated:
        return jsonify({"user": None}), 200
    return jsonify({"user": user_to_dict(current_user)}), 200


@app.route("/api/auth/logout", methods=["POST"])
def api_logout():
    logout_user()
    return jsonify({"message": "Logged out."}), 200


# ---- Dashboard --------------------------------------------------
@app.route("/api/dashboard", methods=["GET"])
@api_login_required
def api_dashboard():
    config = get_event_config()
    team = db.session.get(Team, current_user.team_id) if current_user.team_id else None
    members = []
    if team:
        members = [{"id": m.id, "name": m.name, "email": m.email} for m in team.members]

    return jsonify({
        "user": user_to_dict(current_user),
        "team": {
            "id": team.id,
            "name": team.name,
            "leaderId": team.leader_id,
            "isPresent": team.is_present,
            "round1Score": team.round_1_score,
            "round2Score": team.round_2_score,
            "totalScore": team.total_score,
            "currentRound": team.current_round,
            "members": members,
        } if team else None,
        "config": {
            "round1Active": config.round_1_active,
            "round2Active": config.round_2_active,
        }
    }), 200


# ---- Contest ----------------------------------------------------
@app.route("/api/contest/overview", methods=["GET"])
@api_login_required
def api_contest_overview():
    config = get_event_config()
    team = db.session.get(Team, current_user.team_id) if current_user.team_id else None

    remaining_seconds = None
    if team and team.round_start_time:
        elapsed = int(time() - team.round_start_time)
        remaining_seconds = max(0, ROUND_DURATION_SECONDS - elapsed)

    return jsonify({
        "title": "BitHunt: The Doomsday Arena",
        "round1Active": config.round_1_active,
        "round2Active": config.round_2_active,
        "currentRound": team.current_round if team else 1,
        "isPresent": team.is_present if team else False,
        "remainingSeconds": remaining_seconds,
        "roundDurationSeconds": ROUND_DURATION_SECONDS,
        "teamScore": team.total_score if team else 0,
    }), 200


@app.route("/api/contest/problems", methods=["GET"])
@api_login_required
def api_contest_problems():
    team = db.session.get(Team, current_user.team_id) if current_user.team_id else None
    if not team:
        return jsonify({"error": "No team assigned."}), 400

    config = get_event_config()
    round_num = team.current_round

    if round_num == 1 and not config.round_1_active:
        return jsonify({"error": "Round 1 is not active yet."}), 403
    if round_num == 2 and not config.round_2_active:
        return jsonify({"error": "Round 2 is not active yet."}), 403
    if not team.is_present:
        return jsonify({"error": "Team attendance not verified."}), 403

    questions = db.session.execute(
        db.select(Question).where(Question.round_number == round_num)
    ).scalars().all()

    return jsonify([{
        "id": q.id,
        "code": f"BH-R{q.round_number}-{q.id:02d}",
        "title": q.content[:60] + ("..." if len(q.content) > 60 else ""),
        "content": q.content,
        "optionA": q.option_a,
        "optionB": q.option_b,
        "optionC": q.option_c,
        "optionD": q.option_d,
        "points": q.points,
        "roundNumber": q.round_number,
        "difficulty": "Alpha" if q.points <= 10 else "Gamma" if q.points <= 20 else "Omega",
    } for q in questions]), 200


@app.route("/api/contest/problems/<int:q_id>", methods=["GET"])
@api_login_required
def api_contest_problem_detail(q_id):
    q = db.session.get(Question, q_id)
    if not q:
        return jsonify({"error": "Question not found."}), 404
    return jsonify({
        "id": q.id,
        "code": f"BH-R{q.round_number}-{q.id:02d}",
        "content": q.content,
        "optionA": q.option_a,
        "optionB": q.option_b,
        "optionC": q.option_c,
        "optionD": q.option_d,
        "points": q.points,
        "roundNumber": q.round_number,
        "difficulty": "Alpha" if q.points <= 10 else "Gamma" if q.points <= 20 else "Omega",
    }), 200


@app.route("/api/contest/submit", methods=["POST"])
@api_login_required
def api_contest_submit():
    if current_user.is_disqualified:
        return jsonify({"error": "You are disqualified."}), 403

    team = db.session.get(Team, current_user.team_id)
    if not team:
        return jsonify({"error": "No team assigned."}), 400
    if not team.is_present:
        return jsonify({"error": "Team attendance not verified."}), 403

    config = get_event_config()
    if team.current_round == 1 and not config.round_1_active:
        return jsonify({"error": "Round 1 is not active."}), 403
    if team.current_round == 2 and not config.round_2_active:
        return jsonify({"error": "Round 2 is not active."}), 403

    # Check timer
    if team.round_start_time:
        elapsed = int(time() - team.round_start_time)
        if elapsed >= ROUND_DURATION_SECONDS:
            return jsonify({"error": "Time is up! Round ended.", "timeExpired": True}), 400

    data = request.get_json(force=True, silent=True) or {}
    question_id = data.get("questionId") or data.get("problemId")
    chosen = (data.get("chosenOption") or data.get("option") or "").upper().strip()

    if not question_id or chosen not in ("A", "B", "C", "D"):
        return jsonify({"error": "questionId and chosenOption (A/B/C/D) are required."}), 400

    question = db.session.get(Question, int(question_id))
    if not question:
        return jsonify({"error": "Question not found."}), 404

    # Anti-double-submit
    already = db.session.execute(
        db.select(TeamSubmission).where(
            TeamSubmission.team_id == team.id,
            TeamSubmission.question_id == question.id,
        )
    ).scalar()
    if already:
        return jsonify({"error": "Already submitted by your team for this question."}), 409

    is_correct = (chosen == question.correct_option)
    sub = TeamSubmission(
        team_id=team.id,
        question_id=question.id,
        submitted_by_user_id=current_user.id,
        chosen_option=chosen,
        is_correct=is_correct,
    )
    db.session.add(sub)

    if is_correct:
        if team.current_round == 1:
            team.round_1_score += question.points
        else:
            team.round_2_score += question.points

    team.current_question_index += 1
    db.session.commit()

    return jsonify({
        "correct": is_correct,
        "pointsEarned": question.points if is_correct else 0,
        "correctOption": question.correct_option,
        "teamScore": team.total_score,
        "nextQuestionIndex": team.current_question_index,
        "message": "Correct! Points added." if is_correct else "Wrong answer. Moving on.",
    }), 200


@app.route("/api/contest/leaderboard", methods=["GET"])
def api_contest_leaderboard():
    teams = db.session.execute(db.select(Team)).scalars().all()
    sorted_teams = sorted(teams, key=lambda t: t.total_score, reverse=True)
    return jsonify([{
        "rank": idx + 1,
        "teamId": t.id,
        "teamName": t.name,
        "round1Score": t.round_1_score,
        "round2Score": t.round_2_score,
        "totalScore": t.total_score,
        "currentRound": t.current_round,
        "memberCount": len(t.members),
    } for idx, t in enumerate(sorted_teams)]), 200


# ---- Existing gameplay anti-cheat endpoints (kept for compatibility) ----
@app.route("/api/check_update/<int:current_index>")
@api_login_required
def check_update(current_index):
    team = db.session.get(Team, current_user.team_id)
    if team and team.current_question_index > current_index:
        return jsonify({"updated": True}), 200
    return jsonify({"updated": False}), 200


@app.route("/end_round_early", methods=["POST"])
@api_login_required
def end_round_early():
    user = db.session.get(User, current_user.id)
    if user:
        user.is_disqualified = True
        db.session.commit()
    return jsonify({"status": "disqualified"}), 200


# ================================================================
# ORIGINAL FLASK HTML ROUTES (Admin / Developer dashboard)
# ================================================================

@app.route("/", methods=["GET"])
def home():
    if current_user.is_authenticated:
        if current_user.role == "participant":
            return redirect(url_for("participant_dashboard"))
        elif current_user.role == "developer":
            return redirect(url_for("developer_dashboard"))
    return render_template("index.html")


@app.route("/leaderboard", methods=["GET"])
@login_required
def leaderboard():
    teams = db.session.execute(db.select(Team)).scalars().all()
    sorted_teams = sorted(teams, key=lambda t: t.total_score, reverse=True)
    return render_template("leaderboard.html", teams=sorted_teams)


# ----- Authentication & Account Management ------- #
@app.route("/sign_up", methods=["GET", "POST"])
def sign_up():
    form = SignUpForm()
    if form.validate_on_submit():
        user_email = form.email.data.strip().lower()
        existing_user = db.session.execute(
            db.select(User).where((User.email == user_email) | (User.phone == form.phone.data))
        ).scalar()

        if existing_user:
            flash("Email or Phone No. already registered. Please log in.", "warning")
            return redirect(url_for("login"))

        hashed_password = generate_password_hash(form.password.data, method="pbkdf2:sha256", salt_length=8)
        assigned_role = "developer" if user_email in DEVELOPER_EMAILS else "participant"

        team_name = form.team_name.data.strip()
        team = db.session.execute(db.select(Team).where(Team.name == team_name)).scalar()
        is_new_team = False

        if assigned_role == "participant":
            if team:
                if len(team.members) >= 4:
                    flash(f"Team '{team_name}' is full (Max 4 members). Join another or create a new one.", "danger")
                    return redirect(url_for("sign_up"))
            else:
                team = Team(name=team_name)
                db.session.add(team)
                db.session.commit()
                is_new_team = True
        else:
            team = None

        new_user = User(
            name=form.name.data,
            email=user_email,
            password=hashed_password,
            phone=form.phone.data,
            role=assigned_role,
            team_id=team.id if team else None
        )
        db.session.add(new_user)
        db.session.commit()

        if is_new_team and team:
            team.leader_id = new_user.id
            db.session.commit()

        login_user(new_user)
        return redirect(url_for("home"))

    return render_template("sign_up.html", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.execute(db.select(User).where(User.email == form.email.data.strip().lower())).scalar()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for("home"))
        else:
            flash("Invalid email or password.", "danger")
    return render_template("login.html", form=form)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))


@app.route("/delete_account", methods=["POST"])
@login_required
def delete_account():
    user = db.session.get(User, current_user.id)
    if user:
        subs = db.session.execute(
            db.select(TeamSubmission).where(TeamSubmission.submitted_by_user_id == user.id)
        ).scalars().all()
        for s in subs:
            s.submitted_by_user_id = None

        if user.team:
            cleanup_team_after_member_leaves(user.team, user.id)

        logout_user()
        db.session.delete(user)
        db.session.commit()
        flash("Your account has been permanently deleted from the event.", "info")
    return redirect(url_for("home"))


# ----- Participant & Team Management Routes ------- #
@app.route("/dashboard", methods=["GET", "POST"])
@role_required("participant")
def participant_dashboard():
    team = db.session.get(Team, current_user.team_id) if current_user.team_id else None
    config = get_event_config()
    join_form = JoinTeamForm()

    if not team and join_form.validate_on_submit():
        team_name = join_form.team_name.data.strip()
        target_team = db.session.execute(db.select(Team).where(Team.name == team_name)).scalar()
        is_new = False

        if target_team:
            if len(target_team.members) >= 4:
                flash(f"Team '{team_name}' is full (Max 4 members).", "danger")
                return redirect(url_for("participant_dashboard"))
        else:
            target_team = Team(name=team_name, leader_id=current_user.id)
            db.session.add(target_team)
            db.session.commit()
            is_new = True

        user = db.session.get(User, current_user.id)
        user.team_id = target_team.id
        db.session.commit()
        flash(f"{'Created' if is_new else 'Joined'} team '{team_name}'!", "success")
        return redirect(url_for("participant_dashboard"))

    return render_template("participant_dashboard.html", team=team, join_form=join_form, config=config)


@app.route("/team/leave", methods=["POST"])
@role_required("participant")
def leave_team():
    user = db.session.get(User, current_user.id)
    if user and user.team:
        team = user.team
        team_name = team.name
        user.team_id = None
        cleanup_team_after_member_leaves(team, user.id)
        db.session.commit()
        flash(f"You have left team '{team_name}'.", "info")
    return redirect(url_for("participant_dashboard"))


@app.route("/team/remove_member/<int:member_id>", methods=["POST"])
@role_required("participant")
def remove_member(member_id):
    team = db.session.get(Team, current_user.team_id)
    if not team or team.leader_id != current_user.id:
        abort(403)

    if member_id == current_user.id:
        flash("Use the 'Leave Team' button to remove yourself.", "warning")
        return redirect(url_for("participant_dashboard"))

    member = db.session.get(User, member_id)
    if member and member.team_id == team.id:
        member.team_id = None
        db.session.commit()
        flash(f"Removed {member.name} from the team.", "info")
    return redirect(url_for("participant_dashboard"))


# ----- Gameplay & Anti-Cheat Routes ------- #
@app.route("/play", methods=["GET", "POST"])
@role_required("participant")
def play_round():
    if current_user.is_disqualified:
        return render_template("disqualified.html")

    team = db.session.get(Team, current_user.team_id)
    if not team:
        flash("You must join or create a team before playing.", "warning")
        return redirect(url_for("participant_dashboard"))

    if not team.is_present:
        flash("Access Denied: Your team has not been marked present at the venue by the organizers.", "danger")
        return redirect(url_for("participant_dashboard"))

    config = get_event_config()
    if team.current_round == 1 and not config.round_1_active:
        flash("Round 1 is currently locked by the organizers. Please wait for the round to start.", "warning")
        return redirect(url_for("participant_dashboard"))
    if team.current_round == 2 and not config.round_2_active:
        flash("Round 2 is currently locked by the organizers. Please wait for the round to start.", "warning")
        return redirect(url_for("participant_dashboard"))

    active_order_str = team.r1_question_order if team.current_round == 1 else team.r2_question_order
    question_ids = json.loads(active_order_str)

    if not question_ids:
        start_team_round_session(team, team.current_round)
        active_order_str = team.r1_question_order if team.current_round == 1 else team.r2_question_order
        question_ids = json.loads(active_order_str)
        if not question_ids:
            flash(f"No questions have been uploaded for Round {team.current_round} yet.", "warning")
            return redirect(url_for("participant_dashboard"))

    if team.current_question_index >= len(question_ids):
        return render_template("round_completed.html", team=team, time_expired=False)

    if not team.round_start_time:
        team.round_start_time = time()
        db.session.commit()

    elapsed = int(time() - team.round_start_time)
    remaining_seconds = max(0, ROUND_DURATION_SECONDS - elapsed)

    if remaining_seconds <= 0:
        team.current_question_index = 99999
        db.session.commit()
        flash("Time is up! Your round has automatically ended.", "danger")
        return render_template("round_completed.html", team=team, time_expired=True)

    current_q_id = question_ids[team.current_question_index]
    question = db.session.get(Question, current_q_id)

    if not question:
        team.current_question_index += 1
        db.session.commit()
        return redirect(url_for("play_round"))

    form = SubmitMCQForm()
    form.chosen_option.choices = [
        ('A', f"A. {question.option_a}"),
        ('B', f"B. {question.option_b}"),
        ('C', f"C. {question.option_c}"),
        ('D', f"D. {question.option_d}")
    ]

    if form.validate_on_submit():
        already_submitted = db.session.execute(
            db.select(TeamSubmission).where(
                TeamSubmission.team_id == team.id,
                TeamSubmission.question_id == question.id
            )
        ).scalar()

        if already_submitted:
            flash("A teammate just answered that question! Loaded the next question.", "warning")
            return redirect(url_for("play_round"))

        selected = form.chosen_option.data
        is_correct = (selected == question.correct_option)

        sub = TeamSubmission(
            team_id=team.id,
            question_id=question.id,
            submitted_by_user_id=current_user.id,
            chosen_option=selected,
            is_correct=is_correct
        )
        db.session.add(sub)

        if is_correct:
            if team.current_round == 1:
                team.round_1_score += question.points
            else:
                team.round_2_score += question.points
            flash("Correct answer! Points added to team score.", "success")
        else:
            flash("Incorrect answer! Moving to the next question.", "danger")

        team.current_question_index += 1
        db.session.commit()
        return redirect(url_for("play_round"))

    return render_template(
        "play.html",
        question=question,
        form=form,
        team=team,
        remaining_seconds=remaining_seconds
    )


# ----- Developer / Admin Routes ------- #
@app.route("/developer/dashboard", methods=["GET"])
@role_required("developer")
def developer_dashboard():
    config = get_event_config()
    teams = db.session.execute(db.select(Team)).scalars().all()
    questions = db.session.execute(db.select(Question).order_by(Question.round_number)).scalars().all()
    disqualified_users = db.session.execute(
        db.select(User).where(User.is_disqualified == True)
    ).scalars().all()

    return render_template(
        "developer_dashboard.html",
        config=config,
        teams=teams,
        questions=questions,
        disqualified_users=disqualified_users
    )


@app.route("/developer/toggle_round/<int:round_num>", methods=["POST"])
@role_required("developer")
def toggle_round(round_num):
    config = get_event_config()
    if round_num == 1:
        config.round_1_active = not config.round_1_active
        state = "UNLOCKED (Live)" if config.round_1_active else "LOCKED"
        flash(f"Round 1 is now {state}.", "success" if config.round_1_active else "warning")
    elif round_num == 2:
        config.round_2_active = not config.round_2_active
        state = "UNLOCKED (Live)" if config.round_2_active else "LOCKED"
        flash(f"Round 2 is now {state}.", "success" if config.round_2_active else "warning")
    db.session.commit()
    return redirect(url_for("developer_dashboard"))


@app.route("/developer/toggle_presence/<int:team_id>", methods=["POST"])
@role_required("developer")
def toggle_presence(team_id):
    team = db.session.get(Team, team_id)
    if team:
        team.is_present = not team.is_present
        db.session.commit()
        status = "Present at Venue" if team.is_present else "Absent (Blocked)"
        flash(f"Team '{team.name}' marked as {status}.", "info")
    return redirect(url_for("developer_dashboard"))


@app.route("/developer/mark_all_present", methods=["POST"])
@role_required("developer")
def mark_all_present():
    teams = db.session.execute(db.select(Team)).scalars().all()
    for team in teams:
        team.is_present = True
    db.session.commit()
    flash("All registered teams have been marked Present at the venue.", "success")
    return redirect(url_for("developer_dashboard"))


@app.route("/developer/pardon/<int:user_id>", methods=["POST"])
@role_required("developer")
def pardon_user(user_id):
    user = db.session.get(User, user_id)
    if user:
        user.is_disqualified = False
        db.session.commit()
        flash(f"Pardoned {user.name}. They can now resume playing.", "success")
    return redirect(url_for("developer_dashboard"))


@app.route("/developer/advance_team/<int:team_id>", methods=["POST"])
@role_required("developer")
def advance_team(team_id):
    team = db.session.get(Team, team_id)
    if team:
        if team.current_round == 1:
            promote_team_to_round_2(team)
            db.session.commit()
            flash(f"Team '{team.name}' promoted to Round 2!", "success")
        else:
            flash(f"Team '{team.name}' is already in Round 2.", "warning")
    return redirect(url_for("developer_dashboard"))


@app.route("/developer/advance_all_teams", methods=["POST"])
@role_required("developer")
def advance_all_teams():
    teams = db.session.execute(db.select(Team).where(Team.current_round == 1)).scalars().all()
    count = 0
    for team in teams:
        promote_team_to_round_2(team)
        count += 1
    db.session.commit()
    flash(f"Promoted {count} team(s) to Round 2!", "success")
    return redirect(url_for("developer_dashboard"))


@app.route("/developer/add_question", methods=["GET", "POST"])
@role_required("developer")
def add_question():
    form = AddQuestionForm()
    if form.validate_on_submit():
        new_question = Question(
            round_number=form.round_number.data,
            content=form.content.data,
            option_a=form.option_a.data,
            option_b=form.option_b.data,
            option_c=form.option_c.data,
            option_d=form.option_d.data,
            correct_option=form.correct_option.data,
            points=form.points.data
        )
        db.session.add(new_question)
        db.session.commit()
        flash("Question added successfully!", "success")
        return redirect(url_for("developer_dashboard"))
    return render_template("add_question.html", form=form, is_edit=False)


@app.route("/developer/edit_question/<int:q_id>", methods=["GET", "POST"])
@role_required("developer")
def edit_question(q_id):
    question = db.session.get(Question, q_id)
    if not question:
        abort(404)

    form = AddQuestionForm(obj=question)
    if form.validate_on_submit():
        question.round_number = form.round_number.data
        question.content = form.content.data
        question.option_a = form.option_a.data
        question.option_b = form.option_b.data
        question.option_c = form.option_c.data
        question.option_d = form.option_d.data
        question.correct_option = form.correct_option.data
        question.points = form.points.data
        db.session.commit()
        flash("Question updated successfully!", "success")
        return redirect(url_for("developer_dashboard"))

    return render_template("add_question.html", form=form, is_edit=True)


@app.route("/developer/delete_question/<int:q_id>", methods=["POST"])
@role_required("developer")
def delete_question(q_id):
    question = db.session.get(Question, q_id)
    if question:
        subs = db.session.execute(
            db.select(TeamSubmission).where(TeamSubmission.question_id == q_id)
        ).scalars().all()
        for s in subs:
            db.session.delete(s)

        db.session.delete(question)
        db.session.commit()
        flash("Question deleted.", "info")
    return redirect(url_for("developer_dashboard"))


@app.route("/sih_hidden_gateway", methods=["GET", "POST"])
def hidden_dev_gateway():
    form = DevLoginForm()
    if form.validate_on_submit():
        if form.secret_pin.data != os.environ.get("DEV_PIN"):
            flash("Unauthorized access attempt flagged.", "danger")
            return redirect(url_for("home"))

        user_email = form.email.data.strip().lower()
        user = db.session.execute(db.select(User).where(User.email == user_email)).scalar()

        if user:
            if user.role == "developer" and check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for("developer_dashboard"))
            else:
                flash("Invalid developer credentials.", "danger")
        elif user_email in DEVELOPER_EMAILS:
            hashed_pw = generate_password_hash(form.password.data, method="pbkdf2:sha256", salt_length=8)
            new_dev = User(
                name="System Admin",
                email=user_email,
                password=hashed_pw,
                phone="0000000000",
                role="developer"
            )
            db.session.add(new_dev)
            db.session.commit()
            login_user(new_dev)
            flash("Developer account created and logged in.", "success")
            return redirect(url_for("developer_dashboard"))
        else:
            flash("Email not authorized for developer access.", "danger")
    return render_template("dev_gateway.html", form=form)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)