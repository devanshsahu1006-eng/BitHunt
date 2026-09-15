import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Send,
  Code2,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { contestApi, CONTEST_PROBLEMS } from '../../api/contest';
import { useAudio } from '../../context/AudioContext';

export const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playClick, playSuccess } = useAudio();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Execution & Verdict states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const p = CONTEST_PROBLEMS.find((item) => item.id === id) || CONTEST_PROBLEMS[0];
    setProblem(p);
    setCode(p.starterCode[language] || p.starterCode['cpp']);
  }, [id]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const copySampleInput = (input) => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSample = async () => {
    playClick();
    setIsRunning(true);
    setConsoleOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput({
        type: 'sample',
        status: 'SUCCESS',
        runtime: '12ms',
        memory: '6.8MB',
        input: problem?.samples[0]?.input || '',
        expected: problem?.samples[0]?.output || '',
        actual: problem?.samples[0]?.output || '',
        stdout: `Compilation successful (0 warnings, 0 errors).
[Sandbox Node 07] Executing test vector...
Case #1: PASS [CPU: 10ms, RAM: 6.2MB]
Case #2: PASS [CPU: 12ms, RAM: 6.8MB]
All sample constraints verified.`
      });
    }, 800);
  };

  const handleSubmit = async () => {
    playClick();
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT
      // Flask API will be connected here.
      // POST /api/contest/submit
      // Body: { problemId: id, language, code }
      // =========================================================================
      const result = await contestApi.submitSolution({
        problemId: problem.id,
        language,
        code,
      });

      setSubmissionResult(result);

      if (result.status === 'ACCEPTED') {
        playSuccess();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00e575', '#ffffff', '#18201d'],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen pt-32 text-center text-metallic-400 font-cinematic">
        Loading problem specifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <Link
            to="/contest"
            className="w-8 h-8 rounded-sm bg-[#060908] border border-white/10 flex items-center justify-center text-metallic-400 hover:text-white hover:border-white/30 transition-all"
            title="Return to Arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-cinematic text-[#00e575] tracking-wider">
                {problem.code}
              </span>
              <span className="text-metallic-600">·</span>
              <h1 className="text-xl sm:text-2xl font-cinematic font-normal text-white">
                {problem.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-cinematic tracking-wider">
          <span className="text-metallic-400">
            Score: <strong className="text-white">{problem.points} Points</strong>
          </span>
          <span className="text-metallic-600">·</span>
          <span className="text-[#00e575] uppercase">
            Tier: {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Problem Specification */}
        <div className="lg:col-span-6 space-y-6 h-[calc(100vh-180px)] overflow-y-auto pr-3">
          <div className="p-8 rounded-sm bg-[#070b09] border border-white/5 space-y-8">
            
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
                Problem Description
              </h2>
              <div className="text-sm font-sans text-metallic-300 leading-relaxed whitespace-pre-line">
                {problem.description}
              </div>
            </div>

            {/* Input Format */}
            <div className="space-y-2 border-t border-white/5 pt-6">
              <h3 className="text-xs font-cinematic uppercase tracking-[0.2em] text-metallic-400">
                Input Format
              </h3>
              <div className="text-xs font-mono text-metallic-300 bg-[#040605] p-4 rounded-sm border border-white/5 leading-relaxed">
                {problem.inputFormat}
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-2 border-t border-white/5 pt-6">
              <h3 className="text-xs font-cinematic uppercase tracking-[0.2em] text-metallic-400">
                Output Format
              </h3>
              <div className="text-xs font-mono text-metallic-300 bg-[#040605] p-4 rounded-sm border border-white/5 leading-relaxed">
                {problem.outputFormat}
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-2 border-t border-white/5 pt-6">
              <h3 className="text-xs font-cinematic uppercase tracking-[0.2em] text-metallic-400">
                Constraints
              </h3>
              <div className="text-xs font-mono text-metallic-300 bg-[#040605] p-4 rounded-sm border border-white/5 whitespace-pre-line leading-relaxed">
                {problem.constraints}
              </div>
            </div>

            {/* Samples */}
            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-cinematic uppercase tracking-[0.2em] text-metallic-400">
                  Sample Test Cases
                </h3>
                <button
                  onClick={() => copySampleInput(problem.samples[0]?.input)}
                  className="text-[11px] font-sans text-metallic-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#00e575]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Sample Input'}</span>
                </button>
              </div>

              {problem.samples.map((sample, idx) => (
                <div key={idx} className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-metallic-500 text-[10px] font-sans uppercase tracking-wider">Sample Input</span>
                      <pre className="bg-[#040605] p-3 rounded-sm border border-white/5 text-white overflow-x-auto">
                        {sample.input}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-metallic-500 text-[10px] font-sans uppercase tracking-wider">Sample Output</span>
                      <pre className="bg-[#040605] p-3 rounded-sm border border-white/5 text-[#00e575] overflow-x-auto font-medium">
                        {sample.output}
                      </pre>
                    </div>
                  </div>
                  {sample.explanation && (
                    <p className="text-[11px] font-sans text-metallic-400 italic bg-white/[0.02] p-3 rounded-sm">
                      Explanation: {sample.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Code Editor & Execution Console */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Editor Header */}
          <div className="flex items-center justify-between p-3 rounded-t-sm bg-[#070b09] border border-white/10 text-xs font-sans">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-[#00e575]" />
              <span className="text-metallic-400 uppercase tracking-wider text-[10px]">Compiler:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#040605] text-white px-3 py-1 rounded-sm border border-white/10 text-xs focus:outline-none"
              >
                <option value="cpp">C++20 (GCC 13)</option>
                <option value="python">Python 3.11</option>
                <option value="java">Java 17 (OpenJDK)</option>
                <option value="javascript">JavaScript (Node.js 20)</option>
              </select>
            </div>

            <div className="text-[11px] text-metallic-500 font-cinematic uppercase tracking-widest">
              Cluster Node 07
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="relative rounded-b-sm border-x border-b border-white/10 bg-[#020403] overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              rows={16}
              className="w-full p-4 bg-transparent text-metallic-200 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y selection:bg-[#00e575] selection:text-black"
              placeholder="// Write your solution here..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              disabled={isRunning || isSubmitting}
              onClick={handleRunSample}
              className="px-6 py-3 rounded-sm bg-white/5 border border-white/15 hover:border-white/30 text-white text-xs font-cinematic uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? 'Running...' : 'Run Samples'}</span>
            </button>

            <button
              disabled={isRunning || isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-sm bg-white text-black font-cinematic font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00e575] transition-all flex items-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
            </button>
          </div>

          {/* Console / Verdict */}
          {(consoleOutput || submissionResult) && (
            <div className="p-6 rounded-sm bg-[#070b09] border border-white/10 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-cinematic uppercase tracking-[0.2em] text-white">
                  {submissionResult ? 'Evaluation Verdict' : 'Sample Run Output'}
                </span>
                <span className="text-[10px] text-metallic-500 uppercase tracking-widest">
                  Completed
                </span>
              </div>

              {/* Sample Output */}
              {consoleOutput && !submissionResult && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#00e575]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sample tests passed ({consoleOutput.runtime}, {consoleOutput.memory})</span>
                  </div>
                  <pre className="bg-[#040605] p-3 rounded-sm text-[11px] font-mono text-metallic-300 overflow-x-auto">
                    {consoleOutput.stdout}
                  </pre>
                </div>
              )}

              {/* Submission Result */}
              {submissionResult && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-sm border flex items-center justify-between ${
                      submissionResult.status === 'ACCEPTED'
                        ? 'bg-[#00e575]/5 border-[#00e575]/30 text-[#00e575]'
                        : 'bg-red-950/40 border-red-500/30 text-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {submissionResult.status === 'ACCEPTED' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00e575]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <strong className="text-sm font-cinematic font-bold block">
                          {submissionResult.status === 'ACCEPTED' ? 'Accepted' : 'Wrong Answer'}
                        </strong>
                        <span className="text-xs opacity-90">{submissionResult.verdict}</span>
                      </div>
                    </div>

                    <div className="text-right font-cinematic">
                      <span className="text-lg font-bold">
                        +{submissionResult.score} PTS
                      </span>
                      <div className="text-[10px] opacity-80 uppercase tracking-wider">
                        {submissionResult.testcasesPassed} / {submissionResult.totalTestcases} passed
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-metallic-400 border-t border-white/5 pt-3">
                    <div>
                      <span className="uppercase tracking-wider">Execution Time</span>
                      <strong className="block text-white mt-0.5">{submissionResult.executionTime}</strong>
                    </div>
                    <div>
                      <span className="uppercase tracking-wider">Memory Peak</span>
                      <strong className="block text-white mt-0.5">{submissionResult.memory}</strong>
                    </div>
                    <div>
                      <span className="uppercase tracking-wider">Submission ID</span>
                      <strong className="block text-[#00e575] mt-0.5">{submissionResult.submissionId}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
