import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  PlusCircle, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Filter,
  ArrowUpRight,
  Send,
  Users,
  Trophy,
  Star,
  Award,
  X,
  Play,
  AlertTriangle,
  Lock,
  Shield
} from 'lucide-react';
import { JobOpportunity, UserProfile, TopStudentCandidate } from '../types';
import { TOP_TEN_RECOMMENDED_STUDENTS } from '../mockData';
import { StudentDirectoryView } from './StudentDirectoryView';
import { StudentDetailModal } from './StudentDetailModal';
import { COMPREHENSIVE_STUDENTS_DIRECTORY, StudentFullDetail } from '../data/studentDirectoryData';

interface JobsViewProps {
  jobs: JobOpportunity[];
  currentUser: UserProfile;
  topStudents?: TopStudentCandidate[];
  onApplyJob: (jobId: string) => Promise<{ success: boolean; message: string }>;
  onCreateJob: (newJob: Partial<JobOpportunity>) => Promise<{ success: boolean; message: string }>;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  currentUser,
  topStudents = TOP_TEN_RECOMMENDED_STUDENTS,
  onApplyJob,
  onCreateJob
}) => {
  const isRecruiter = currentUser.role === 'recruiter';
  const isRecruiterOrAdmin = currentUser.role === 'recruiter' || currentUser.role === 'admin';

  // Recruiter view toggle: default to directory if recruiter!
  const [activeTabMode, setActiveTabMode] = useState<'directory' | 'top-students' | 'jobs'>(
    isRecruiter ? 'directory' : 'jobs'
  );

  // Recruiter Top 10 Student Filter and action states
  const [studentQualificationFilter, setStudentQualificationFilter] = useState<'All' | 'IT' | 'Business'>('All');
  const [shortlistedStudentIds, setShortlistedStudentIds] = useState<string[]>(['std-top-1', 'std-top-3']);
  const [invitedStudentIds, setInvitedStudentIds] = useState<string[]>([]);
  
  // Selected student for interview invitation
  const [inviteModalStudent, setInviteModalStudent] = useState<TopStudentCandidate | null>(null);
  const [inviteRoleTitle, setInviteRoleTitle] = useState('Graduate Associate / Software Engineer');
  const [inviteDate, setInviteDate] = useState('Next Tuesday, 10:00 AM SAST');
  const [inviteNotes, setInviteNotes] = useState('We were impressed by your top Dean\'s list academic ranking and datathon achievements at Richfield.');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  // Selected student for Academic Dossier Modal
  const [dossierStudent, setDossierStudent] = useState<TopStudentCandidate | null>(null);

  // Selected student for Full Detailed Modal with Live Prototypes & Certificates
  const [fullDetailStudent, setFullDetailStudent] = useState<StudentFullDetail | null>(null);
  const [fullDetailInitialTab, setFullDetailInitialTab] = useState<'overview' | 'certificates' | 'codehub' | 'transcript' | 'experience'>('overview');

  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedQualification, setSelectedQualification] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Job for Detailed View Modal
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState<string | null>(null);

  // Recruiter Job-Specific Top 10 Matching Modal State
  const [jobMatchedCandidatesModalJob, setJobMatchedCandidatesModalJob] = useState<JobOpportunity | null>(null);

  // Helper to compute AI Top 10 tailored specifically for a selected job
  const getTopCandidatesForJob = (job: JobOpportunity) => {
    const jobTitle = job.title.toLowerCase();
    const jobDesc = job.description.toLowerCase();
    const jobReqs = job.requirements.map(r => r.toLowerCase()).join(' ');
    const combined = `${jobTitle} ${jobDesc} ${jobReqs}`;

    return COMPREHENSIVE_STUDENTS_DIRECTORY.map(student => {
      let score = 55;
      const rationales: string[] = [];

      // 1. Qualification stream match
      if (job.qualification === 'Both' || student.qualificationField === job.qualification || student.qualificationField === 'Both') {
        score += 20;
        rationales.push(`Direct faculty match: ${student.qualificationName}`);
      } else {
        score -= 15;
      }

      // 2. Year alignment
      if (job.yearRequirement === 'All Years') {
        score += 8;
      } else if (student.academicYear.toLowerCase().includes(job.yearRequirement.toLowerCase().slice(0, 3))) {
        score += 15;
        rationales.push(`Cohort alignment (${student.academicYear})`);
      }

      // 3. Academic distinction
      const aggregateNum = parseInt(student.academicAggregate) || 75;
      if (aggregateNum >= 88) {
        score += 16;
        rationales.push(`High distinction average (${student.academicAggregate})`);
      } else if (aggregateNum >= 75) {
        score += 8;
        rationales.push(`Solid academic record (${student.academicAggregate})`);
      }
      if (student.deansList) {
        score += 6;
        rationales.push("Dean's Merit List honouree");
      }

      // 4. Skills match against job requirements & title
      const matchingSkills = student.skills.filter(sk => 
        combined.includes(sk.toLowerCase())
      );
      if (matchingSkills.length > 0) {
        score += Math.min(22, matchingSkills.length * 6);
        rationales.push(`Matches role skills: ${matchingSkills.slice(0, 3).join(', ')}`);
      }

      // 5. CodeHub interactive micro-prototypes
      if (student.codeHubProjects && student.codeHubProjects.length > 0) {
        score += 5;
        rationales.push(`${student.codeHubProjects.length} live verified CodeHub project(s)`);
      }

      const finalScore = Math.min(99, Math.max(68, score));
      return {
        ...student,
        jobMatchScore: finalScore,
        matchRationale: rationales.slice(0, 3).join(' • ')
      };
    })
    .sort((a, b) => b.jobMatchScore - a.jobMatchScore)
    .slice(0, 10);
  };

  // Recruiter Post Job Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState(currentUser.organization || currentUser.company || 'Richfield Industry Partner');
  const [newType, setNewType] = useState<'bursary' | 'internship' | 'graduate-program' | 'entry-level'>('bursary');
  const [newQualification, setNewQualification] = useState<'IT' | 'Business' | 'Both'>('Both');
  const [newYear, setNewYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | 'Final Year / Graduates' | 'All Years'>('All Years');
  const [newSalary, setNewSalary] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newDeadline, setNewDeadline] = useState('December 15, 2026');
  const [isPosting, setIsPosting] = useState(false);

  const filteredTopStudents = topStudents.filter(s => {
    const field = s.qualification || s.qualificationField;
    if (studentQualificationFilter !== 'All' && field !== studentQualificationFilter) {
      return false;
    }
    return true;
  });

  const handleToggleShortlist = (id: string) => {
    if (shortlistedStudentIds.includes(id)) {
      setShortlistedStudentIds(shortlistedStudentIds.filter(x => x !== id));
    } else {
      setShortlistedStudentIds([...shortlistedStudentIds, id]);
    }
  };

  const handleSendInterviewInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteModalStudent) return;

    if (!invitedStudentIds.includes(inviteModalStudent.id)) {
      setInvitedStudentIds([...invitedStudentIds, inviteModalStudent.id]);
    }

    setInviteSuccessMsg(`Fast-track interview invitation dispatched to ${inviteModalStudent.name}! Candidate status updated to Fast-Track Pipeline.`);
    setTimeout(() => {
      setInviteModalStudent(null);
      setInviteSuccessMsg(null);
    }, 1800);
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedType !== 'All' && job.type !== selectedType) return false;
    if (selectedQualification !== 'All' && job.qualification !== selectedQualification && job.qualification !== 'Both') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchDesc) return false;
    }
    return true;
  });

  const handleApply = async (job: JobOpportunity) => {
    setIsApplying(true);
    setApplyFeedback(null);
    const res = await onApplyJob(job.id);
    setIsApplying(false);
    setApplyFeedback(res.message);
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setIsPosting(true);
    const reqs = newRequirements.split('\n').map(r => r.trim()).filter(Boolean);

    await onCreateJob({
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: 'South Africa / Hybrid',
      campusTarget: 'All Richfield Campuses',
      type: newType,
      qualification: newQualification,
      yearRequirement: newYear,
      stipendOrSalary: newSalary.trim() || 'Market Related',
      description: newDescription.trim(),
      requirements: reqs.length > 0 ? reqs : ['Richfield student in good standing', 'Active enrollment verification'],
      deadline: newDeadline,
      postedBy: currentUser.id,
      postedByName: `${currentUser.name} (${currentUser.role === 'recruiter' ? 'Campus Recruiter' : 'Admin'})`,
      isVerified: true
    });

    setIsPosting(false);
    setShowPostModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewRequirements('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-900">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {isRecruiter ? 'Talent Hub & Corporate Recruiting' : 'Bursaries & Career Opportunities'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {isRecruiter 
              ? 'AI-recommended top student talent pipelines, distinction candidates, and campus job listings'
              : 'Verified corporate bursaries, internships, and graduate programs tailored for Richfield IT & Business students'
            }
          </p>
        </div>

        {/* Action Button for Recruiters / Campus Managers */}
        {isRecruiterOrAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            {isRecruiter && !currentUser.verified ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Admin Approval</span>
              </div>
            ) : (
              <button
                onClick={() => setShowPostModal(true)}
                className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Bursary / Role</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recruiter Verification Notice if Unverified */}
      {isRecruiter && !currentUser.verified && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-sm animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs space-y-1">
            <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
              <span>Recruiter Verification Pending Admin Authorization</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold uppercase">POPIA Vetting</span>
            </h4>
            <p className="text-amber-800 leading-relaxed">
              Your corporate recruiter profile is currently awaiting institutional clearance from the Richfield Admin registry. 
              Once an administrator verifies your company credentials in the Admin Command center, you will be granted access to post new bursary requisitions, request fast-track interview schedules, and access candidate contact dossiers.
            </p>
          </div>
        </div>
      )}

      {/* Top-Level Mode Selector */}
      <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm flex-wrap gap-2">
        <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg flex-wrap gap-1">
          <button
            onClick={() => setActiveTabMode('directory')}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
              activeTabMode === 'directory'
                ? 'bg-[#002B66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Student Directory & Portfolios</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200 text-slate-700">
              Peer Profiles
            </span>
          </button>

          {isRecruiterOrAdmin && (
            <button
              onClick={() => setActiveTabMode('top-students')}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                activeTabMode === 'top-students'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>General Top 10 AI Talent</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-amber-400 text-purple-950">
                AI Match
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTabMode('jobs')}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTabMode === 'jobs'
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Listings & Bursaries ({jobs.length})</span>
          </button>
        </div>

        {/* Shortlist Counter for Recruiters */}
        {isRecruiterOrAdmin && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mr-1">
            <span className="flex items-center gap-1 text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <Star className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
              {shortlistedStudentIds.length} Shortlisted Candidates
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 0: STUDENT DIRECTORY (FILTER BY YEARS & CAMPUS)                      */}
      {/* ========================================================================= */}
      {activeTabMode === 'directory' && (
        <StudentDirectoryView
          shortlistedStudentIds={shortlistedStudentIds}
          onToggleShortlist={handleToggleShortlist}
          currentUser={currentUser}
          onScheduleInterviewFromDirectory={(std) => {
            const foundTop = topStudents.find(t => t.id === std.id || t.name === std.name);
            if (foundTop) {
              setInviteModalStudent(foundTop);
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODE 1: TOP 10 AI RECOMMENDED STUDENTS                                    */}
      {/* ========================================================================= */}
      {activeTabMode === 'top-students' && (
        <div className="space-y-4">
          
          {/* AI Talent Intelligence Overview Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-md border border-purple-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-bold uppercase tracking-wider">
                    AI Talent Radar Algorithm v3.4
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Dean's Verification Verified
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Richfield Top 10 Recommended Student Leaders
                </h2>
                <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed">
                  Cross-referencing verified exam transcripts, CodeHub code quality metrics, Business Datathon placements, and continuous campus attendance.
                </p>
              </div>

              {/* Pipeline Quick Stats */}
              <div className="grid grid-cols-3 gap-2 shrink-0 bg-white/10 rounded-lg p-2.5 border border-white/10 text-center">
                <div>
                  <span className="text-xs text-purple-200 block text-[10px] uppercase font-semibold">Cohort Avg</span>
                  <span className="text-sm font-black text-white">89.6%</span>
                </div>
                <div>
                  <span className="text-xs text-purple-200 block text-[10px] uppercase font-semibold">AI Match</span>
                  <span className="text-sm font-black text-emerald-300">96.8%</span>
                </div>
                <div>
                  <span className="text-xs text-purple-200 block text-[10px] uppercase font-semibold">Ready</span>
                  <span className="text-sm font-black text-amber-300">10 / 10</span>
                </div>
              </div>
            </div>

            {/* Filter Pills for Top 10 */}
            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-purple-800/40">
              <span className="text-[10px] font-bold text-purple-300 uppercase">Stream:</span>
              <div className="flex space-x-1">
                {(['All', 'IT', 'Business'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setStudentQualificationFilter(q)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors ${
                      studentQualificationFilter === q
                        ? 'bg-white text-purple-950 shadow-sm'
                        : 'text-purple-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {q === 'All' ? 'All Top 10 Candidates' : `${q} Candidates`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTopStudents.map((candidate) => {
              const isShortlisted = shortlistedStudentIds.includes(candidate.id);
              const isInvited = invitedStudentIds.includes(candidate.id);

              return (
                <div
                  key={candidate.id}
                  className={`bg-white rounded-xl p-4 sm:p-5 border shadow-sm transition-all flex flex-col justify-between space-y-3.5 ${
                    candidate.rank === 1
                      ? 'border-amber-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/20 to-white'
                      : candidate.rank <= 3
                        ? 'border-purple-200 border-l-4 border-l-purple-600'
                        : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header: Rank + Match Score + Shortlist */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Rank Badge */}
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-sm ${
                          candidate.rank === 1
                            ? 'bg-amber-400 text-amber-950 font-black ring-2 ring-amber-300'
                            : candidate.rank === 2
                              ? 'bg-slate-300 text-slate-900'
                              : candidate.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{candidate.rank}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-slate-900 text-sm">{candidate.name}</h3>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {candidate.academicYear}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{candidate.campus}</span>
                            <span>•</span>
                            <span>{candidate.qualificationName}</span>
                          </p>
                        </div>
                      </div>

                      {/* AI Match Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {candidate.aiMatchScore}% Match
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                          {candidate.gpa || candidate.academicAggregate}
                        </span>
                      </div>
                    </div>

                    {/* AI Recommendation Rationale Quote */}
                    <div className="mt-3 p-2.5 bg-purple-50/60 rounded-lg border border-purple-100 text-xs">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        AI Recommendation Rationale:
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed italic">
                        "{candidate.recommendationReason || candidate.aiRecommendationRationale}"
                      </p>
                    </div>

                    {/* Key Strengths & Skills */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Verified Achievements */}
                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                      {(candidate.achievements || candidate.keyStrengths || []).map((ach, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                          <Award className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions for Recruiter */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleShortlist(candidate.id)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                        isShortlisted
                          ? 'border-amber-300 bg-amber-50 text-amber-900'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                      title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      <span className="hidden sm:inline">{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDossierStudent(candidate)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                      >
                        Academic Record
                      </button>

                      <button
                        onClick={() => setInviteModalStudent(candidate)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow transition-all ${
                          isInvited
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-purple-700 hover:bg-purple-800 text-white active:scale-95'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{isInvited ? 'Invited' : 'Invite to Interview'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: STANDARD JOBS & BURSARIES VIEW                                    */}
      {/* ========================================================================= */}
      {activeTabMode === 'jobs' && (
        <div className="space-y-4">

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role title, company (e.g. Vodacom, SovTech, Standard Bank), or tech stack..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          {/* Opportunity Type Pills */}
          <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { id: 'All', label: 'All Opportunities' },
              { id: 'bursary', label: '💰 Bursaries' },
              { id: 'internship', label: '💼 Internships' },
              { id: 'graduate-program', label: '🚀 Graduate Programs' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`text-xs font-bold px-3 py-1 rounded-md transition-all ${
                  selectedType === t.id
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Qualification Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stream:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {['All', 'IT', 'Business'].map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQualification(q)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                    selectedQualification === q
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredJobs.map((job) => {
          const hasApplied = job.applicantIds.includes(currentUser.id);

          return (
            <div
              key={job.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 border-l-4 border-indigo-500"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        job.type === 'bursary' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        job.type === 'graduate-program' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {job.type.replace('-', ' ')}
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                        {job.matchScore || 92}% AI Match
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 hover:text-indigo-900 cursor-pointer">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.company}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md block">
                      {job.stipendOrSalary}
                    </span>
                  </div>
                </div>

                {/* Details Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    {job.qualification === 'Both' ? 'IT & Business' : `${job.qualification} Stream`}
                  </span>
                  <span>•</span>
                  <span>{job.yearRequirement}</span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Key Requirements List */}
                <div className="mt-2.5 space-y-1">
                  {job.requirements.slice(0, 2).map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Deadline: {job.deadline}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {isRecruiterOrAdmin && (
                    <button
                      onClick={() => setJobMatchedCandidatesModalJob(job)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                      title="View AI Top 10 Candidates Tailored for this Job"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Top 10 For Job</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setSelectedJob(job); setApplyFeedback(null); }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Details
                  </button>

                  {isRecruiter ? (
                    <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>{job.applicantIds.length} {job.applicantIds.length === 1 ? 'Applicant' : 'Applicants'}</span>
                    </span>
                  ) : currentUser.role === 'lecturer' || currentUser.role === 'admin' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                      {job.applicantIds.length} Applicants
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={hasApplied || isApplying}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                        hasApplied
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-[#002B66] hover:bg-blue-900 text-white active:scale-95'
                      }`}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Click Apply</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
      </div>
      )}

      {/* Recruiter Fast-Track Interview Modal */}
      {inviteModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Invite to Fast-Track Interview</h3>
                  <p className="text-[11px] text-slate-500">Corporate Fast-Track Placement</p>
                </div>
              </div>
              <button
                onClick={() => setInviteModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccessMsg ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Invitation Dispatched</h4>
                <p className="text-xs text-slate-600 leading-relaxed px-4">
                  {inviteSuccessMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInterviewInvite} className="space-y-3.5 pt-4">
                <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{inviteModalStudent.name}</p>
                    <p className="text-[11px] text-purple-800 font-semibold">{inviteModalStudent.qualificationName} • {inviteModalStudent.campus}</p>
                  </div>
                  <span className="text-xs font-black text-purple-900 bg-white px-2 py-0.5 rounded shadow-sm">
                    #{inviteModalStudent.rank} Rank
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Position / Programme Role</label>
                  <input
                    type="text"
                    required
                    value={inviteRoleTitle}
                    onChange={(e) => setInviteRoleTitle(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Interview Time / Format</label>
                  <input
                    type="text"
                    required
                    value={inviteDate}
                    onChange={(e) => setInviteDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Personalized Recruiter Note</label>
                  <textarea
                    rows={3}
                    required
                    value={inviteNotes}
                    onChange={(e) => setInviteNotes(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalStudent(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Official Fast-Track Invite</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Academic Record / Dossier Modal */}
      {dossierStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                  #{dossierStudent.rank} Academic Dean's Leader
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{dossierStudent.name}</h3>
                <p className="text-xs text-slate-600">{dossierStudent.qualificationName} • {dossierStudent.campus}</p>
              </div>
              <button
                onClick={() => setDossierStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Aggregate Standing</span>
                <span className="font-bold text-slate-900">{dossierStudent.gpa || dossierStudent.academicAggregate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">AI Match Rating</span>
                <span className="font-bold text-emerald-700">{dossierStudent.aiMatchScore}% Synergy</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Evaluation Rationale</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                {dossierStudent.recommendationReason || dossierStudent.aiRecommendationRationale}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Verified Campus Honors</h4>
              <div className="space-y-1">
                {(dossierStudent.achievements || dossierStudent.keyStrengths || []).map((ach, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-slate-50 rounded border border-slate-200">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setDossierStudent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED JOB MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {selectedJob.type}
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">{selectedJob.title}</h3>
                <p className="text-sm font-bold text-slate-700">{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900">Compensation / Bursary Grant:</span>
              <span className="font-extrabold text-emerald-800 text-sm">{selectedJob.stipendOrSalary}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Opportunity Overview</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Eligibility & Requirements</h4>
              <ul className="space-y-1.5">
                {selectedJob.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Posted by: <strong>{selectedJob.postedByName}</strong></span>
              <span>Deadline: <strong>{selectedJob.deadline}</strong></span>
            </div>

            {applyFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{applyFeedback}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
              <div>
                {isRecruiterOrAdmin && (
                  <button
                    onClick={() => {
                      const j = selectedJob;
                      setSelectedJob(null);
                      setJobMatchedCandidatesModalJob(j);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-1.5 shadow transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>View Top 10 Candidates For This Job</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                {isRecruiter || currentUser.role === 'admin' || currentUser.role === 'lecturer' ? (
                  <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Recruiter Portal • {selectedJob.applicantIds.length} Candidate Applications</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(selectedJob)}
                    disabled={selectedJob.applicantIds.includes(currentUser.id) || isApplying}
                    className="px-6 py-2 bg-[#002B66] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
                  >
                    {selectedJob.applicantIds.includes(currentUser.id) ? 'Application Submitted' : 'Submit 1-Click Application'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POST BURSARY / JOB MODAL (RECRUITER / CAMPUS MANAGER PERSPECTIVE) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Post Bursary or Career Opportunity</h3>
                <p className="text-xs text-slate-500">Reach verified Richfield IT & Business students nationwide.</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2026 Vodacom IT Graduate Bursary Scheme"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Opportunity Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option value="bursary">Bursary (Tuition + Stipend)</option>
                    <option value="internship">Internship</option>
                    <option value="graduate-program">Graduate Program</option>
                    <option value="entry-level">Entry-Level Role</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Qualification Target</label>
                  <select
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option value="Both">Both IT & Business</option>
                    <option value="IT">IT Only</option>
                    <option value="Business">Business Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    <option value="All Years">All Academic Years</option>
                    <option value="1st Year">1st Year Students</option>
                    <option value="2nd Year">2nd Year Students</option>
                    <option value="3rd Year">3rd Year Students</option>
                    <option value="Final Year / Graduates">Final Year / Graduates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Stipend / Grant Value</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  placeholder="e.g. 100% Tuition + R8,500/month stipend"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline the responsibilities, program duration, and benefits..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Requirements (one per line)</label>
                <textarea
                  rows={2}
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="Minimum 60% aggregate&#10;South African citizen&#10;BSc IT or BCom Business"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting}
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow transition-all"
                >
                  {isPosting ? 'Publishing...' : 'Publish to Student Feeds'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* JOB-SPECIFIC TOP 10 RANKED CANDIDATES MODAL */}
      {jobMatchedCandidatesModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    Role-Specific AI Matching Engine
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {jobMatchedCandidatesModalJob.company}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                    {jobMatchedCandidatesModalJob.qualification} Stream • {jobMatchedCandidatesModalJob.yearRequirement}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Top 10 Ranked Candidates for: "{jobMatchedCandidatesModalJob.title}"
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Tailored ranking based on job requirements, technical skills, academic transcripts, and verified CodeHub prototypes.
                </p>
              </div>

              <button
                onClick={() => setJobMatchedCandidatesModalJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidates List */}
            <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
              {getTopCandidatesForJob(jobMatchedCandidatesModalJob).map((candidate, idx) => {
                const isShortlisted = shortlistedStudentIds.includes(candidate.id);
                const isInvited = invitedStudentIds.includes(candidate.id);

                return (
                  <div
                    key={candidate.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    {/* Candidate Info */}
                    <div className="flex items-start gap-3 flex-1">
                      {/* Rank badge */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${
                          idx === 0 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' :
                          idx === 1 ? 'bg-slate-200 text-slate-800 ring-2 ring-slate-300' :
                          idx === 2 ? 'bg-amber-700 text-amber-50 ring-2 ring-amber-600' :
                          'bg-purple-100 text-purple-900'
                        }`}>
                          #{idx + 1}
                        </div>
                      </div>

                      <div className="w-11 h-11 rounded-full bg-[#002B66] text-white flex items-center justify-center font-black text-xs shrink-0 border-2 border-indigo-200">
                        {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm">{candidate.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                            {candidate.studentIdNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            {candidate.jobMatchScore}% Job Match
                          </span>
                          {candidate.deansList && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold flex items-center gap-0.5">
                              <Award className="w-3 h-3 text-amber-600" /> Dean's List
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600">
                          {candidate.qualificationName} • {candidate.academicYear} • <span className="font-semibold">{candidate.campus}</span>
                        </p>

                        <p className="text-[11px] text-purple-900 font-medium bg-purple-50/80 px-2 py-1 rounded-md border border-purple-100">
                          💡 <strong>Match Rationale:</strong> {candidate.matchRationale}
                        </p>

                        {/* Matching Skills */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {candidate.skills.slice(0, 5).map((sk, sidx) => (
                            <span key={sidx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold">
                              {sk}
                            </span>
                          ))}
                          {candidate.codeHubProjects && candidate.codeHubProjects.length > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold flex items-center gap-0.5">
                              <Play className="w-2.5 h-2.5 fill-blue-600" />
                              {candidate.codeHubProjects.length} CodeHub Prototypes
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={() => {
                          setFullDetailStudent(candidate);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>Full Dossier & Code</span>
                      </button>

                      <button
                        onClick={() => {
                          setInviteRoleTitle(jobMatchedCandidatesModalJob.title);
                          setInviteModalStudent({
                            id: candidate.id,
                            name: candidate.name,
                            email: candidate.email,
                            rank: idx + 1,
                            campus: candidate.campus,
                            qualification: candidate.qualificationField,
                            qualificationField: candidate.qualificationField,
                            qualificationName: candidate.qualificationName,
                            academicYear: candidate.academicYear,
                            gpa: candidate.academicAggregate,
                            academicAggregate: candidate.academicAggregate,
                            aiMatchScore: candidate.jobMatchScore,
                            aiRecommendationRationale: candidate.matchRationale,
                            skills: candidate.skills,
                            headline: candidate.headline,
                            bio: candidate.bio,
                            keyStrengths: candidate.skills.slice(0, 3),
                            achievements: candidate.certificates.map(c => c.name),
                            bursaryStatus: candidate.bursaryStatus,
                            candidateStatus: 'interview-requested'
                          });
                        }}
                        disabled={isInvited}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all ${
                          isInvited
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-700 hover:bg-purple-800 text-white'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{isInvited ? 'Interview Invited' : 'Fast-Track Invite'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Showing top 10 verified candidates dynamically filtered for this posting</span>
              <button
                onClick={() => setJobMatchedCandidatesModalJob(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL STUDENT DETAIL MODAL */}
      {fullDetailStudent && (
        <StudentDetailModal
          student={fullDetailStudent}
          onClose={() => setFullDetailStudent(null)}
          currentUser={currentUser}
          isShortlisted={shortlistedStudentIds.includes(fullDetailStudent.id)}
          onToggleShortlist={handleToggleShortlist}
          initialTab={fullDetailInitialTab}
          onScheduleInterview={(std) => {
            const foundTop = topStudents.find(t => t.id === std.id || t.name === std.name);
            if (foundTop) {
              setInviteModalStudent(foundTop);
            } else {
              setInviteModalStudent({
                id: std.id,
                name: std.name,
                email: std.email,
                rank: 1,
                campus: std.campus,
                qualification: std.qualificationField,
                qualificationField: std.qualificationField,
                qualificationName: std.qualificationName,
                academicYear: std.academicYear,
                gpa: std.academicAggregate,
                academicAggregate: std.academicAggregate,
                aiMatchScore: 92,
                aiRecommendationRationale: 'Selected from Richfield Student Directory for fast-track interview',
                skills: std.skills,
                headline: std.headline,
                bio: std.bio,
                keyStrengths: std.skills.slice(0, 3),
                achievements: std.certificates.map(c => c.name),
                bursaryStatus: std.bursaryStatus,
                candidateStatus: 'interview-requested'
              });
            }
          }}
        />
      )}

    </div>
  );
};
