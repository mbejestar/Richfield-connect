import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Video, 
  Sparkles, 
  AlertCircle, 
  Users, 
  BookOpen, 
  Briefcase, 
  Code2, 
  Award,
  ChevronRight,
  PhoneCall,
  Lock,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { UserProfile, MentorshipSession, CampusLocation } from '../types';
import { PremiumMentorStudio } from './PremiumMentorStudio';

interface MentorshipViewProps {
  mentors: UserProfile[];
  sessions: MentorshipSession[];
  currentUser: UserProfile;
  onRequestSession: (
    mentorId: string, 
    topic: string, 
    domain: string, 
    notes?: string,
    scheduledTime?: string,
    meetPlatform?: string
  ) => Promise<{ success: boolean; message: string }>;
  onAcceptSession?: (sessionId: string) => void;
  onDeclineSession?: (sessionId: string) => void;
  onNavigateToJobs?: () => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({
  mentors,
  sessions,
  currentUser,
  onRequestSession,
  onAcceptSession,
  onDeclineSession,
  onNavigateToJobs
}) => {
  // If user is logged in as a recruiter, show strict RBAC boundary view
  if (currentUser.role === 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-purple-800/50 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                Strict Role-Based Access Control (RBAC) Notice
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Corporate Recruiter Access Restriction
              </h2>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              Academic mentorship sessions, private 1-on-1 tutoring calls, and student peer requests are strictly private to students and accredited faculty/alumni mentors. Corporate recruiters do <strong>NOT</strong> have permission to access student mentorship call requests or private coaching notes.
            </p>
            <p>
              To recruit top students, inspect verified CodeHub live prototypes, view certified academic credentials, and schedule corporate interviews, please use the <strong>Talent Hub & Student Directory</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToJobs && onNavigateToJobs()}
              className="w-full sm:w-auto px-6 py-3 bg-[#E31B23] hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>Open Talent Hub & Student Directory</span>
            </button>
            <span className="text-xs text-slate-400">
              Complete student profiles, GPA rankings & live CodeHub runners
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isMentor = currentUser.isMentor || currentUser.role === 'alumni' || currentUser.role === 'lecturer';
  const isStudent = currentUser.role === 'student';

  // Filter incoming call requests directed to current mentor
  const incomingRequests = sessions.filter(s => {
    return (s.mentorId === currentUser.id || s.mentorName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) && s.status === 'pending';
  });

  const [activeSubTab, setActiveSubTab] = useState<'find' | 'incoming' | 'premium-ai' | 'sessions' | 'become'>(
    isMentor && incomingRequests.length > 0 ? 'incoming' : 'find'
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('All Campuses');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  
  // Call Booking Modal State
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<UserProfile | null>(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDomain, setBookingDomain] = useState('');
  const [bookingDate, setBookingDate] = useState('Tomorrow, 14:00 SAST');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('14:00 - 14:45 SAST');
  const [bookingPlatform, setBookingPlatform] = useState('Google Meet');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const campuses = [
    'All Campuses',
    'Newtown Campus',
    'Pretoria Campus',
    'Durban Campus',
    'Umhlanga Campus',
    'Cape Town Campus',
    'Polokwane Campus',
    'Sandton Campus',
    'Midrand Campus',
    'Alberton Campus'
  ];

  const domains = [
    'All',
    'Web Development',
    'Game Development',
    'Cloud Architecture',
    'Algorithms & Data Structures',
    'Cybersecurity & SecOps',
    'Business Analysis',
    'Financial Modeling',
    'Interview Prep & CV'
  ];

  const topicPresets = [
    'Mock Technical Interview & Code Review',
    'Capstone System Architecture & Database Design',
    'National Exam Runway Prep (Algorithms & Data Structures)',
    'Financial Modeling & Corporate Case Study Walkthrough',
    'Career Guidance & Graduate CV Polish'
  ];

  const filteredMentors = mentors.filter(mentor => {
    if (selectedCampus !== 'All Campuses' && !mentor.campus.includes(selectedCampus)) {
      return false;
    }
    if (selectedDomain !== 'All') {
      const match = (mentor.mentorDomain || []).some(d => d.toLowerCase().includes(selectedDomain.toLowerCase()));
      if (!match) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = mentor.name.toLowerCase().includes(q);
      const headlineMatch = mentor.headline.toLowerCase().includes(q);
      const skillsMatch = (mentor.skills || []).some(s => s.toLowerCase().includes(q));
      const domainMatch = (mentor.mentorDomain || []).some(d => d.toLowerCase().includes(q));
      if (!nameMatch && !headlineMatch && !skillsMatch && !domainMatch) return false;
    }
    return true;
  });

  const handleOpenBooking = (mentor: UserProfile, prefillTopic?: string) => {
    setSelectedMentorForBooking(mentor);
    setBookingTopic(prefillTopic || '');
    setBookingDomain(mentor.mentorDomain && mentor.mentorDomain[0] ? mentor.mentorDomain[0] : 'General Guidance');
    setBookingNotes('');
    setBookingDate('Tomorrow, 14:00 SAST');
    setBookingTimeSlot(currentUser.isPremium ? '14:00 - 15:00 SAST (60 mins · Extended Pro)' : '14:00 - 14:20 SAST (20 mins · Standard)');
    setBookingPlatform('Google Meet');
    setBookingFeedback(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForBooking || !bookingTopic.trim()) return;

    setIsSubmitting(true);
    setBookingFeedback(null);

    const fullTime = `${bookingDate} (${bookingTimeSlot}) via ${bookingPlatform}`;

    const res = await onRequestSession(
      selectedMentorForBooking.id,
      bookingTopic.trim(),
      bookingDomain,
      bookingNotes.trim(),
      fullTime,
      bookingPlatform
    );

    setIsSubmitting(false);

    if (res.success) {
      setBookingFeedback({ 
        type: 'success', 
        text: `Call request sent to ${selectedMentorForBooking.name}! Status is Pending. You will be notified once they accept.` 
      });
      setTimeout(() => {
        setSelectedMentorForBooking(null);
        setActiveSubTab('sessions');
      }, 1600);
    } else {
      setBookingFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Mentor Incoming Notification Alert */}
      {isMentor && incomingRequests.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-amber-900 block text-sm">
                You have {incomingRequests.length} Pending Student Call Request{incomingRequests.length > 1 ? 's' : ''}!
              </span>
              <span className="text-amber-800 text-xs">
                Students are waiting for your approval to confirm their 1-on-1 mentorship call session.
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('incoming')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md shrink-0 transition-colors"
          >
            Review Incoming Requests ({incomingRequests.length})
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-900">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Mentorship Hub</h1>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Alumni & Faculty mentoring students across all Richfield campuses — 1-on-1 calls, tutoring & career prep
            </p>
          </div>

          {/* Institutional Free Guarantee Badge */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 flex items-center gap-2.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
            <div className="text-[11px]">
              <span className="font-bold text-indigo-950 block">100% Free for Verified Students</span>
              <span className="text-indigo-800/80 text-[10px]">Funded via Richfield Directorate</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-0.5 bg-slate-100 rounded-lg mt-4 max-w-fit">
          <button
            onClick={() => setActiveSubTab('find')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'find'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Mentors ({mentors.length})
          </button>

          {/* Incoming Requests Tab for Mentors */}
          {isMentor && (
            <button
              onClick={() => setActiveSubTab('incoming')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'incoming'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-800 hover:bg-amber-100/60'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Incoming Call Requests</span>
              {incomingRequests.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('premium-ai')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'premium-ai'
                ? 'bg-purple-800 text-white shadow-sm'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Matcher & Advisory</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-purple-950">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sessions')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'sessions'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Scheduled Calls ({sessions.length})
          </button>

          {!isStudent && (
            <button
              onClick={() => setActiveSubTab('become')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeSubTab === 'become'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mentor Capacity Settings
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: INCOMING CALL REQUESTS (MENTOR PERSPECTIVE)                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'incoming' && isMentor && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Incoming Student Call Requests</h2>
              <p className="text-xs text-slate-500">
                Review and approve 1-on-1 coaching sessions requested by Richfield students.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900">
              {incomingRequests.length} Pending Approval
            </span>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">All student requests are up to date!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When students schedule a call with your profile, the request will appear here for you to accept.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map(sess => (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-sm space-y-4 hover:border-amber-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black uppercase rounded-md">
                          Call Request Pending
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-bold text-slate-700">{sess.scheduledTime}</span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 mt-1">{sess.topic}</h3>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <span className="font-bold text-indigo-900">Student: {sess.menteeName}</span>
                        <span>•</span>
                        <span>{sess.menteeYear}</span>
                        <span>•</span>
                        <span className="text-slate-500">Domain: {sess.mentorDomain}</span>
                      </div>
                    </div>

                    {/* Mentor Fast Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onDeclineSession && onDeclineSession(sess.id)}
                        className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onAcceptSession && onAcceptSession(sess.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Call Request</span>
                      </button>
                    </div>
                  </div>

                  {sess.studentNotes && (
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 border border-slate-200/80">
                      <span className="font-bold text-slate-900 block mb-0.5">Student's Roadblocks & Questions:</span>
                      {sess.studentNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero-Fee Verified • Institutional Code of Conduct Active
                    </span>
                    <span>Accepting will automatically generate a Google Meet call room</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: FIND MENTORS                                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'find' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors by name, topic, or expertise (e.g. Algorithms, Full-Stack, Cyber Security, DCF Valuation)..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Campus:</span>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 focus:outline-none"
              >
                {campuses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <span className="text-[10px] font-bold text-slate-500 uppercase ml-2">Domain:</span>
              <div className="flex flex-wrap items-center gap-1">
                {domains.slice(0, 6).map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                      selectedDomain === dom
                        ? 'bg-white text-indigo-900 shadow-sm border border-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredMentors.map((mentor) => {
              const currentMentees = mentor.currentMenteesCount || 0;
              const maxCapacity = mentor.maxMentees || 4;
              const isAtCapacity = currentMentees >= maxCapacity;

              return (
                <div
                  key={mentor.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 border-l-4 border-indigo-500"
                >
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 border border-indigo-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                          {mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm text-slate-900">{mentor.name}</h3>
                            {mentor.role === 'alumni' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300 shadow-xs">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-600 fill-amber-200" />
                                <span>Alumni with a Tick ✓</span>
                              </span>
                            ) : (
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                mentor.role === 'admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                mentor.role === 'lecturer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {mentor.role === 'lecturer' ? 'Faculty Lecturer' : 'Verified Mentor'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{mentor.headline}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{mentor.campus}</span>
                            {mentor.company && <span>• {mentor.company}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Capacity Badge */}
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        isAtCapacity 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isAtCapacity ? 'Capacity Full' : `${maxCapacity - currentMentees} slots available`}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed">
                      {mentor.bio}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {mentor.skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500">
                      Domain: {mentor.mentorDomain && mentor.mentorDomain[0] ? mentor.mentorDomain[0] : 'General'}
                    </span>

                    <button
                      onClick={() => handleOpenBooking(mentor)}
                      disabled={isAtCapacity}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5 ${
                        currentUser.isPremium && mentor.role === 'alumni'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
                          : 'bg-[#002B66] hover:bg-blue-900 text-white'
                      }`}
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>
                        {isAtCapacity 
                          ? 'Full' 
                          : currentUser.isPremium && mentor.role === 'alumni' 
                          ? '60-Min Pro Call (with Tick ✓)' 
                          : 'Schedule Call (20m)'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: PREMIUM AI MENTOR STUDIO                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'premium-ai' && (
        <PremiumMentorStudio
          mentors={mentors}
          currentUser={currentUser}
          onRequestSession={onRequestSession}
          onOpenBookingModal={(mentor, topic) => handleOpenBooking(mentor, topic)}
        />
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: MY SCHEDULED SESSIONS                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900">No active mentorship calls scheduled</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the verified alumni & faculty mentors on EnrichHub and schedule your first 1-on-1 coaching call.
              </p>
              <button
                onClick={() => setActiveSubTab('find')}
                className="mt-4 px-4 py-2 bg-[#002B66] text-white text-xs font-bold rounded-xl shadow"
              >
                Find a Mentor & Schedule Call
              </button>
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900">{sess.topic}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        sess.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 font-black' :
                        sess.status === 'pending' ? 'bg-amber-100 text-amber-800 font-bold' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {sess.status === 'accepted' ? 'Confirmed & Scheduled' : sess.status === 'pending' ? 'Pending Mentor Approval' : sess.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span><strong>Mentor:</strong> {sess.mentorName} ({sess.mentorDomain})</span>
                      <span>•</span>
                      <span><strong>Student:</strong> {sess.menteeName} ({sess.menteeYear})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sess.meetLink && sess.status === 'accepted' && (
                      <a
                        href={sess.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Video Call</span>
                      </a>
                    )}
                  </div>
                </div>

                {sess.studentNotes && (
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-0.5">Session Prep Notes:</span>
                    {sess.studentNotes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AI Safety Monitored • Institutional Zero-Fee Verified</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sess.scheduledTime}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: MENTOR CAPACITY SETTINGS                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'become' && !isStudent && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Volunteer Mentor Settings</h3>
              <p className="text-xs text-slate-500">Manage your mentee capacity limits and specialized domains.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Max Mentee Capacity (Institutional Limit: 3-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                defaultValue={currentUser.maxMentees || 4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Limits prevent mentor burnout and ensure high-touch guidance for each student.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Mentorship Domains</label>
              <input
                type="text"
                defaultValue={(currentUser.mentorDomain || ['Web Development', 'Cloud Architecture', 'Interview Prep']).join(', ')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <button className="w-full py-2.5 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900 transition-colors">
              Save Capacity & Domain Settings
            </button>
          </div>
        </div>
      )}

      {/* SCHEDULE A CALL MODAL */}
      {selectedMentorForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Schedule 1-on-1 Call with Mentor</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Requesting session with <strong>{selectedMentorForBooking.name}</strong> ({selectedMentorForBooking.headline})
                </p>
              </div>
              <button
                onClick={() => setSelectedMentorForBooking(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Zero-Fee Institutional Guarantee Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>100% Free:</strong> No student fees. Certified Richfield Academic Guidance program.</span>
            </div>

            {/* Premium vs Standard Session Duration Banner */}
            {currentUser.isPremium ? (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-950 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900">🌟 Richfield Pro Student Perk Applied: 60-Minute Extended Call</span>
                  <span className="text-slate-600">
                    You have <strong className="text-amber-900">+40 extra minutes</strong> with verified Alumni with a tick (✓). Enjoy thorough capstone reviews and mock interviews.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Standard 20-Minute Introductory Call</span>
                  <span className="text-slate-500">
                    Standard students receive 20-min introductory slots. Switch to <strong className="text-[#002B66]">Themba Billa (Premium Student)</strong> to unlock 60-minute deep dives with alumni with a tick ✓!
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-3.5">
              
              {/* Topic Input with presets */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Call Topic / Learning Agenda *
                </label>
                <input
                  type="text"
                  required
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="e.g. Mock Technical Interview & Capstone Review"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                
                {/* Quick Topic Chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {topicPresets.slice(0, 3).map((tp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBookingTopic(tp)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-900 transition-colors"
                    >
                      {tp.split(' ')[0]} {tp.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Requested Date
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none"
                  >
                    <option value="Tomorrow, 14:00 SAST">Tomorrow</option>
                    <option value="This Thursday, 11:00 SAST">This Thursday</option>
                    <option value="This Friday, 16:00 SAST">This Friday</option>
                    <option value="Next Monday, 10:00 SAST">Next Monday</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {currentUser.isPremium ? (
                      <>
                        <option value="09:00 - 10:00 SAST (60 mins · Extended Pro)">09:00 - 10:00 SAST (60 mins · Extended Pro)</option>
                        <option value="11:30 - 12:30 SAST (60 mins · Extended Pro)">11:30 - 12:30 SAST (60 mins · Extended Pro)</option>
                        <option value="14:00 - 15:00 SAST (60 mins · Extended Pro)">14:00 - 15:00 SAST (60 mins · Extended Pro)</option>
                        <option value="16:30 - 17:30 SAST (60 mins · Extended Pro)">16:30 - 17:30 SAST (60 mins · Extended Pro)</option>
                      </>
                    ) : (
                      <>
                        <option value="09:00 - 09:20 SAST (20 mins · Standard)">09:00 - 09:20 SAST (20 mins · Standard)</option>
                        <option value="11:30 - 11:50 SAST (20 mins · Standard)">11:30 - 11:50 SAST (20 mins · Standard)</option>
                        <option value="14:00 - 14:20 SAST (20 mins · Standard)">14:00 - 14:20 SAST (20 mins · Standard)</option>
                        <option value="16:30 - 16:50 SAST (20 mins · Standard)">16:30 - 16:50 SAST (20 mins · Standard)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Video Platform */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Video Platform
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setBookingPlatform('Google Meet')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      bookingPlatform === 'Google Meet'
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Google Meet
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingPlatform('Microsoft Teams')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      bookingPlatform === 'Microsoft Teams'
                        ? 'bg-purple-50 border-purple-600 text-purple-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Microsoft Teams
                  </button>
                </div>
              </div>

              {/* Notes & Specific Questions */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Specific Questions or Code Roadblocks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="e.g. Would love feedback on our JWT authentication gateway and interview prep..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {bookingFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  bookingFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}>
                  {bookingFeedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{bookingFeedback.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentorForBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !bookingTopic.trim()}
                  className="px-5 py-2.5 bg-[#002B66] hover:bg-blue-900 text-white rounded-xl text-xs font-black shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Schedule Call with Mentor'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
