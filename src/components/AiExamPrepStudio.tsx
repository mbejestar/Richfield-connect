import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  Award, 
  FileText, 
  Bookmark, 
  Copy, 
  Check, 
  AlertTriangle, 
  GraduationCap, 
  ArrowRight,
  Layers,
  Lightbulb
} from 'lucide-react';
import { ExamPrepDeck, UserProfile } from '../types';
import { DEFAULT_EXAM_PREP_DECKS } from '../mockData';

interface AiExamPrepStudioProps {
  currentUser: UserProfile;
}

export const AiExamPrepStudio: React.FC<AiExamPrepStudioProps> = ({ currentUser }) => {
  // Stored Decks (curated pre-loaded + newly generated)
  const [decks, setDecks] = useState<ExamPrepDeck[]>(DEFAULT_EXAM_PREP_DECKS);
  const [selectedDeckId, setSelectedDeckId] = useState<string>(DEFAULT_EXAM_PREP_DECKS[0]?.id || '');
  
  // Generation form state
  const [moduleCode, setModuleCode] = useState('DSA201');
  const [moduleName, setModuleName] = useState('Data Structures & Algorithms');
  const [qualification, setQualification] = useState<'IT' | 'Business'>(
    currentUser.qualification === 'Business' ? 'Business' : 'IT'
  );
  const [difficulty, setDifficulty] = useState<'Standard Exam' | 'Comprehensive Final' | 'Honors Distinction'>('Comprehensive Final');
  const [specificTopic, setSpecificTopic] = useState('Dynamic Programming, Graph Traversal & Trees');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active study tab: flashcards, exam questions, or revision cheat-sheet
  const [studyTab, setStudyTab] = useState<'flashcards' | 'questions' | 'tips'>('flashcards');

  // Active Flashcard Index & Flip State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [masteredCardIndices, setMasteredCardIndices] = useState<number[]>([]);

  // Expanded Questions
  const [expandedQuestionIndices, setExpandedQuestionIndices] = useState<number[]>([0]);

  // Copied feedback
  const [copied, setCopied] = useState(false);

  // Current active deck
  const activeDeck = decks.find(d => d.id === selectedDeckId) || decks[0];

  // Curated Quick-Picks
  const quickPicks = [
    { code: 'DSA201', name: 'Data Structures & Algorithms', qual: 'IT' as const, topic: 'Trees, Graphs & Big-O' },
    { code: 'PRG302', name: 'Advanced Software Engineering', qual: 'IT' as const, topic: 'Design Patterns, CI/CD & Unit Testing' },
    { code: 'SYS301', name: 'Cloud Infrastructure & Security', qual: 'IT' as const, topic: 'AWS/Azure, VPC & Microservices' },
    { code: 'BUS301', name: 'Corporate Financial Management', qual: 'Business' as const, topic: 'WACC, Capital Budgeting & NPV' },
    { code: 'BMA101', name: 'Strategic Business Operations', qual: 'Business' as const, topic: 'Porter 5 Forces, SWOT & PESTEL' },
    { code: 'AGA201', name: 'Auditing & Governance (AGA)', qual: 'Business' as const, topic: 'King IV, ISA Auditing & Ethics' }
  ];

  const handleSelectQuickPick = (pick: typeof quickPicks[0]) => {
    setModuleCode(pick.code);
    setModuleName(pick.name);
    setQualification(pick.qual);
    setSpecificTopic(pick.topic);
  };

  const handleGenerateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleCode.trim() || !moduleName.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/ai/exam-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleCode: moduleCode.trim().toUpperCase(),
          moduleName: moduleName.trim(),
          qualification,
          difficulty,
          specificTopic: specificTopic.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.deck) {
        setDecks([data.deck, ...decks]);
        setSelectedDeckId(data.deck.id);
        setCurrentCardIndex(0);
        setIsCardFlipped(false);
        setMasteredCardIndices([]);
        setExpandedQuestionIndices([0]);
      } else {
        setGenerationError(data.message || 'Failed to generate exam deck');
      }
    } catch (err: any) {
      setGenerationError(err.message || 'Error connecting to exam prep AI engine');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMasterCard = (idx: number) => {
    if (masteredCardIndices.includes(idx)) {
      setMasteredCardIndices(masteredCardIndices.filter(i => i !== idx));
    } else {
      setMasteredCardIndices([...masteredCardIndices, idx]);
    }
  };

  const toggleQuestionExpanded = (idx: number) => {
    if (expandedQuestionIndices.includes(idx)) {
      setExpandedQuestionIndices(expandedQuestionIndices.filter(i => i !== idx));
    } else {
      setExpandedQuestionIndices([...expandedQuestionIndices, idx]);
    }
  };

  const handleCopyDeck = () => {
    if (!activeDeck) return;
    const text = `RICHFIELD EXAM PREPARATION DECK: ${activeDeck.moduleCode} - ${activeDeck.moduleName}
Difficulty: ${activeDeck.difficulty} | Qualification: ${activeDeck.qualification}

--- EXAM REVISION TIPS ---
${activeDeck.revisionTips.map((t, i) => `${i + 1}. ${t}`).join('\n')}

--- SAMPLE PRACTICE QUESTIONS ---
${activeDeck.questions.map((q, i) => `Q${i + 1} [${q.marks} Marks]: ${q.question}\nAnswer: ${q.modelAnswer}\n`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-md border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-bold uppercase tracking-wider">
                Richfield AI Academic Assistant
              </span>
              <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Gemini 2.5 Flash Integrated
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-1">
              AI Exam Preparation Studio & Revision Flashcards
            </h2>
            <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed mt-0.5">
              Generate structured exam cram flashcards, high-yield practice questions with mark allocations, and past exam pattern tips tailored to your semester syllabus.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyDeck}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Deck!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        {/* Quick Pick Pills */}
        <div className="mt-4 pt-3 border-t border-purple-800/40 space-y-1.5">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
            Quick Study Picks:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPicks.map((pick) => (
              <button
                key={pick.code}
                onClick={() => handleSelectQuickPick(pick)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                  moduleCode === pick.code
                    ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-sm'
                    : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span className="font-extrabold">{pick.code}</span> - {pick.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generator Accordion / Box */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              Customize or Generate New Exam Revision Pack
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            {decks.length} Active Decks Saved
          </span>
        </div>

        <form onSubmit={handleGenerateDeck} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Module Code</label>
              <input
                type="text"
                required
                value={moduleCode}
                onChange={(e) => setModuleCode(e.target.value.toUpperCase())}
                placeholder="e.g. DSA201, BUS301"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Module Name</label>
              <input
                type="text"
                required
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="e.g. Corporate Financial Management"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Difficulty Target</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              >
                <option value="Standard Exam">Standard Semester Exam (60–75%)</option>
                <option value="Comprehensive Final">Comprehensive Final (75–85%)</option>
                <option value="Honors Distinction">Honors Distinction Challenge (85%+)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Stream</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              >
                <option value="IT">IT & Computer Science</option>
                <option value="Business">Business & Accounting</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Specific Revision Focus (Optional)</label>
              <input
                type="text"
                value={specificTopic}
                onChange={(e) => setSpecificTopic(e.target.value)}
                placeholder="e.g. Recursion, Big-O, Weighted Average Cost of Capital, King IV"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2 px-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate AI Deck</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {generationError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{generationError}</span>
            </div>
          )}
        </form>
      </div>

      {/* Select Active Deck Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Available Decks:</span>
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => {
              setSelectedDeckId(deck.id);
              setCurrentCardIndex(0);
              setIsCardFlipped(false);
              setMasteredCardIndices([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border ${
              activeDeck?.id === deck.id
                ? 'bg-slate-900 text-white border-slate-800 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>{deck.moduleCode}</span>
            <span className="text-[10px] opacity-75 font-normal">({deck.flashcards.length} cards)</span>
          </button>
        ))}
      </div>

      {/* Active Study Deck Suite */}
      {activeDeck && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Deck Metadata Header */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {activeDeck.moduleCode}
                </span>
                <span className="text-xs font-bold text-slate-800">{activeDeck.moduleName}</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {activeDeck.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Generated {activeDeck.createdAt} • Syllabus Focus: {activeDeck.specificTopic || 'Core Syllabus Modules'}
              </p>
            </div>

            {/* Sub-mode Navigation */}
            <div className="flex space-x-1 p-0.5 bg-slate-200 rounded-lg">
              <button
                onClick={() => setStudyTab('flashcards')}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  studyTab === 'flashcards'
                    ? 'bg-white text-purple-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Flashcards ({activeDeck.flashcards.length})</span>
              </button>

              <button
                onClick={() => setStudyTab('questions')}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  studyTab === 'questions'
                    ? 'bg-white text-purple-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Exam Questions ({activeDeck.questions.length})</span>
              </button>

              <button
                onClick={() => setStudyTab('tips')}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  studyTab === 'tips'
                    ? 'bg-white text-purple-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Revision Tips ({activeDeck.revisionTips.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: INTERACTIVE FLASHCARD PLAYER */}
          {studyTab === 'flashcards' && activeDeck.flashcards.length > 0 && (
            <div className="p-5 sm:p-6 max-w-2xl mx-auto space-y-4">
              
              {/* Progress & Mastery Header */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">
                  Card {currentCardIndex + 1} of {activeDeck.flashcards.length}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {masteredCardIndices.length} of {activeDeck.flashcards.length} Mastered
                </span>
              </div>

              {/* Flashcard Card Body */}
              {(() => {
                const card = activeDeck.flashcards[currentCardIndex];
                const isMastered = masteredCardIndices.includes(currentCardIndex);

                return (
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className={`cursor-pointer min-h-[220px] sm:min-h-[260px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-2 transition-all select-none shadow-sm relative ${
                      isCardFlipped
                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-300 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-purple-300 text-slate-900'
                    }`}
                  >
                    {/* Top pill inside card */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {card.topic}
                      </span>
                      <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        {isCardFlipped ? 'Answer View (Click to flip)' : 'Question View (Click to reveal)'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="my-auto py-4 text-center">
                      {!isCardFlipped ? (
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Question / Core Concept</span>
                          <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                            {card.front}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 text-left">
                          <span className="text-[10px] uppercase font-bold text-purple-600">Model Answer & Explanation</span>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                            {card.back}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Status */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                      <span>Click anywhere to flip</span>
                      {isMastered && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Marked as Mastered
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : activeDeck.flashcards.length - 1));
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => toggleMasterCard(currentCardIndex)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    masteredCardIndices.includes(currentCardIndex)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{masteredCardIndices.includes(currentCardIndex) ? 'Mastered!' : 'Mark Mastered'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setCurrentCardIndex((prev) => (prev < activeDeck.flashcards.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 shadow"
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: EXAM QUESTIONS WITH MODEL ANSWERS & RUBRIC */}
          {studyTab === 'questions' && (
            <div className="p-4 sm:p-5 space-y-3">
              {activeDeck.questions.map((q, idx) => {
                const isExpanded = expandedQuestionIndices.includes(idx);

                return (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 transition-all shadow-sm">
                    <div 
                      onClick={() => toggleQuestionExpanded(idx)}
                      className="flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          Q{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {q.question}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                            Topic: {q.topic}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          {q.marks} Marks
                        </span>
                        <button className="text-slate-400 hover:text-slate-600">
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                          <div className="flex items-center gap-1 font-bold text-emerald-900 text-[11px] uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Model Answer & Marking Rubric:
                          </div>
                          <p className="text-slate-800 leading-relaxed whitespace-pre-line text-xs">
                            {q.modelAnswer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: HIGH-YIELD REVISION TIPS & EXAM TRAPS */}
          {studyTab === 'tips' && (
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Examiner's Advice & High-Frequency Revision Themes
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {activeDeck.revisionTips.map((tip, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-slate-800 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
