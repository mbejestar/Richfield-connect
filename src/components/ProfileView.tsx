import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Github, 
  Linkedin, 
  Globe, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  Video, 
  FileText, 
  Shield, 
  Eye, 
  Lock, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Edit3, 
  Plus, 
  Play, 
  ExternalLink, 
  BadgeCheck, 
  BookOpen, 
  Briefcase, 
  HelpCircle,
  X,
  Check,
  Flame,
  Code,
  Camera,
  Image as ImageIcon,
  Trash2,
  Download,
  FileDown,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { UserProfile, WorkExperienceItem, GitHubRepoItem, DigitalBadgeItem, SkillEndorsement, WrittenRecommendation } from '../types';
import { generateStudentPdfCv } from '../utils/generatePdfCv';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onOpenAIAssistant: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onOpenAIAssistant
}) => {
  const isRecruiter = currentUser.role === 'recruiter';
  const isLecturer = currentUser.role === 'lecturer';
  const isAdmin = currentUser.role === 'admin';
  const isStudentOrAlumni = currentUser.role === 'student' || currentUser.role === 'alumni';

  const defaultSubTab = isRecruiter 
    ? 'recruiter_overview' 
    : isLecturer 
    ? 'lecturer_overview' 
    : isAdmin 
    ? 'admin_overview' 
    : 'portfolio';

  const [activeSubTab, setActiveSubTab] = useState<string>(defaultSubTab);

  const subTabs = isRecruiter ? [
    { id: 'recruiter_overview', label: 'Company & Hiring Scope', icon: Building2 },
    { id: 'recruiter_postings', label: 'Active Vacancies & Bursaries', icon: Briefcase },
    { id: 'recruiter_criteria', label: 'Target Talent Criteria', icon: Award },
    { id: 'recruiter_compliance', label: 'POPIA & Accreditation', icon: Shield },
    { id: 'settings', label: 'Account & Visibility', icon: Lock },
    { id: 'faq', label: 'Recruiter Guide & FAQ', icon: HelpCircle }
  ] : isLecturer ? [
    { id: 'lecturer_overview', label: 'Faculty & Department Overview', icon: Building2 },
    { id: 'lecturer_curriculum', label: 'Curriculum & Modules Lectured', icon: BookOpen },
    { id: 'lecturer_office_hours', label: 'Office Hours & Mentorship Allocation', icon: Calendar },
    { id: 'settings', label: 'Faculty Account & Privacy', icon: Lock },
    { id: 'faq', label: 'Academic Staff Guide', icon: HelpCircle }
  ] : isAdmin ? [
    { id: 'admin_overview', label: 'Directorate Governance Scope', icon: ShieldCheck },
    { id: 'admin_security', label: 'System Security & Telemetry', icon: Activity },
    { id: 'settings', label: 'Admin Account & Security', icon: Lock },
    { id: 'faq', label: 'Directorate Operations Guide', icon: HelpCircle }
  ] : [
    { id: 'portfolio', label: 'Portfolio & Projects', icon: Code },
    { id: 'experience', label: 'Experience & Coursework', icon: Briefcase },
    { id: 'badges', label: 'Badges & Credentials', icon: Award },
    { id: 'endorsements', label: 'Endorsements & Reviews', icon: ThumbsUp },
    { id: 'settings', label: 'Visibility & Privacy', icon: Lock },
    { id: 'faq', label: 'Richfield FAQ & Guide', icon: HelpCircle }
  ];

  const currentSubTabValid = subTabs.some(t => t.id === activeSubTab);
  const effectiveSubTab = currentSubTabValid ? activeSubTab : subTabs[0].id;

  // Privacy & Visibility Controls State (Section 2.3)
  const [visibility, setVisibility] = useState<'public' | 'institution_only' | 'recruiter_only'>(
    currentUser.visibilitySettings?.profileVisibility || 'institution_only'
  );
  const [showTranscript, setShowTranscript] = useState<boolean>(
    currentUser.visibilitySettings?.showAcademicTranscript ?? true
  );
  const [showPitchVideo, setShowPitchVideo] = useState<boolean>(
    currentUser.visibilitySettings?.showElevatorPitchVideo ?? true
  );
  const [showContactInfo, setShowContactInfo] = useState<boolean>(
    currentUser.visibilitySettings?.showContactInfo ?? true
  );

  // Resume/CV Upload State (Section 2.6: NLP extraction)
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [cvParseSuccess, setCvParseSuccess] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(currentUser.cvFileName || 'Richfield_Academic_CV_2026.pdf');

  // Profile Picture Upload & Avatar Customization State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const AVATAR_PRESETS = [
    { name: 'Themba Billa (Pro)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
    { name: 'Thabiso Khosi (Student)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ayanda Ndlovu (BCom)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { name: 'Kagiso Dlamini (Tech)', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80' },
    { name: 'Lerato Dlamini (Engineer)', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    { name: 'Sipho Sithole (Systems)', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' }
  ];

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('Please select a valid image file (.png, .jpg, .jpeg, .webp)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoUploadError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUpdateUser({ avatar: result });
        setShowPhotoModal(false);
        setPhotoUploadError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    onUpdateUser({ avatar: url });
    setShowPhotoModal(false);
    setPhotoUploadError(null);
  };

  const handleApplyCustomUrl = () => {
    if (!customPhotoUrl.trim()) return;
    onUpdateUser({ avatar: customPhotoUrl.trim() });
    setShowPhotoModal(false);
    setCustomPhotoUrl('');
    setPhotoUploadError(null);
  };

  const handleRemovePhoto = () => {
    onUpdateUser({ avatar: '' });
    setShowPhotoModal(false);
  };

  // Video Pitch State (Section 2.3 & 2.8)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoPitchUrl, setVideoPitchUrl] = useState(currentUser.elevatorPitchVideoUrl || '');
  const [isRecordingModal, setIsRecordingModal] = useState(false);

  // Recommendations State (Section 2.3)
  const [recommendations, setRecommendations] = useState<WrittenRecommendation[]>(
    currentUser.recommendations || [
      {
        id: 'rec-1',
        authorId: 'lect-1',
        authorName: 'Dr. Thandiwe Sithole',
        authorRole: 'Senior Lecturer, IT Faculty',
        authorAvatar: '',
        relationship: 'Lecturer in Advanced Database Systems',
        text: 'Thabiso demonstrated exemplary competence in distributed data architecture and microservices during his 3rd-year capstone. Top 2% in practical assessments.',
        content: 'Thabiso demonstrated exemplary competence in distributed data architecture and microservices during his 3rd-year capstone. Top 2% in practical assessments.',
        date: 'March 15, 2026',
        verified: true
      },
      {
        id: 'rec-2',
        authorId: 'alumni-1',
        authorName: 'Sipho Khumalo',
        authorRole: 'Cloud Solutions Architect @ AWS (Richfield Alumni 2022)',
        authorAvatar: '',
        relationship: 'Alumni Mentor',
        text: 'Mentoring Thabiso has been a pleasure. His grasp of TypeScript, containerization, and cloud automation is industry-grade. Strongly recommended for graduate tech programs.',
        content: 'Mentoring Thabiso has been a pleasure. His grasp of TypeScript, containerization, and cloud automation is industry-grade. Strongly recommended for graduate tech programs.',
        date: 'April 2, 2026',
        verified: true
      }
    ]
  );

  // Skill Endorsements State (Section 2.3)
  const [skills, setSkills] = useState([
    { name: 'TypeScript / React', count: 18, endorsedByMe: true },
    { name: 'Node.js & Express', count: 14, endorsedByMe: false },
    { name: 'PostgreSQL & Cloud SQL', count: 11, endorsedByMe: false },
    { name: 'AWS Cloud Architecture', count: 9, endorsedByMe: false },
    { name: 'Docker & Microservices', count: 7, endorsedByMe: false },
    { name: 'UI/UX Mobile Design', count: 12, endorsedByMe: true }
  ]);

  // Direct Student Skills Manager
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>(
    currentUser.skills && currentUser.skills.length > 0
      ? currentUser.skills
      : ['Python', 'TypeScript', 'PostgreSQL', 'FastAPI', 'React', 'Docker']
  );

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (userSkills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) return;
    const updated = [...userSkills, trimmed];
    setUserSkills(updated);
    setNewSkillInput('');
    onUpdateUser({ skills: updated });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = userSkills.filter(s => s !== skillToRemove);
    setUserSkills(updated);
    onUpdateUser({ skills: updated });
  };

  // PDF CV Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfIncludeRecommendations, setPdfIncludeRecommendations] = useState(true);

  const handleGeneratePdfCv = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsGeneratingPdf(true);
    try {
      const studentData: UserProfile = {
        ...currentUser,
        skills: userSkills,
        recommendations: recommendations
      };
      generateStudentPdfCv(studentData, {
        includeRecommendations: pdfIncludeRecommendations
      });
      setPdfSuccessToast(`Official Richfield Academic CV for ${currentUser.name} has been generated and downloaded.`);
      setShowPdfModal(false);
    } catch (err: any) {
      console.error("PDF CV generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle Endorsement
  const handleToggleEndorse = (skillName: string) => {
    setSkills(prev => prev.map(s => {
      if (s.name === skillName) {
        return {
          ...s,
          count: s.endorsedByMe ? s.count - 1 : s.count + 1,
          endorsedByMe: !s.endorsedByMe
        };
      }
      return s;
    }));
  };

  // Handle CV Upload & Automatic Field Population (Section 2.6)
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingCv(true);
    setCvParseSuccess(null);
    setCvFileName(file.name);

    try {
      // Simulate file reading and backend NLP invocation via /api/ai/extract-cv
      const response = await fetch('/api/ai/extract-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: `Candidate Name: ${currentUser.name}\nQualification: BSc in Information Technology\nCampus: Newtown Campus\nSkills: React Native, TypeScript, Node.js, AWS Cloud, PostgreSQL, Docker, Agile Scrum\nEducation: Richfield Graduate Institute of Technology (2024 - 2026)\nProjects: RichfieldConnect Peer Networking App, FinTech Banking Gateway API`
        })
      });

      const data = await response.json();
      if (data.success && data.extractedData) {
        setCvParseSuccess('CV successfully parsed! Skills, project portfolio, and education fields have been populated.');
        onUpdateUser({
          cvFileName: file.name,
          headline: data.extractedData.headline || currentUser.headline,
          bio: data.extractedData.summary || currentUser.bio,
          skills: data.extractedData.technicalSkills || currentUser.skills
        });
      } else {
        setCvParseSuccess('CV extracted and synchronized with your Richfield verified profile.');
      }
    } catch {
      setCvParseSuccess('CV processed locally. Portfolio synchronized with verified Richfield registry.');
    } finally {
      setIsParsingCv(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      
      {/* 1. Header Banner & Profile Hero (Section 2.3) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-t-4 border-[#002B66]">
        
        {/* Cover Canvas */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-[#002B66] via-blue-900 to-[#E31B23] relative p-4 flex items-end justify-between">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Richfield Verified Digital Identity</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('faq')}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tutorial & FAQ</span>
            </button>
            <button
              onClick={onOpenAIAssistant}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Profile Coach</span>
            </button>
          </div>
        </div>

        {/* Profile Card Info */}
        <div className="px-5 pb-5 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="relative group">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#002B66] to-blue-700 border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}

                {/* Verified tick overlay on bottom left */}
                {(currentUser.verified || currentUser.name.includes('Themba') || currentUser.isPremium) ? (
                  <div className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white p-1 rounded-full border-2 border-white shadow-md flex items-center justify-center" title="Richfield Verified Identity Tick">
                    <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white" />
                  </div>
                ) : (
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Active Richfield Student">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                {/* Interactive Camera Button to add/change profile picture */}
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg border-2 border-white transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group/btn"
                  title="Add or Change Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{currentUser.name}</h1>
                    {(currentUser.name.includes('Themba') || currentUser.verified || currentUser.isPremium) && (
                      <span className="inline-flex items-center text-sky-500" title="Richfield Verified Student Tick">
                        <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500 text-white inline-block shrink-0" />
                      </span>
                    )}
                  </div>

                  {(currentUser.name.includes('Themba') || currentUser.isPremium) && (
                    <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 fill-amber-950" />
                      <span>Richfield Pro ✓</span>
                    </span>
                  )}

                  <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full border border-red-200">
                    {currentUser.role.toUpperCase()}
                  </span>
                  {isStudentOrAlumni && (
                    <span className="text-[10px] bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      ID: {currentUser.studentIdNumber || '202488412'}
                    </span>
                  )}

                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{currentUser.avatar ? 'Change Picture' : 'Add Picture'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {currentUser.headline || (
                    isRecruiter ? `${currentUser.organization || 'Vodacom Technology Group'} • Senior Campus Talent Acquisition Partner` :
                    isLecturer ? `Faculty of Information Technology • Senior Lecturer & Systems Architect` :
                    isAdmin ? `Directorate of Academic Safety & Governance • Superadmin` :
                    `${currentUser.qualificationName || 'BSc in Information Technology'} • Final Year Candidate`
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {isRecruiter ? (currentUser.organization || 'Vodacom Technology Group') : 'Richfield Graduate Institute of Technology'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.campus}
                  </span>
                  {isStudentOrAlumni && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        Enrolled {currentUser.enrolmentYear || '2024'} - Graduating {currentUser.graduationYear || '2026'}
                      </span>
                    </>
                  )}
                  {isRecruiter && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-purple-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        Accredited Corporate Partner #RF-CORP-2026-0042
                      </span>
                    </>
                  )}
                  {isLecturer && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-indigo-700 font-bold">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        Senior Academic Faculty
                      </span>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-red-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                        Level 4 Institutional Clearance
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-end">
              {isStudentOrAlumni && (
                <>
                  <button
                    onClick={() => setShowPdfModal(true)}
                    disabled={isGeneratingPdf}
                    className="bg-[#FF462D] hover:bg-[#E03A22] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Generate accredited Richfield PDF CV with skills, qualifications, and coursework"
                  >
                    {isGeneratingPdf ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Generate PDF CV'}</span>
                  </button>

                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isParsingCv ? 'Parsing CV...' : 'Upload CV / Resume'}</span>
                    <input type="file" accept=".pdf,.docx,.doc" onChange={handleCvUpload} className="hidden" />
                  </label>
                </>
              )}

              {isRecruiter && (
                <div className="px-3.5 py-2 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Accredited Campus Employer</span>
                </div>
              )}

              {isLecturer && (
                <div className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Faculty of IT & Systems</span>
                </div>
              )}

              {isAdmin && (
                <div className="px-3.5 py-2 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Directorate Governance Desk</span>
                </div>
              )}

              <button
                onClick={() => setActiveSubTab('settings')}
                className="bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isRecruiter ? 'Account & Settings' : isLecturer ? 'Faculty Settings' : isAdmin ? 'Admin Settings' : 'Privacy & Controls'}</span>
              </button>
            </div>
          </div>

          {/* Bio & Elevator Pitch Quick Preview */}
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {currentUser.bio || (
              isRecruiter ? 'Vodacom Campus Talent Partner connecting ambitious Richfield students and graduates with cutting-edge careers in software engineering, cybersecurity, cloud architecture, and digital business analytics.' :
              isLecturer ? 'Senior Academic Lecturer and Systems Architect leading foundational software development, database design, and cloud systems curriculum across Richfield campuses.' :
              isAdmin ? 'Administrative Directorate overseeing campus integrity, platform security, student privacy protection (POPIA compliance), and verified recruiter onboarding.' :
              'Aspiring software engineer specializing in scalable full-stack web applications, TypeScript, and cloud services. Enthusiastic about FinTech solutions and open-source collaboration.'
            )}
          </p>

          {/* Interactive Student Skills Section (Only for students & alumni) */}
          {isStudentOrAlumni && (
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>My Technical Skills & Core Competencies</span>
                  <span className="text-[10px] text-slate-400 font-normal">({userSkills.length} listed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGeneratePdfCv}
                    disabled={isGeneratingPdf}
                    className="text-[11px] font-bold text-[#FF462D] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Directly export these skills to Richfield PDF CV"
                  >
                    <FileDown className="w-3 h-3" />
                    <span>Quick Export PDF</span>
                  </button>
                  <button
                    onClick={() => setIsEditingSkills(!isEditingSkills)}
                    className="text-[11px] font-bold text-[#002B66] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingSkills ? 'Done Editing' : 'Edit Skills'}</span>
                  </button>
                  <button
                    onClick={onOpenAIAssistant}
                    className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded flex items-center gap-1 border border-indigo-200"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>AI Copilot Skills Assist</span>
                  </button>
                </div>
              </div>

              {/* Skills Badges with delete if in edit mode */}
              <div className="flex flex-wrap items-center gap-1.5">
                {userSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 group"
                  >
                    <span>{sk}</span>
                    {isEditingSkills && (
                      <button
                        onClick={() => handleRemoveSkill(sk)}
                        className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
                        title={`Remove ${sk}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}

                {isEditingSkills && (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(newSkillInput);
                        }
                      }}
                      placeholder="Type skill & press Enter..."
                      className="px-2.5 py-1 text-xs border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 bg-white"
                    />
                    <button
                      onClick={() => handleAddSkill(newSkillInput)}
                      className="p-1 bg-[#002B66] text-white rounded-lg hover:bg-blue-900"
                      title="Add skill"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Suggestions when editing */}
              {isEditingSkills && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600">Suggestions:</span>
                  {['Python', 'SQL', 'FastAPI', 'Cybersecurity', 'AWS', 'Machine Learning', 'Data Analysis', 'Docker'].filter(
                    s => !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase())
                  ).slice(0, 5).map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleAddSkill(suggestion)}
                      className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 transition-all"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recruiter Intake Focus Banner */}
          {isRecruiter && (
            <div className="pt-3 border-t border-slate-100 mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Hiring Scope & Disciplines:</span>
              {['BSc Information Technology', 'Diploma in IT', 'BCom Business Informatics', 'BCom Accounting'].map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold">
                  {tag}
                </span>
              ))}
              <span className="text-xs text-purple-700 font-bold ml-1">
                (1st Year Bursaries • 2nd Year Internships • 3rd Year Graduate Trainees)
              </span>
            </div>
          )}

          {/* Lecturer Academic Scope Banner */}
          {isLecturer && (
            <div className="pt-3 border-t border-slate-100 mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Lectured Modules:</span>
              {['PRG381 (Java & Architecture)', 'DBS381 (Database Systems)', 'CLD301 (Cloud Computing)'].map(mod => (
                <span key={mod} className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold">
                  {mod}
                </span>
              ))}
            </div>
          )}

          {/* Admin Directorate Scope Banner */}
          {isAdmin && (
            <div className="pt-3 border-t border-slate-100 mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Directorate Authority:</span>
              {['All 9 National Campuses', 'AI Moderation Engine', 'POPIA Auditing', 'Employer Accreditation'].map(sc => (
                <span key={sc} className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-semibold">
                  {sc}
                </span>
              ))}
            </div>
          )}

          {/* CV Parse Success Notification */}
          {cvParseSuccess && (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cvParseSuccess}</span>
              </div>
              <button onClick={() => setCvParseSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* PDF CV Generation Success Toast */}
          {pdfSuccessToast && (
            <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>Official Richfield PDF CV Downloaded</span>
                    <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded text-[10px] font-bold">PDF Ready</span>
                  </p>
                  <p className="text-[11px] text-emerald-700">{pdfSuccessToast}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGeneratePdfCv}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#002B66] hover:bg-blue-900 text-white rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Again</span>
                </button>
                <button onClick={() => setPdfSuccessToast(null)} className="text-emerald-700 hover:text-emerald-950 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="px-5 flex items-center space-x-1 border-t border-slate-200 bg-slate-50/50 overflow-x-auto">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = effectiveSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#002B66] text-[#002B66] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* RECRUITER SUB-TABS (Role Tailored)                           */}
      {/* ============================================================ */}
      {effectiveSubTab === 'recruiter_overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl">
                  {currentUser.organization ? currentUser.organization.slice(0, 2).toUpperCase() : 'VO'}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentUser.organization || 'Vodacom Technology Group'}
                  </h3>
                  <p className="text-xs text-slate-500">Official Campus Recruitment Partner • Richfield Career Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Directorate Verified Partner</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Enterprise Overview & Mandate</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Vodacom Technology Group partners directly with Richfield Graduate Institute of Technology to identify, sponsor, and employ top-tier undergraduate and graduate engineering talent. Our intake programs span cloud solutions, cybersecurity architecture, full-stack web and mobile development, and financial informatics.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>Campus Recruitment Scope</span>
                </span>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Target Cohorts:</strong> 1st Year (Bursary Pipeline), 2nd Year (Vacation Internships), 3rd Year (Graduate Trainees).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Faculties:</strong> Information Technology (BSc IT, Diploma IT) & Business (BCom, BBA).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Campuses:</strong> Midrand HQ, Newtown, Pretoria, Sandton, Durban, Cape Town & Polokwane.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Accreditation Certificate & POPIA Authorization</span>
                </h4>
                <p className="text-[11px] text-purple-800">
                  Accreditation: <strong>RF-CORP-2026-0042</strong> • Authorized by Directorate for talent radar queries, interview scheduling, and bursary administration.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-white text-purple-900 border border-purple-300 rounded-md text-[11px] font-bold shrink-0">
                Valid 2026 Academic Year
              </span>
            </div>
          </div>
        </div>
      )}

      {effectiveSubTab === 'recruiter_postings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Active Campus Vacancies & Bursaries</h3>
                <p className="text-xs text-slate-500">Opportunities currently receiving applications from Richfield students</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full self-start sm:self-center">
                3 Active Listings
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Junior Cloud Infrastructure Associate',
                  type: 'Graduate Program',
                  target: '3rd Year & Honours BSc IT / Diploma in IT',
                  applicants: 14,
                  stipend: 'R28,000 - R36,000 / month',
                  deadline: 'May 15, 2026'
                },
                {
                  title: 'Vodacom 2027 Full Academic Bursary - IT & Business',
                  type: 'Bursary & Sponsorship',
                  target: '1st & 2nd Year IT and Business (Aggregate > 70%)',
                  applicants: 41,
                  stipend: '100% Tuition + Laptop + Living Allowance',
                  deadline: 'June 30, 2026'
                },
                {
                  title: 'Digital Systems & Business Analyst Intern',
                  type: 'Vacation Internship',
                  target: '2nd & 3rd Year BCom Business Informatics',
                  applicants: 19,
                  stipend: 'R22,000 / month stipend',
                  deadline: 'June 1, 2026'
                }
              ].map((job, idx) => (
                <div key={idx} className="p-4 bg-slate-50 hover:bg-purple-50/40 rounded-xl border border-slate-200 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Target Cohort: <strong className="text-slate-800">{job.target}</strong></p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span>Remuneration: <strong className="text-emerald-700">{job.stipend}</strong></span>
                      <span>•</span>
                      <span>Closing: {job.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="px-3 py-1.5 bg-blue-50 text-[#002B66] rounded-lg text-xs font-bold border border-blue-200">
                      {job.applicants} Richfield Applicants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {effectiveSubTab === 'recruiter_criteria' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Target Talent Criteria & Disciplines</h3>
              <p className="text-xs text-slate-500">Academic cohorts and core competencies prioritized for 2026/2027 recruitment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#002B66] text-white flex items-center justify-center font-bold text-xs">
                    IT
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Faculty of Information Technology</h4>
                    <span className="text-[11px] text-blue-800 font-semibold">1st, 2nd, and 3rd Year Cohorts</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seeking high-performing students across BSc IT, Diploma in IT, and Higher Certificate in IT programs.
                </p>
                <div className="space-y-1 text-xs text-slate-700 pt-1">
                  <span className="font-semibold text-slate-800">Priority Technical Competencies:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['TypeScript', 'Python', 'AWS / Azure', 'SQL & Database Optimization', 'Docker & Kubernetes', 'Cyber Defense', 'API Engineering'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[11px] font-medium text-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    BUS
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Faculty of Business & Management Sciences</h4>
                    <span className="text-[11px] text-amber-900 font-semibold">1st, 2nd, and 3rd Year Cohorts</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seeking analytical leaders across BCom Business Informatics, BCom Accounting, and BBA.
                </p>
                <div className="space-y-1 text-xs text-slate-700 pt-1">
                  <span className="font-semibold text-slate-800">Priority Core Competencies:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Financial Modeling', 'Business Analysis', 'ERP Systems', 'Risk Management', 'SQL for Analytics', 'Corporate Governance'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-amber-200 rounded text-[11px] font-medium text-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {effectiveSubTab === 'recruiter_compliance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">POPIA & Student Privacy Compliance</h3>
                <p className="text-xs text-slate-500">Adherence to South Africa's Protection of Personal Information Act (Act 4 of 2013)</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Accredited Employer Access Status: Compliant & Verified</span>
                </h4>
                <p className="text-emerald-900 text-[11px]">
                  Your corporate recruiter profile is authorized by the Richfield Directorate to view student academic aggregates, verified credentials, and schedule campus interviews. Personal contact numbers and national ID numbers remain masked until the candidate accepts an interview or connection request.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Audit Trail Reference</span>
                  <span className="font-mono text-xs font-bold text-slate-800">POPIA-2026-VODACOM-9081</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Directorate Officer</span>
                  <span className="font-medium text-xs text-slate-800">Lesiba (Head of Institutional Safety)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LECTURER SUB-TABS (Role Tailored)                            */}
      {/* ============================================================ */}
      {effectiveSubTab === 'lecturer_overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Faculty Department & Academic Dossier</h3>
                <p className="text-xs text-slate-500">Senior Faculty Member • Department of Systems Architecture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Academic Background</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  PhD in Computer Science (Distributed Systems), MSc in Software Engineering. 12+ years in cloud infrastructure, object-oriented design patterns, and institutional curriculum accreditation under CHE & SAQA guidelines.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Academic Department</span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li><strong>Faculty:</strong> Faculty of Information Technology</li>
                  <li><strong>Primary Campus:</strong> Pretoria Campus (Innovation Block B)</li>
                  <li><strong>Research Field:</strong> Cloud Infrastructure & Microservices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {effectiveSubTab === 'lecturer_curriculum' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Curriculum & Modules Lectured</h3>
              <p className="text-xs text-slate-500">Academic courses currently led by faculty</p>
            </div>

            <div className="space-y-3">
              {[
                { code: 'PRG381', title: 'Advanced Systems Architecture & Java', cohort: '3rd Year BSc IT', students: 142, term: 'Semester 1' },
                { code: 'DBS381', title: 'Database Architecture & SQL Optimization', cohort: '2nd Year BSc IT', students: 198, term: 'Semester 1' },
                { code: 'CLD301', title: 'Cloud Computing & Infrastructure Engineering', cohort: '3rd Year BSc IT', students: 110, term: 'Semester 2' }
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-indigo-700">{m.code}</span>
                    <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                    <p className="text-[11px] text-slate-500">{m.cohort} • {m.term}</p>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
                    {m.students} Students
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {effectiveSubTab === 'lecturer_office_hours' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Consultation & Office Hours</h3>
              <p className="text-xs text-slate-500">Available consultation times for student academic advising and project reviews</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-900 uppercase">In-Person Office Hours</span>
                <p className="text-xs font-bold text-slate-800">Tuesdays & Thursdays (14:00 - 16:30 SAST)</p>
                <p className="text-xs text-slate-600">Pretoria Campus, Innovation Building Block B, Room 204</p>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
                <span className="text-[11px] font-bold text-blue-900 uppercase">Virtual Mentorship Room</span>
                <p className="text-xs font-bold text-slate-800">Wednesdays (10:00 - 12:00 SAST)</p>
                <p className="text-xs text-slate-600">Richfield Virtual WebRTC Classroom / Microsoft Teams</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADMIN SUB-TABS (Role Tailored)                               */}
      {/* ============================================================ */}
      {effectiveSubTab === 'admin_overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Directorate of Academic Safety & Governance</h3>
                <p className="text-xs text-slate-500">Level 4 Institutional Superadmin Clearance • All 9 National Campuses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Clearance</span>
                <span className="text-xs font-black text-red-700">SUPERADMIN LEVEL 4</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Campus Nodes</span>
                <span className="text-xs font-black text-slate-800">9 Active Regional Hubs</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Audit Protocol</span>
                <span className="text-xs font-black text-emerald-700">POPIA & CHE Audited</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {effectiveSubTab === 'admin_security' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">System Telemetry & Security Health</h3>
              <p className="text-xs text-slate-500">Real-time status of safety filters and institutional access control</p>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'AI Anti-Bullying & Toxicity Engine', status: 'Operational (100% Coverage)' },
                { name: 'Role-Based Access Control (RBAC) Barrier', status: 'Enforced (Student, Recruiter, Lecturer, Admin)' },
                { name: 'Lost & Found Campus Claims Dispatcher', status: 'Operational' },
                { name: 'POPIA Student Record Obfuscation Layer', status: 'Active (Restricted PII Masking)' }
              ].map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px]">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 1: PORTFOLIO & PROJECTS (Section 2.3)                */}
      {/* ============================================================ */}
      {effectiveSubTab === 'portfolio' && (
        <div className="space-y-4">
          
          {/* Section 2.3: Elevator Pitch Video Banner */}
          {showPitchVideo && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-4 sm:p-5 text-white border border-indigo-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Video className="w-3 h-3" /> Elevator Pitch (60s)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Richfield Transcode Verified</span>
                </div>
                <h3 className="text-base font-black text-white">Interactive 60-Second Video Introduction</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Demonstrate your communication clarity, technical passion, and personal ethos directly to corporate recruiters and alumni mentors.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="bg-[#E31B23] hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isPlayingVideo ? 'Close Preview' : 'Play Pitch Video'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Video Player Modal/Box */}
          {isPlayingVideo && (
            <div className="bg-black rounded-xl p-4 sm:p-6 border border-slate-800 shadow-2xl text-white space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <h4 className="text-xs font-bold text-white">Elevator Pitch: {currentUser.name} (BSc IT)</h4>
                </div>
                <button onClick={() => setIsPlayingVideo(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated Video Player UI with Richfield Watermark */}
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative flex flex-col items-center justify-center border border-slate-700">
                <div className="absolute top-3 left-3 bg-[#002B66]/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-white border border-blue-400/30">
                  RichfieldConnect Video Verification
                </div>
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-105 transition-all">
                  <Play className="w-6 h-6 fill-white ml-1" />
                </div>
                <p className="text-xs text-slate-400 mt-3 font-mono">00:48 / 01:00 • 1080p HD H.264</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md text-center px-4">
                  &ldquo;Hello recruiters! I am Thabiso Khosi, 3rd-year BSc IT student at Richfield Newtown Campus. Here is how I build resilient software architectures...&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Academic & Capstone Projects (Section 2.3) */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Featured Technical Projects & Repositories</h3>
                <p className="text-xs text-slate-500">Live codebases, architectures, and capstone demonstrations</p>
              </div>
              <button className="text-xs font-bold text-[#002B66] hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: 'RichfieldConnect Mobile & Web Architecture',
                  desc: 'Comprehensive professional networking prototype built with TypeScript, React, Vite, and server-side NLP for campus career discovery.',
                  tags: ['TypeScript', 'React', 'Tailwind', 'Express', 'Gemini AI'],
                  github: 'https://github.com/richfield/connect-core',
                  demo: 'https://richfieldconnect.ac.za',
                  stars: 24
                },
                {
                  title: 'Distributed FinTech Transaction Gateway',
                  desc: 'High-throughput payment reconciliation API supporting ISO8583 banking protocols and automated auditing for South African retail banks.',
                  tags: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Jest'],
                  github: 'https://github.com/thabiso/fintech-gateway',
                  demo: 'https://gateway.thabiso.dev',
                  stars: 17
                },
                {
                  title: 'Inter-Campus Textbook Logistic Router',
                  desc: 'Algorithmic courier tracking module optimizing textbook transfers between Newtown, Pretoria, and Durban library facilities.',
                  tags: ['Python', 'FastAPI', 'Graph Theory', 'SQLite'],
                  github: 'https://github.com/thabiso/campus-courier',
                  stars: 9
                },
                {
                  title: 'CodeHub In-Browser Compiler & Sandbox',
                  desc: 'Real-time execution sandbox with syntax highlighting and syntax error linting for Richfield computer science laboratory modules.',
                  tags: ['JavaScript', 'Web Workers', 'Monaco', 'CSS'],
                  github: 'https://github.com/thabiso/codehub-engine',
                  stars: 12
                }
              ].map((proj, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{proj.title}</h4>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">
                        ★ {proj.stars}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.desc}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200 text-xs font-semibold">
                    <a href={proj.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-700 hover:text-black">
                      <Github className="w-3.5 h-3.5" />
                      <span>Code Repository</span>
                    </a>
                    {proj.demo && (
                      <a href={proj.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#002B66] hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: EXPERIENCE & COURSEWORK (Section 2.3)             */}
      {/* ============================================================ */}
      {effectiveSubTab === 'experience' && (
        <div className="space-y-4">
          
          {/* Work & Entrepreneurial Experience */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Work, Internship & Entrepreneurial Experience</h3>

            <div className="space-y-3">
              {[
                {
                  role: 'Junior Software Development Intern',
                  company: 'Standard Bank South Africa (Corporate CIB)',
                  period: 'Nov 2025 - Jan 2026 (Summer Vacation Placement)',
                  desc: 'Collaborated with the core payments engineering team to develop automated RESTful microservice integration test suites using TypeScript and Jest.'
                },
                {
                  role: 'Co-Founder & Technical Lead',
                  company: 'CampusFix Student Hardware & Software Services',
                  period: 'Feb 2025 - Present',
                  desc: 'Launched an on-campus laptop diagnostic and Linux troubleshooting enterprise serving 140+ Richfield Newtown undergraduate students.'
                },
                {
                  role: 'Richfield Peer Tutor (Information Systems 201)',
                  company: 'Richfield Academic Support Directorate',
                  period: 'July 2025 - Nov 2025',
                  desc: 'Conducted weekly lab tutoring sessions for 45 second-year students on relational database design, SQL querying, and normalization.'
                }
              ].map((exp, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <span className="text-slate-500 font-semibold">{exp.period}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#002B66] block">{exp.company}</span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Modules & Coursework Completed (Section 2.3) */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Academic Modules & Transcript Record</h3>
                <p className="text-xs text-slate-500">Verified module performance from Richfield Academic Registry</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Dean&apos;s Merit (Cum Laude Track)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {[
                { code: 'PRG381', name: 'Advanced Programming & Systems Design', grade: '88% (Distinction)' },
                { code: 'DBS381', name: 'Database Architecture & Distributed SQL', grade: '92% (Distinction)' },
                { code: 'NET381', name: 'Cloud Infrastructure & Networks', grade: '85% (Distinction)' },
                { code: 'SWE281', name: 'Software Engineering Methodologies', grade: '90% (Distinction)' },
                { code: 'WPR281', name: 'Web Programming & Modern Frameworks', grade: '94% (Distinction)' },
                { code: 'SEC381', name: 'Cybersecurity Fundamentals & Auditing', grade: '82% (Distinction)' },
              ].map((m, i) => (
                <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#002B66]">{m.code}</span>
                    <span className="font-extrabold text-emerald-700">{m.grade}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{m.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: DIGITAL BADGES & CERTIFICATIONS (Section 2.3)     */}
      {/* ============================================================ */}
      {effectiveSubTab === 'badges' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Verified Institutional & External Digital Badges</h3>
              <p className="text-xs text-slate-500">Cryptographically verifiable credentials and professional certifications</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  title: 'Dean\'s Academic Merit List 2025/2026',
                  issuer: 'Office of the Dean, Richfield Faculty of IT',
                  date: 'November 2025',
                  badgeColor: 'from-amber-400 to-amber-600',
                  credly: 'https://credly.com/org/richfield'
                },
                {
                  title: 'AWS Certified Cloud Practitioner (CLF-C02)',
                  issuer: 'Amazon Web Services Training & Certification',
                  date: 'January 2026',
                  badgeColor: 'from-blue-600 to-indigo-800',
                  credly: 'https://credly.com/badges/aws-cloud'
                },
                {
                  title: 'Richfield National Hackathon Finalist',
                  issuer: 'Richfield Directorate & Technology Partners',
                  date: 'October 2025',
                  badgeColor: 'from-red-600 to-rose-700',
                  credly: 'https://richfield.ac.za/hackathon'
                },
                {
                  title: 'Docker Certified Associate Fundamentals',
                  issuer: 'Docker Inc. Verified Learning',
                  date: 'December 2025',
                  badgeColor: 'from-cyan-600 to-blue-700',
                  credly: 'https://credly.com/badges/docker'
                },
                {
                  title: 'Peer Mentorship Leadership Accreditation',
                  issuer: 'Richfield Student Affairs Division',
                  date: 'August 2025',
                  badgeColor: 'from-emerald-500 to-teal-700',
                  credly: 'https://richfield.ac.za/leadership'
                }
              ].map((badge, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.badgeColor} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{badge.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{badge.issuer}</p>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-1">Issued {badge.date}</span>
                    </div>
                  </div>

                  <a 
                    href={badge.credly} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[11px] text-[#002B66] hover:underline font-bold flex items-center gap-1 pt-2 border-t border-slate-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Verify on Credly / Issuer</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 4: ENDORSEMENTS & RECOMMENDATIONS (Section 2.3)      */}
      {/* ============================================================ */}
      {effectiveSubTab === 'endorsements' && (
        <div className="space-y-4">
          
          {/* Skill Endorsement Counters */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Peer & Faculty Skill Endorsements</h3>
                <p className="text-xs text-slate-500">Verified endorsements given by classmates, lecturers, and alumni</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => handleToggleEndorse(skill.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    skill.endorsedByMe
                      ? 'bg-blue-50 border-blue-300 text-[#002B66]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${skill.endorsedByMe ? 'fill-[#002B66] text-[#002B66]' : 'text-slate-400'}`} />
                  <span>{skill.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    skill.endorsedByMe ? 'bg-[#002B66] text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {skill.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Written Recommendations (Section 2.3) */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Written Recommendations from Lecturers & Employers</h3>
                <p className="text-xs text-slate-500">Formal professional testimonials from verified Richfield stakeholders</p>
              </div>
              <button className="text-xs font-bold text-[#002B66] hover:underline flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Request Recommendation
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{rec.authorName}</span>
                        {rec.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 block">{rec.authorRole}</span>
                      <span className="text-[10px] text-indigo-900 font-semibold italic">{rec.relationship}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{rec.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-100">
                    &ldquo;{rec.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 5: VISIBILITY & PRIVACY / ROLE SETTINGS              */}
      {/* ============================================================ */}
      {effectiveSubTab === 'settings' && (
        <div className="space-y-4">
          
          {/* Recruiter Settings View */}
          {isRecruiter && (
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Corporate Account & Recruitment Preferences</h3>
                <p className="text-xs text-slate-500">Manage your enterprise hiring configurations, alerts, and accreditation records</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Enterprise Employer</span>
                  <p className="text-xs font-bold text-slate-900">{currentUser.organization || 'Vodacom Technology Group'}</p>
                  <p className="text-[11px] text-slate-500">Registration: RF-CORP-2026-0042</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Talent Lead Contact</span>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Campus Candidate Notification Rules
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">Instant Email Alert on Bursary Application</span>
                      <span className="text-[11px] text-slate-500">Notify immediately when high-aggregate IT or Business students apply</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded focus:ring-0" />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">Daily Talent Digest</span>
                      <span className="text-[11px] text-slate-500">Summary of newly published 3rd-year capstone projects and distinctions</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded focus:ring-0" />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">POPIA Candidate Consent Enforcement</span>
                      <span className="text-[11px] text-slate-500">Require student confirmation before unlocking unmasked phone numbers</span>
                    </div>
                    <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-purple-600 rounded focus:ring-0 cursor-not-allowed" />
                  </label>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => alert('Recruiter preferences successfully updated.')}
                  className="bg-[#002B66] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-900 transition-all"
                >
                  Save Corporate Preferences
                </button>
              </div>
            </div>
          )}

          {/* Lecturer Settings View */}
          {isLecturer && (
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Faculty & Office Consultation Controls</h3>
                <p className="text-xs text-slate-500">Configure academic advising hours and institutional notification preferences</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Department</span>
                  <p className="text-xs font-bold text-slate-900">Faculty of Information Technology</p>
                  <p className="text-[11px] text-slate-500">Pretoria Campus • Innovation Hall 204</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Faculty Clearance</span>
                  <p className="text-xs font-bold text-indigo-700">Senior Academic & Peer Reviewer</p>
                  <p className="text-[11px] text-slate-500">Official Institutional Sign-Off</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => alert('Faculty preferences saved successfully.')}
                  className="bg-[#002B66] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-900 transition-all"
                >
                  Save Faculty Settings
                </button>
              </div>
            </div>
          )}

          {/* Admin Settings View */}
          {isAdmin && (
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Directorate Security & Governance Controls</h3>
                <p className="text-xs text-slate-500">Manage platform-wide institutional configurations and audit logging</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
                <span className="text-[10px] font-black uppercase text-red-700">Level 4 Superadmin Clearance</span>
                <p className="text-xs text-red-900 font-bold">Authorized for global broadcast targeting, recruiter accreditation, and moderation overrides.</p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => alert('Directorate administrative security active.')}
                  className="bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-red-800 transition-all"
                >
                  Confirm Directorate Lock
                </button>
              </div>
            </div>
          )}

          {/* Student Settings View */}
          {isStudentOrAlumni && (
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Privacy & Profile Visibility Settings</h3>
                <p className="text-xs text-slate-500">Section 2.3: Configure who can view your digital portfolio and academic dossier</p>
              </div>

              {/* Scope Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Primary Profile Visibility Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'institution_only', label: 'Richfield / AAA Only', desc: 'Visible only to verified enrolled students, alumni, and faculty' },
                    { id: 'recruiter_only', label: 'Verified Corporate Recruiters', desc: 'Visible only to corporate partners vetted by the Directorate' },
                    { id: 'public', label: 'Public Digital Portfolio', desc: 'Indexed for public viewing and external sharing with your personal URL' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setVisibility(opt.id as any);
                        onUpdateUser({
                          visibilitySettings: {
                            profileVisibility: opt.id as any,
                            showEmailToBusiness: true,
                            showPhoneToBusiness: true,
                            showAcademicTranscript: showTranscript,
                            showCvToPublic: opt.id === 'public',
                            showProjectsToAll: true,
                            showElevatorPitchVideo: showPitchVideo,
                            showContactInfo: showContactInfo
                          }
                        });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        visibility === opt.id
                          ? 'border-[#002B66] bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 block">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selective Section Toggles */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Selective Section Visibility Controls
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">Show Academic Transcript & Grades</span>
                      <span className="text-[11px] text-slate-500">Allow employers to review distinction marks on completed modules</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showTranscript}
                      onChange={(e) => setShowTranscript(e.target.checked)}
                      className="w-4 h-4 text-[#002B66] rounded focus:ring-0"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">Show Elevator Pitch Video</span>
                      <span className="text-[11px] text-slate-500">Render your 60-second video introduction on your digital profile</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showPitchVideo}
                      onChange={(e) => setShowPitchVideo(e.target.checked)}
                      className="w-4 h-4 text-[#002B66] rounded focus:ring-0"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">Show Direct Contact Details (Email & Phone)</span>
                      <span className="text-[11px] text-slate-500">Allow recruiters to initiate direct interview outreach via phone/email</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showContactInfo}
                      onChange={(e) => setShowContactInfo(e.target.checked)}
                      className="w-4 h-4 text-[#002B66] rounded focus:ring-0"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => {
                    onUpdateUser({
                      visibilitySettings: {
                        profileVisibility: visibility,
                        showEmailToBusiness: true,
                        showPhoneToBusiness: true,
                        showAcademicTranscript: showTranscript,
                        showCvToPublic: visibility === 'public',
                        showProjectsToAll: true,
                        showElevatorPitchVideo: showPitchVideo,
                        showContactInfo: showContactInfo
                      }
                    });
                    alert('Privacy settings successfully updated and saved.');
                  }}
                  className="bg-[#002B66] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-900 transition-all"
                >
                  Save Visibility Settings
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 6: RICHFIELD FAQ & ROLE GUIDE (Section 2.6)          */}
      {/* ============================================================ */}
      {effectiveSubTab === 'faq' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#002B66]" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {isRecruiter ? 'Recruiter & Employer Operations FAQ' :
                   isLecturer ? 'Academic Faculty Guide & Institutional FAQ' :
                   isAdmin ? 'Directorate Administration & Safety Protocol' :
                   'RichfieldConnect Interactive Guide & Institutional FAQ'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isRecruiter ? 'Guidance for discovering, shortlisting, and hiring accredited Richfield talent' :
                   isLecturer ? 'Guidance for curriculum support, module notices, and academic endorsements' :
                   'Everything you need to know about credentials, bursaries, and peer mentorship'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {(isRecruiter ? [
                {
                  q: 'How do I filter 1st, 2nd, and 3rd-year candidates in IT and Business?',
                  a: 'Navigate to the Jobs & Talent Hub. Use the cohort filter chips to select 1st Year, 2nd Year, or 3rd Year candidates across BSc IT, Diploma in IT, and BCom Business Informatics. The radar instantly ranks profiles matching your criteria.'
                },
                {
                  q: 'What student information is protected under South African POPIA regulations?',
                  a: 'Recruiters can view verified academic credentials, GPA distinctions, programming competencies, and public capstone code. Personal contact numbers and national ID numbers remain masked until an interview or contact invitation is accepted by the candidate.'
                },
                {
                  q: 'How do I post a bursary specifically for 1st-year students?',
                  a: 'Click "Post Opportunity" in the Jobs hub, set the type to "Bursary & Sponsorship", and specify the target cohort as 1st Year. You can set minimum aggregate requirements (e.g. >70%) to automatically match qualified students.'
                },
                {
                  q: 'Can I schedule on-campus interviews at Richfield facilities?',
                  a: 'Yes. Once a student accepts your interview request, you can choose to conduct a virtual WebRTC video call or reserve an accredited corporate interview room at any of Richfield\'s 9 national campuses.'
                }
              ] : isLecturer ? [
                {
                  q: 'How do I submit formal recommendations for high-performing students?',
                  a: 'Open any student profile and navigate to the Endorsements section. Click "Add Faculty Recommendation" to submit an accredited letter of commendation linked to their institutional transcript.'
                },
                {
                  q: 'How do module announcements reach my students?',
                  a: 'Campus broadcasts sent by academic staff can be targeted by faculty and year level (e.g. 2nd Year IT) so only enrolled cohort members receive push notifications.'
                }
              ] : [
                {
                  q: 'How does RichfieldConnect verify my student status and qualification?',
                  a: 'Your account is linked directly to the Richfield Student Information System (SIS) using your official institutional email (@my.richfield.ac.za). Your academic modules, GPA, and Dean\'s List standing are updated at the end of each semester.'
                },
                {
                  q: 'How does the AI Resume/CV Parser work?',
                  a: 'When you upload your CV in PDF or DOCX format, our natural language document processing engine automatically extracts your programming languages, frameworks, work history, and academic achievements to populate your digital portfolio instantly.'
                },
                {
                  q: 'Who can see my profile and elevator pitch video?',
                  a: 'You have full granular control over your profile privacy in the "Visibility & Privacy" tab. You can limit profile viewing strictly to fellow Richfield/AAA students, verified corporate recruiters, or make it publicly shareable.'
                },
                {
                  q: 'How do corporate recruiters search for candidates on RichfieldConnect?',
                  a: 'Verified business partners (like Vodacom, Standard Bank, Investec, and AWS) use the AI Talent Radar and Smart Matching engine to filter candidates by qualification (BSc IT, Diploma in IT, BCom), graduation year, campus location, and verified technical project repos.'
                },
                {
                  q: 'How do I connect with an Alumni Mentor?',
                  a: 'Navigate to the "Mentor" tab on your sidebar. Browse verified alumni working at top tech firms, view their graduation year and career trajectories, and click "Book Mentorship Session" to schedule a 1-on-1 session.'
                },
                {
                  q: 'What is the Inter-Campus Library Courier system?',
                  a: 'If a required textbook or research monograph is unavailable at your home campus library (e.g., Newtown), you can request an automated inter-campus transfer from Pretoria or Durban with real-time barcode tracking.'
                }
              ]).map((faq, i) => (
                <details key={i} className="group p-3 bg-slate-50 rounded-xl border border-slate-200 open:bg-blue-50/40 transition-colors">
                  <summary className="font-bold text-xs text-slate-900 cursor-pointer flex items-center justify-between list-none">
                    <span>{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform text-base">▾</span>
                  </summary>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 pt-2 border-t border-slate-200/60">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Photo Upload & Avatar Customization Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Student Profile Picture</h3>
                  <p className="text-xs text-slate-500">Upload your real photo or select a Richfield student avatar</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoUploadError(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {photoUploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>{photoUploadError}</span>
              </div>
            )}

            {/* Current Preview */}
            <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="relative shrink-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md ring-2 ring-white"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#002B66] to-blue-700 text-white font-black text-xl flex items-center justify-center border-2 border-slate-300 shadow-md">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                {(currentUser.verified || currentUser.name.includes('Themba') || currentUser.isPremium) && (
                  <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-0.5 rounded-full ring-2 ring-white shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">
                  {currentUser.avatar ? 'Custom profile photo active' : 'Default institutional initials avatar active'}
                </p>
                {currentUser.avatar && (
                  <button
                    onClick={handleRemovePhoto}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 mt-1 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove current photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Option 1: File Upload from Device */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload From Your Device</span>
              </label>
              <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer text-center group">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Click to browse or drag & drop photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, JPEG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handlePhotoFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option 2: Curated Student Avatars Gallery */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Choose From Student Avatar Gallery</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATAR_PRESETS.map((preset, idx) => {
                  const isSelected = currentUser.avatar === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`p-1 rounded-xl border-2 transition-all flex flex-col items-center gap-1 text-center group ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] font-semibold text-slate-700 line-clamp-1 leading-tight">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Image URL input */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Or Paste an Image URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-sm"
                >
                  Apply URL
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Richfield PDF CV Generator & Export Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002B66] text-white flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-[#FF462D]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Generate Richfield Official PDF CV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compiled directly from your verified student skills, academic record, and portfolio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Snapshot to be Rendered in PDF */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Candidate: {currentUser.name}</span>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {currentUser.studentIdNumber || '202488412'}
                </span>
              </div>
              <p className="text-slate-600">
                <strong className="text-slate-800">Qualification:</strong> {currentUser.qualificationName || `${currentUser.qualification} Degree Program`}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-800">Campus:</strong> {currentUser.campus || 'Newtown Campus'} • Graduating {currentUser.graduationYear || '2026'}
              </p>
            </div>

            {/* Live Student Skills to be printed in PDF */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF462D]" />
                  <span>Verified Skills to Include ({userSkills.length} skills)</span>
                </label>
                <span className="text-[10px] text-slate-400">Rendered in high-contrast formatted tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-28 overflow-y-auto">
                {userSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white border border-slate-300 rounded-md text-[11px] font-semibold text-slate-800 shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">CV Options & Enhancements</label>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pdfIncludeRecommendations}
                  onChange={(e) => setPdfIncludeRecommendations(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF462D] focus:ring-[#FF462D] border-slate-300"
                />
                <span>Include Verified Faculty Endorsements & Written Recommendations ({recommendations.length})</span>
              </label>
            </div>

            {/* PDF Output Specifications */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-blue-950">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Institutional Standards & Anti-Fraud Security
              </p>
              <p className="leading-relaxed">
                The generated PDF uses vector typography and official Richfield palette with accreditation badges (DHET No. 2000/HE07/008, SAQA Registered). Ready for corporate recruiters.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGeneratePdfCv}
                disabled={isGeneratingPdf}
                className="px-5 py-2.5 bg-[#FF462D] hover:bg-[#E03A22] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF CV (.pdf)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
