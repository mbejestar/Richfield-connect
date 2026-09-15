import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Code, 
  FileText, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  Play, 
  ShieldCheck, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Star, 
  GitFork, 
  Clock, 
  Sparkles, 
  Send, 
  FileCheck, 
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Check,
  Building2,
  Lock,
  Shield
} from 'lucide-react';
import { UserProfile } from '../types';
import { StudentFullDetail, StudentCertificate, StudentCodeHubProject } from '../data/studentDirectoryData';

interface StudentDetailModalProps {
  student: StudentFullDetail;
  onClose: () => void;
  onScheduleInterview: (student: StudentFullDetail) => void;
  isShortlisted: boolean;
  onToggleShortlist: (studentId: string) => void;
  initialTab?: 'overview' | 'certificates' | 'codehub' | 'transcript' | 'experience';
  currentUser?: UserProfile;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onScheduleInterview,
  isShortlisted,
  onToggleShortlist,
  initialTab = 'overview',
  currentUser
}) => {
  const isSelf = currentUser?.id === student.id || currentUser?.name === student.name;
  const isAuthorizedRecruiterOrStaff = 
    currentUser?.role === 'recruiter' || 
    currentUser?.role === 'admin' || 
    currentUser?.role === 'lecturer' || 
    isSelf;
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'codehub' | 'transcript' | 'experience'>(initialTab);
  const [selectedCertificate, setSelectedCertificate] = useState<StudentCertificate | null>(null);
  const [activePrototypeProject, setActivePrototypeProject] = useState<StudentCodeHubProject | null>(null);

  // Prototype state for JWT Gateway
  const [protoRole, setProtoRole] = useState<'student' | 'mentor' | 'recruiter' | 'admin'>('student');
  const [protoCampus, setProtoCampus] = useState(student.campus);
  const [protoToken, setProtoToken] = useState<string | null>(null);
  const [protoAuthResult, setProtoAuthResult] = useState<{ status: number; message: string; claims?: any; latencyMs: number } | null>(null);

  // Prototype state for DCF Valuation
  const [waccRate, setWaccRate] = useState<number>(11.5);
  const [terminalGrowth, setTerminalGrowth] = useState<number>(3.5);
  const [cfYear1, setCfYear1] = useState<number>(14);
  const [cfYear2, setCfYear2] = useState<number>(18);
  const [cfYear3, setCfYear3] = useState<number>(23);
  const [cfYear4, setCfYear4] = useState<number>(29);
  const [cfYear5, setCfYear5] = useState<number>(36);

  // Prototype state for Dijkstra Courier
  const [originCampus, setOriginCampus] = useState('Newtown Campus');
  const [destCampus, setDestCampus] = useState('Pretoria Campus');
  const [routingResult, setRoutingResult] = useState<{ path: string[]; distanceKm: number; estHours: number; fuelZar: number } | null>(null);

  // Prototype view mode
  const [prototypeViewMode, setPrototypeViewMode] = useState<'interactive' | 'code' | 'tests'>('interactive');

  // Handle Token Generation in Prototype
  const handleGenerateToken = () => {
    const fakeHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const fakePayload = btoa(JSON.stringify({
      sub: student.studentIdNumber,
      name: student.name,
      role: protoRole,
      campus: protoCampus,
      iss: 'EnrichHub-Auth-Authority',
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const fakeSig = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const jwt = `${fakeHeader}.${fakePayload}.${fakeSig}`;
    setProtoToken(jwt);
    setProtoAuthResult(null);
  };

  const handleTestTokenClaims = (requiredRole: string) => {
    if (!protoToken) return;
    const start = performance.now();
    setTimeout(() => {
      const latency = Math.round(performance.now() - start + 8);
      const isAllowed = protoRole === requiredRole || protoRole === 'admin';
      if (isAllowed) {
        setProtoAuthResult({
          status: 200,
          message: `Access Granted! Token cryptographically verified with signature algorithm HS256. Clearance role matches '${requiredRole}'.`,
          claims: {
            sub: student.studentIdNumber,
            name: student.name,
            role: protoRole,
            campus: protoCampus,
            issuer: 'EnrichHub-Auth-Authority',
            permissions: ['academic:read', 'portfolio:view', 'codehub:execute']
          },
          latencyMs: latency
        });
      } else {
        setProtoAuthResult({
          status: 403,
          message: `Forbidden: Token subject '${student.name}' holds role '${protoRole}', which lacks privilege clearance for '${requiredRole}'.`,
          latencyMs: latency
        });
      }
    }, 120);
  };

  // Handle DCF calculation
  const calculateDCF = () => {
    const r = waccRate / 100;
    const g = terminalGrowth / 100;
    const cfs = [cfYear1, cfYear2, cfYear3, cfYear4, cfYear5];
    let pv = 0;
    cfs.forEach((cf, i) => {
      pv += cf / Math.pow(1 + r, i + 1);
    });
    const terminalVal = (cfYear5 * (1 + g)) / (r - g);
    const pvTerminal = terminalVal / Math.pow(1 + r, 5);
    const enterpriseVal = pv + pvTerminal;
    const debt = 15; // R15M debt
    const cash = 8;  // R8M cash
    const equityVal = enterpriseVal - debt + cash;
    const shares = 5; // 5M shares
    const sharePrice = equityVal / shares;

    return {
      pvCashFlows: pv.toFixed(2),
      terminalVal: terminalVal.toFixed(2),
      enterpriseVal: enterpriseVal.toFixed(2),
      equityVal: equityVal.toFixed(2),
      sharePrice: sharePrice.toFixed(2)
    };
  };

  const dcfResults = calculateDCF();

  // Handle Courier Routing calculation
  const handleCalculateRoute = () => {
    const campusDistances: Record<string, Record<string, number>> = {
      'Newtown Campus': { 'Sandton Campus': 14, 'Pretoria Campus': 58, 'Midrand Campus': 32, 'Alberton Campus': 18, 'Durban Campus': 565, 'Cape Town Campus': 1400, 'Polokwane Campus': 310, 'Umhlanga Campus': 580 },
      'Pretoria Campus': { 'Midrand Campus': 28, 'Sandton Campus': 46, 'Newtown Campus': 58, 'Polokwane Campus': 255, 'Alberton Campus': 72, 'Durban Campus': 610, 'Cape Town Campus': 1450, 'Umhlanga Campus': 625 },
      'Sandton Campus': { 'Newtown Campus': 14, 'Midrand Campus': 18, 'Pretoria Campus': 46, 'Alberton Campus': 29, 'Durban Campus': 575, 'Cape Town Campus': 1410, 'Polokwane Campus': 295, 'Umhlanga Campus': 590 },
      'Durban Campus': { 'Umhlanga Campus': 16, 'Newtown Campus': 565, 'Pretoria Campus': 610, 'Sandton Campus': 575, 'Midrand Campus': 585, 'Alberton Campus': 550, 'Cape Town Campus': 1630, 'Polokwane Campus': 860 },
      'Cape Town Campus': { 'Newtown Campus': 1400, 'Pretoria Campus': 1450, 'Durban Campus': 1630, 'Sandton Campus': 1410, 'Midrand Campus': 1425, 'Polokwane Campus': 1710, 'Alberton Campus': 1385, 'Umhlanga Campus': 1645 }
    };

    let dist = 38;
    if (campusDistances[originCampus] && campusDistances[originCampus][destCampus]) {
      dist = campusDistances[originCampus][destCampus];
    } else if (campusDistances[destCampus] && campusDistances[destCampus][originCampus]) {
      dist = campusDistances[destCampus][originCampus];
    } else {
      dist = originCampus === destCampus ? 0 : 75;
    }

    const estHours = parseFloat((dist / 70).toFixed(1));
    const fuelZar = Math.round((dist / 100) * 8.5 * 24.5); // Liters * ZAR/L

    setRoutingResult({
      path: originCampus === destCampus ? [originCampus] : [originCampus, 'Midrand Logistics Hub', destCampus],
      distanceKm: dist,
      estHours: Math.max(0.3, estHours),
      fuelZar: Math.max(80, fuelZar)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#001F4D] via-[#002B66] to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              {student.avatar ? (
                <img 
                  src={student.avatar} 
                  alt={student.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg ring-4 ring-white/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E31B23] to-red-800 text-white flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white/10 shrink-0">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                    <span>{student.name}</span>
                    {(student.verified || student.name.includes('Themba') || student.isPremium) && (
                      <span className="inline-flex items-center gap-1 text-sky-300" title="Richfield Verified Student Tick">
                        <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-500 text-slate-900 shrink-0 inline-block" />
                      </span>
                    )}
                  </h2>

                  {(student.verified || student.name.includes('Themba')) && (
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-400/40 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-sky-300" />
                      Verified Student ✓
                    </span>
                  )}

                  {(student.isPremium || student.name.includes('Themba')) && (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-amber-950" />
                      Richfield Pro ✓
                    </span>
                  )}

                  {isAuthorizedRecruiterOrStaff ? (
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider">
                      {student.studentIdNumber}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>ID: Protected (POPIA)</span>
                    </span>
                  )}
                  {student.deansList && (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Award className="w-3 h-3" />
                      Dean's List
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5">{student.headline}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200/80 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {student.campus}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    {student.academicYear} • {student.qualificationName}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-300">
                    Aggregate: {student.academicAggregate}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Recruiter Fast Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <button
                onClick={() => onToggleShortlist(student.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isShortlisted
                    ? 'bg-amber-400 text-amber-950 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-amber-950' : ''}`} />
                <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </button>

              <button
                onClick={() => onScheduleInterview(student)}
                className="px-4 py-2 bg-[#E31B23] hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 pt-4 mt-4 border-t border-white/10 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Dossier Overview
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'certificates'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Certificates ({student.certificates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('codehub')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'codehub'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>CodeHub & Live Prototypes ({student.codeHubProjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'transcript'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Academic Transcript</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'experience'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Experience & References
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW                                                           */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Contact & Verification Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Direct Contact</span>
                    {!isAuthorizedRecruiterOrStaff && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-amber-700" /> POPIA Protected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {isAuthorizedRecruiterOrStaff ? (
                      <a href={`mailto:${student.email}`} className="font-semibold hover:underline truncate">{student.email}</a>
                    ) : (
                      <span className="font-mono text-slate-500 font-semibold">••••••••@student.richfield.ac.za</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {isAuthorizedRecruiterOrStaff ? (
                      <span className="font-semibold">{student.phone}</span>
                    ) : (
                      <span className="font-mono text-slate-500 font-semibold">+27 •• ••• ••••</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{student.campus} • On-Campus Resident</span>
                  </div>

                  {!isAuthorizedRecruiterOrStaff && (
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-900 mt-1 flex items-start gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <p className="leading-tight">
                        <strong>POPIA Compliance:</strong> Direct phone numbers, emails, and student IDs are protected. Only verified recruiters and faculty can view contact information.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Standing & NQF</span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Degree Level:</span>
                    <span className="font-bold text-slate-900">NQF Level {student.nqfLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Cumulative GPA:</span>
                    <span className="font-black text-emerald-700">{student.gpa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Bursary Status:</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
                      {student.bursaryStatus}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Public Repositories & Profiles</span>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Github className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                    <a href={student.githubUrl} target="_blank" rel="noreferrer" className="font-semibold hover:underline text-blue-700 truncate">
                      GitHub Developer Profile
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Linkedin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="font-semibold hover:underline text-blue-700 truncate">
                      LinkedIn Verified Dossier
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Richfield Identity Verified</span>
                  </div>
                </div>
              </div>

              {/* Professional Biography */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Biography & Career Objective</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 border border-slate-200 rounded-xl shadow-inner">
                  {student.bio}
                </p>
              </div>

              {/* Skills Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Validated Technical & Professional Competencies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview Cards for Certificates & CodeHub Prototypes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Certificates Teaser */}
                <div className="p-4 bg-gradient-to-br from-amber-50/60 to-white border border-amber-200/70 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Verified Certifications ({student.certificates.length})</h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('certificates')}
                      className="text-xs text-amber-800 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {student.certificates.slice(0, 2).map(cert => (
                      <div
                        key={cert.id}
                        onClick={() => setSelectedCertificate(cert)}
                        className="p-2.5 bg-white border border-amber-100 rounded-lg flex items-center justify-between text-xs cursor-pointer hover:border-amber-300 transition-colors shadow-sm"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate">{cert.name}</span>
                          <span className="text-[10px] text-slate-500">{cert.issuer} • {cert.issueDate}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold shrink-0">
                          Inspect
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CodeHub Projects Teaser */}
                <div className="p-4 bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200/70 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">CodeHub Live Prototypes</h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('codehub')}
                      className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Launch Sandbox</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {student.codeHubProjects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          setActivePrototypeProject(proj);
                          setActiveTab('codehub');
                        }}
                        className="p-2.5 bg-white border border-emerald-100 rounded-lg flex items-center justify-between text-xs cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate">{proj.title}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">{proj.techStack.slice(0, 3).join(', ')} • {proj.coveragePercent}% Coverage</span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-black flex items-center gap-1 shadow-sm shrink-0">
                          <Play className="w-2.5 h-2.5" />
                          Run Live
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CERTIFICATES & CREDENTIAL VIEWER                                    */}
          {/* ========================================================================= */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Accredited Digital Certifications</h3>
                  <p className="text-xs text-slate-500">Cryptographically verified credentials issued by industry partners and Richfield Registrar.</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  All Signatures Authenticated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {student.certificates.map(cert => (
                  <div
                    key={cert.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs sm:text-sm">{cert.name}</h4>
                          <span className="text-[10px] text-slate-500 block">{cert.issuer}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                        {cert.verificationStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{cert.description}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Issued: <strong>{cert.issueDate}</strong></span>
                        <span>Credential ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{cert.credentialId}</code></span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cert.skillsValidated.map(sk => (
                          <span key={sk} className="text-[9px] px-1.5 py-0.2 bg-blue-50 text-blue-800 rounded font-semibold border border-blue-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="w-full py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Inspect Official Digital Certificate</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CODEHUB PROJECTS & LIVE PROTOTYPES                                  */}
          {/* ========================================================================= */}
          {activeTab === 'codehub' && (
            <div className="space-y-6">
              
              {/* Project Selector Ribbon */}
              <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Select Student CodeHub Prototype to Run:</span>
                  <span className="text-[10px] text-slate-500">Interactive live simulators executing algorithms in real-time</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {student.codeHubProjects.map(proj => {
                    const isSelected = activePrototypeProject?.id === proj.id || (!activePrototypeProject && student.codeHubProjects[0]?.id === proj.id);
                    return (
                      <button
                        key={proj.id}
                        onClick={() => setActivePrototypeProject(proj)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#002B66] text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Play className="w-3 h-3" />
                        <span>{proj.title.split(' ')[0]} {proj.title.split(' ')[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Prototype Display */}
              {(() => {
                const currentProj = activePrototypeProject || student.codeHubProjects[0];
                if (!currentProj) return null;

                return (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                    
                    {/* Prototype Banner Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-white">{currentProj.title}</h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                            Live Sandbox Ready
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 max-w-2xl">{currentProj.description}</p>
                        
                        <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                          <span className="flex items-center gap-1">
                            <Code className="w-3.5 h-3.5 text-blue-400" />
                            {currentProj.language}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            {currentProj.starsCount} Stars
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {currentProj.unitTestsCount}/{currentProj.unitTestsCount} Tests Passing ({currentProj.coveragePercent}% Coverage)
                          </span>
                        </div>
                      </div>

                      {/* Prototype View Mode Toggle */}
                      <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl shrink-0 self-start md:self-center">
                        <button
                          onClick={() => setPrototypeViewMode('interactive')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            prototypeViewMode === 'interactive' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 text-emerald-600" />
                          <span>Interactive Simulator</span>
                        </button>

                        <button
                          onClick={() => setPrototypeViewMode('code')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            prototypeViewMode === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <Terminal className="w-3 h-3 text-blue-600" />
                          <span>Source Code</span>
                        </button>

                        <button
                          onClick={() => setPrototypeViewMode('tests')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            prototypeViewMode === 'tests' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3 text-amber-500" />
                          <span>Automated Tests</span>
                        </button>
                      </div>
                    </div>

                    {/* VIEW 1: INTERACTIVE SIMULATOR */}
                    {prototypeViewMode === 'interactive' && (
                      <div className="p-4 sm:p-5 space-y-5">
                        
                        {/* 1. JWT Security Prototype */}
                        {currentProj.prototypeType === 'jwt-auth' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Step 1: Configure Token Claims & Issuer</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Simulated Identity Role</label>
                                  <select
                                    value={protoRole}
                                    onChange={(e: any) => setProtoRole(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                                  >
                                    <option value="student">Student (Standard Permissions)</option>
                                    <option value="mentor">Mentor (Faculty & Student Guidance)</option>
                                    <option value="recruiter">Recruiter (Candidate Review & Jobs)</option>
                                    <option value="admin">System Admin (Superuser Bypass)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Institutional Campus Scope</label>
                                  <select
                                    value={protoCampus}
                                    onChange={(e: any) => setProtoCampus(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                                  >
                                    <option value="Newtown Campus">Newtown Campus</option>
                                    <option value="Pretoria Campus">Pretoria Campus</option>
                                    <option value="Durban Campus">Durban Campus</option>
                                    <option value="Cape Town Campus">Cape Town Campus</option>
                                  </select>
                                </div>
                              </div>

                              <button
                                onClick={handleGenerateToken}
                                className="px-4 py-2 bg-[#002B66] hover:bg-blue-900 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Sign & Generate Live JWT Token</span>
                              </button>
                            </div>

                            {/* Token Output Inspection */}
                            {protoToken && (
                              <div className="p-4 bg-slate-950 text-slate-100 rounded-xl space-y-3 font-mono text-xs">
                                <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans border-b border-slate-800 pb-2">
                                  <span>Generated Base64 Cryptographic JWT Token:</span>
                                  <span className="text-emerald-400 font-bold">Algorithm: HS256 • Status: Valid Signature</span>
                                </div>
                                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-amber-300 break-all select-all">
                                  {protoToken}
                                </div>

                                <div className="pt-2">
                                  <span className="text-[11px] text-slate-300 font-sans font-bold block mb-2">Step 2: Test Access Gates with Token Claims</span>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleTestTokenClaims('student')}
                                      className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 rounded-lg text-xs font-bold font-sans transition-colors"
                                    >
                                      Test Student Portal Access
                                    </button>
                                    <button
                                      onClick={() => handleTestTokenClaims('mentor')}
                                      className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 rounded-lg text-xs font-bold font-sans transition-colors"
                                    >
                                      Test Mentor Private Portal Access
                                    </button>
                                    <button
                                      onClick={() => handleTestTokenClaims('recruiter')}
                                      className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-lg text-xs font-bold font-sans transition-colors"
                                    >
                                      Test Corporate Recruiter Portal Access
                                    </button>
                                  </div>
                                </div>

                                {protoAuthResult && (
                                  <div className={`p-3 rounded-lg border text-xs font-sans mt-3 animate-in fade-in ${
                                    protoAuthResult.status === 200
                                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                                      : 'bg-rose-950/60 border-rose-600 text-rose-200'
                                  }`}>
                                    <div className="flex items-center justify-between font-bold mb-1">
                                      <span>HTTP {protoAuthResult.status} {protoAuthResult.status === 200 ? 'OK' : 'FORBIDDEN'}</span>
                                      <span>Latency: {protoAuthResult.latencyMs}ms</span>
                                    </div>
                                    <p className="leading-relaxed">{protoAuthResult.message}</p>
                                    {protoAuthResult.claims && (
                                      <pre className="mt-2 p-2 bg-black/40 rounded text-[10px] text-emerald-300 overflow-x-auto">
                                        {JSON.stringify(protoAuthResult.claims, null, 2)}
                                      </pre>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. DCF Valuation Prototype */}
                        {currentProj.prototypeType === 'dcf-valuation' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Interactive Financial Model Parameters</span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <div className="flex justify-between font-bold mb-1">
                                    <span>Discount Rate (WACC):</span>
                                    <span className="text-indigo-900">{waccRate}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="8"
                                    max="18"
                                    step="0.5"
                                    value={waccRate}
                                    onChange={(e) => setWaccRate(parseFloat(e.target.value))}
                                    className="w-full accent-[#002B66]"
                                  />
                                </div>

                                <div>
                                  <div className="flex justify-between font-bold mb-1">
                                    <span>Terminal Growth Rate:</span>
                                    <span className="text-indigo-900">{terminalGrowth}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="2"
                                    max="6"
                                    step="0.25"
                                    value={terminalGrowth}
                                    onChange={(e) => setTerminalGrowth(parseFloat(e.target.value))}
                                    className="w-full accent-[#002B66]"
                                  />
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Projected Free Cash Flows (ZAR Millions):</span>
                                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Year 1</span>
                                    <input
                                      type="number"
                                      value={cfYear1}
                                      onChange={(e) => setCfYear1(parseFloat(e.target.value) || 0)}
                                      className="w-full bg-white border border-slate-200 rounded p-1 text-center font-bold"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Year 2</span>
                                    <input
                                      type="number"
                                      value={cfYear2}
                                      onChange={(e) => setCfYear2(parseFloat(e.target.value) || 0)}
                                      className="w-full bg-white border border-slate-200 rounded p-1 text-center font-bold"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Year 3</span>
                                    <input
                                      type="number"
                                      value={cfYear3}
                                      onChange={(e) => setCfYear3(parseFloat(e.target.value) || 0)}
                                      className="w-full bg-white border border-slate-200 rounded p-1 text-center font-bold"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Year 4</span>
                                    <input
                                      type="number"
                                      value={cfYear4}
                                      onChange={(e) => setCfYear4(parseFloat(e.target.value) || 0)}
                                      className="w-full bg-white border border-slate-200 rounded p-1 text-center font-bold"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Year 5</span>
                                    <input
                                      type="number"
                                      value={cfYear5}
                                      onChange={(e) => setCfYear5(parseFloat(e.target.value) || 0)}
                                      className="w-full bg-white border border-slate-200 rounded p-1 text-center font-bold"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Live Valuation Results */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                                <span className="text-[10px] font-bold text-blue-700 uppercase block">PV of Cash Flows</span>
                                <span className="text-base font-black text-blue-950">R{dcfResults.pvCashFlows}M</span>
                              </div>
                              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Terminal Value</span>
                                <span className="text-base font-black text-indigo-950">R{dcfResults.terminalVal}M</span>
                              </div>
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                                <span className="text-[10px] font-bold text-purple-700 uppercase block">Enterprise Value</span>
                                <span className="text-base font-black text-purple-950">R{dcfResults.enterpriseVal}M</span>
                              </div>
                              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center ring-2 ring-emerald-400/50">
                                <span className="text-[10px] font-black text-emerald-800 uppercase block">Implied Share Price</span>
                                <span className="text-base font-black text-emerald-900">R{dcfResults.sharePrice}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. Courier Dijkstra Prototype */}
                        {currentProj.prototypeType === 'library-routing' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Select Route Endpoints</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Origin Richfield Campus</label>
                                  <select
                                    value={originCampus}
                                    onChange={(e) => setOriginCampus(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                                  >
                                    <option value="Newtown Campus">Newtown Campus (Johannesburg)</option>
                                    <option value="Pretoria Campus">Pretoria Campus</option>
                                    <option value="Sandton Campus">Sandton Campus</option>
                                    <option value="Durban Campus">Durban Campus</option>
                                    <option value="Cape Town Campus">Cape Town Campus</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Destination Richfield Campus</label>
                                  <select
                                    value={destCampus}
                                    onChange={(e) => setDestCampus(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                                  >
                                    <option value="Pretoria Campus">Pretoria Campus</option>
                                    <option value="Newtown Campus">Newtown Campus (Johannesburg)</option>
                                    <option value="Sandton Campus">Sandton Campus</option>
                                    <option value="Durban Campus">Durban Campus</option>
                                    <option value="Cape Town Campus">Cape Town Campus</option>
                                  </select>
                                </div>
                              </div>

                              <button
                                onClick={handleCalculateRoute}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors"
                              >
                                <Play className="w-3.5 h-3.5" />
                                <span>Execute Dijkstra Shortest Path Solver</span>
                              </button>
                            </div>

                            {routingResult && (
                              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in">
                                <div className="flex items-center justify-between font-bold text-xs text-emerald-950">
                                  <span>Optimal Route Computed by Graph Solver</span>
                                  <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded">0ms Graph Convergence</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border border-emerald-100">
                                  {routingResult.path.map((step, idx) => (
                                    <React.Fragment key={step}>
                                      <span className="px-2 py-0.5 bg-slate-100 rounded">{step}</span>
                                      {idx < routingResult.path.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />}
                                    </React.Fragment>
                                  ))}
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                    <span className="text-[10px] text-slate-500 block">Total Distance</span>
                                    <span className="font-black text-slate-900">{routingResult.distanceKm} KM</span>
                                  </div>
                                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                    <span className="text-[10px] text-slate-500 block">Transit Time</span>
                                    <span className="font-black text-slate-900">{routingResult.estHours} Hours</span>
                                  </div>
                                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                    <span className="text-[10px] text-slate-500 block">Fuel & Toll Est.</span>
                                    <span className="font-black text-emerald-700">R{routingResult.fuelZar}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 4. SQL Index Profiler Prototype */}
                        {currentProj.prototypeType === 'sql-profiler' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs space-y-3">
                              <div className="flex items-center justify-between text-slate-400 font-sans border-b border-slate-800 pb-2">
                                <span>High-Volume Financial Ledger Query Benchmark:</span>
                                <span className="text-emerald-400 font-bold">100,000 Sample Records</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                                <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-rose-400">Without B-Tree Clustered Index</span>
                                  <div className="text-xl font-black text-rose-300">48.2 ms</div>
                                  <p className="text-[11px] text-rose-200/80">Full Sequential Table Scan. High disk read IO wait.</p>
                                </div>

                                <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-lg space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-emerald-400">With Clustered B-Tree Index</span>
                                  <div className="text-xl font-black text-emerald-300">1.8 ms (96% Faster)</div>
                                  <p className="text-[11px] text-emerald-200/80">Index Condition Search. Zero wasted buffer pages.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* VIEW 2: SOURCE CODE */}
                    {prototypeViewMode === 'code' && (
                      <div className="p-4 sm:p-5">
                        <div className="bg-slate-950 rounded-xl p-4 text-xs font-mono text-slate-100 overflow-x-auto max-h-96">
                          <pre>{currentProj.codeSnippet}</pre>
                        </div>
                      </div>
                    )}

                    {/* VIEW 3: AUTOMATED UNIT TESTS */}
                    {prototypeViewMode === 'tests' && (
                      <div className="p-4 sm:p-5 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Test Runner Suite Output (Jest / JUnit Engine)</span>
                        <div className="space-y-1.5">
                          {currentProj.testCases.map((tc, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-mono"
                            >
                              <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-slate-800 font-semibold">{tc.name}</span>
                              </div>
                              <span className="text-slate-500 text-[11px]">{tc.durationMs}ms</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ACADEMIC TRANSCRIPT                                                */}
          {/* ========================================================================= */}
          {activeTab === 'transcript' && (
            !isAuthorizedRecruiterOrStaff ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-800 shadow-inner">
                  <Lock className="w-7 h-7 text-amber-700" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="font-black text-slate-900 text-base">Academic Examination Record Protected</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    POPIA Act No. 4 of 2013 Compliance
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2">
                    Under South African Protection of Personal Information Act regulations and Richfield Academic Registrar policy, detailed module marks, symbols, and academic transcripts are confidential personal records.
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Access to official transcripts is restricted to verified enterprise recruiters evaluating candidates for employment and institutional faculty members.
                  </p>
                </div>

                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    Return to Overview
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Verified Academic Examination Transcript</h3>
                    <p className="text-xs text-slate-500">Official grades confirmed by Richfield Academic Board & Registrar.</p>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Cumulative GPA: {student.gpa}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3">Module Code</th>
                        <th className="p-3">Course Module Title</th>
                        <th className="p-3">Semester</th>
                        <th className="p-3 text-center">Score</th>
                        <th className="p-3 text-center">Symbol</th>
                        <th className="p-3 text-right">Academic Standing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {student.transcript.map(m => (
                        <tr key={m.code} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">{m.code}</td>
                          <td className="p-3 font-medium text-slate-900">{m.name}</td>
                          <td className="p-3 text-slate-500">{m.semester}</td>
                          <td className="p-3 text-center font-bold text-slate-900">{m.grade}%</td>
                          <td className="p-3 text-center font-black text-indigo-900">{m.symbol}</td>
                          <td className="p-3 text-right">
                            {m.distinction ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Distinction
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                                Pass
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* TAB 5: EXPERIENCE & REFERENCES                                            */}
          {/* ========================================================================= */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Work Experience */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internships & Work-Based Learning</h3>
                <div className="space-y-2.5">
                  {student.workExperience.map((exp, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                        <span className="text-[10px] text-slate-500">{exp.duration}</span>
                      </div>
                      <span className="text-blue-800 font-semibold block">{exp.company}</span>
                      <p className="text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty & Mentor Endorsements */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty & Alumni Mentorship References</h3>
                <div className="space-y-2.5">
                  {student.endorsements.map((end, idx) => (
                    <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{end.authorName}</span>
                        <span className="text-[10px] text-slate-400">{end.date}</span>
                      </div>
                      <span className="text-[11px] text-indigo-700 font-medium block">{end.authorRole}</span>
                      <p className="text-slate-600 italic leading-relaxed pt-1">"{end.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Sticky Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>EnrichHub Institutional Verification • Directorate of Academic Records</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onScheduleInterview(student)}
              className="px-5 py-2 bg-[#E31B23] hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invite to Fast-Track Interview</span>
            </button>
          </div>
        </div>

      </div>

      {/* SUB-MODAL: OFFICIAL DIGITAL CERTIFICATE VIEWER */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border-4 border-amber-400/80 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            
            {/* Certificate Watermark Graphic */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-50/80 border-8 border-amber-200/50 pointer-events-none flex items-center justify-center">
              <Award className="w-32 h-32 text-amber-200/60" />
            </div>

            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                RF
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                Richfield Graduate Institute of Technology • Verified Credential Registry
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Institutional Certificate of Competence
              </h3>
            </div>

            {/* Certificate Core Statement */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">This officially confirms that</p>
              <h2 className="text-2xl font-black text-[#002B66]">{student.name}</h2>
              <span className="text-xs text-slate-500">Student ID: {student.studentIdNumber} • {student.campus}</span>
              <p className="text-xs text-slate-500 uppercase tracking-wider pt-2">has successfully satisfied all rigorous requirements for</p>
              <h4 className="text-base font-black text-slate-900">{selectedCertificate.name}</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">{selectedCertificate.description}</p>
            </div>

            {/* Credential Data Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Issuer / Accrediting Body</span>
                <span className="font-bold text-slate-800 font-sans">{selectedCertificate.issuer}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Issue Date</span>
                <span className="font-bold text-slate-800 font-sans">{selectedCertificate.issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Official Credential ID</span>
                <span className="font-bold text-blue-800">{selectedCertificate.credentialId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Cryptographic Hash</span>
                <span className="font-bold text-emerald-700 truncate block">{selectedCertificate.verificationHash}</span>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-900">Signed & Validated by Richfield Academic Registrar</span>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="px-4 py-1.5 bg-[#002B66] text-white rounded-lg text-xs font-bold"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
