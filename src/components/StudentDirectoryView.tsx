import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Award, 
  Code2, 
  FileText, 
  Sparkles, 
  Star, 
  Calendar, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Filter, 
  Building2, 
  ExternalLink,
  BookOpen,
  ArrowUpDown,
  Send,
  UserCheck,
  Check,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';
import { COMPREHENSIVE_STUDENTS_DIRECTORY, StudentFullDetail } from '../data/studentDirectoryData';
import { StudentDetailModal } from './StudentDetailModal';

interface StudentDirectoryViewProps {
  shortlistedStudentIds: string[];
  onToggleShortlist: (studentId: string) => void;
  onScheduleInterviewFromDirectory?: (student: StudentFullDetail) => void;
  currentUser?: UserProfile;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  shortlistedStudentIds,
  onToggleShortlist,
  onScheduleInterviewFromDirectory,
  currentUser
}) => {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCampus, setSelectedCampus] = useState<string>('All Campuses');
  const [selectedStream, setSelectedStream] = useState<'All' | 'IT' | 'Business'>('All');
  const [sortBy, setSortBy] = useState<'gpa' | 'projects' | 'certificates' | 'name'>('gpa');

  // Modal inspection state
  const [inspectingStudent, setInspectingStudent] = useState<StudentFullDetail | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'overview' | 'certificates' | 'codehub' | 'transcript' | 'experience'>('overview');

  // Fast-track interview state inside directory
  const [interviewStudent, setInterviewStudent] = useState<StudentFullDetail | null>(null);
  const [interviewRoleTitle, setInterviewRoleTitle] = useState('Graduate Software Engineer / Associate');
  const [interviewDate, setInterviewDate] = useState('Next Tuesday, 10:00 AM SAST');
  const [interviewNotes, setInterviewNotes] = useState('We reviewed your verified CodeHub live prototype and academic transcript on EnrichHub.');
  const [invitedStudentIds, setInvitedStudentIds] = useState<string[]>([]);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

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

  const years = [
    'All',
    '1st Year',
    '2nd Year',
    '3rd Year',
    'Final Year / Graduates',
    'Honours & Postgrad'
  ];

  const filteredStudents = useMemo(() => {
    return COMPREHENSIVE_STUDENTS_DIRECTORY.filter(student => {
      // Year Filter
      if (selectedYear !== 'All' && student.academicYear !== selectedYear) {
        return false;
      }

      // Campus Filter
      if (selectedCampus !== 'All Campuses' && student.campus !== selectedCampus) {
        return false;
      }

      // Stream Filter
      if (selectedStream !== 'All') {
        const isIT = student.qualificationName.toLowerCase().includes('information technology') || 
                     student.qualificationName.toLowerCase().includes('bsc') ||
                     student.qualificationName.toLowerCase().includes('software');
        const isBusiness = student.qualificationName.toLowerCase().includes('bcom') || 
                           student.qualificationName.toLowerCase().includes('business') ||
                           student.qualificationName.toLowerCase().includes('accounting');

        if (selectedStream === 'IT' && !isIT) return false;
        if (selectedStream === 'Business' && !isBusiness) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchId = student.studentIdNumber.toLowerCase().includes(q);
        const matchCampus = student.campus.toLowerCase().includes(q);
        const matchDegree = student.qualificationName.toLowerCase().includes(q);
        const matchSkills = student.skills.some(s => s.toLowerCase().includes(q));
        const matchProjects = student.codeHubProjects.some(p => p.title.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q)));
        const matchCerts = student.certificates.some(c => c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q));

        if (!matchName && !matchId && !matchCampus && !matchDegree && !matchSkills && !matchProjects && !matchCerts) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'gpa') {
        return parseFloat(b.gpa || '0') - parseFloat(a.gpa || '0');
      }
      if (sortBy === 'projects') {
        return b.codeHubProjects.length - a.codeHubProjects.length;
      }
      if (sortBy === 'certificates') {
        return b.certificates.length - a.certificates.length;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [selectedYear, selectedCampus, selectedStream, searchQuery, sortBy]);

  const handleOpenDetailModal = (student: StudentFullDetail, tab: 'overview' | 'certificates' | 'codehub' | 'transcript' | 'experience' = 'overview') => {
    setInspectingStudent(student);
    setModalInitialTab(tab);
  };

  const handleTriggerInterview = (student: StudentFullDetail) => {
    setInterviewStudent(student);
    setInterviewRoleTitle(
      student.qualificationName.includes('IT') || student.qualificationName.includes('BSc') 
        ? 'Graduate Software Engineer / Systems Architect' 
        : 'Graduate Financial Analyst / Operations Associate'
    );
  };

  const handleSubmitInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewStudent) return;

    if (!invitedStudentIds.includes(interviewStudent.id)) {
      setInvitedStudentIds([...invitedStudentIds, interviewStudent.id]);
    }

    if (onScheduleInterviewFromDirectory) {
      onScheduleInterviewFromDirectory(interviewStudent);
    }

    setInviteSuccessMsg(`Fast-track interview confirmed for ${interviewStudent.name}! Formal institutional invitation dispatched.`);
    setTimeout(() => {
      setInterviewStudent(null);
      setInviteSuccessMsg(null);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      
      {/* Directory Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-indigo-900/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider">
                Richfield Verified Student Registry
              </span>
              <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cross-Campus Verified Transcripts
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              Student Directory & Portfolios
            </h1>
            <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
              Browse all Richfield students filtered by academic year and campus. Inspect full academic transcripts, verify authentic credentials, and test live interactive CodeHub prototypes.
            </p>
          </div>

          {/* Key Metrics Counters */}
          <div className="grid grid-cols-3 gap-2 shrink-0 bg-white/10 rounded-xl p-3 border border-white/10 text-center">
            <div>
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Students</span>
              <span className="text-base font-black text-white">{COMPREHENSIVE_STUDENTS_DIRECTORY.length} Listed</span>
            </div>
            <div>
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Avg Aggregate</span>
              <span className="text-base font-black text-emerald-400">91.4%</span>
            </div>
            <div>
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Prototypes</span>
              <span className="text-base font-black text-amber-300">100% Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, 9-digit student number (e.g. 202488412), tech stack (Java, React, SQL), project name or campus..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          {/* Year Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              {years.map(yr => (
                <option key={yr} value={yr}>{yr === 'All' ? 'All Academic Years' : yr}</option>
              ))}
            </select>
          </div>

          {/* Campus Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Campus Location
            </label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              {campuses.map(cp => (
                <option key={cp} value={cp}>{cp}</option>
              ))}
            </select>
          </div>

          {/* Stream Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Discipline / Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value as 'All' | 'IT' | 'Business')}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="All">All Disciplines</option>
              <option value="IT">Information Technology (BSc / IT)</option>
              <option value="Business">Business & Finance (BCom / Management)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Sort Candidates
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'gpa' | 'projects' | 'certificates' | 'name')}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="gpa">Highest Academic Aggregate / GPA</option>
              <option value="projects">Most CodeHub Projects</option>
              <option value="certificates">Most Verified Certificates</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>

        </div>

        {/* Filter Summary and Results count */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing <strong>{filteredStudents.length}</strong> verified students matching criteria</span>
          {(selectedYear !== 'All' || selectedCampus !== 'All Campuses' || selectedStream !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedYear('All');
                setSelectedCampus('All Campuses');
                setSelectedStream('All');
                setSearchQuery('');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Students List / Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
          <Filter className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900">No students found matching your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your campus or academic year selection, or clear the search query.
          </p>
          <button
            onClick={() => {
              setSelectedYear('All');
              setSelectedCampus('All Campuses');
              setSelectedStream('All');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const isShortlisted = shortlistedStudentIds.includes(student.id);
            const isInvited = invitedStudentIds.includes(student.id);

            return (
              <div
                key={student.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                  isShortlisted 
                    ? 'border-purple-300 ring-2 ring-purple-100 bg-purple-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Card Header: Avatar, Name, Campus, Year, Shortlist Star */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-black text-slate-900 text-base">{student.name}</h2>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {student.academicYear}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{student.campus}</span>
                          <span>•</span>
                          {currentUser?.role === 'recruiter' || currentUser?.role === 'admin' ? (
                            <span className="font-mono text-[11px] text-slate-600 font-semibold">{student.studentIdNumber}</span>
                          ) : (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                              <Lock className="w-2.5 h-2.5 text-amber-600" />
                              <span>ID: Protected (POPIA)</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">
                          {student.qualificationName}
                        </p>
                      </div>
                    </div>

                    {/* Shortlist Star */}
                    <button
                      onClick={() => onToggleShortlist(student.id)}
                      title={isShortlisted ? 'Remove from shortlist' : 'Add to corporate shortlist'}
                      className={`p-2 rounded-xl border transition-colors shrink-0 ${
                        isShortlisted
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isShortlisted ? 'fill-purple-600' : ''}`} />
                    </button>
                  </div>

                  {/* Academic & Feature Highlight Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Aggregate</span>
                      <span className="text-xs font-black text-emerald-700">{student.academicAggregate}% ({student.gpa}/4.0)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Certificates</span>
                      <span className="text-xs font-black text-indigo-700 flex items-center justify-center gap-1">
                        <Award className="w-3 h-3 text-indigo-600" />
                        {student.certificates.length} Verified
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">CodeHub</span>
                      <span className="text-xs font-black text-purple-700 flex items-center justify-center gap-1">
                        <Code2 className="w-3 h-3 text-purple-600" />
                        {student.codeHubProjects.length} Projects
                      </span>
                    </div>
                  </div>

                  {/* Badges / Awards */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {student.deansList && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        Dean's Merit List
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-blue-600" />
                      {student.bursaryStatus}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                      <Award className="w-2.5 h-2.5 text-emerald-600" />
                      NQF Level {student.nqfLevel}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {student.skills.slice(0, 6).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 6 && (
                      <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                        +{student.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View Full Dossier */}
                    <button
                      onClick={() => handleOpenDetailModal(student, 'overview')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Dossier</span>
                    </button>

                    {/* Run Live Prototype */}
                    <button
                      onClick={() => handleOpenDetailModal(student, 'codehub')}
                      className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 text-amber-300 fill-amber-300" />
                      <span>Live Prototype</span>
                    </button>

                    {/* View Certificates */}
                    <button
                      onClick={() => handleOpenDetailModal(student, 'certificates')}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Certificates ({student.certificates.length})</span>
                    </button>
                  </div>

                  {/* Schedule Interview */}
                  <button
                    onClick={() => handleTriggerInterview(student)}
                    disabled={isInvited}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 shrink-0 ${
                      isInvited
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-[#E31B23] hover:bg-red-700 text-white shadow-sm'
                    }`}
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Interview Sent</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Interview</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED STUDENT MODAL (Dossier, Certificates, CodeHub Live Runner, Transcripts) */}
      {inspectingStudent && (
        <StudentDetailModal
          student={inspectingStudent}
          currentUser={currentUser}
          initialTab={modalInitialTab}
          onClose={() => setInspectingStudent(null)}
          onScheduleInterview={(std) => {
            setInspectingStudent(null);
            handleTriggerInterview(std);
          }}
          isShortlisted={shortlistedStudentIds.includes(inspectingStudent.id)}
          onToggleShortlist={onToggleShortlist}
        />
      )}

      {/* FAST-TRACK INTERVIEW INVITATION MODAL */}
      {interviewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">Fast-Track Hiring Pipeline</span>
                <h3 className="font-extrabold text-lg text-slate-900">Schedule Interview</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inviting <strong>{interviewStudent.name}</strong> ({interviewStudent.campus})
                </p>
              </div>
              <button
                onClick={() => setInterviewStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitInterview} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Role Position</label>
                <input
                  type="text"
                  required
                  value={interviewRoleTitle}
                  onChange={(e) => setInterviewRoleTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Interview Time</label>
                <input
                  type="text"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Direct Recruiter Note</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {inviteSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{inviteSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setInterviewStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E31B23] hover:bg-red-700 text-white rounded-xl text-xs font-black shadow transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Interview Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
