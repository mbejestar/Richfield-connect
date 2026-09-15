import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Calendar, 
  Video, 
  MessageSquare, 
  UserCheck, 
  Briefcase, 
  ChevronRight, 
  Send, 
  AlertCircle,
  TrendingUp,
  GraduationCap,
  Building2,
  ThumbsUp
} from 'lucide-react';
import { UserProfile, MentorshipSession } from '../types';

interface PremiumMentorStudioProps {
  currentUser: UserProfile;
  mentors: UserProfile[];
  onRequestSession: (mentorId: string, topic: string, domain: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  onOpenBookingModal: (mentor: UserProfile, prefillTopic?: string) => void;
}

interface CareerGoalTrack {
  id: string;
  title: string;
  targetCompany: string;
  matchedMentorId: string;
  compatibilityScore: number;
  domain: string;
  missingSkills: string[];
  roadmap: { week: number; title: string; objective: string }[];
}

const CAREER_TRACKS: CareerGoalTrack[] = [
  {
    id: 'track-1',
    title: 'Enterprise Business Analyst & Financial Architect',
    targetCompany: 'Standard Bank Corporate & Investment Banking',
    matchedMentorId: 'user-mpho',
    compatibilityScore: 98,
    domain: 'Business Analysis & Agile Delivery',
    missingSkills: ['BPMN 2.0 Process Modeling', 'Fintech Regulatory Compliance (FICA/POPIA)', 'Agile User Story Slicing'],
    roadmap: [
      { week: 1, title: 'CV & Target Domain Diagnostic', objective: 'Audit academic transcript, align BA artifacts, and review banking project portfolio.' },
      { week: 2, title: 'Fintech Case Study & Requirements Elicitation', objective: 'Run a live simulated client interview for a cross-border mobile banking API.' },
      { week: 3, title: 'Mock Technical & Behavioral Interview', objective: 'Standard Bank style competency questions and stakeholder conflict resolution.' },
      { week: 4, title: 'Fast-Track Graduate Application Referral', objective: 'Final review and direct referral to Standard Bank Graduate Hiring Committee.' }
    ]
  },
  {
    id: 'track-2',
    title: 'Full-Stack Distributed Systems Engineer',
    targetCompany: 'Vodacom Digital Services & AWS Core',
    matchedMentorId: 'user-sipho',
    compatibilityScore: 95,
    domain: 'Cloud Architecture & Scalable Web',
    missingSkills: ['Docker & Kubernetes Containerization', 'Distributed Microservice Transactions', 'PostgreSQL Query Optimization'],
    roadmap: [
      { week: 1, title: 'Code Review & System Architecture Audit', objective: 'Review Richfield capstone project repositories and identify scaling bottlenecks.' },
      { week: 2, title: 'High-Concurrency System Design', objective: 'Architect a 100,000 req/sec payment gateway using message queues and caching.' },
      { week: 3, title: 'Live Whiteboard Algorithm Sprint', objective: 'Timed live coding challenge on dynamic programming and graph traversals.' },
      { week: 4, title: 'Engineering Manager Mock Interview', objective: 'Mock behavioral interview with senior engineering director and code submission polish.' }
    ]
  },
  {
    id: 'track-3',
    title: 'Cybersecurity SOC Analyst & Cloud Security Guard',
    targetCompany: 'Luno Global & Standard Bank Cyber Defense',
    matchedMentorId: 'user-devon',
    compatibilityScore: 94,
    domain: 'Cybersecurity & SecOps',
    missingSkills: ['SIEM Incident Triage (Splunk/Wazuh)', 'Linux Kernel Hardening', 'MITRE ATT&CK Framework Mapping'],
    roadmap: [
      { week: 1, title: 'SecOps Lab Diagnostic & Blueprint', objective: 'Configure Home SOC lab and analyze live capture packet traces.' },
      { week: 2, title: 'Incident Response & Threat Hunting', objective: 'Simulate simulated ransomware attack triage and write an executive breach report.' },
      { week: 3, title: 'SOC Technical Scenario Interview', objective: 'Live scenario-based technical questions on network segmentation and zero-trust.' },
      { week: 4, title: 'Luno/Fintech Fast-Track CV Dispatch', objective: 'Direct fast-track submission to Luno SOC Analyst talent pipeline.' }
    ]
  }
];

export const PremiumMentorStudio: React.FC<PremiumMentorStudioProps> = ({
  currentUser,
  mentors,
  onRequestSession,
  onOpenBookingModal
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(CAREER_TRACKS[0].id);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Mock Interview Prep Room State
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
  const [userMockAnswer, setUserMockAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<{
    score: number;
    strengths: string[];
    growthAreas: string[];
    modelAnswerTip: string;
  } | null>(null);

  const activeTrack = CAREER_TRACKS.find(t => t.id === selectedTrackId) || CAREER_TRACKS[0];
  const matchedMentor = mentors.find(m => m.id === activeTrack.matchedMentorId) || mentors[0];

  const mockQuestions = [
    {
      role: 'Enterprise Business Analyst',
      company: 'Standard Bank',
      question: 'Walk me through how you would elicit and prioritize requirements when two senior business stakeholders have directly conflicting priorities for a mobile banking feature.',
      rubric: 'Assess stakeholder conflict management, MoSCoW prioritization technique, and data-driven impact metrics.'
    },
    {
      role: 'Full-Stack Software Engineer',
      company: 'Vodacom Cloud Services',
      question: 'Explain how you design an API to handle sudden traffic surges during a national campus registration deadline without bringing down the relational database.',
      rubric: 'Look for caching strategies (Redis), queueing (RabbitMQ/Kafka), optimistic vs pessimistic locking, and read-replica routing.'
    },
    {
      role: 'Cybersecurity SOC Analyst',
      company: 'Luno Global',
      question: 'You notice unexpected outbound encrypted traffic on port 443 originating from an internal domain controller at 02:00 AM. What are your immediate triage steps?',
      rubric: 'Check isolation protocols, firewall logs, DNS sinkholing, process memory dumping, and chain of custody preservation.'
    }
  ];

  const activeMockQuestion = mockQuestions[interviewQuestionIndex];

  const handleInstantBookRoadmap = async () => {
    if (!matchedMentor) return;
    setIsBooking(true);
    setBookingSuccessMsg(null);

    const topic = `AI Career Acceleration Roadmap: ${activeTrack.title}`;
    const notes = `Targeting ${activeTrack.targetCompany}. Initial milestone: ${activeTrack.roadmap[0].title}. Address missing skills: ${activeTrack.missingSkills.join(', ')}.`;

    const res = await onRequestSession(matchedMentor.id, topic, activeTrack.domain, notes);
    setIsBooking(false);
    if (res.success) {
      setBookingSuccessMsg(`Mentorship Roadmap session confirmed with ${matchedMentor.name}! Added to your active schedule.`);
      setTimeout(() => setBookingSuccessMsg(null), 4000);
    }
  };

  const handleEvaluateMockAnswer = () => {
    if (!userMockAnswer.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationFeedback({
        score: Math.floor(Math.random() * 16) + 82, // 82 to 97
        strengths: [
          'Clear logical structuring and step-by-step problem breakdown',
          'Good demonstration of enterprise terminology and user impact awareness',
          'Proactive risk mitigation mindset aligned with corporate banking/tech standards'
        ],
        growthAreas: [
          'Quantify your impact metrics (e.g. mention expected % latency reduction or SLA response time)',
          'Reference specific industry frameworks (such as King IV, ITIL, or AWS Well-Architected Framework)'
        ],
        modelAnswerTip: 'Senior interviewers love candidates who articulate trade-offs (e.g. "We chose eventual consistency here over strict ACID because availability was our top metric").'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Premium Header Showcase */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-5 sm:p-6 text-white border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-purple-950 fill-purple-950" />
                Premium Mentorship Feature
              </span>
              <span className="text-[11px] text-purple-200 font-semibold flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
                AI Career Acceleration Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white mt-1.5">
              AI Smart Matcher & 1-on-1 Virtual Advisory Suite
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed mt-1">
              Select your dream corporate role. Our algorithm pairs your Richfield qualification with top-ranked Alumni working at leading South African enterprises, maps your skill gaps, and unlocks customized 4-week roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-xs text-purple-200 block font-semibold">Alumni Placement</span>
              <span className="text-lg font-black text-amber-300">92%</span>
              <span className="text-[9px] text-purple-300/80 block">Within 6 Months</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-xs text-purple-200 block font-semibold">Free Student Pass</span>
              <span className="text-lg font-black text-emerald-400">100%</span>
              <span className="text-[9px] text-purple-300/80 block">Alumni Funded</span>
            </div>
          </div>
        </div>

        {/* Career Target Track Selector */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
            Select Your Target Career Trajectory:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CAREER_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`text-left p-3 rounded-xl border transition-all relative ${
                  selectedTrackId === track.id
                    ? 'bg-purple-600/30 border-amber-400 ring-1 ring-amber-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {track.compatibilityScore}% Compatibility
                  </span>
                  {selectedTrackId === track.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white mt-1 leading-snug">
                  {track.title}
                </h4>
                <p className="text-[10px] text-purple-200/80 mt-0.5 truncate">
                  Target: {track.targetCompany}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE TRACK BREAKDOWN: MENTOR PROFILE + SKILL GAPS + ROADMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Matched Alumni Mentor Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Top-Ranked Mentor Match
            </span>
            <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {activeTrack.compatibilityScore}% Match
            </span>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white font-black text-base flex items-center justify-center shadow-md shrink-0">
              {matchedMentor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 leading-tight">
                {matchedMentor.name}
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                {matchedMentor.currentRole || matchedMentor.headline}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-0.5 font-bold text-indigo-900">
                  <Building2 className="w-3 h-3 text-indigo-600" />
                  {matchedMentor.company || 'Corporate Partner'}
                </span>
                <span>•</span>
                <span>{matchedMentor.campus}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            &ldquo;{matchedMentor.bio}&rdquo;
          </p>

          {/* Missing Skills Identified */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Skill Gaps to Address in Mentorship:
            </span>
            <div className="space-y-1.5">
              {activeTrack.missingSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 bg-amber-50/70 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
                  <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium text-[11px]">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={handleInstantBookRoadmap}
              disabled={isBooking}
              className="w-full py-2.5 px-4 bg-indigo-900 hover:bg-indigo-950 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBooking ? 'Registering Roadmap...' : `Book Roadmap with ${matchedMentor.name.split(' ')[0]}`}</span>
            </button>
            {bookingSuccessMsg && (
              <p className="text-[11px] text-emerald-700 font-bold text-center mt-2 animate-in fade-in">
                {bookingSuccessMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right Column (2 cols): 4-Week Career Acceleration Roadmap */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Custom Mentorship Curriculum
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                4-Week Accelerated Career Milestone Roadmap
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              1-on-1 Sessions + Async Code/Doc Reviews
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {activeTrack.roadmap.map((step) => (
              <div 
                key={step.week}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 font-black text-xs flex items-center justify-center shrink-0 shadow-inner">
                  W{step.week}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      60-min Milestone
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.objective}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Richfield Career Guarantee:</strong> Completing all 4 milestones earns you a verified LinkedIn recommendation and direct CV fast-track to corporate recruitment partners.
            </span>
          </div>
        </div>

      </div>

      {/* FEATURE 2: 1-ON-1 VIRTUAL ADVISORY PREP & AI MOCK INTERVIEW ROOM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900">
                1-on-1 Virtual Advisory Prep & AI Mock Interview Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Practice answering enterprise-level interview questions before your live session with your alumni mentor.
              </p>
            </div>
          </div>

          {/* Track Switcher */}
          <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg shrink-0">
            {mockQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInterviewQuestionIndex(idx);
                  setEvaluationFeedback(null);
                  setUserMockAnswer('');
                }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  interviewQuestionIndex === idx
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {q.company}
              </button>
            ))}
          </div>
        </div>

        {/* Active Question Box */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {activeMockQuestion.role} • {activeMockQuestion.company}
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold">
              Question {interviewQuestionIndex + 1} of {mockQuestions.length}
            </span>
          </div>

          <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-snug pt-1">
            &ldquo;{activeMockQuestion.question}&rdquo;
          </h4>

          <p className="text-[11px] text-slate-500 italic">
            Evaluation Rubric: {activeMockQuestion.rubric}
          </p>
        </div>

        {/* Interactive Answer Input */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Your Response (Draft your talking points or answer):
            </label>
            <textarea
              rows={3}
              value={userMockAnswer}
              onChange={(e) => setUserMockAnswer(e.target.value)}
              placeholder="e.g. First, I would separate the discussion into immediate business impact vs technical feasibility. I would schedule a 30-minute alignment workshop using MoSCoW prioritization..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Simulates real technical recruiter assessment criteria.
            </span>

            <button
              onClick={handleEvaluateMockAnswer}
              disabled={isEvaluating || !userMockAnswer.trim()}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEvaluating ? 'AI Scoring Response...' : 'Evaluate Answer with AI'}</span>
            </button>
          </div>
        </div>

        {/* AI Evaluation Report Card */}
        {evaluationFeedback && (
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  Gemini Interview Feedback & Competency Score
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-purple-200 font-semibold">Score:</span>
                <span className="text-sm sm:text-base font-black text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {evaluationFeedback.score}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Key Strengths:
                </span>
                {evaluationFeedback.strengths.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  Examiner Growth Tips:
                </span>
                {evaluationFeedback.growthAreas.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[11px] text-purple-200">
              <strong className="text-amber-300">Alumni Pro-Tip:</strong> {evaluationFeedback.modelAnswerTip}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
