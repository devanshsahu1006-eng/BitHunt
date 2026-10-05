from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, SubmitField, TelField, IntegerField, TextAreaField, RadioField
from wtforms.validators import DataRequired, EqualTo, Email, ValidationError

class PasswordSize(object):
    def __init__(self, message=None):
        if not message:
            message = "Password must be greater than 8 characters."
        self.message = message
    def __call__(self, form, field):
        if len(field.data) <= 8:
            raise ValidationError(self.message)
        
class PhoneNumberValidator(object):
    def __init__(self, message=None):
        if not message:
            message = "Please enter a valid 10-digit Phone No."
        self.message = message
    def __call__(self, form, field):
        if len(field.data) != 10 or not field.data.isdigit():
            raise ValidationError(self.message)

class SignUpForm(FlaskForm):
    name = StringField(label="Full Name", validators=[DataRequired(message="This is a required field.")])
    email = EmailField(label="Email Address", validators=[DataRequired(message="Please provide an email address."), Email(message="Please enter a valid email address.")])
    password = PasswordField(label="Password", validators=[DataRequired(message="Please enter a password."), PasswordSize()])
    confirm = PasswordField(label="Confirm Password", validators=[DataRequired(message="Please confirm your password."), EqualTo(fieldname="password", message="Passwords must match.")])
    phone = TelField(label="Phone No.", validators=[DataRequired(message="Phone number is required."), PhoneNumberValidator()])
    team_name = StringField(label="Team Name", validators=[DataRequired(message="Please provide a team name to join or create.")])
    submit = SubmitField("Register")

class JoinTeamForm(FlaskForm):
    team_name = StringField(label="Enter Team Name to Join or Create", validators=[DataRequired()])
    submit = SubmitField("Join / Create Team")

class LoginForm(FlaskForm):
    email = EmailField(label="Enter Email", validators=[DataRequired(message="Email is required."), Email(message="Please enter a valid email.")])
    password = PasswordField(label="Enter Password", validators=[DataRequired(message="Password is required.")])
    submit = SubmitField("Log In")

class DevLoginForm(FlaskForm):
    email = EmailField(label="Developer Email", validators=[DataRequired(message="Admin email required."), Email()])
    password = PasswordField(label="Password", validators=[DataRequired(message="Password required.")])
    secret_pin = PasswordField(label="System Admin PIN", validators=[DataRequired(message="PIN required for access.")])
    submit = SubmitField("Access Gateway")

class AddQuestionForm(FlaskForm):
    round_number = IntegerField("Round Number (1 or 2)", validators=[DataRequired()])
    content = TextAreaField("Question Content", validators=[DataRequired()])
    option_a = StringField("Option A", validators=[DataRequired()])
    option_b = StringField("Option B", validators=[DataRequired()])
    option_c = StringField("Option C", validators=[DataRequired()])
    option_d = StringField("Option D", validators=[DataRequired()])
    correct_option = RadioField("Correct Option", choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], validators=[DataRequired()])
    points = IntegerField("Points", default=10, validators=[DataRequired()])
    submit = SubmitField("Save Question")

class SubmitMCQForm(FlaskForm):
    chosen_option = RadioField("Choose Answer", choices=[
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D')
    ], validators=[DataRequired(message="Select an option before submitting.")])
    submit = SubmitField("Submit Team Answer")