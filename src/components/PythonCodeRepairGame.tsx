import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Timer, 
  Zap, 
  RotateCcw, 
  Users, 
  MessageSquare, 
  Swords, 
  Award, 
  Terminal, 
  Bug, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Flame,
  HelpCircle
} from 'lucide-react';
import { UserProfile, EduMatchedPeer } from '../types';

interface PythonChallenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  module: string;
  concept: string;
  description: string;
  errorTraceback: string;
  buggyCode: string[];
  buggyLineIndex: number; // 0-indexed
  options: {
    label: string;
    replacementCode: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  tests: {
    input: string;
    expected: string;
  }[];
  matchedPeer: {
    name: string;
    campus: string;
    year: string;
    qualification: string;
    skills: string[];
    matchScore: number;
    synergyReason: string;
    avatarInitials: string;
  };
}

const PYTHON_CHALLENGES: PythonChallenge[] = [
  {
    id: 'py-1',
    title: 'Fix IndexError in Campus Mark Sorter',
    difficulty: 'Beginner',
    module: 'PRG281 - Object Oriented Programming & Algorithms',
    concept: 'Off-by-one loop boundaries and zero-indexed arrays',
    description: 'A student wrote an algorithm to compute the highest test grade in a class cohort, but it crashes on the last iteration.',
    errorTraceback: `Traceback (most recent call last):
  File "grade_analyzer.py", line 4, in find_highest_mark
    if marks[i] > top_grade:
IndexError: list index out of range (Index 5 requested on array of length 5)`,
    buggyCode: [
      'def find_highest_mark(marks):',
      '    top_grade = marks[0]',
      '    # Find maximum grade in student marks array',
      '    for i in range(1, len(marks) + 1):',
      '        if marks[i] > top_grade:',
      '            top_grade = marks[i]',
      '    return top_grade'
    ],
    buggyLineIndex: 3,
    options: [
      {
        label: 'for i in range(1, len(marks)):',
        replacementCode: '    for i in range(1, len(marks)):',
        isCorrect: true,
        explanation: 'len(marks) ensures indices 1 to len-1 are inspected without accessing beyond the list bound.'
      },
      {
        label: 'for i in range(0, len(marks) + 1):',
        replacementCode: '    for i in range(0, len(marks) + 1):',
        isCorrect: false,
        explanation: 'Still requests len(marks), which throws IndexError on zero-indexed lists.'
      },
      {
        label: 'for i in range(len(marks) - 1):',
        replacementCode: '    for i in range(len(marks) - 1):',
        isCorrect: false,
        explanation: 'Skips the last element entirely and starts at 0, which re-evaluates marks[0].'
      }
    ],
    tests: [
      { input: 'marks = [65, 88, 72, 94, 81]', expected: '94 (Correct Max Grade)' },
      { input: 'marks = [50, 50, 50]', expected: '50' }
    ],
    matchedPeer: {
      name: 'Kagiso Molefe',
      campus: 'Bryanston Campus',
      year: '3rd Year',
      qualification: 'BSc Information Technology',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      matchScore: 98,
      synergyReason: 'You pinpointed array index constraints instantly. Kagiso excels at API architecture and seeks peer collaboration on algorithmic problem-solving for the national Datathon.',
      avatarInitials: 'KM'
    }
  },
  {
    id: 'py-2',
    title: 'Fix TypeError in Student Mark Aggregator',
    difficulty: 'Intermediate',
    module: 'PRG381 - Systems Architecture & Python Integration',
    concept: 'Type coercion and unparsed string inputs from JSON payloads',
    description: 'When importing test results from the campus portal, marks arrive as string tokens causing string-integer concatenation errors.',
    errorTraceback: `Traceback (most recent call last):
  File "academic_audit.py", line 4, in calculate_average
    total += mark
TypeError: unsupported operand type(s) for +=: 'int' and 'str'`,
    buggyCode: [
      'def calculate_average(marks):',
      '    total = 0',
      '    for mark in marks:',
      '        total += mark',
      '    return total / len(marks)'
    ],
    buggyLineIndex: 3,
    options: [
      {
        label: 'total += float(mark)',
        replacementCode: '        total += float(mark)',
        isCorrect: true,
        explanation: 'Casts string marks to floating-point numbers before accumulating total.'
      },
      {
        label: 'total = str(total) + mark',
        replacementCode: '        total = str(total) + mark',
        isCorrect: false,
        explanation: 'Performs string concatenation (e.g. "07582") instead of numerical addition.'
      },
      {
        label: 'total += int(len(mark))',
        replacementCode: '        total += int(len(mark))',
        isCorrect: false,
        explanation: 'Counts string length in characters rather than mark value.'
      }
    ],
    tests: [
      { input: 'marks = ["75", "82", "90", "65"]', expected: '78.0 (Correct Mean Average)' },
      { input: 'marks = ["100"]', expected: '100.0' }
    ],
    matchedPeer: {
      name: 'Nomvula Dlamini',
      campus: 'Braamfontein Campus',
      year: '2nd Year',
      qualification: 'Diploma in Information Technology',
      skills: ['Data Cleaning', 'Pandas', 'NumPy', 'Python Scripting'],
      matchScore: 96,
      synergyReason: 'Nomvula is building data pipelines for student wellness analytics and needs a study partner strong in type validation and defensive programming.',
      avatarInitials: 'ND'
    }
  },
  {
    id: 'py-3',
    title: 'Fix Mutable Default Parameter in Lab Attendance',
    difficulty: 'Advanced',
    module: 'SWE281 - Software Engineering & Code Quality',
    concept: 'Python mutable default arguments bound at function definition time',
    description: 'Attendance lists from morning lab sessions are leaking into afternoon batches due to a shared mutable list in default arguments.',
    errorTraceback: `AssertionError: Lab Batch B received 8 attendees instead of 3!
Previous student IDs from Batch A persisted in default parameter [] memory.`,
    buggyCode: [
      'def log_lab_attendance(student_id, cohort=[]):',
      '    cohort.append(student_id)',
      '    return cohort'
    ],
    buggyLineIndex: 0,
    options: [
      {
        label: 'def log_lab_attendance(student_id, cohort=None): if cohort is None: cohort = []',
        replacementCode: 'def log_lab_attendance(student_id, cohort=None):\n    if cohort is None:\n        cohort = []',
        isCorrect: true,
        explanation: 'Using None as a sentinel default avoids sharing mutable state between independent function invocations.'
      },
      {
        label: 'def log_lab_attendance(student_id, cohort=()):',
        replacementCode: 'def log_lab_attendance(student_id, cohort=()):',
        isCorrect: false,
        explanation: 'Tuples are immutable, so cohort.append() will throw an AttributeError.'
      },
      {
        label: 'def log_lab_attendance(student_id, cohort=""):',
        replacementCode: 'def log_lab_attendance(student_id, cohort=""):',
        isCorrect: false,
        explanation: 'Strings cannot be appended to as lists.'
      }
    ],
    tests: [
      { input: 'log_lab_attendance("RF-101"); log_lab_attendance("RF-202")', expected: 'Isolated cohorts [["RF-101"], ["RF-202"]]' }
    ],
    matchedPeer: {
      name: 'Tshepo Modise',
      campus: 'Umhlanga Campus',
      year: '3rd Year',
      qualification: 'BSc Computer Science',
      skills: ['Python OOP', 'Clean Code', 'Test Driven Development', 'FastAPI'],
      matchScore: 99,
      synergyReason: 'You understand Python memory models and default argument binding. Tshepo is preparing for graduate tech assessments and seeks high-velocity debugging partners.',
      avatarInitials: 'TM'
    }
  }
];

interface PythonCodeRepairGameProps {
  currentUser: UserProfile;
  onConnectPeer?: (peerName: string, message: string) => void;
  onAddStudyBuddy?: (peerName: string) => void;
}

export const PythonCodeRepairGame: React.FC<PythonCodeRepairGameProps> = ({
  currentUser,
  onConnectPeer,
  onAddStudyBuddy
}) => {
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const challenge = PYTHON_CHALLENGES[selectedChallengeIdx];

  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [buddyAdded, setBuddyAdded] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && testResult !== 'passed') {
      interval = setInterval(() => setSecondsElapsed(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, testResult]);

  const handleReset = () => {
    setSelectedOptionIdx(null);
    setTestResult('idle');
    setTestLogs([]);
    setSecondsElapsed(0);
    setIsTimerActive(true);
    setBuddyAdded(false);
    setMessageSent(false);
  };

  const handleRunVerification = () => {
    if (selectedOptionIdx === null) return;
    setIsTestRunning(true);
    setTestLogs([
      '⚡ Spawning Sandboxed Python 3.11 Runtime...',
      '🔍 Parsing Abstract Syntax Tree (AST) & Lexical Tokens...',
      '⚙️ Running unit test suite across Richfield test cases...'
    ]);

    setTimeout(() => {
      const chosen = challenge.options[selectedOptionIdx];
      if (chosen.isCorrect) {
        setTestLogs(prev => [
          ...prev,
          `✓ Test 1: Passed (${challenge.tests[0].input} -> ${challenge.tests[0].expected})`,
          `✓ Test 2: Passed with zero runtime warnings (11ms execution)`,
          '🎉 All unit tests passed! Code error permanently remediated.'
        ]);
        setTestResult('passed');
        setIsTimerActive(false);
      } else {
        setTestLogs(prev => [
          ...prev,
          `✗ Test Failed: ${chosen.explanation}`,
          '🛑 Python runtime encountered failure during test assertions.'
        ]);
        setTestResult('failed');
      }
      setIsTestRunning(false);
    }, 1100);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Game Header Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-black text-xs border border-amber-400/30 flex items-center gap-1">
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Python Bug-Fix Game</span>
            </span>
            <span className="text-xs text-slate-400">• Fix Error to Trigger Peer Match</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>{challenge.title}</span>
          </h2>
          <p className="text-xs text-slate-300">{challenge.module} • {challenge.concept}</p>
        </div>

        {/* Game Stats & Timer */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 text-slate-200">
            <Timer className="w-4 h-4 text-sky-400" />
            <span className="font-mono font-bold text-white">{secondsElapsed}s</span>
          </div>
          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 text-amber-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold">+150 EduXP</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PYTHON_CHALLENGES.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => {
              setSelectedChallengeIdx(idx);
              handleReset();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              selectedChallengeIdx === idx
                ? 'bg-[#002B66] text-white border-blue-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Challenge {idx + 1}: {ch.difficulty}</span>
          </button>
        ))}
      </div>

      {/* Code Editor & Terminal Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Col: Code Editor (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between">
          
          {/* Editor Header */}
          <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-slate-400 font-semibold text-[11px] ml-1">richfield_runner.py</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900">
              Bug Detected on Line {challenge.buggyLineIndex + 1}
            </span>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="p-4 font-mono text-xs leading-relaxed space-y-1 overflow-x-auto">
            {challenge.buggyCode.map((line, lidx) => {
              const isBugLine = lidx === challenge.buggyLineIndex;
              const isReplaced = isBugLine && selectedOptionIdx !== null && testResult === 'passed';

              return (
                <div 
                  key={lidx} 
                  className={`flex items-start gap-3 px-2 py-0.5 rounded ${
                    isBugLine
                      ? isReplaced
                        ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                        : 'bg-rose-950/50 border border-rose-800/70 text-rose-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none w-5 text-right font-bold text-[11px]">
                    {lidx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">
                    {isReplaced ? challenge.options[selectedOptionIdx!].replacementCode : line}
                  </span>
                  {isBugLine && !isReplaced && (
                    <span className="text-[10px] text-rose-400 font-sans font-bold flex items-center gap-1 shrink-0">
                      <Bug className="w-3 h-3" /> Runtime Crash
                    </span>
                  )}
                  {isReplaced && (
                    <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> Patched
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Traceback Box */}
          <div className="p-3.5 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Python Traceback Error Dump:</span>
            </div>
            <pre className="text-[11px] font-mono text-rose-300/90 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-rose-950">
              {challenge.errorTraceback}
            </pre>
          </div>

        </div>

        {/* Right Col: Fix Options & Test Runner (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Select the Correct Python Code Fix</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the line of code that remedies the crash without violating computational complexity:
              </p>
            </div>

            <div className="space-y-2">
              {challenge.options.map((opt, oidx) => {
                const isSelected = selectedOptionIdx === oidx;
                return (
                  <button
                    key={oidx}
                    onClick={() => {
                      setSelectedOptionIdx(oidx);
                      setTestResult('idle');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold leading-relaxed">{opt.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunVerification}
              disabled={selectedOptionIdx === null || isTestRunning}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              {isTestRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing Python Test Suite...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Sandbox & Verify Fix</span>
                </>
              )}
            </button>
          </div>

          {/* Live Test Execution Output */}
          {testLogs.length > 0 && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>Test Execution Stream</span>
                {testResult === 'passed' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASSED (100%)
                  </span>
                )}
                {testResult === 'failed' && (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> REJECTED
                  </span>
                )}
              </div>
              {testLogs.map((log, lidx) => (
                <p 
                  key={lidx} 
                  className={log.includes('✓') || log.includes('🎉') ? 'text-emerald-400 font-semibold' : log.includes('✗') || log.includes('🛑') ? 'text-rose-400 font-semibold' : 'text-slate-300'}
                >
                  {log}
                </p>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* PEER MATCH REVEAL CARD (TRIGGERED UPON PASSING THE GAME) */}
      {testResult === 'passed' && (
        <div className="bg-gradient-to-br from-indigo-900 via-[#002B66] to-blue-950 text-white p-6 sm:p-7 rounded-2xl border-2 border-indigo-400 shadow-2xl space-y-4 animate-in zoom-in-95">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                  EduMatch Algorithm Synergy Complete
                </span>
                <h3 className="text-lg font-black text-white">
                  Complementary Study Peer Matched via Python Challenge!
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-amber-300 font-black text-sm">{challenge.matchedPeer.matchScore}%</span>
              <span className="text-slate-200">Synergy Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Peer Details */}
            <div className="md:col-span-8 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-lg">
                {challenge.matchedPeer.avatarInitials}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-base text-white">{challenge.matchedPeer.name}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/20 text-white font-semibold">
                    {challenge.matchedPeer.year}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                    {challenge.matchedPeer.campus}
                  </span>
                </div>
                <p className="text-xs text-blue-100">{challenge.matchedPeer.qualification}</p>
                <p className="text-xs text-amber-200 bg-white/10 p-2.5 rounded-xl border border-white/10 leading-relaxed">
                  💡 <strong>Why Matched:</strong> {challenge.matchedPeer.synergyReason}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {challenge.matchedPeer.skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-4 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMessageSent(true);
                  if (onConnectPeer) {
                    onConnectPeer(
                      challenge.matchedPeer.name, 
                      `Hi ${challenge.matchedPeer.name}! I just aced the Python ${challenge.title} challenge in EduMatch with a ${challenge.matchedPeer.matchScore}% synergy rating. Would you like to team up for module coursework?`
                    );
                  }
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                  messageSent 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{messageSent ? 'Inquiry Dispatched!' : `Message ${challenge.matchedPeer.name}`}</span>
              </button>

              <button
                onClick={() => {
                  setBuddyAdded(true);
                  if (onAddStudyBuddy) {
                    onAddStudyBuddy(challenge.matchedPeer.name);
                  }
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  buddyAdded
                    ? 'bg-white/20 border-white/40 text-emerald-300'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{buddyAdded ? 'Added to Study Buddies ✓' : 'Add to Study Buddies'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
