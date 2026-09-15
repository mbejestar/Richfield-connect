import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  UserCheck, 
  Users, 
  MessageSquare, 
  MapPin, 
  Sparkles,
  Check,
  Send,
  X,
  BellRing,
  Rss,
  Gamepad2,
  CheckCircle2,
  ExternalLink,
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { UserProfile, CampusLocation } from '../types';
import { StudentDetailModal } from './StudentDetailModal';
import { COMPREHENSIVE_STUDENTS_DIRECTORY, StudentFullDetail } from '../data/studentDirectoryData';

interface NetworkViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onSendConnection: (targetUserId: string) => void;
  onStartDirectMessage: (targetUser: UserProfile) => void;
  connectedUserIds: string[];
  onNavigateToEduMatch?: () => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  users,
  currentUser,
  onSendConnection,
  onStartDirectMessage,
  connectedUserIds,
  onNavigateToEduMatch
}) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'connections'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('All Campuses');
  const [selectedCourse, setSelectedCourse] = useState<string>('All Courses');

  // Section 2.4: Follow model & Connection note state
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(['user-4', 'user-6']);
  const [connectingUser, setConnectingUser] = useState<UserProfile | null>(null);
  const [connectNote, setConnectNote] = useState('');
  const [noteSentFeedback, setNoteSentFeedback] = useState<string | null>(null);
  const [sentRequestUserIds, setSentRequestUserIds] = useState<string[]>([]);
  const [requestActionFeedback, setRequestActionFeedback] = useState<string | null>(null);

  // Incoming Network Requests
  const [incomingRequests, setIncomingRequests] = useState<Array<{
    id: string;
    sender: UserProfile;
    note?: string;
    sentAt: string;
  }>>([
    {
      id: 'req-1',
      sender: {
        id: 'user-sipho-req',
        name: 'Sipho Ndlovu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'student',
        headline: '3rd Year BSc IT • Distributed Systems & Cloud Architecture',
        bio: 'Passionate software engineering and cloud systems student at Richfield Pretoria Campus.',
        campus: 'Pretoria Campus',
        qualification: 'IT',
        qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
        academicYear: '3rd Year',
        studentIdNumber: '202499182',
        verified: true,
        skills: ['Distributed Systems', 'Cloud', 'Java', 'Docker'],
        email: 'siphondlovu@richfield.ac.za'
      },
      note: "Hi! I noticed your distributed systems project on CodeHub. I'm preparing for the upcoming PRG302 exam runway and would love to connect and share study notes.",
      sentAt: '2 hours ago'
    },
    {
      id: 'req-2',
      sender: {
        id: 'user-nomvula-req',
        name: 'Nomvula Dlamini',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'student',
        headline: 'AWS Student Ambassador & Peer Code Reviewer',
        bio: 'Cloud enthusiast and hackathon lead at Richfield Sandton Campus.',
        campus: 'Sandton Campus',
        qualification: 'IT',
        qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
        academicYear: 'Final Year / Graduates',
        studentIdNumber: '202477129',
        verified: true,
        skills: ['AWS Cloud', 'React Native', 'TypeScript', 'DevOps'],
        email: 'nomvula.d@richfield.ac.za'
      },
      note: "Greetings! Organizing the cross-campus Richfield Cloud & React Hackathon cohort. Would be great to have you in my network.",
      sentAt: 'Yesterday'
    }
  ]);

  const handleAcceptRequest = (req: { id: string; sender: UserProfile; note?: string; sentAt: string }) => {
    onSendConnection(req.sender.id);
    setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
    setRequestActionFeedback(`You and ${req.sender.name} are now connected! You can now exchange direct messages.`);
    setTimeout(() => setRequestActionFeedback(null), 4500);
  };

  const handleDeclineRequest = (reqId: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== reqId));
  };

  // Student profile modal state when clicking any user's name or avatar
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentFullDetail | null>(null);
  const [shortlistedStudentIds, setShortlistedStudentIds] = useState<string[]>(['user-themba-billa', 'std-thabiso']);

  const handleOpenStudentProfile = (user: UserProfile) => {
    // 1. Search directory by id or exact/fuzzy name
    const foundInDirectory = COMPREHENSIVE_STUDENTS_DIRECTORY.find(
      s => s.id === user.id || 
           s.name.toLowerCase() === user.name.toLowerCase() ||
           (user.studentIdNumber && s.studentIdNumber === user.studentIdNumber)
    );

    if (foundInDirectory) {
      setSelectedStudentForModal(foundInDirectory);
      return;
    }

    // 2. Synthesize complete high-fidelity student detail if not in directory
    const synthesizedStudent: StudentFullDetail = {
      id: user.id,
      studentIdNumber: user.studentIdNumber || `2024${Math.abs(user.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 37 % 90000 + 10000)}`,
      name: user.name,
      avatar: user.avatar,
      verified: user.verified || user.name.includes('Themba') || user.isPremium,
      isPremium: user.isPremium || user.name.includes('Themba'),
      email: user.email,
      phone: '+27 82 555 0192',
      campus: (user.campus as any) || 'Sandton Campus',
      academicYear: (user.academicYear as any) || '3rd Year',
      qualificationField: (user.qualification as any) || 'IT',
      qualificationName: user.qualificationName || 'Bachelor of Science in Information Technology (BSc IT)',
      nqfLevel: 7,
      academicAggregate: user.name.includes('Themba') ? '87.6% (Distinction Average • Richfield Pro ✓)' : '81.4% (Merit Average)',
      gpa: user.name.includes('Themba') ? '3.94 / 4.00' : '3.78 / 4.00',
      deansList: Boolean(user.verified || user.isPremium || user.name.includes('Themba')),
      bursaryStatus: 'Open to Offers',
      headline: user.headline || `${user.role ? user.role.toUpperCase() : 'Student'} @ Richfield ${user.campus}`,
      bio: user.bio || `${user.name} is an active student at Richfield ${user.campus}, engaging in hands-on academic projects and continuous skill mastery.`,
      skills: user.skills && user.skills.length > 0 ? user.skills : ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure'],
      githubUrl: `https://github.com/${user.name.toLowerCase().replace(/\s+/g, '-')}`,
      linkedinUrl: `https://linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, '-')}`,
      portfolioUrl: `https://${user.name.toLowerCase().replace(/\s+/g, '-')}.richfield.dev`,
      certificates: [
        {
          id: `cert-${user.id}-1`,
          name: user.name.includes('Themba') 
            ? 'Richfield Pro Verified Scholar & Systems Excellence' 
            : 'Institutional Academic Achievement & Project Merit',
          issuer: 'Richfield Academic Directorate',
          issueDate: 'January 2026',
          credentialId: `RF-MERIT-${user.id.slice(-5)}`,
          verificationHash: '0x' + user.name.slice(0, 4).toLowerCase() + '88902fa',
          badgeColor: user.name.includes('Themba') ? 'amber' : 'blue',
          skillsValidated: user.skills?.slice(0, 3) || ['Systems Engineering', 'Database Design'],
          description: 'Verified academic standing and practical technical project execution at Richfield.',
          verificationStatus: 'Verified by Richfield Registrar'
        }
      ],
      codeHubProjects: [
        {
          id: `proj-${user.id}-1`,
          title: `${user.name.split(' ')[0]}'s Distributed Campus Application`,
          description: 'Production-ready full stack prototype built with modern TypeScript, REST APIs, and automated test coverage.',
          language: 'TypeScript',
          techStack: ['TypeScript', 'React', 'Tailwind', 'PostgreSQL'],
          prototypeType: 'jwt-auth',
          repoUrl: `https://github.com/${user.name.toLowerCase().replace(/\s+/g, '-')}/campus-application`,
          starsCount: 24,
          forksCount: 6,
          unitTestsCount: 8,
          coveragePercent: 96,
          testCases: [
            { name: 'verifyAuthenticationHandshake()', passed: true, durationMs: 8 },
            { name: 'processStudentDatabaseTransaction()', passed: true, durationMs: 11 },
            { name: 'enforceRoleAuthorizationPolicies()', passed: true, durationMs: 4 }
          ],
          codeSnippet: `// Verified CodeHub prototype for ${user.name}\nexport function runStudentApp() {\n  console.log("Active student pipeline initiated for ${user.name}");\n}`
        }
      ],
      transcript: [
        { code: 'PRG381', name: 'Advanced Systems Architecture & Java', semester: 'Sem 1, 2026', grade: user.name.includes('Themba') ? 86 : 80, symbol: 'A', distinction: true },
        { code: 'DBS381', name: 'Database Architecture & SQL Optimization', semester: 'Sem 1, 2026', grade: user.name.includes('Themba') ? 83 : 78, symbol: 'A', distinction: true },
        { code: 'NET631', name: 'Networking & Cybersecurity Defense', semester: 'Sem 1, 2026', grade: user.name.includes('Themba') ? 81 : 75, symbol: 'B+', distinction: false },
        { code: 'HCI600', name: 'Human Computer Interaction 600', semester: 'Sem 1, 2026', grade: user.name.includes('Themba') ? 76 : 74, symbol: 'B+', distinction: false }
      ],
      workExperience: [
        {
          role: 'Student Technology Contributor',
          company: 'Richfield Campus Innovation Lab',
          duration: 'Jan 2025 - Present',
          description: 'Collaborating on academic prototypes, peer code reviews, and student mentor sessions.'
        }
      ],
      endorsements: [
        {
          authorName: 'Dr. Sipho Mthembu',
          authorRole: 'Head of IT & Faculty Senior Lecturer',
          date: 'Feb 2026',
          comment: `Commendable dedication and practical work ethic demonstrated by ${user.name}.`
        }
      ]
    };

    setSelectedStudentForModal(synthesizedStudent);
  };

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

  const courses = [
    'All Courses',
    'BSc IT',
    'BCom & Accounting (AGA)',
    'BBA & Management',
    'Public Management (BPM)',
    'Diplomas (DIT/DBA/DLGM)',
    'Higher Certificates',
    'Postgraduate & MBA'
  ];

  const filteredUsers = users.filter(user => {
    if (user.id === currentUser.id) return false;
    
    if (activeTab === 'connections') {
      if (!connectedUserIds.includes(user.id)) return false;
    }

    if (selectedCampus !== 'All Campuses' && !user.campus.includes(selectedCampus)) {
      return false;
    }

    if (selectedCourse !== 'All Courses') {
      const qText = ((user.qualificationName || '') + ' ' + (user.qualification || '') + ' ' + user.headline).toLowerCase();
      if (selectedCourse === 'BSc IT' && !(qText.includes('bsc') || qText.includes('bsc it') || (qText.includes('information technology') && !qText.includes('diploma') && !qText.includes('higher certificate')))) return false;
      if (selectedCourse === 'BCom & Accounting (AGA)' && !(qText.includes('bcom') || qText.includes('accounting') || qText.includes('aga'))) return false;
      if (selectedCourse === 'BBA & Management' && !(qText.includes('bba') || qText.includes('business administration'))) return false;
      if (selectedCourse === 'Public Management (BPM)' && !(qText.includes('bpm') || qText.includes('public management') || qText.includes('local government'))) return false;
      if (selectedCourse === 'Diplomas (DIT/DBA/DLGM)' && !(qText.includes('diploma') || qText.includes('dit') || qText.includes('dba') || qText.includes('dlgm'))) return false;
      if (selectedCourse === 'Higher Certificates' && !(qText.includes('higher certificate') || qText.includes('hcit') || qText.includes('hccf') || qText.includes('hcba') || qText.includes('hcoa'))) return false;
      if (selectedCourse === 'Postgraduate & MBA' && !(qText.includes('mba') || qText.includes('honours') || qText.includes('pgdm') || qText.includes('master'))) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchRole = user.role.toLowerCase().includes(q);
      const matchCampus = user.campus.toLowerCase().includes(q);
      const matchHeadline = user.headline.toLowerCase().includes(q);
      const matchSkills = (user.skills || []).some(s => s.toLowerCase().includes(q));
      const matchQual = (user.qualificationName || '').toLowerCase().includes(q) || (user.qualification || '').toLowerCase().includes(q);
      const matchYear = (user.academicYear || '').toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchCampus && !matchHeadline && !matchSkills && !matchQual && !matchYear) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Title & EduMatch CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">My Network</h1>
        {onNavigateToEduMatch && (
          <button
            onClick={onNavigateToEduMatch}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#002B66] to-indigo-700 hover:from-blue-900 hover:to-indigo-800 text-white text-xs font-extrabold shadow-sm transition-all self-start sm:self-auto"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
            <span>EduMatch: Find Complementary Study Buddies</span>
            <span className="bg-rose-500 text-[9px] px-1 py-0.2 rounded font-black">GAME</span>
          </button>
        )}
      </div>

      {/* Top Subtabs */}
      <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
            activeTab === 'discover'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Discover
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Requests</span>
          {incomingRequests.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'requests' ? 'bg-indigo-600 text-white' : 'bg-red-100 text-red-700'
            }`}>
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
            activeTab === 'connections'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Connections ({connectedUserIds.length})
        </button>
      </div>

      {/* Action Feedback Banner */}
      {requestActionFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{requestActionFeedback}</span>
        </div>
      )}

      {/* SUB-VIEW 1: INCOMING REQUESTS (Section: Requests Tab) */}
      {activeTab === 'requests' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-indigo-900">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-base text-slate-900">
                  Network Invitations & Requests
                </h2>
                <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  {incomingRequests.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Peers, alumni, and recruiters wishing to connect with you across Richfield campuses. Connecting enables direct messaging and collaborative study hub access.
              </p>
            </div>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-sm space-y-2">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No Pending Network Requests</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You have reviewed all incoming network invitations. Explore the &quot;Discover&quot; tab to connect with fellow Richfield students and academic mentors.
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="mt-2 px-4 py-1.5 bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Discover Richfield Peers</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleOpenStudentProfile(req.sender)}
                      className="relative shrink-0 group focus:outline-none"
                    >
                      <img
                        src={req.sender.avatar}
                        alt={req.sender.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 group-hover:border-indigo-600 shadow-sm transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {req.sender.verified && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-sky-500 text-white p-0.5 rounded-full ring-2 ring-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentProfile(req.sender)}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 hover:underline transition-colors text-left"
                        >
                          {req.sender.name}
                        </button>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          {req.sender.role}
                        </span>
                        <span className="text-[10px] text-slate-400">• {req.sentAt}</span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {req.sender.headline}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {req.sender.campus}
                        </span>
                        {req.sender.qualificationName && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-700 font-semibold">
                              {req.sender.qualificationName}
                            </span>
                          </>
                        )}
                      </div>

                      {req.note && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 italic max-w-xl">
                          &quot;{req.note}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleOpenStudentProfile(req.sender)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="px-4 py-1.5 text-xs font-bold bg-[#002B66] hover:bg-blue-900 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Accept Request</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, course (e.g. BSc IT, BCom, AGA, DIT), campus, skills..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Campus Pills Filter */}
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Campus:</span>
              {campuses.map((campus) => (
                <button
                  key={campus}
                  onClick={() => setSelectedCampus(campus)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all shrink-0 ${
                    selectedCampus === campus
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>

            {/* Course / Programme Pills Filter */}
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto pt-1.5 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Course:</span>
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all shrink-0 ${
                    selectedCourse === course
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No network profiles found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try broadening your campus filter or search query.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isConnected = connectedUserIds.includes(user.id);

            return (
              <div
                key={user.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col items-center text-center justify-between space-y-3 border-t-2 border-indigo-500"
              >
                {/* Large Circular Avatar (Clickable) */}
                <div className="flex flex-col items-center w-full">
                  <button
                    type="button"
                    onClick={() => handleOpenStudentProfile(user)}
                    className="group relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full mb-2"
                    title={`Click to view ${user.name}'s student profile`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 group-hover:border-indigo-600 shadow-sm ring-2 ring-indigo-50 transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-600 group-hover:bg-indigo-700 border border-indigo-400 text-white font-black text-base flex items-center justify-center shadow-sm ring-2 ring-indigo-50 transition-transform group-hover:scale-105">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    {(user.name.includes('Themba') || user.verified || user.isPremium) && (
                      <span 
                        className="absolute -bottom-0.5 -right-0.5 bg-sky-500 text-white p-0.5 rounded-full ring-2 ring-white shadow-xs" 
                        title="Richfield Verified Student Tick"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>

                  {/* Name (Clickable with Verification Tick) */}
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenStudentProfile(user)}
                      className="font-bold text-sm text-slate-900 hover:text-indigo-600 hover:underline cursor-pointer flex items-center justify-center gap-1.5 transition-colors group"
                      title="Click to view student profile, verified marks & transcript"
                    >
                      <span className="group-hover:text-indigo-600">{user.name}</span>
                      {(user.name.includes('Themba') || user.verified || user.isPremium) && (
                        <span className="inline-flex items-center text-sky-500 shrink-0" title="Richfield Verified Student Tick">
                          <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500 text-white inline-block shrink-0" />
                        </span>
                      )}
                    </button>

                    {/* Pro Student badge for Themba or premium users */}
                    {(user.name.includes('Themba') || user.isPremium) && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                        <span>Richfield Pro Student ✓</span>
                      </span>
                    )}
                  </div>

                  {/* Role Pill */}
                  <div className="mt-1">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded capitalize ${
                      user.role === 'admin' ? 'bg-slate-900 text-white' :
                      user.role === 'alumni' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      user.role === 'recruiter' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                      user.role === 'lecturer' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                      'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Qualification Course Badge */}
                  {user.qualificationName && (
                    <div className="mt-1 max-w-full px-1">
                      <span 
                        className="text-[10px] font-semibold text-indigo-800 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full inline-block truncate max-w-full"
                        title={user.qualificationName}
                      >
                        {user.academicYear ? `${user.academicYear} • ` : ''}{user.qualificationName.split('—')[0].trim()}
                      </span>
                    </div>
                  )}

                  {/* Headline & Campus */}
                  <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 px-1">
                    {user.headline}
                  </p>

                  {/* Section 2.4: Mutual Connections Pill */}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap justify-center">
                    <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Users className="w-2.5 h-2.5 text-slate-400" />
                      {user.role === 'recruiter' ? 'Verified Corporate Partner' : `${(user.name.length % 4) + 1} mutual connections`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{user.campus}</span>
                  </div>
                </div>

                {/* Actions: View Student Profile, + Connect & Message & Follow */}
                <div className="w-full space-y-1.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenStudentProfile(user)}
                    className="w-full py-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50/90 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-indigo-200/80"
                    title="Open student dossier & academic transcript"
                  >
                    <span>View Student Profile</span>
                    <ExternalLink className="w-3 h-3 text-indigo-600" />
                  </button>

                  {(() => {
                    const isPending = sentRequestUserIds.includes(user.id);

                    return (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (isConnected || isPending) return;
                            setConnectingUser(user);
                            setConnectNote(`Hi ${user.name.split(' ')[0]}, I came across your Richfield profile and would love to connect to discuss ${user.role === 'recruiter' ? 'graduate opportunities' : 'academic projects and career pathways'}.`);
                          }}
                          disabled={isConnected || isPending}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isConnected
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : isPending
                              ? 'bg-slate-100 text-slate-600 border border-slate-200 cursor-default'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98'
                          }`}
                        >
                          {isConnected ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Connected</span>
                            </>
                          ) : isPending ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>Pending</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>+ Connect</span>
                            </>
                          )}
                        </button>

                        {/* Section 2.4: Follow Model */}
                        <button
                          onClick={() => {
                            setFollowedUserIds(prev =>
                              prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                            followedUserIds.includes(user.id)
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={followedUserIds.includes(user.id) ? 'Following activity updates' : 'Follow industry updates'}
                        >
                          <Rss className="w-3 h-3" />
                          <span className="text-[10px]">{followedUserIds.includes(user.id) ? 'Following' : 'Follow'}</span>
                        </button>
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => onStartDirectMessage(user)}
                    className="w-full py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Direct Message</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </>
  )}

      {/* Section 2.4: Connection Request with Optional Note Modal */}
      {connectingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {connectingUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Connect with {connectingUser.name}</h3>
                  <p className="text-xs text-slate-500">{connectingUser.headline}</p>
                </div>
              </div>
              <button onClick={() => setConnectingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Add an optional personalized note (Section 2.4)
              </label>
              <textarea
                rows={3}
                value={connectNote}
                onChange={(e) => setConnectNote(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like to connect..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 italic">
                Personalized notes increase connection acceptance rates by 68% on RichfieldConnect.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConnectingUser(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetUser = connectingUser;
                  onSendConnection(targetUser.id);
                  setSentRequestUserIds(prev => [...prev, targetUser.id]);
                  setConnectingUser(null);
                  setRequestActionFeedback(`Connection invitation dispatched to ${targetUser.name}!`);
                  setTimeout(() => setRequestActionFeedback(null), 4000);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-[#002B66] hover:bg-blue-900 text-white rounded-lg shadow flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Send Invitation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Full Profile Modal */}
      {selectedStudentForModal && (
        <StudentDetailModal
          student={selectedStudentForModal}
          currentUser={currentUser}
          onClose={() => setSelectedStudentForModal(null)}
          onScheduleInterview={(std) => {
            alert(`Interview / Mentorship session scheduled with ${std.name}! Calendar invitation sent.`);
          }}
          isShortlisted={shortlistedStudentIds.includes(selectedStudentForModal.id)}
          onToggleShortlist={(id) => {
            setShortlistedStudentIds(prev => 
              prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            );
          }}
        />
      )}

    </div>
  );
};
