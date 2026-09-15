import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Server, 
  Users, 
  FileText, 
  Activity,
  Search,
  Lock,
  Sparkles,
  Calendar,
  Briefcase,
  Megaphone,
  BarChart3,
  Plus,
  Trash2,
  Ban,
  UserCheck,
  ExternalLink,
  GraduationCap,
  Building,
  Check,
  Clock,
  Radio,
  PackageSearch,
  MapPin
} from 'lucide-react';
import { ModerationLog, UserProfile, JobOpportunity, PlatformAnnouncement, LostAndFoundItem } from '../types';
import { INITIAL_USERS } from '../mockData';

interface AdminViewProps {
  logs: ModerationLog[];
  currentUser: UserProfile;
  onApproveLog: (logId: string) => void;
  onRejectLog: (logId: string) => void;
  lostAndFoundItems?: LostAndFoundItem[];
  onApproveLostFoundClaim?: (itemId: string, claimId: string) => void;
  onRejectLostFoundClaim?: (itemId: string, claimId: string) => void;
  onVerifyRecruiter?: (userId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  logs,
  currentUser,
  onApproveLog,
  onRejectLog,
  lostAndFoundItems = [],
  onApproveLostFoundClaim,
  onRejectLostFoundClaim,
  onVerifyRecruiter
}) => {
  const [selectedTab, setSelectedTab] = useState<
    'users' | 'moderation' | 'events' | 'opportunities' | 'announcements' | 'analytics' | 'lostfound'
  >('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'alumni' | 'recruiter' | 'lecturer'>('all');
  const [claimStatusFilter, setClaimStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Compute pending claims
  const pendingLostFoundClaims = (lostAndFoundItems || []).flatMap(item => 
    (item.claims || []).filter(c => c.status === 'pending').map(claim => ({ item, claim }))
  );

  const allLostFoundClaims = (lostAndFoundItems || []).flatMap(item => 
    (item.claims || []).map(claim => ({ item, claim }))
  );

  // 1. User Management State (Section 2.2)
  const [userList, setUserList] = useState<Array<UserProfile & { status?: 'active' | 'suspended' | 'pending' }>>([
    ...INITIAL_USERS.map(u => ({
      ...u,
      status: (u.verificationStatus === 'pending_approval' ? 'pending' : 'active') as 'active' | 'suspended' | 'pending'
    })),
    {
      id: 'biz-pend-1',
      name: 'Standard Bank Graduate Acquisition',
      email: 'careers@standardbank.co.za',
      role: 'recruiter',
      verified: false,
      verificationStatus: 'pending_approval',
      campus: 'Bryanston Campus',
      organization: 'Standard Bank South Africa',
      qualification: 'Business',
      qualificationName: 'Corporate Graduate Recruiter',
      academicYear: 'Staff',
      headline: 'Corporate Graduate Recruiter | Talent Acquisition',
      bio: 'Seeking final-year BSc IT and BCom Business Informatics students for 2027 Engineering Graduate Rotation.',
      skills: ['FinTech', 'Cloud Architecture', 'Core Banking'],
      status: 'pending'
    },
    {
      id: 'alumni-pend-1',
      name: 'Kagiso Molefe',
      email: 'kagiso.m@fintech.africa',
      role: 'alumni',
      verified: false,
      alumniVerificationStatus: 'pending',
      campus: 'Pretoria Campus',
      degreeSerial: 'RF-DIP-2022-9012',
      graduationYear: '2022',
      qualification: 'IT',
      qualificationName: 'Diploma in Information Technology',
      academicYear: 'Alumni',
      headline: 'Senior Cloud Engineer @ FinTech Africa',
      bio: 'Backend Lead at FinTech Africa. Offering mentorship in Node.js and AWS architecture.',
      skills: ['Node.js', 'PostgreSQL', 'Docker'],
      status: 'pending'
    }
  ]);

  // 2. Official Institutional Events State (Section 2.2: Admin is ONLY user who can create/publish official events)
  const [officialEvents, setOfficialEvents] = useState([
    {
      id: 'ev-1',
      title: '2026 Richfield National Technology & Career Fair',
      type: 'Career Fair',
      date: 'April 24, 2026 • 09:00 - 16:00 SAST',
      location: 'Newtown Campus & Hybrid Live Stream',
      targetAudience: 'All Richfield & AAA Undergraduates, Honours & Alumni',
      description: 'Over 40 technology enterprises, banks, and software consultancies recruiting directly from Richfield qualification cohorts.',
      attendeesCount: 384,
      published: true
    },
    {
      id: 'ev-2',
      title: 'Richfield Alumni Masterclass: From BSc IT to Cloud Principal',
      type: 'Alumni Workshop',
      date: 'May 12, 2026 • 17:30 SAST',
      location: 'Richfield Virtual Auditorium (Teams & WebRTC)',
      targetAudience: 'IT Faculty (BSc IT, BIT, Diploma in IT)',
      description: 'Senior Alumni Sipho Khumalo (AWS Solutions Architect) delivers an architectural breakdown on production Kubernetes and Terraform.',
      attendeesCount: 192,
      published: true
    },
    {
      id: 'ev-3',
      title: 'Richfield National Hackathon 2026 Finals & Pitch Stage',
      type: 'Hackathon',
      date: 'May 30, 2026 • 10:00 - 18:00 SAST',
      location: 'Durban Campus Innovation Lab',
      targetAudience: 'Registered Hackathon Finalists & Industry Judges',
      description: 'Top student developer teams present their production-ready networking and portfolio prototypes to Richfield Directorate and venture mentors.',
      attendeesCount: 156,
      published: true
    }
  ]);

  // Event Creation Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('Career Fair');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Newtown Campus & Stream');
  const [newEventAudience, setNewEventAudience] = useState('All Campuses');
  const [newEventDesc, setNewEventDesc] = useState('');

  // 3. Opportunity Oversight Queue State (Section 2.2: Review/approve business job listings)
  const [pendingOpportunities, setPendingOpportunities] = useState<Array<JobOpportunity & { reviewFeedback?: string }>>([
    {
      id: 'opp-rev-1',
      title: 'Junior Cloud Infrastructure Associate',
      company: 'Vodacom Technology Group',
      location: 'Midrand Campus / Hybrid',
      campusTarget: 'Midrand Campus',
      type: 'graduate-program',
      qualification: 'IT',
      yearRequirement: 'Final Year / Graduates',
      stipendOrSalary: 'R28,000 - R36,000 / month',
      description: 'Vodacom is seeking ambitious Richfield BSc IT / Diploma in IT graduates with strong networking, Linux, and AWS/Azure foundations.',
      requirements: ['BSc IT / Diploma in IT', 'Linux Administration', 'Docker & Kubernetes Fundamentals'],
      postedBy: 'recruiter-vodacom',
      postedByName: 'Vodacom Talent Acquisition',
      deadline: 'May 15, 2026',
      applicantIds: [],
      isVerified: true,
      createdAt: '2 hours ago',
      status: 'pending_review',
      matchScore: 94
    },
    {
      id: 'opp-rev-2',
      title: 'Financial Systems & Business Analyst Intern',
      company: 'Investec Private Bank',
      location: 'Sandton / Newtown Campus',
      campusTarget: 'Newtown Campus',
      type: 'internship',
      qualification: 'Business',
      yearRequirement: '3rd Year',
      stipendOrSalary: 'R22,000 / month stipend',
      description: 'Join the Investec wealth solutions team. Open to Richfield BCom Business Informatics and Accounting graduates.',
      requirements: ['BCom Business Informatics or BCom Accounting', 'Financial Modeling', 'SQL'],
      postedBy: 'recruiter-investec',
      postedByName: 'Investec Campus Recruitment',
      deadline: 'June 1, 2026',
      applicantIds: [],
      isVerified: true,
      createdAt: 'Yesterday',
      status: 'pending_review',
      matchScore: 89
    }
  ]);

  // 4. Announcement Broadcasting State (Section 2.2)
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([
    {
      id: 'ann-1',
      title: 'Institutional Directive: Final Semester Capstone Verification',
      content: 'All final-year BSc IT, BIT, and BCom students must submit their digital project portfolios on RichfieldConnect by May 30 for academic registry review.',
      authorName: 'Office of the Academic Registrar (Richfield Directorate)',
      authorRole: 'admin',
      createdAt: 'April 14, 2026',
      targetAudience: 'students',
      priority: 'urgent'
    },
    {
      id: 'ann-2',
      title: 'Alumni Mentorship Network: 2026 Winter Cohort Onboarding',
      content: 'We invite all verified Richfield alumni to connect with current 2nd and 3rd-year students for our 8-week technical mentorship program.',
      authorName: 'Richfield Alumni Relations Directorate',
      authorRole: 'admin',
      createdAt: 'April 10, 2026',
      targetAudience: 'alumni',
      priority: 'normal'
    }
  ]);

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annAudience, setAnnAudience] = useState<
    | 'all' 
    | 'students' 
    | 'it_1st_year' 
    | 'it_2nd_year' 
    | 'it_3rd_year' 
    | 'business_1st_year' 
    | 'business_2nd_year' 
    | 'business_3rd_year' 
    | 'both_business' 
    | 'alumni' 
    | 'business' 
    | 'lecturers'
  >('all');
  const [annPriority, setAnnPriority] = useState<'normal' | 'urgent'>('normal');
  const [annBroadcastSuccess, setAnnBroadcastSuccess] = useState(false);

  const formatAudienceLabel = (aud: string) => {
    switch (aud) {
      case 'all': return 'All Users (Campus-Wide)';
      case 'students': return 'All Current Students';
      case 'it_1st_year': return '1st Year IT';
      case 'it_2nd_year': return '2nd Year IT';
      case 'it_3rd_year': return '3rd Year IT';
      case 'business_1st_year': return '1st Year Business';
      case 'business_2nd_year': return '2nd Year Business';
      case 'business_3rd_year': return '3rd Year Business';
      case 'both_business': return 'Both IT & Business Students';
      case 'alumni': return 'Verified Alumni';
      case 'business': return 'Corporate Partners';
      case 'lecturers': return 'Faculty Lecturers';
      default: return aud;
    }
  };

  // Actions for User Management
  const handleApproveBusinessUser = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verified: true,
          verificationStatus: 'verified',
          status: 'active'
        };
      }
      return u;
    }));
    if (onVerifyRecruiter) {
      onVerifyRecruiter(userId);
    }
  };

  const handleVerifyAlumniUser = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verified: true,
          alumniVerificationStatus: 'verified',
          status: 'active'
        };
      }
      return u;
    }));
  };

  const handleToggleUserSuspension = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleRemoveUser = (userId: string) => {
    if (window.confirm("Are you sure you want to permanently remove this user account?")) {
      setUserList(prev => prev.filter(u => u.id !== userId));
    }
  };

  // Actions for Official Events
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) return;

    const newEv = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      type: newEventType,
      date: newEventDate.trim(),
      location: newEventLocation.trim(),
      targetAudience: newEventAudience.trim(),
      description: newEventDesc.trim(),
      attendeesCount: 0,
      published: true
    };

    setOfficialEvents(prev => [newEv, ...prev]);
    setShowEventModal(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
  };

  // Actions for Opportunity Moderation
  const handleApproveOpportunity = (oppId: string) => {
    setPendingOpportunities(prev => prev.filter(o => o.id !== oppId));
  };

  const handleRejectOpportunity = (oppId: string) => {
    setPendingOpportunities(prev => prev.filter(o => o.id !== oppId));
  };

  // Actions for Announcements
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn: PlatformAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      content: annContent.trim(),
      authorName: 'Richfield Directorate Admin Console',
      authorRole: 'admin',
      createdAt: 'Just now',
      targetAudience: annAudience,
      priority: annPriority
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setAnnTitle('');
    setAnnContent('');
    setAnnBroadcastSuccess(true);
    setTimeout(() => setAnnBroadcastSuccess(false), 3500);
  };

  // Filtered Users
  const filteredUsers = userList.filter(u => {
    const matchesSearch = !searchQuery.trim() || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.studentIdNumber && u.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-4 border-[#E31B23]">
        <div>
          <div className="flex items-center gap-2 text-[#002B66]">
            <ShieldCheck className="w-5 h-5 text-[#E31B23]" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Admin & Directorate Command Center
            </h1>
            <span className="text-xs bg-red-100 text-[#E31B23] font-bold px-2 py-0.5 rounded-full">
              Full Administrator Privilege
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Richfield Directorate: User governance, institutional event publishing, opportunity moderation & broadcast relays
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
          {[
            { id: 'users', label: 'User Governance', icon: Users },
            { id: 'lostfound', label: 'Lost & Found Claims', icon: PackageSearch, badge: pendingLostFoundClaims.length > 0 ? pendingLostFoundClaims.length : undefined },
            { id: 'moderation', label: 'Content Safety', icon: ShieldAlert, badge: logs.length },
            { id: 'events', label: 'Institutional Events', icon: Calendar },
            { id: 'opportunities', label: 'Opportunity Oversight', icon: Briefcase, badge: pendingOpportunities.length },
            { id: 'announcements', label: 'Broadcasts', icon: Megaphone },
            { id: 'analytics', label: 'Platform Telemetry', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            const active = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  active 
                    ? 'bg-[#002B66] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {Boolean(tab.badge) && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Alert for Pending Lost & Found Claims */}
      {pendingLostFoundClaims.length > 0 && selectedTab !== 'lostfound' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  Action Required: Student Claims Filed
                </span>
                <span className="text-xs font-bold text-amber-950">
                  {pendingLostFoundClaims.length} Pending Ownership Verification{pendingLostFoundClaims.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Student(s) submitted claims asserting ownership (<em>"It's mine!"</em>) for items safeguarded at Richfield campus security desks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedTab('lostfound')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm shrink-0 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review & Authorize Release</span>
          </button>
        </div>
      )}

      {/* SUB-VIEW 1: USER MANAGEMENT (Section 2.2) */}
      {selectedTab === 'users' && (
        <div className="space-y-3">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, ID, or company..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002B66]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0">Filter:</span>
              {(['all', 'student', 'alumni', 'recruiter', 'lecturer'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setUserRoleFilter(role)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize shrink-0 transition-all ${
                    userRoleFilter === role
                      ? 'bg-[#002B66] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role === 'recruiter' ? 'Business' : role}
                </button>
              ))}
            </div>
          </div>

          {/* User List Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <div key={u.id} className="p-3.5 sm:p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-black text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{u.name}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'student' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'alumni' ? 'bg-amber-100 text-amber-800' :
                          u.role === 'recruiter' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {u.role === 'recruiter' ? 'Business Partner' : u.role}
                        </span>

                        {u.status === 'suspended' ? (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Ban className="w-3 h-3" /> Suspended
                          </span>
                        ) : u.verificationStatus === 'pending_approval' ? (
                          <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Approval Pending
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified Active
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-mono">{u.email}</p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap pt-0.5">
                        <span><strong>Campus:</strong> {u.campus}</span>
                        {u.qualificationName && <span><strong>Program:</strong> {u.qualificationName}</span>}
                        {u.studentIdNumber && <span><strong>ID:</strong> {u.studentIdNumber}</span>}
                        {u.organization && <span><strong>Org:</strong> {u.organization}</span>}
                        {u.degreeSerial && <span><strong>Serial:</strong> {u.degreeSerial}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Business User Approval */}
                    {u.role === 'recruiter' && u.verificationStatus === 'pending_approval' && (
                      <button
                        onClick={() => handleApproveBusinessUser(u.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve Business</span>
                      </button>
                    )}

                    {/* Alumni Verification */}
                    {u.role === 'alumni' && u.alumniVerificationStatus === 'pending' && (
                      <button
                        onClick={() => handleVerifyAlumniUser(u.id)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Verify Registry</span>
                      </button>
                    )}

                    {/* Suspend / Unsuspend */}
                    <button
                      onClick={() => handleToggleUserSuspension(u.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        u.status === 'suspended'
                          ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {u.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                    </button>

                    {/* Delete User */}
                    <button
                      onClick={() => handleRemoveUser(u.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove User Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CONTENT MODERATION & SAFETY ENGINE (Section 2.2) */}
      {selectedTab === 'moderation' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Gemini AI Safety Audit Queue
              </h3>
              <p className="text-xs text-slate-500">
                Real-time lexical, harassment and anti-bullying screening across campus feeds, code repositories, and videos.
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> 99.8% Safety Uptime
            </span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-rose-600"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{log.authorName}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      Toxicity: {log.toxicityScore ? `${(log.toxicityScore * 100).toFixed(0)}%` : 'High Risk'}
                    </span>
                    <span className="text-xs text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md max-w-xl">
                    <strong>Flag Reason:</strong> {log.flaggedReason}
                  </p>
                  <p className="text-xs text-slate-700 italic border-l-2 border-slate-300 pl-2 mt-1">
                    "{log.contentSnippet}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onApproveLog(log.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Dismiss Flag
                  </button>
                  <button
                    onClick={() => onRejectLog(log.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Content</span>
                  </button>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">All flagged queues cleared!</p>
                <p>No content violations or harassment flags currently pending.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INSTITUTIONAL EVENT MANAGEMENT (Section 2.2: Admin is ONLY user who can create official events) */}
      {selectedTab === 'events' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#002B66]" />
                <h3 className="font-bold text-sm text-slate-900">
                  Official Institutional Event Management
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Under Section 2.2 of the Hackathon Brief, the Administrator is the <strong>exclusive authorized role</strong> who can create and publish official Richfield institutional events.
              </p>
            </div>

            <button
              onClick={() => setShowEventModal(!showEventModal)}
              className="px-3.5 py-2 bg-[#002B66] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Official Event</span>
            </button>
          </div>

          {/* New Event Form Modal / Inline Box */}
          {showEventModal && (
            <form onSubmit={handleCreateEvent} className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <h4 className="text-xs font-black uppercase text-[#002B66] tracking-wider">
                  Create Official Institutional Event
                </h4>
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. 2026 Richfield AI & Cybersecurity Career Expo"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002B66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Type *</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Career Fair">Career Fair & Tech Expo</option>
                    <option value="Alumni Workshop">Alumni Mentorship Masterclass</option>
                    <option value="Hackathon">Hackathon Runway</option>
                    <option value="Executive Networking">Executive Industry Mixer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date & Time *</label>
                  <input
                    type="text"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. May 20, 2026 • 10:00 SAST"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Venue / Live Link *</label>
                  <input
                    type="text"
                    required
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    placeholder="e.g. Newtown Auditorium & Stream"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={newEventAudience}
                    onChange={(e) => setNewEventAudience(e.target.value)}
                    placeholder="e.g. All IT & Business Students"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description & Overview</label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Provide schedule details, invited enterprise recruiters, and preparation guidance for attendees..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E31B23] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish to Platform Event Feed</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Published Events */}
          <div className="space-y-3">
            {officialEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-[#002B66]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900">{ev.title}</h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#002B66]">
                      {ev.type}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Official Institutional
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    📅 {ev.date} • 📍 {ev.location}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ev.description}
                  </p>
                  <p className="text-[11px] text-indigo-900 font-semibold">
                    🎯 Target Cohort: {ev.targetAudience} • {ev.attendeesCount} Registered Students
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm("Remove this institutional event from listings?")) {
                        setOfficialEvents(prev => prev.filter(e => e.id !== ev.id));
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: OPPORTUNITY OVERSIGHT QUEUE (Section 2.2) */}
      {selectedTab === 'opportunities' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Corporate Opportunity Moderation Queue
              </h3>
              <p className="text-xs text-slate-500">
                Under Section 2.2, all job and internship listings posted by business partners must be approved by the Administrator before being pushed live to student feeds.
              </p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-full">
              {pendingOpportunities.length} Pending Review
            </span>
          </div>

          <div className="space-y-3">
            {pendingOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-l-4 border-purple-600"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{opp.title}</span>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {opp.company}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {opp.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span><strong>Faculty Target:</strong> {opp.qualification}</span>
                    {opp.stipendOrSalary && <span><strong>Compensation:</strong> {opp.stipendOrSalary}</span>}
                    <span><strong>Posted By:</strong> {opp.postedByName || opp.postedBy}</span>
                    <span><strong>Deadline:</strong> {opp.deadline}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {opp.requirements.map((req, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveOpportunity(opp.id)}
                    className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                  <button
                    onClick={() => handleRejectOpportunity(opp.id)}
                    className="w-full px-3 py-1.5 border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-semibold"
                  >
                    Reject with Feedback
                  </button>
                </div>
              </div>
            ))}

            {pendingOpportunities.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">All employer postings approved!</p>
                <p>No corporate listings currently waiting in the verification queue.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: ANNOUNCEMENT BROADCASTING (Section 2.2) */}
      {selectedTab === 'announcements' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-0.5">
              Platform-Wide Announcement Broadcasting
            </h3>
            <p className="text-xs text-slate-500">
              Push real-time institutional directives and banner notifications to the entire Richfield community or specific target cohorts.
            </p>

            <form onSubmit={handleBroadcastAnnouncement} className="mt-3.5 space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Directive / Announcement Title *</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Richfield National Graduation Registry Sync Notice"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002B66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Audience</label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002B66]"
                  >
                    <optgroup label="General Cohorts">
                      <option value="all">📢 All Users (Campus-Wide)</option>
                      <option value="students">🎓 All Current Students</option>
                      <option value="both_business">💼 Both IT & Business Students (All Undergrads)</option>
                    </optgroup>
                    <optgroup label="Information Technology Faculty">
                      <option value="it_1st_year">💻 1st Year IT (BSc IT & IT Diplomas)</option>
                      <option value="it_2nd_year">💻 2nd Year IT (BSc IT & IT Diplomas)</option>
                      <option value="it_3rd_year">💻 3rd Year IT (BSc IT & IT Diplomas)</option>
                    </optgroup>
                    <optgroup label="Business & Management Sciences">
                      <option value="business_1st_year">📊 1st Year Business (BCom & BBA)</option>
                      <option value="business_2nd_year">📊 2nd Year Business (BCom & BBA)</option>
                      <option value="business_3rd_year">📊 3rd Year Business (BCom & BBA)</option>
                    </optgroup>
                    <optgroup label="External & Faculty Stakeholders">
                      <option value="alumni">🏛️ Verified Alumni Only</option>
                      <option value="business">💼 Corporate Partners & Recruiters</option>
                      <option value="lecturers">👨‍🏫 Academic Faculty & Lecturers</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Broadcast Content / Body *</label>
                <textarea
                  rows={2}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Type the official message that will be pinned to student dashboards and distributed via WebSocket notification relay..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={annPriority === 'urgent'}
                    onChange={(e) => setAnnPriority(e.target.checked ? 'urgent' : 'normal')}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="font-bold text-red-700">Mark as Priority Institutional Alert</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002B66] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Radio className="w-4 h-4" />
                  <span>Transmit Broadcast</span>
                </button>
              </div>

              {annBroadcastSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Announcement broadcast dispatched successfully across all connected user sessions!</span>
                </div>
              )}
            </form>
          </div>

          {/* Past Broadcast History */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Active Broadcast Archive ({announcements.length})
            </h4>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`bg-white rounded-xl p-4 border shadow-sm space-y-1 border-l-4 ${
                  ann.priority === 'urgent' ? 'border-l-red-600 border-red-200' : 'border-l-[#002B66] border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{ann.title}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ann.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ann.priority}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                      Audience: {formatAudienceLabel(ann.targetAudience)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{ann.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Author: {ann.authorName}</span>
                  <span className="text-emerald-600 font-semibold">Active Institutional Broadcast</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: PLATFORM ANALYTICS & HEALTH (Section 2.2) */}
      {selectedTab === 'analytics' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Registered Users</span>
              <p className="text-2xl font-black text-slate-900 mt-1">2,840</p>
              <span className="text-[10px] text-emerald-600 font-bold">↑ 18% this month</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Undergraduates & Alumni</span>
              <p className="text-2xl font-black text-blue-900 mt-1">2,610</p>
              <span className="text-[10px] text-slate-500">9 Campuses connected</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Vetted Corporate Partners</span>
              <p className="text-2xl font-black text-purple-900 mt-1">114</p>
              <span className="text-[10px] text-purple-600 font-bold">42 active vacancies</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">AI Safety Resolution</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
              <span className="text-[10px] text-slate-500">0 unmoderated violations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Gemini Safety Engine</span>
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-lg font-extrabold text-emerald-700">Healthy (22ms latency)</p>
              <p className="text-[10px] text-slate-400">Automated NLP toxic screening active on feeds and comments</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Richfield Campus Courier</span>
                <Server className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-lg font-extrabold text-indigo-900">9 Campuses Connected</p>
              <p className="text-[10px] text-slate-400">Newtown, Pretoria, Durban, Braamfontein, Bryanston, Polokwane, Cape Town</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Real-Time WebSocket Stream</span>
                <Lock className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-lg font-extrabold text-purple-700">TLS 1.3 / RBAC Active</p>
              <p className="text-[10px] text-slate-400">Zero unauthorized clearance escalations</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 7: LOST & FOUND CLAIMS OVERSIGHT */}
      {selectedTab === 'lostfound' && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-[#E31B23]" />
                <h2 className="font-bold text-base text-slate-900">
                  Campus Lost & Found: Student Ownership Claims
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and authorize release of student valuables safeguarded at Richfield campus security desks. When students assert ownership (&quot;It&apos;s mine!&quot;), verify their submitted proof against security records.
              </p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                onClick={() => setClaimStatusFilter('pending')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  claimStatusFilter === 'pending'
                    ? 'bg-[#002B66] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending Verification ({pendingLostFoundClaims.length})
              </button>
              <button
                onClick={() => setClaimStatusFilter('approved')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  claimStatusFilter === 'approved'
                    ? 'bg-[#002B66] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved & Released
              </button>
              <button
                onClick={() => setClaimStatusFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  claimStatusFilter === 'all'
                    ? 'bg-[#002B66] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Claims ({allLostFoundClaims.length})
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Awaiting Verification</span>
              <p className="text-2xl font-black text-amber-950 mt-1">{pendingLostFoundClaims.length}</p>
              <span className="text-[11px] text-amber-700 font-semibold">Claims where student asserted &quot;It&apos;s mine!&quot;</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Recovered & Returned</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">
                {(lostAndFoundItems || []).filter(i => i.status === 'recovered').length}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold">Safely reunited with owners</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Physical Items Safeguarded</span>
              <p className="text-2xl font-black text-blue-950 mt-1">{(lostAndFoundItems || []).length}</p>
              <span className="text-[11px] text-blue-700 font-semibold">Across 9 Richfield Campus Desks</span>
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-3">
            {(() => {
              const displayClaims = allLostFoundClaims.filter(({ claim }) => {
                if (claimStatusFilter === 'all') return true;
                return claim.status === claimStatusFilter;
              });

              if (displayClaims.length === 0) {
                return (
                  <div className="bg-white rounded-xl p-10 border border-slate-200 text-center space-y-2">
                    <PackageSearch className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-700 text-sm">
                      {claimStatusFilter === 'pending'
                        ? 'No Pending Claims Awaiting Verification'
                        : 'No Claims Found in this Category'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      When a student or community member clicks &quot;It&apos;s mine!&quot; on an item in the Lost &amp; Found and submits ownership proof, their claim will appear here for admin review.
                    </p>
                  </div>
                );
              }

              return displayClaims.map(({ item, claim }) => (
                <div
                  key={`${item.id}-${claim.id}`}
                  className={`bg-white rounded-xl p-4 border shadow-sm transition-all ${
                    claim.status === 'pending'
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : claim.status === 'approved'
                      ? 'border-emerald-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Item Preview & Location */}
                    <div className="flex items-start gap-3.5 min-w-[280px] lg:max-w-xs">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                          <PackageSearch className="w-8 h-8" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.category}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-slate-400">
                            Ref: {item.securityReferenceNumber || item.id}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-[#E31B23]" />
                          <span>{item.campusLocation} • {item.specificLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ownership Claim Details */}
                    <div className="flex-1 bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                            Ownership Claim: &quot;It&apos;s Mine!&quot;
                          </span>
                          <span className="text-xs font-bold text-slate-900">{claim.claimantName}</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                            ID: {claim.claimantStudentId}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">({claim.claimantRole})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{claim.timestamp}</span>
                      </div>

                      {/* Submitted Proof */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Submitted Proof of Ownership / Description:
                        </span>
                        <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed italic">
                          &quot;{claim.proofDescription}&quot;
                        </div>
                      </div>

                      {/* Security Desk Verification Question */}
                      {item.verificationQuestion && (
                        <div className="text-[11px] text-slate-500">
                          <strong className="text-slate-700">Verification Question:</strong> {item.verificationQuestion}
                        </div>
                      )}

                      {/* Contact details */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span><strong>Claimant Contact:</strong> {claim.contactEmailOrPhone}</span>
                      </div>
                    </div>

                    {/* Decision / Action Column */}
                    <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0">
                      {claim.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => onApproveLostFoundClaim && onApproveLostFoundClaim(item.id, claim.id)}
                            className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Authorize Release</span>
                          </button>
                          <button
                            onClick={() => onRejectLostFoundClaim && onRejectLostFoundClaim(item.id, claim.id)}
                            className="w-full px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Claim</span>
                          </button>
                        </>
                      ) : claim.status === 'approved' ? (
                        <div className="flex flex-col items-end text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            <span>Release Authorized</span>
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">Ready for pickup at desk</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Claim Rejected</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
