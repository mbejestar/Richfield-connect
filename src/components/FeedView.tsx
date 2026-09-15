import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquare, 
  Heart, 
  Share2, 
  Code, 
  Filter, 
  AlertTriangle,
  ArrowRight,
  Layers,
  GraduationCap,
  Flag,
  CheckCircle2,
  X,
  Gamepad2,
  Zap,
  Timer,
  BookOpen,
  Smile,
  Meh,
  Frown,
  Megaphone,
  PackageSearch
} from 'lucide-react';
import { Post, UserProfile } from '../types';

interface FeedViewProps {
  posts: Post[];
  currentUser: UserProfile;
  onCreatePost: (newPost: Partial<Post>) => Promise<{ success: boolean; reason?: string }>;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenAIAssistant: () => void;
  onNavigateToEduMatch?: () => void;
  onNavigateToStudyWellness?: (tab: 'check-in' | 'focus' | 'notes') => void;
  onNavigateToLostFound?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  onCreatePost,
  onLikePost,
  onAddComment,
  onOpenAIAssistant,
  onNavigateToEduMatch,
  onNavigateToStudyWellness,
  onNavigateToLostFound
}) => {
  const [selectedCohort, setSelectedCohort] = useState<'All' | '1st Year' | '2nd Year' | '3rd Year' | 'General'>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'IT' | 'Business'>('All');
  
  const [postContent, setPostContent] = useState('');
  const [postCohort, setPostCohort] = useState<'1st Year' | '2nd Year' | '3rd Year' | 'General'>(
    currentUser.academicYear === '1st Year' ? '1st Year' :
    currentUser.academicYear === '2nd Year' ? '2nd Year' :
    currentUser.academicYear === '3rd Year' ? '3rd Year' : 'General'
  );
  const [postCategory, setPostCategory] = useState<'IT' | 'Business' | 'All'>(
    currentUser.qualification === 'Both' ? 'All' : currentUser.qualification
  );
  const [postTags, setPostTags] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeSnippet, setCodeSnippet] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Section 2.4 Reporting Mechanism
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Unprofessional or non-career related content');
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);

  // Filter posts based on cohort and category
  const filteredPosts = posts.filter(post => {
    if (selectedCohort !== 'All' && post.cohort !== selectedCohort && post.cohort !== 'General') {
      return false;
    }
    if (selectedCategory !== 'All' && post.qualificationCategory !== selectedCategory && post.qualificationCategory !== 'All') {
      return false;
    }
    return true;
  });

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmitting(true);
    setModerationWarning(null);

    const tagsArray = postTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const result = await onCreatePost({
      content: postContent,
      cohort: postCohort,
      qualificationCategory: postCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['RichfieldConnect', postCohort.replace(' ', '')],
      codeSnippet: showCodeInput && codeSnippet.trim() ? { language: codeLanguage, code: codeSnippet } : undefined
    });

    setIsSubmitting(false);

    if (result.success) {
      setPostContent('');
      setPostTags('');
      setCodeSnippet('');
      setShowCodeInput(false);
    } else {
      setModerationWarning(result.reason || "Your post violated the Richfield Student Safety & Anti-Bullying Policy.");
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (text && text.trim()) {
      onAddComment(postId, text.trim());
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Announcements & Lost/Found Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-[#002B66]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#002B66] flex items-center justify-center font-black shrink-0 shadow-xs">
            <Megaphone className="w-5 h-5 text-[#002B66]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                Announcements & Campus Feed
              </h1>
              <span className="text-[10px] bg-red-100 text-[#E31B23] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Institutional notices, faculty updates, and cohort academic discussions across Richfield.
            </p>
          </div>
        </div>

        {onNavigateToLostFound && (
          <button
            onClick={onNavigateToLostFound}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-slate-900 to-[#002B66] hover:from-blue-900 hover:to-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 self-stretch sm:self-auto justify-center group"
          >
            <PackageSearch className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Digital Lost & Found</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
      
      {/* EduMatch Study Buddy Spotlight - Students Only */}
      {currentUser.role === 'student' && onNavigateToEduMatch && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#002B66] text-white p-3.5 sm:p-4 rounded-xl border border-blue-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow">
              <Gamepad2 className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-1.5 py-0.2 rounded">
                  NEW FEATURE
                </span>
                <h3 className="font-extrabold text-sm text-white">EduMatch: Find Study Partners</h3>
              </div>
              <p className="text-xs text-blue-100/90 line-clamp-1">
                Take quick module quizzes, match on complementary strengths, and 1v1 blitz with peers across 9 campuses!
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToEduMatch}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-amber-300 text-blue-950 font-extrabold text-xs shadow transition-all flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
          >
            <span>Play & Match</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-950" />
          </button>
        </div>
      )}

      {/* Student Wellness & Productivity Quick Hub - Students and Alumni Only */}
      {(currentUser.role === 'student' || currentUser.role === 'alumni') && onNavigateToStudyWellness && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Check in on yourself */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900">Check in on yourself</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                A quick, private check-in on how you're coping — with support when you need it.
              </p>
              
              {/* Quick Mood Selection */}
              <div className="grid grid-cols-3 gap-1.5 my-3">
                <button
                  onClick={() => onNavigateToStudyWellness('check-in')}
                  className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Frown className="w-3 h-3 text-amber-700" />
                  <span>Tough</span>
                </button>
                <button
                  onClick={() => onNavigateToStudyWellness('check-in')}
                  className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Meh className="w-3 h-3 text-blue-700" />
                  <span>OK</span>
                </button>
                <button
                  onClick={() => onNavigateToStudyWellness('check-in')}
                  className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Smile className="w-3 h-3 text-emerald-700" />
                  <span>Good</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 mb-2">
                A 30-second check-in on how you're coping — private, with support if you need it.
              </p>
            </div>

            <button
              onClick={() => onNavigateToStudyWellness('check-in')}
              className="text-xs font-bold text-[#002B66] hover:text-blue-800 flex items-center gap-1 pt-2 border-t border-slate-100 text-left transition-colors"
            >
              <span>Do a check-in</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: Run a focus session */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900">Run a focus session</span>
                <Timer className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Turn your courses into focused, timed study - with breaks built in.
              </p>

              {/* Focus Intervals */}
              <div className="flex items-center justify-center gap-1.5 my-3">
                <span className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-md text-[10px] font-bold">
                  Focus 25m
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                  5m
                </span>
                <span className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-md text-[10px] font-bold">
                  Focus 25m
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToStudyWellness('focus')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 pt-2 border-t border-slate-100 text-left transition-colors"
            >
              <span>Start a session</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 3: Keep study notes */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900">Keep study notes</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                Jot notes for your courses and keep everything in one place....
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[10px] text-slate-600 italic">
                "Database normalization 3NF notes saved for PRG381 exam revision..."
              </div>
            </div>

            <button
              onClick={() => onNavigateToStudyWellness('notes')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 pt-2 mt-3 border-t border-slate-100 text-left transition-colors"
            >
              <span>Jot a note</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Post Creation Box with Anti-Bullying / Toxicity AI Guard */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#002B66] border border-blue-400 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`Share an academic update or question, ${currentUser.name.split(' ')[0]}...`}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-lg px-3.5 py-2 border border-slate-200 focus:border-[#002B66] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Post Options (Cohort, Qualification, Code Snippet) */}
        {postContent.length > 0 && (
          <div className="pt-2.5 border-t border-slate-100 space-y-2.5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Target Stream / Cohort
                </label>
                <select
                  value={postCohort}
                  onChange={(e) => setPostCohort(e.target.value as any)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:ring-1 focus:ring-[#002B66] focus:outline-none"
                >
                  <option value="General">📢 Campus Announcements & Notices</option>
                  <option value="1st Year">1st Year Students</option>
                  <option value="2nd Year">2nd Year Students</option>
                  <option value="3rd Year">3rd Year Students</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Qualification Stream
                </label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:ring-1 focus:ring-[#002B66] focus:outline-none"
                >
                  <option value="All">All Qualifications (IT & Business)</option>
                  <option value="IT">IT / Computer Science Only</option>
                  <option value="Business">Business Administration Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="e.g. ExamPrep, Python, Capstone"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:ring-1 focus:ring-[#002B66] focus:outline-none"
                />
              </div>
            </div>

            {/* Code Snippet Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className="text-xs font-bold text-[#002B66] hover:text-blue-900 flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5 text-[#E31B23]" />
                {showCodeInput ? 'Remove Code Block' : '+ Attach Code Snippet (IT Students)'}
              </button>

              {showCodeInput && (
                <div className="mt-2 space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Attached Snippet</span>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-0.5"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={4}
                    placeholder="// Paste your code or algorithm here..."
                    className="w-full font-mono text-xs bg-slate-950 text-emerald-400 p-2.5 rounded-md border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Moderation Warning Banner */}
        {moderationWarning && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">AI Anti-Bullying & Safety Alert:</span>
              <span>{moderationWarning}</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] hidden sm:inline">Protected by Real-Time AI Content Moderation</span>
          </div>

          <button
            onClick={handleSubmitPost}
            disabled={isSubmitting || !postContent.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 border-b-2 border-[#E31B23]"
          >
            {isSubmitting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning Safety...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3 text-red-300" />
                <span>Publish Post</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Cohort & Stream Filter Bar (High Density Segments) */}
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Cohort & Announcement Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          {(['All', 'General', '1st Year', '2nd Year', '3rd Year'] as const).map((cohort) => (
            <button
              key={cohort}
              onClick={() => setSelectedCohort(cohort)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all shrink-0 ${
                selectedCohort === cohort
                  ? 'bg-[#002B66] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cohort === 'All' ? 'All Updates' : cohort === 'General' ? '📢 Announcements' : `${cohort} Feed`}
            </button>
          ))}
        </div>

        {/* Qualification Stream Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['All', 'IT', 'Business'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#002B66] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'All Streams' : cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Posts Feed List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-2.5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">No posts in this cohort feed yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Be the first to start a conversation or ask an academic question for this cohort!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasLiked = post.likedBy.includes(currentUser.id);
            const isCommentsOpen = activeCommentPostId === post.id;

            return (
              <article 
                key={post.id} 
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-3 border-l-4 border-indigo-500"
              >
                {/* Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-400 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                      {post.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 hover:underline cursor-pointer">
                          {post.authorName}
                        </span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          post.authorRole === 'admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          post.authorRole === 'alumni' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          post.authorRole === 'lecturer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          post.authorRole === 'recruiter' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{post.authorHeadline}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span>{post.authorCampus}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cohort Pill */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {post.cohort}
                    </span>
                    {post.qualificationCategory !== 'All' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {post.qualificationCategory}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>

                {/* Optional Attached Code Snippet */}
                {post.codeSnippet && (
                  <div className="bg-slate-900 rounded-lg p-3 text-xs overflow-x-auto border border-slate-800">
                    <div className="text-[9px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                      {post.codeSnippet.language}
                    </div>
                    <pre className="text-emerald-400 font-mono text-xs">
                      <code>{post.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors cursor-pointer border border-indigo-100/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar (Like, Comment, Share, Verified Safety) */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded transition-colors ${
                        hasLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments.length} Comments</span>
                    </button>

                    <button
                      onClick={() => alert("Link to post copied to clipboard.")}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>

                    <button
                      onClick={() => {
                        setReportingPostId(reportingPostId === post.id ? null : post.id);
                        setReportFeedback(null);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Report content (Section 2.4)"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span className="hidden sm:inline">AI Verified Safe</span>
                  </div>
                </div>

                {/* Section 2.4: Reporting Box */}
                {reportingPostId === post.id && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Report Content to Richfield Moderation Directorate</span>
                      </div>
                      <button onClick={() => setReportingPostId(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {reportFeedback ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-white p-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{reportFeedback}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[11px] text-slate-600 block">
                          Please select the violation category:
                        </label>
                        <select
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-full text-xs bg-white border border-rose-300 rounded-lg p-1.5 text-slate-800 focus:outline-none"
                        >
                          <option value="Unprofessional or non-career related content">Unprofessional / non-career related content</option>
                          <option value="Harassment, cyberbullying, or hate speech">Harassment, cyberbullying, or personal attacks</option>
                          <option value="Academic dishonesty or exam breach">Academic dishonesty or exam policy violation</option>
                          <option value="Commercial spam or unsolicited solicitation">Commercial spam or unsolicited advertising</option>
                        </select>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setReportingPostId(null)}
                            className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setReportFeedback("Report submitted. An administrative moderation review has been dispatched.");
                              setTimeout(() => setReportingPostId(null), 2500);
                            }}
                            className="px-3 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                          >
                            Submit Report
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Comments Section */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                    
                    {/* Existing Comments */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {post.comments.length === 0 ? (
                        <div className="p-3 bg-slate-50 rounded-lg text-center">
                          <p className="text-xs text-slate-400 italic">No comments yet. Start the academic or peer discussion!</p>
                        </div>
                      ) : (
                        post.comments.map((comm) => (
                          <div key={comm.id} className="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 text-xs border border-slate-200/70 transition-colors">
                            <div className="flex items-center justify-between mb-1.5 gap-2">
                              <div className="flex items-center gap-2">
                                {comm.authorAvatar ? (
                                  <img 
                                    src={comm.authorAvatar} 
                                    alt={comm.authorName} 
                                    className="w-6 h-6 rounded-full object-cover border border-indigo-200"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                    {comm.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                )}
                                <span className="font-bold text-slate-900 text-xs">{comm.authorName}</span>
                                {comm.authorRole && (
                                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                    comm.authorRole === 'admin' ? 'bg-emerald-100 text-emerald-800' :
                                    comm.authorRole === 'lecturer' ? 'bg-indigo-100 text-indigo-800' :
                                    comm.authorRole === 'alumni' ? 'bg-amber-100 text-amber-800' :
                                    comm.authorRole === 'recruiter' ? 'bg-purple-100 text-purple-800' :
                                    'bg-sky-100 text-sky-800'
                                  }`}>
                                    {comm.authorRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0">{comm.createdAt}</span>
                            </div>
                            <p className="text-slate-700 text-xs leading-relaxed pl-8">{comm.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* New Comment Input */}
                    <div className="flex items-center gap-2 pt-1.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                        {currentUser.avatar ? (
                          <img 
                            src={currentUser.avatar} 
                            alt={currentUser.name} 
                            className="w-7 h-7 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(post.id); }}
                          placeholder={`Reply as ${currentUser.name}...`}
                          className="w-full bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg pl-3 pr-9 py-2 border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-colors"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 transition-colors"
                          title="Send Reply"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
