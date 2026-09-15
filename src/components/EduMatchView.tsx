import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Swords,
  Sparkles,
  Brain,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Users,
  BookOpen,
  MessageSquare,
  Timer,
  Award,
  Zap,
  ChevronRight,
  GraduationCap,
  MapPin,
  TrendingUp,
  Check,
  Code,
  Database,
  Binary,
  Network,
  Cpu,
  Calculator,
  UserPlus,
  Play,
  Share2,
  Filter
} from 'lucide-react';
import { UserProfile, EduMatchSubject, EduMatchedPeer, EduMatchChallengeRecord } from '../types';
import {
  EDUMATCH_SUBJECTS,
  EDUMATCH_DIAGNOSTIC_QUESTIONS,
  INITIAL_EDUMATCHED_PEERS,
  INITIAL_CHALLENGE_RECORDS,
  WEEKLY_CAMPUS_LEADERBOARD
} from '../edumatchData';
import { PythonCodeRepairGame } from './PythonCodeRepairGame';

interface EduMatchViewProps {
  currentUser: UserProfile;
  onNavigateToMessages?: (recipientName: string, initialMessage?: string) => void;
  onNavigateToLibrary?: (query?: string) => void;
  onNavigateToNetwork?: () => void;
}

type EduMatchTab = 'diagnostics' | 'code-game' | 'matches' | 'arena' | 'buddies' | 'leaderboard';

export const EduMatchView: React.FC<EduMatchViewProps> = ({
  currentUser,
  onNavigateToMessages,
  onNavigateToLibrary,
  onNavigateToNetwork
}) => {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<EduMatchTab>('diagnostics');
  const [selectedSubject, setSelectedSubject] = useState<EduMatchSubject>(EDUMATCH_SUBJECTS[0]);
  const [filterCampus, setFilterCampus] = useState<string>('All Campuses');

  // Diagnostic Quiz State
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [diagnosticScore, setDiagnosticScore] = useState<number>(0);

  // Gamification User Stats State
  const [userXp, setUserXp] = useState<number>(1420);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [studyBuddies, setStudyBuddies] = useState<EduMatchedPeer[]>(
    INITIAL_EDUMATCHED_PEERS.filter(p => p.isStudyBuddy)
  );
  const [allPeers, setAllPeers] = useState<EduMatchedPeer[]>(INITIAL_EDUMATCHED_PEERS);
  const [challengeHistory, setChallengeHistory] = useState<EduMatchChallengeRecord[]>(INITIAL_CHALLENGE_RECORDS);

  // 1v1 Arena State
  const [arenaActive, setArenaActive] = useState<boolean>(false);
  const [arenaOpponent, setArenaOpponent] = useState<EduMatchedPeer | null>(null);
  const [arenaQuestionIdx, setArenaQuestionIdx] = useState<number>(0);
  const [arenaUserScore, setArenaUserScore] = useState<number>(0);
  const [arenaOpponentScore, setArenaOpponentScore] = useState<number>(0);
  const [arenaTimer, setArenaTimer] = useState<number>(15);
  const [arenaAnswerSelected, setArenaAnswerSelected] = useState<number | null>(null);
  const [arenaOpponentAnswered, setArenaOpponentAnswered] = useState<boolean>(false);
  const [arenaFinished, setArenaFinished] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active diagnostic questions
  const activeQuestions = EDUMATCH_DIAGNOSTIC_QUESTIONS[selectedSubject.id] || EDUMATCH_DIAGNOSTIC_QUESTIONS['database'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Timer countdown for 1v1 arena
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (arenaActive && !arenaFinished && arenaTimer > 0 && arenaAnswerSelected === null) {
      interval = setInterval(() => {
        setArenaTimer(prev => {
          if (prev <= 1) {
            handleArenaTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [arenaActive, arenaFinished, arenaTimer, arenaAnswerSelected]);

  // Handle Diagnostic Answer selection
  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    const isCorrect = idx === activeQuestions[currentQuestionIdx].correctIndex;
    if (isCorrect) {
      setUserXp(prev => prev + 25);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setUserAnswers(prev => [...prev, selectedOption]);
    }

    if (currentQuestionIdx + 1 < activeQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Calculate final score
      const finalAnswers = selectedOption !== null ? [...userAnswers, selectedOption] : userAnswers;
      let correctCount = 0;
      activeQuestions.forEach((q, index) => {
        if (finalAnswers[index] === q.correctIndex) {
          correctCount++;
        }
      });
      const pct = Math.round((correctCount / activeQuestions.length) * 100);
      setDiagnosticScore(pct);
      setQuizCompleted(true);
      setUserXp(prev => prev + 100);
      showToast(`Quiz completed! You scored ${pct}%. Finding your complementary study partners...`);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setUserAnswers([]);
    setQuizCompleted(false);
    setDiagnosticScore(0);
  };

  // Start 1v1 Challenge
  const handleStartChallenge = (peer: EduMatchedPeer) => {
    setArenaOpponent(peer);
    setArenaActive(true);
    setArenaQuestionIdx(0);
    setArenaUserScore(0);
    setArenaOpponentScore(0);
    setArenaTimer(15);
    setArenaAnswerSelected(null);
    setArenaOpponentAnswered(false);
    setArenaFinished(false);
    setActiveTab('arena');
  };

  const handleArenaSelectOption = (optionIdx: number) => {
    if (arenaAnswerSelected !== null) return;
    setArenaAnswerSelected(optionIdx);

    const isCorrect = optionIdx === activeQuestions[arenaQuestionIdx].correctIndex;
    if (isCorrect) {
      setArenaUserScore(prev => prev + 1);
      setUserXp(prev => prev + 30);
    }

    // Simulate opponent response based on their score profile
    setTimeout(() => {
      const oppProb = (arenaOpponent?.subjectScore || 85) / 100;
      const oppCorrect = Math.random() < oppProb;
      if (oppCorrect) {
        setArenaOpponentScore(prev => prev + 1);
      }
      setArenaOpponentAnswered(true);

      // Auto advance to next question or finish after 2 seconds
      setTimeout(() => {
        if (arenaQuestionIdx + 1 < activeQuestions.length) {
          setArenaQuestionIdx(prev => prev + 1);
          setArenaTimer(15);
          setArenaAnswerSelected(null);
          setArenaOpponentAnswered(false);
        } else {
          // Finished
          setArenaFinished(true);
          const finalUserScore = arenaUserScore + (isCorrect ? 1 : 0);
          const finalOppScore = arenaOpponentScore + (oppCorrect ? 1 : 0);
          const result = finalUserScore > finalOppScore ? 'won' : finalUserScore < finalOppScore ? 'lost' : 'tied';
          const xpEarned = result === 'won' ? 150 : result === 'tied' ? 80 : 40;
          setUserXp(prev => prev + xpEarned);

          const newRecord: EduMatchChallengeRecord = {
            id: `rec-${Date.now()}`,
            opponentId: arenaOpponent?.id || 'peer',
            opponentName: arenaOpponent?.name || 'Study Peer',
            subject: selectedSubject.name,
            userScore: finalUserScore,
            opponentScore: finalOppScore,
            totalQuestions: activeQuestions.length,
            result,
            xpEarned,
            date: 'Just now'
          };
          setChallengeHistory(prev => [newRecord, ...prev]);
        }
      }, 1600);
    }, 700);
  };

  const handleArenaTimeOut = () => {
    handleArenaSelectOption(-1);
  };

  // Add / Toggle Study Buddy
  const handleToggleStudyBuddy = (peer: EduMatchedPeer) => {
    const isBuddy = studyBuddies.some(b => b.id === peer.id);
    if (isBuddy) {
      setStudyBuddies(prev => prev.filter(b => b.id !== peer.id));
      setAllPeers(prev => prev.map(p => p.id === peer.id ? { ...p, isStudyBuddy: false } : p));
      showToast(`Removed ${peer.name} from your Study Buddies list.`);
    } else {
      const updatedPeer = { ...peer, isStudyBuddy: true };
      setStudyBuddies(prev => [...prev, updatedPeer]);
      setAllPeers(prev => prev.map(p => p.id === peer.id ? { ...p, isStudyBuddy: true } : p));
      setUserXp(prev => prev + 50);
      showToast(`🎉 Connected! ${peer.name} (${peer.campus}) is now your Richfield Study Buddy! +50 XP`);
    }
  };

  // Render subject icon
  const renderSubjectIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Database': return <Database className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Binary': return <Binary className={className} />;
      case 'Network': return <Network className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  // Filter peers by campus
  const filteredPeers = allPeers.filter(peer => {
    if (filterCampus === 'All Campuses') return true;
    return peer.campus.toLowerCase().includes(filterCampus.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-500/30 flex items-center gap-3 animate-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner: Richfield EduMatch */}
      <div className="bg-gradient-to-r from-[#002B66] via-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold text-amber-300">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Peer Learning Engine</span>
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-extrabold">NEW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              EduMatch: Learn, Challenge & Connect Across Campuses
            </h1>
            <p className="text-blue-100/90 text-sm leading-relaxed">
              The game isn’t the destination — genuine academic synergy is. Take quick module quizzes to diagnose your strengths, get matched with complementary study peers across all 9 Richfield campuses, and challenge each other in 1v1 blitz showdowns.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/60 text-slate-200">
                <span className="text-amber-400 font-bold">1. Quiz</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-indigo-300 font-bold">2. Match</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-rose-400 font-bold">3. Challenge</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-emerald-400 font-bold">4. Connect</span>
              </div>
            </div>
          </div>

          {/* Gamification Stats Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shrink-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[280px]">
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Study Streak</p>
                <p className="text-base font-black text-white">{streakDays} Days</p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">EduXP Points</p>
                <p className="text-base font-black text-white">{userXp} XP</p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Study Buddies</p>
                <p className="text-base font-black text-white">{studyBuddies.length} Active</p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Campus Rank</p>
                <p className="text-base font-black text-white">#14 Newtown</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-[#002B66] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>1. Diagnostic Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('code-game')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'code-game'
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'text-amber-900 bg-amber-50/70 border-amber-200 hover:bg-amber-100 hover:text-amber-950'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-600" />
            <span>🎮 Python Bug-Fix Game</span>
            <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black">MATCH</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-[#002B66] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Matched Peers ({allPeers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'arena'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Swords className="w-4 h-4 text-amber-300" />
            <span>3. 1v1 Blitz Arena</span>
          </button>

          <button
            onClick={() => setActiveTab('buddies')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'buddies'
                ? 'bg-[#002B66] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Study Buddies ({studyBuddies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-[#002B66] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Campus Leaderboard</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DIAGNOSTIC QUIZ (STEP 1: CHOOSE SUBJECT & STEP 2: SHORT QUIZ)     */}
      {/* ========================================================================= */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Quick Match-by-Game Callout Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-md border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shrink-0 shadow">
                <Code className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded">
                    Gamified Peer Matching
                  </span>
                  <span className="text-xs font-black text-rose-900">• Python Error-Fix Game</span>
                </div>
                <h3 className="font-black text-sm text-slate-950">
                  Prefer practical coding? Fix real Python bugs to get matched!
                </h3>
                <p className="text-xs text-slate-800 leading-snug">
                  Debug syntax & algorithmic errors in Python code to automatically find complementary student peers.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('code-game')}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-2 shrink-0 shadow-lg transition-all active:scale-95"
            >
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Launch Python Game</span>
            </button>
          </div>

          {/* Subject Selector Carousel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Step 1: Choose Your Module</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Select an academic subject to assess your strengths and match with peers in need of your skills.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {EDUMATCH_SUBJECTS.length} Accredited Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {EDUMATCH_SUBJECTS.map((subject) => {
                const isSelected = selectedSubject.id === subject.id;
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject);
                      handleRestartQuiz();
                    }}
                    className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                        }`}>
                          {renderSubjectIcon(subject.iconName, 'w-4 h-4')}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {subject.code} • {subject.category}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 line-clamp-1">
                            {subject.name}
                          </h3>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {subject.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {subject.activeLearnersCount} active students
                      </span>
                      <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Start Quiz <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Quiz Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
            {!quizStarted ? (
              <div className="text-center max-w-xl mx-auto py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-inner">
                  {renderSubjectIcon(selectedSubject.iconName, 'w-8 h-8')}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedSubject.name} ({selectedSubject.code}) Diagnostic
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Answer 4 short conceptual questions to map your strengths across {selectedSubject.subTopics.join(', ')}. No pressure — this is designed to find you the best study buddies!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                    <Timer className="w-3.5 h-3.5 text-slate-500" /> ~2 Minutes
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" /> +100 EduXP Reward
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-semibold border border-amber-200">
                    <Flame className="w-3.5 h-3.5 text-amber-600" /> Advances Daily Streak
                  </span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="px-6 py-3 rounded-xl bg-[#002B66] hover:bg-blue-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Begin Module Diagnostic</span>
                  </button>
                </div>
              </div>
            ) : !quizCompleted ? (
              // Quiz In-Progress
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
                    <span className="text-indigo-600">{selectedSubject.code} • {activeQuestions[currentQuestionIdx].subTopic}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {activeQuestions[currentQuestionIdx].difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Topic: {activeQuestions[currentQuestionIdx].subTopic}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {activeQuestions[currentQuestionIdx].question}
                  </h4>

                  {/* Code snippet if any */}
                  {activeQuestions[currentQuestionIdx].codeSnippet && (
                    <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 overflow-x-auto shadow-inner">
                      {activeQuestions[currentQuestionIdx].codeSnippet}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {activeQuestions[currentQuestionIdx].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeQuestions[currentQuestionIdx].correctIndex;

                    let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-500 bg-rose-50/80 text-rose-900 font-semibold ring-1 ring-rose-400';
                      } else {
                        btnStyle = 'border-slate-200 opacity-60 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on answered */}
                {hasAnswered && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5 animate-in fade-in">
                    <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Conceptual Explanation
                    </p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {activeQuestions[currentQuestionIdx].explanation}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {hasAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-[#002B66] hover:bg-blue-900 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <span>{currentQuestionIdx + 1 === activeQuestions.length ? 'View Diagnostic Results' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Quiz Completed & Synergy Results
              <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg ring-8 ring-emerald-50">
                    <Trophy className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Diagnostic Complete: You scored {diagnosticScore}%!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Here is your academic strength breakdown for {selectedSubject.name}. EduMatch has computed your complementary peer matches.
                  </p>
                </div>

                {/* Strengths & Growth Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Your Strongest Areas</span>
                    </div>
                    <ul className="text-xs text-emerald-800 space-y-1 font-medium list-disc list-inside">
                      <li>{selectedSubject.subTopics[0]}</li>
                      <li>{selectedSubject.subTopics[1]}</li>
                    </ul>
                    <p className="text-[11px] text-emerald-700 italic pt-1">
                      You can mentor peers who struggle with these topics!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span>Recommended Areas to Sharpen</span>
                    </div>
                    <ul className="text-xs text-amber-800 space-y-1 font-medium list-disc list-inside">
                      <li>{selectedSubject.subTopics[2] || 'Advanced Query Analysis'}</li>
                      <li>{selectedSubject.subTopics[3] || 'System Architecture'}</li>
                    </ul>
                    <p className="text-[11px] text-amber-700 italic pt-1">
                      Our algorithm found peers who scored 90%+ in these areas to help you!
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('matches')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#002B66] hover:bg-blue-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>View My Matched Study Peers ({allPeers.length})</span>
                  </button>

                  <button
                    onClick={handleRestartQuiz}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: PYTHON BUG-FIX CODE REPAIR GAME (MATCHING BY INTERACTIVE ACTIVITIES) */}
      {/* ========================================================================= */}
      {activeTab === 'code-game' && (
        <PythonCodeRepairGame
          currentUser={currentUser}
          onConnectPeer={(peerName, initialMessage) => {
            onNavigateToMessages?.(peerName, initialMessage);
          }}
          onAddStudyBuddy={(peerName) => {
            showToast(`${peerName} has been added to your Richfield Study Buddies list!`);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MATCHED PEERS (STEP 3: GET MATCHED & COMPLEMENTARY STRENGTHS)      */}
      {/* ========================================================================= */}
      {activeTab === 'matches' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Complementary Study Matches</span>
              </h2>
              <p className="text-xs text-slate-500">
                Matched based on reciprocal strengths: what you excel in, they need help with — and vice versa!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Campus:</span>
              <select
                value={filterCampus}
                onChange={(e) => setFilterCampus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
              >
                <option value="All Campuses">All 9 Richfield Campuses</option>
                <option value="Newtown">Newtown Campus</option>
                <option value="Pretoria">Pretoria Campus</option>
                <option value="Durban">Durban Campus</option>
                <option value="Cape Town">Cape Town Campus</option>
                <option value="Polokwane">Polokwane Campus</option>
              </select>
            </div>
          </div>

          {/* Peers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPeers.map((peer) => {
              const isBuddy = studyBuddies.some(b => b.id === peer.id);
              return (
                <div
                  key={peer.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-md transition-all space-y-4 relative flex flex-col justify-between"
                >
                  {/* Top Bar: Match Score & Campus */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-sm flex items-center justify-center shadow-md">
                          {peer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          peer.onlineStatus === 'online' ? 'bg-emerald-500' : peer.onlineStatus === 'studying' ? 'bg-amber-400' : 'bg-slate-300'
                        }`} title={peer.onlineStatus} />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-slate-900">{peer.name}</h3>
                          {peer.academicYear && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {peer.academicYear}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{peer.campus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        {peer.matchScore}% Match
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        🔥 {peer.studyStreak}d streak • {peer.xpPoints} XP
                      </p>
                    </div>
                  </div>

                  {/* Why You Matched Callout */}
                  <div className="p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-xl border border-blue-100 text-xs text-blue-950 leading-relaxed font-medium">
                    <p className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      Reciprocal Synergy Rationale
                    </p>
                    {peer.matchReason}
                  </div>

                  {/* Complementary Breakdown: Strengths vs Needs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-1">They Can Help You With:</span>
                      <div className="space-y-0.5 text-emerald-800">
                        {peer.strongIn.map((st, i) => (
                          <p key={i} className="line-clamp-1">✓ {st}</p>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
                      <span className="font-bold text-indigo-900 block mb-1">You Can Help Them With:</span>
                      <div className="space-y-0.5 text-indigo-800">
                        {peer.needsHelpWith.map((nh, i) => (
                          <p key={i} className="line-clamp-1">★ {nh}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Digital Library Resource */}
                  {peer.recommendedLibraryResource && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[11px] text-slate-700 font-semibold truncate">
                          Recommended: {peer.recommendedLibraryResource.title}
                        </span>
                      </div>
                      {onNavigateToLibrary && (
                        <button
                          onClick={() => onNavigateToLibrary(peer.recommendedLibraryResource?.title)}
                          className="text-[10px] text-indigo-600 font-bold hover:underline shrink-0 ml-2"
                        >
                          View in Library
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Buttons: Challenge, Buddy, Message */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => handleStartChallenge(peer)}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>1v1 Challenge</span>
                    </button>

                    <button
                      onClick={() => handleToggleStudyBuddy(peer)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        isBuddy
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {isBuddy ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Buddy Added</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add Buddy</span>
                        </>
                      )}
                    </button>

                    {onNavigateToMessages && (
                      <button
                        onClick={() => onNavigateToMessages(
                          peer.name,
                          `Hi ${peer.name.split(' ')[0]}! I noticed on Richfield EduMatch that we have a ${peer.matchScore}% study match in ${selectedSubject.name}. Would you like to team up for capstone prep?`
                        )}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                        title="Chat in Messages"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 1v1 BLITZ ARENA (STEP 4: PLAY TOGETHER & QUICK QUIZZES)           */}
      {/* ========================================================================= */}
      {activeTab === 'arena' && (
        <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
          {!arenaActive ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
                <Swords className="w-8 h-8 text-rose-600" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-slate-900">
                  Richfield 1v1 Blitz Arena
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Put your knowledge to the test! Challenge matched peers to rapid-fire 15-second timed questions. Earn EduXP, build study streaks, and forge lasting academic partnerships.
                </p>
              </div>

              {/* Select an opponent to challenge */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-700">Choose a peer to challenge:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {allPeers.slice(0, 4).map((peer) => (
                    <div
                      key={peer.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-white transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{peer.name}</p>
                        <p className="text-[10px] text-slate-500">{peer.campus} • {peer.matchScore}% Match</p>
                      </div>
                      <button
                        onClick={() => handleStartChallenge(peer)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow flex items-center gap-1 active:scale-98"
                      >
                        <Swords className="w-3 h-3" />
                        <span>Duel</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Challenge History */}
              {challengeHistory.length > 0 && (
                <div className="pt-4 border-t border-slate-100 text-left space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Recent Arena Duels
                  </h4>
                  <div className="space-y-2">
                    {challengeHistory.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] ${
                            rec.result === 'won' ? 'bg-emerald-100 text-emerald-700' : rec.result === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {rec.result === 'won' ? 'W' : rec.result === 'lost' ? 'L' : 'T'}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{rec.subject}</p>
                            <p className="text-[10px] text-slate-400">vs {rec.opponentName} • {rec.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-slate-800">{rec.userScore} - {rec.opponentScore}</p>
                          <p className="text-[10px] font-bold text-emerald-600">+{rec.xpEarned} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : !arenaFinished ? (
            // Live Arena in Progress
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              {/* Top Arena Header: Scores & Timer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                {/* You */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{currentUser.name} (You)</p>
                    <p className="text-base font-black text-indigo-600">{arenaUserScore} pts</p>
                  </div>
                </div>

                {/* Central Countdown Clock */}
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono font-black text-base shadow-sm transition-colors ${
                    arenaTimer <= 5 ? 'border-rose-500 text-rose-600 animate-pulse bg-rose-50' : 'border-indigo-600 text-indigo-700 bg-indigo-50'
                  }`}>
                    {arenaTimer}s
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                    Round {arenaQuestionIdx + 1} / {activeQuestions.length}
                  </p>
                </div>

                {/* Opponent */}
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{arenaOpponent?.name}</p>
                    <p className="text-base font-black text-rose-600">{arenaOpponentScore} pts</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-sm shadow">
                    {arenaOpponent?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
                  Timed Blitz • {activeQuestions[arenaQuestionIdx].subTopic}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {activeQuestions[arenaQuestionIdx].question}
                </h3>
                {activeQuestions[arenaQuestionIdx].codeSnippet && (
                  <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800">
                    {activeQuestions[arenaQuestionIdx].codeSnippet}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuestions[arenaQuestionIdx].options.map((opt, idx) => {
                  const isSelected = arenaAnswerSelected === idx;
                  const isCorrect = idx === activeQuestions[arenaQuestionIdx].correctIndex;

                  let style = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                  if (arenaAnswerSelected !== null) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      style = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      style = 'border-slate-200 opacity-50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={arenaAnswerSelected !== null}
                      onClick={() => handleArenaSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {arenaAnswerSelected !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Opponent Status indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  {arenaOpponentAnswered ? `${arenaOpponent?.name} has submitted answer!` : `${arenaOpponent?.name} is thinking...`}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Speed bonus active: Faster response = more XP
                </span>
              </div>
            </div>
          ) : (
            // Arena Finished Celebration & Resolution
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg ring-8 ring-indigo-50 bg-indigo-100 text-indigo-600">
                {arenaUserScore > arenaOpponentScore ? (
                  <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
                ) : arenaUserScore === arenaOpponentScore ? (
                  <Swords className="w-10 h-10 text-indigo-600" />
                ) : (
                  <Award className="w-10 h-10 text-rose-500" />
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-900">
                  {arenaUserScore > arenaOpponentScore ? 'Victory! Outstanding Speed & Accuracy' : arenaUserScore === arenaOpponentScore ? 'It\'s an Academic Tie!' : 'Good Duel! Ready for a Rematch?'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Final Match Score: <strong className="text-slate-900">{arenaUserScore} (You)</strong> vs <strong className="text-slate-900">{arenaOpponentScore} ({arenaOpponent?.name})</strong>
                </p>
              </div>

              {/* Rewards Earned */}
              <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>+150 EduXP Earned</span>
                <span>•</span>
                <span>🔥 Streak Maintained!</span>
              </div>

              {/* Post-Game Connection Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                {arenaOpponent && (
                  <button
                    onClick={() => handleToggleStudyBuddy(arenaOpponent)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Make {arenaOpponent.name.split(' ')[0]} a Study Buddy</span>
                  </button>
                )}

                {arenaOpponent && onNavigateToMessages && (
                  <button
                    onClick={() => onNavigateToMessages(
                      arenaOpponent.name,
                      `Great game in the 1v1 Blitz Arena! Want to review the ${selectedSubject.name} questions together?`
                    )}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold shadow flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat in Messages</span>
                  </button>
                )}

                <button
                  onClick={() => setArenaActive(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Back to Arena
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MY STUDY BUDDIES (STEP 5: LEARN & CONNECT & DIGITAL LIBRARY)       */}
      {/* ========================================================================= */}
      {activeTab === 'buddies' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>My Active Study Buddies ({studyBuddies.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Students you connected with through EduMatch across Richfield campuses.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('matches')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Find More Buddies</span>
            </button>
          </div>

          {studyBuddies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">No Study Buddies Added Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Take a module diagnostic or challenge a peer to match with students across campuses!
              </p>
              <button
                onClick={() => setActiveTab('matches')}
                className="px-4 py-2 rounded-xl bg-[#002B66] text-white text-xs font-bold"
              >
                Browse Matched Peers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyBuddies.map((buddy) => (
                <div
                  key={buddy.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
                        {buddy.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{buddy.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{buddy.campus}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Study Buddy
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-800">{buddy.subject}</p>
                    <p className="text-slate-500 text-[11px]">
                      Strong in: {buddy.strongIn.join(', ')}
                    </p>
                  </div>

                  {/* Recommended Textbook Share */}
                  {buddy.recommendedLibraryResource && (
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold text-blue-900 uppercase">Shared Digital Library Resource</span>
                        <p className="font-bold text-blue-950 text-xs line-clamp-1">{buddy.recommendedLibraryResource.title}</p>
                        <p className="text-[10px] text-blue-700">by {buddy.recommendedLibraryResource.author}</p>
                      </div>
                      {onNavigateToLibrary && (
                        <button
                          onClick={() => onNavigateToLibrary(buddy.recommendedLibraryResource?.title)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shrink-0 ml-2"
                        >
                          Open Book
                        </button>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleStartChallenge(buddy)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Swords className="w-3 h-3" />
                      <span>Challenge</span>
                    </button>

                    {onNavigateToMessages && (
                      <button
                        onClick={() => onNavigateToMessages(
                          buddy.name,
                          `Hi ${buddy.name.split(' ')[0]}, let's schedule our next collaborative study session on ${buddy.subject}!`
                        )}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Message</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CAMPUS LEADERBOARD (INTER-CAMPUS WEEKLY CHALLENGE)                 */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Weekly Inter-Campus Challenge
              </span>
              <h2 className="text-xl font-black">National Richfield Campus Showdown</h2>
              <p className="text-xs text-amber-100">
                Students earn points for their local campus by completing diagnostics, winning blitz duels, and maintaining study streaks.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500">
              <span>Campus Standings</span>
              <span>Total Points</span>
            </div>

            <div className="divide-y divide-slate-100">
              {WEEKLY_CAMPUS_LEADERBOARD.map((item) => (
                <div
                  key={item.campus}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${
                      item.rank === 1 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' :
                      item.rank === 2 ? 'bg-slate-200 text-slate-800' :
                      item.rank === 3 ? 'bg-amber-700/20 text-amber-900' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      #{item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{item.campus}</h4>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {item.studentsActive} students actively learning this week
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900">
                      {item.points.toLocaleString()} pts
                    </span>
                    <p className="text-[10px] text-emerald-600 font-semibold">
                      +{Math.round(item.points * 0.12)} this week
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
