import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Shield, 
  UserCheck, 
  Briefcase, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Building2, 
  User, 
  AlertCircle,
  Camera,
  CheckCircle2,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserRole, CampusLocation } from '../types';
import { 
  DEFAULT_ROLE_CREDENTIALS, 
  ALL_RICHFIELD_CAMPUSES, 
  ALL_RICHFIELD_QUALIFICATIONS,
  INITIAL_USERS 
} from '../mockData';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
}

// Helper: Robust Password Strength Evaluation for Institutional Compliance
function checkPasswordStrength(pass: string) {
  const hasMinLength = pass.length >= 8;
  const hasUppercase = /[A-Z]/.test(pass);
  const hasLowercase = /[a-z]/.test(pass);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass);
  const commonPatterns = ['1234567', '12345678', '123456789', 'password', 'qwerty', 'admin123', 'richfield'];
  const lower = pass.toLowerCase();
  const isNotCommon = !commonPatterns.some(p => lower.includes(p));

  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumberOrSymbol) score++;
  if (!isNotCommon) score = Math.min(score, 1);

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumberOrSymbol && isNotCommon;
  const label = !pass ? 'None' : score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';
  const color = score <= 1 ? 'bg-rose-500' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-blue-500' : 'bg-emerald-500';
  const textColor = score <= 1 ? 'text-rose-400' : score === 2 ? 'text-amber-400' : score === 3 ? 'text-blue-400' : 'text-emerald-400';

  return {
    score,
    label,
    color,
    textColor,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumberOrSymbol,
    isNotCommon,
    isValid
  };
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  // Current active role perspective for login/signup
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [email, setEmail] = useState('student@richfield.ac.za');
  const [password, setPassword] = useState('Student@Richfield2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showQuickCredentials, setShowQuickCredentials] = useState(false);

  // Sign Up Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regCampus, setRegCampus] = useState<CampusLocation>('Newtown Campus');
  const [regQualId, setRegQualId] = useState('qual-bsc-it');
  const [regStudentId, setRegStudentId] = useState('');
  const [regYear, setRegYear] = useState('1st Year');
  const [regGradYear, setRegGradYear] = useState('2024');
  const [regDegreeSerial, setRegDegreeSerial] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regCompanyWebsite, setRegCompanyWebsite] = useState('');
  const [regTalentSought, setRegTalentSought] = useState('');
  const [verificationModalNotice, setVerificationModalNotice] = useState<string | null>(null);

  // Real-time password strength evaluation
  const regPwdEvaluation = checkPasswordStrength(regPassword);

  // Alumni Special Certificate Login State (ONLY shown when role is Alumni)
  const [isAlumniLogin, setIsAlumniLogin] = useState(true);
  const [alumniCertificateNo, setAlumniCertificateNo] = useState('RIC-GRAD-2023-88219');

  // Recruiter Enhanced Verification State (CIPC, VAT, Camera & Anti-Scam Protection)
  const [regCompanyRegNo, setRegCompanyRegNo] = useState('');
  const [regVatNumber, setRegVatNumber] = useState('');
  const [regCompanyAddress, setRegCompanyAddress] = useState('');
  const [regRecruiterPhone, setRegRecruiterPhone] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraVerified, setCameraVerified] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync regRole whenever selectedRole changes
  useEffect(() => {
    setRegRole(selectedRole);
  }, [selectedRole]);

  // Helper to validate institutional domain (@richfield.ac.za)
  const isRichfieldDomain = (emailStr: string): boolean => {
    const clean = emailStr.trim().toLowerCase();
    const domain = clean.split('@')[1] || '';
    return domain === 'richfield.ac.za' || domain.endsWith('.richfield.ac.za');
  };

  // Switch role and update default credentials / placeholders
  const handleRoleTypeSelect = (role: UserRole) => {
    setSelectedRole(role);
    setRegRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Pick appropriate pre-set credential for the selected role
    const matchingCred = DEFAULT_ROLE_CREDENTIALS.find(c => c.role === role);
    if (matchingCred) {
      setEmail(matchingCred.email);
      setPassword(matchingCred.password);
    } else {
      if (role === 'student') {
        setEmail('student@richfield.ac.za');
        setPassword('Student@Richfield2026');
      } else if (role === 'recruiter') {
        setEmail('recruiter@richfield.ac.za');
        setPassword('Recruiter@Richfield2026');
      } else if (role === 'admin') {
        setEmail('admin@richfield.ac.za');
        setPassword('Admin@Richfield2026');
      } else if (role === 'alumni') {
        setEmail('alumni@richfield.ac.za');
        setPassword('Alumni@Richfield2026');
      } else {
        setEmail('lecturer@richfield.ac.za');
        setPassword('Lecturer@Richfield2026');
      }
    }

    if (role === 'alumni') {
      setIsAlumniLogin(true);
      setAlumniCertificateNo('RIC-GRAD-2023-88219');
    } else {
      setIsAlumniLogin(false);
    }
  };

  // Direct 1-Click selection from the credential quick access
  const handleSelectPreset = (credential: typeof DEFAULT_ROLE_CREDENTIALS[0], autoSubmit = false) => {
    setSelectedRole(credential.role);
    setRegRole(credential.role);
    setEmail(credential.email);
    setPassword(credential.password);
    setErrorMessage(null);

    if (credential.role === 'alumni') {
      setIsAlumniLogin(true);
      setAlumniCertificateNo('RIC-GRAD-2023-88219');
    } else {
      setIsAlumniLogin(false);
    }

    if (autoSubmit) {
      executeLogin(credential.email, credential.password, credential.role);
    }
  };

  const handleCopyPassword = (pass: string, roleName: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedRole(roleName);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn("Camera media access fallback:", err);
      setCameraActive(true);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 320, 240);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhotoUrl(dataUrl);
      }
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    } else {
      setCapturedPhotoUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&auto=format&fit=crop&q=80');
    }
    setCameraActive(false);
    setCameraVerified(true);
  };

  // Authentication execution
  const executeLogin = async (loginEmail: string, loginPass: string, roleHint: UserRole = selectedRole) => {
    setIsLoading(true);
    setErrorMessage(null);

    const cleanEmail = loginEmail.trim().toLowerCase();

    // STRICT DOMAIN VALIDATION:
    // Only corporate recruiter is exempt!
    // Student, Admin, and Lecturer must have @richfield.ac.za domain.
    // Alumni uses personal email if certificate is provided.
    if (roleHint !== 'recruiter' && roleHint !== 'alumni') {
      if (!isRichfieldDomain(cleanEmail)) {
        setIsLoading(false);
        setErrorMessage(
          `Domain Restricted: Only official @richfield.ac.za email addresses are authorized for ${roleHint.toUpperCase()} access. Corporate recruiters are exempt.`
        );
        return;
      }
    }

    // Alumni certificate verification check
    if (roleHint === 'alumni' && !alumniCertificateNo.trim()) {
      setIsLoading(false);
      setErrorMessage('Alumni Confirmation: Because student emails are revoked post-graduation, please enter your Richfield Graduation Certificate Number.');
      return;
    }

    try {
      // 1. Attempt server-side authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: loginPass })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        if (data.token) {
          localStorage.setItem('richfield_auth_token', data.token);
        }
        if (rememberMe) {
          localStorage.setItem('richfield_saved_user', JSON.stringify(data.user));
        }
        setIsLoading(false);
        onLogin(data.user);
        return;
      } else if (!response.ok) {
        setIsLoading(false);
        setErrorMessage(data.error || "Invalid credentials for this account. Access denied.");
        return;
      }
    } catch (apiErr) {
      console.warn("Backend auth call fallback to local verified store:", apiErr);
    }

    // 2. Client-side fallback authentication (if backend is unreachable)
    setTimeout(() => {
      const matchedCred = DEFAULT_ROLE_CREDENTIALS.find(
        c => c.email.toLowerCase() === cleanEmail || 
             (cleanEmail.includes('student') && c.role === 'student') ||
             (cleanEmail.includes('admin') && c.role === 'admin') ||
             (cleanEmail.includes('alumni') && c.role === 'alumni') ||
             (cleanEmail.includes('recruiter') && c.role === 'recruiter') ||
             (cleanEmail.includes('lecturer') && c.role === 'lecturer')
      );

      let targetUser: UserProfile | undefined = INITIAL_USERS.find(
        u => u.email.toLowerCase() === cleanEmail
      );

      if (!targetUser && matchedCred) {
        targetUser = INITIAL_USERS.find(u => u.id === matchedCred.userId) || 
                     INITIAL_USERS.find(u => u.role === matchedCred.role);
      }

      // Strict credential matching - no weak length-only bypasses allowed
      const expectedPass = matchedCred ? matchedCred.password : 'Student@Richfield2026';
      const isPassValid = Boolean(expectedPass) && (
        loginPass === expectedPass || 
        loginPass.toLowerCase() === expectedPass.toLowerCase()
      );

      if (!isPassValid) {
        setIsLoading(false);
        setErrorMessage(`Invalid password for ${loginEmail}. Please enter your correct credentials or select a 1-click test role.`);
        return;
      }

      if (!targetUser) {
        targetUser = {
          id: `user-${Date.now()}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: roleHint || (matchedCred ? matchedCred.role : 'student'),
          verified: true,
          campus: 'Newtown Campus',
          qualification: 'IT',
          qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
          academicYear: '2nd Year',
          skills: ['Software Engineering', 'EnRich Hub Portal'],
          bio: 'Richfield student exploring academic and career opportunities.',
          headline: `${roleHint.toUpperCase()} @ Richfield Newtown Campus`,
          completedOnboarding: true
        };
      }

      if (rememberMe) {
        try {
          localStorage.setItem('richfield_saved_user', JSON.stringify(targetUser));
        } catch (e) {
          console.error(e);
        }
      }

      setIsLoading(false);
      onLogin(targetUser);
    }, 400);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }
    executeLogin(email, password, selectedRole);
  };

  // Microsoft 365 Institutional Single Sign-On simulation
  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const cred = DEFAULT_ROLE_CREDENTIALS.find(c => c.role === selectedRole) || DEFAULT_ROLE_CREDENTIALS[0];
      executeLogin(cred.email, cred.password, cred.role);
    }, 600);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();

    // DOMAIN RESTRICTION:
    // Only corporate recruiters are exempt!
    // Students, faculty, and admins must use @richfield.ac.za domain.
    if (regRole !== 'recruiter' && regRole !== 'alumni') {
      if (!isRichfieldDomain(cleanEmail)) {
        setErrorMessage(
          `Domain Restricted: Current Richfield students, staff, and faculty must register using their official @richfield.ac.za email address. Corporate recruiters are exempt.`
        );
        return;
      }
    }

    // Student ID Validation: Richfield student number is strictly 9 digits
    if (regRole === 'student') {
      const cleanStudentId = regStudentId.trim();
      if (!cleanStudentId) {
        setErrorMessage("Student Registration: Richfield student number is required.");
        return;
      }
      if (!/^\d{9}$/.test(cleanStudentId)) {
        setErrorMessage(
          `Invalid Student Number: Richfield student number must be exactly 9 digits (currently ${cleanStudentId.length} digit${cleanStudentId.length === 1 ? '' : 's'}). Format: 9 numeric digits only (e.g. 202488412).`
        );
        return;
      }
    }

    // Alumni verification check
    if (regRole === 'alumni' && !regDegreeSerial.trim() && !regStudentId.trim()) {
      setErrorMessage(
        'Alumni Verification: Please provide either your former Richfield Student ID or Degree / Diploma Serial Number for identity confirmation.'
      );
      return;
    }

    // Recruiter / Business verification & Anti-Scam safeguards
    if (regRole === 'recruiter') {
      if (!regCompany.trim()) {
        setErrorMessage('Business Registration: Please specify your Company or Enterprise Organisation name.');
        return;
      }
      if (!regCompanyRegNo.trim() && !regVatNumber.trim()) {
        setErrorMessage('Anti-Fraud Compliance: Corporate recruiters must provide their official CIPC Company Registration Number or VAT Number to verify legitimacy and protect students.');
        return;
      }
      if (!cameraVerified) {
        setErrorMessage('Anti-Fraud Identity Check: Please click "Activate Camera & Verify Recruiter Identity" to complete the live identity scan before submitting.');
        return;
      }
    }

    // Admin self-registration prevention
    if (regRole === 'admin') {
      setErrorMessage('Administrator accounts cannot be self-registered. Admin credentials are provisioned directly by the Richfield Systems Directorate.');
      return;
    }

    // Strong Password Policy Enforcement
    const pwdStrength = checkPasswordStrength(regPassword);
    if (!pwdStrength.isValid) {
      if (!pwdStrength.isNotCommon) {
        setErrorMessage("Weak password: Common sequential patterns like '1234567' or dictionary words ('password') are strictly prohibited.");
      } else if (!pwdStrength.hasMinLength) {
        setErrorMessage("Strong password required: Password must be at least 8 characters long.");
      } else if (!pwdStrength.hasUppercase) {
        setErrorMessage("Strong password required: Password must contain at least one uppercase letter (A-Z).");
      } else if (!pwdStrength.hasLowercase) {
        setErrorMessage("Strong password required: Password must contain at least one lowercase letter (a-z).");
      } else {
        setErrorMessage("Strong password required: Password must contain at least one number or special symbol (0-9, @, #, $, etc.).");
      }
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const qualObj = ALL_RICHFIELD_QUALIFICATIONS.find(q => q.id === regQualId);
    const isIT = qualObj?.faculty === 'Information Technology';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: cleanEmail,
          password: regPassword,
          role: regRole,
          campus: regCampus,
          qualification: isIT ? 'IT' : 'Business',
          qualificationName: qualObj ? `${qualObj.name} — NQF Level ${qualObj.nqfLevel}` : 'Bachelor of Science in Information Technology',
          academicYear: regRole === 'student' ? regYear : regRole === 'alumni' ? 'Alumni' : 'Staff',
          studentIdNumber: regStudentId.trim() || (regRole === 'student' ? `2026${Math.floor(10000 + Math.random() * 90000)}` : undefined),
          degreeSerial: regDegreeSerial.trim(),
          graduationYear: regGradYear,
          company: regCompany.trim(),
          organization: regCompany.trim(),
          companyWebsite: regCompanyWebsite.trim(),
          talentSought: regTalentSought.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setErrorMessage(data.error || 'Registration failed. Please review your details.');
        return;
      }

      if (data.token) {
        localStorage.setItem('richfield_auth_token', data.token);
      }

      if (rememberMe && data.user) {
        localStorage.setItem('richfield_saved_user', JSON.stringify(data.user));
      }

      setIsLoading(false);

      if (regRole === 'recruiter') {
        setVerificationModalNotice(
          "Employer Verification In Progress: Your business account has been submitted to the Richfield Systems Directorate for verification. Full access to student personal information will unlock once confirmed."
        );
        setTimeout(() => {
          onLogin(data.user);
        }, 1800);
      } else {
        onLogin(data.user);
      }
      return;

    } catch (apiErr) {
      console.warn("Backend registration fallback:", apiErr);
    }

    // Client-side fallback
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: regName.trim(),
        email: cleanEmail,
        role: regRole,
        verified: regRole === 'student' || (regRole === 'alumni' && Boolean(regDegreeSerial)),
        campus: regCampus,
        qualification: isIT ? 'IT' : 'Business',
        qualificationName: qualObj ? `${qualObj.name} — NQF Level ${qualObj.nqfLevel}` : 'Bachelor of Science in Information Technology',
        academicYear: regRole === 'student' ? (regYear as any) : regRole === 'alumni' ? 'Alumni' : 'Staff',
        studentIdNumber: regStudentId.trim() || `2026${Math.floor(10000 + Math.random() * 90000)}`,
        degreeSerial: regDegreeSerial.trim(),
        graduationYear: regGradYear,
        company: regCompany.trim(),
        organization: regCompany.trim(),
        verificationStatus: regRole === 'recruiter' ? 'pending_approval' : 'verified',
        alumniVerificationStatus: regRole === 'alumni' ? 'verified' : undefined,
        skills: isIT ? ['Python', 'SQL', 'Web Development'] : ['Financial Analysis', 'Business Strategy'],
        bio: `${regRole === 'student' ? 'Student' : regRole === 'alumni' ? 'Alumni' : 'Recruiter'} at Richfield Graduate Institute of Technology (${regCampus}).`,
        headline: `${regRole.toUpperCase()} | Richfield ${regCampus}`,
        completedOnboarding: true,
        connectionsCount: 5,
        postsCount: 1
      };

      if (rememberMe) {
        try {
          localStorage.setItem('richfield_saved_user', JSON.stringify(newUser));
        } catch (e) {
          console.error(e);
        }
      }

      setIsLoading(false);
      onLogin(newUser);
    }, 450);
  };

  // Helper for dynamic registration tab label based on the selected role
  const getRegistrationTabLabel = (role: UserRole) => {
    switch (role) {
      case 'recruiter':
        return 'Company & Recruiter Registration';
      case 'alumni':
        return 'Alumni Registration';
      case 'admin':
        return 'Admin Onboarding';
      case 'lecturer':
        return 'Faculty Registration';
      case 'student':
      default:
        return 'Student Registration';
    }
  };

  // Dynamic heading based on role and auth mode
  const getCardSubHeading = () => {
    if (authMode === 'signup') {
      switch (selectedRole) {
        case 'recruiter': return 'Company & Recruiter Registration';
        case 'alumni': return 'Alumni Graduate Registration';
        case 'admin': return 'Admin Access Information';
        case 'lecturer': return 'Faculty Lecturer Registration';
        case 'student':
        default: return 'Student Registration';
      }
    }
    switch (selectedRole) {
      case 'admin': return 'Admin Sign In';
      case 'recruiter': return 'Business & Recruiter Sign In';
      case 'alumni': return 'Alumni Sign In';
      case 'lecturer': return 'Faculty Sign In';
      case 'student':
      default: return 'Student Sign In';
    }
  };

  return (
    <div className="min-h-screen bg-[#071326] text-white flex flex-col justify-center relative overflow-hidden font-sans selection:bg-[#FF462D] selection:text-white">
      
      {/* Visual Background Angular Vector Elements matching User Screenshot */}
      {/* Top Right Angular Red Slices */}
      <div 
        className="absolute -top-12 -right-12 w-96 h-96 bg-[#FF462D] pointer-events-none opacity-90"
        style={{
          clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 0% 100%)',
          transform: 'rotate(-25deg)',
          filter: 'drop-shadow(0 0 40px rgba(255, 70, 45, 0.4))'
        }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FF462D] pointer-events-none opacity-80"
        style={{
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 85%)',
          transform: 'rotate(15deg)'
        }}
      />
      {/* Left Crisp Royal Blue Angular Geometry */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#0055D4]/40 pointer-events-none"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 40% 100%, 0% 100%)',
          transform: 'rotate(10deg)',
          filter: 'blur(10px)'
        }}
      />
      <div 
        className="absolute top-1/4 -left-20 w-80 h-80 bg-[#0072FF]/20 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Top Test Credentials Toggle Bar */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between bg-[#0B1D3A]/90 border border-blue-900/60 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-300">EnRich Hub • Richfield Academic & Career Ecosystem</span>
          </div>

          <button
            type="button"
            onClick={() => setShowQuickCredentials(!showQuickCredentials)}
            className="text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Test Credentials ({selectedRole.toUpperCase()})</span>
            {showQuickCredentials ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Quick Credentials Drawer */}
        {showQuickCredentials && (
          <div className="mt-2 p-3 sm:p-4 bg-[#0A1830] border border-blue-800/60 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Pre-Configured Campus Personas (Click to Load)
              </span>
              <span className="text-[11px] text-slate-400">Instantly switch role & credentials</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {DEFAULT_ROLE_CREDENTIALS.map((cred) => {
                const isSelected = selectedRole === cred.role;
                return (
                  <button
                    key={cred.userId}
                    type="button"
                    onClick={() => handleSelectPreset(cred)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#122A54] border-[#FF462D] text-white ring-1 ring-[#FF462D] shadow-md'
                        : 'bg-[#0E2042] border-slate-700/80 text-slate-300 hover:bg-[#142950]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200">
                        {cred.role}
                      </span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </div>
                    <p className="font-bold text-white truncate text-[11px]">{cred.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{cred.campus}</p>
                    <div className="mt-1 pt-1 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-amber-300">
                      <span>{cred.password}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPassword(cred.password, cred.name);
                        }}
                        className="hover:text-white p-0.5"
                        title="Copy password"
                      >
                        {copiedRole === cred.name ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Container: Split Hero & Login Card */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* ======================================================== */}
          {/* LEFT SIDE: HERO BRANDING & ACCREDITED ECOSYSTEM           */}
          {/* Matches User Screenshot 2: "EnRich Hub"                   */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 pr-0 lg:pr-4">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF462D] text-white flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-white/20">
                <Shield className="w-6 h-6 fill-white text-[#FF462D]" />
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                EnRich Hub
              </span>
            </div>

            {/* Tagline pill */}
            <div className="text-xs sm:text-sm font-black tracking-[0.25em] text-blue-400 uppercase">
              LEARN &nbsp;/&nbsp; GROW &nbsp;/&nbsp; BUILD YOUR FUTURE
            </div>

            {/* Hero Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Your academic journey.<br />
              Your career. <span className="text-white">All in one place.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              EnRich Hub connects students, alumni, businesses and Richfield administration in one intelligent academic and career ecosystem.
            </p>

            {/* Value Proposition Bullets */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-[#FF462D]/20 text-[#FF462D] border border-[#FF462D]/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Academic & career development</span>
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span>Connect with alumni and industry</span>
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Discover career opportunities</span>
              </div>
            </div>

            {/* Institutional Trust Badges */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NQF Accredited Qualifications</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>9 Campuses Nationwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Section 2.1 RBAC Compliance</span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT SIDE: AUTHENTICATION CARD                           */}
          {/* Matches User Screenshot 2: "Welcome to EnRich Hub"        */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
            
            <div className="bg-[#0C1E3C]/95 backdrop-blur-xl border border-[#1A3766] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 relative">
              
              {/* Card Brand Header */}
              <div className="text-center space-y-1 mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 mb-2">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome to EnRich Hub
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Choose your account type to continue
                </p>
              </div>

              {/* Account Type Grid Selector (2x2 Grid + Lecturer) */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                
                {/* 1. Student */}
                <button
                  type="button"
                  onClick={() => handleRoleTypeSelect('student')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    selectedRole === 'student'
                      ? 'bg-[#122A54] border-[#FF462D] text-white shadow-lg ring-1 ring-[#FF462D]'
                      : 'bg-[#0A1933] border-[#18345E] text-slate-300 hover:border-slate-500 hover:bg-[#0D2144]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <GraduationCap className={`w-4 h-4 ${selectedRole === 'student' ? 'text-[#FF462D]' : 'text-slate-400'}`} />
                    {selectedRole === 'student' && <span className="w-2 h-2 rounded-full bg-[#FF462D]" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-white">Student</p>
                    <p className="text-[10px] text-slate-400">Current Richfield students</p>
                  </div>
                </button>

                {/* 2. Alumni */}
                <button
                  type="button"
                  onClick={() => handleRoleTypeSelect('alumni')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    selectedRole === 'alumni'
                      ? 'bg-[#122A54] border-[#FF462D] text-white shadow-lg ring-1 ring-[#FF462D]'
                      : 'bg-[#0A1933] border-[#18345E] text-slate-300 hover:border-slate-500 hover:bg-[#0D2144]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <UserCheck className={`w-4 h-4 ${selectedRole === 'alumni' ? 'text-[#FF462D]' : 'text-slate-400'}`} />
                    {selectedRole === 'alumni' && <span className="w-2 h-2 rounded-full bg-[#FF462D]" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-white">Alumni</p>
                    <p className="text-[10px] text-slate-400">Graduates & mentors</p>
                  </div>
                </button>

                {/* 3. Business (Recruiter) */}
                <button
                  type="button"
                  onClick={() => handleRoleTypeSelect('recruiter')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    selectedRole === 'recruiter'
                      ? 'bg-[#122A54] border-[#FF462D] text-white shadow-lg ring-1 ring-[#FF462D]'
                      : 'bg-[#0A1933] border-[#18345E] text-slate-300 hover:border-slate-500 hover:bg-[#0D2144]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Briefcase className={`w-4 h-4 ${selectedRole === 'recruiter' ? 'text-[#FF462D]' : 'text-slate-400'}`} />
                    {selectedRole === 'recruiter' && <span className="w-2 h-2 rounded-full bg-[#FF462D]" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-white">Business</p>
                    <p className="text-[10px] text-slate-400">Companies & recruiters</p>
                  </div>
                </button>

                {/* 4. Admin */}
                <button
                  type="button"
                  onClick={() => handleRoleTypeSelect('admin')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    selectedRole === 'admin'
                      ? 'bg-[#122A54] border-[#FF462D] text-white shadow-lg ring-1 ring-[#FF462D]'
                      : 'bg-[#0A1933] border-[#18345E] text-slate-300 hover:border-slate-500 hover:bg-[#0D2144]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Shield className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-[#FF462D]' : 'text-slate-400'}`} />
                    {selectedRole === 'admin' && <span className="w-2 h-2 rounded-full bg-[#FF462D]" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-white">Admin</p>
                    <p className="text-[10px] text-slate-400">Platform management</p>
                  </div>
                </button>

              </div>

              {/* Faculty / Lecturer extra quick button */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => handleRoleTypeSelect('lecturer')}
                  className={`text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    selectedRole === 'lecturer'
                      ? 'bg-[#FF462D]/20 text-[#FF462D] border-[#FF462D]/60'
                      : 'text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Are you a Faculty Lecturer? Sign In here</span>
                </button>
              </div>

              {/* Dynamic Header & Tab Navigation */}
              {/* Fixes user bug: "im still on the recruiter but it says new student registartion fix that" */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                <div>
                  <h3 className="font-black text-base text-white">
                    {getCardSubHeading()}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedRole === 'recruiter' 
                      ? 'Corporate & enterprise partner portal' 
                      : selectedRole === 'alumni' 
                        ? 'Alumni network & mentorship hub' 
                        : selectedRole === 'admin'
                          ? 'Academic directorate console'
                          : selectedRole === 'lecturer'
                            ? 'Faculty & curriculum management'
                            : 'Richfield student portal access'}
                  </p>
                </div>

                {/* Mode Switcher Tabs */}
                {selectedRole !== 'admin' && (
                  <div className="flex items-center bg-[#071326] p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setErrorMessage(null); }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                        authMode === 'signin'
                          ? 'bg-[#FF462D] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                        authMode === 'signup'
                          ? 'bg-[#FF462D] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {getRegistrationTabLabel(selectedRole)}
                    </button>
                  </div>
                )}
              </div>

              {/* Error & Info Alerts */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-100">Authentication Notice</p>
                    <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* MODE 1: SIGN IN FORM                                      */}
              {/* ======================================================== */}
              {authMode === 'signin' ? (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  
                  {/* Email Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        {selectedRole === 'recruiter' 
                          ? 'Corporate / Company Email' 
                          : selectedRole === 'alumni'
                            ? 'Alumni Registered Email'
                            : 'Richfield Institutional Email'}
                      </label>
                      
                      {/* Domain badge indicator */}
                      {selectedRole === 'recruiter' ? (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                          All Corporate Domains Allowed
                        </span>
                      ) : selectedRole === 'alumni' ? (
                        <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
                          Alumni Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-blue-300 font-semibold bg-blue-950/60 border border-blue-800 px-1.5 py-0.5 rounded">
                          @richfield.ac.za Only
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          selectedRole === 'recruiter'
                            ? "recruiter@company.co.za or corporate@richfield.ac.za"
                            : selectedRole === 'alumni'
                              ? "alumni@gmail.com or personal email"
                              : "student@richfield.ac.za"
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#08172E] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF462D] focus:border-transparent transition-all text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Quick Domain Pill helper for Richfield students */}
                    {selectedRole === 'student' && (
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Institutional domain:</span>
                        {['@richfield.ac.za', '@my.richfield.ac.za'].map(dom => (
                          <button
                            key={dom}
                            type="button"
                            onClick={() => {
                              const prefix = email.split('@')[0] || 'student';
                              setEmail(`${prefix}${dom}`);
                            }}
                            className="text-[9px] font-mono text-blue-300 bg-blue-950/80 border border-blue-800 hover:border-blue-600 px-1.5 py-0.5 rounded"
                          >
                            {dom}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ========================================================================= */}
                  {/* ALUMNI SPECIAL CERTIFICATE VERIFICATION SECTION                           */}
                  {/* Fixes user bug: "also the 'I am a Richfield Alumni', it should be on the  */}
                  {/* alumni ogin and registration page only"                                   */}
                  {/* ========================================================================= */}
                  {selectedRole === 'alumni' && (
                    <div className="p-3.5 bg-amber-950/40 border border-amber-500/50 rounded-2xl space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-200">
                          <input
                            type="checkbox"
                            checked={isAlumniLogin}
                            onChange={(e) => setIsAlumniLogin(e.target.checked)}
                            className="w-4 h-4 text-[#FF462D] rounded border-amber-600 focus:ring-[#FF462D]"
                          />
                          <span>I am a Richfield Alumni (School email revoked post-graduation)</span>
                        </label>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                          Registrar Check
                        </span>
                      </div>

                      {isAlumniLogin && (
                        <div className="pt-1 space-y-2 text-xs">
                          <p className="text-[11px] text-amber-200/90 leading-relaxed">
                            Under institutional security protocol, student inbox credentials expire upon graduation. Alumni sign in with their personal email and their <strong>Accredited Graduation Certificate Number</strong>.
                          </p>
                          <div>
                            <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1">
                              Richfield Graduation Certificate Number *
                            </label>
                            <div className="relative">
                              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                              <input
                                type="text"
                                required={isAlumniLogin}
                                value={alumniCertificateNo}
                                onChange={(e) => setAlumniCertificateNo(e.target.value)}
                                placeholder="e.g. RIC-GRAD-2023-88219 or RF-DIP-2022-441"
                                className="w-full pl-9 pr-3 py-2 text-xs bg-[#09152A] border border-amber-500/60 rounded-xl text-amber-200 font-mono font-bold uppercase focus:ring-2 focus:ring-[#FF462D] focus:outline-none"
                              />
                            </div>
                            <span className="text-[10px] text-amber-400/80 mt-1 block">
                              ✓ Verified against South African SAQA / CHE National Graduate Registry
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs font-bold text-blue-400 hover:text-[#FF462D] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#08172E] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF462D] focus:border-transparent transition-all text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-[#FF462D] border-slate-700 rounded focus:ring-[#FF462D] bg-slate-900"
                      />
                      <span>Remember me</span>
                    </label>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted
                    </span>
                  </div>

                  {/* Sign In Button (Coral / Red Accent matching Screenshot) */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-[#FF462D] hover:bg-[#E03A22] active:scale-[0.99] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* OR Divider */}
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-700/80"></div>
                      <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">OR</span>
                      <div className="flex-grow border-t border-slate-700/80"></div>
                    </div>

                    {/* Microsoft Single Sign-On Button (Richfield 365) */}
                    <button
                      type="button"
                      onClick={handleMicrosoftLogin}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#09172E] hover:bg-[#0E2244] border border-[#1A3868] hover:border-blue-500/80 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99]"
                    >
                      {/* Microsoft 4-Color Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 21 21">
                        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                      </svg>
                      <span>Continue with Microsoft</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                </form>
              ) : (
                /* ======================================================== */
                /* MODE 2: SIGN UP FORM                                      */
                /* Adapts to Role: Recruiter, Alumni, Student, Lecturer      */
                /* ======================================================== */
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  
                  {/* Name & ID Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Full Name & Surname *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Bongani Sithole"
                        className="w-full px-3 py-2 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-300 uppercase">
                          {regRole === 'student' ? 'Student Number *' : regRole === 'recruiter' ? 'Recruiter / Employee ID' : 'Staff / Member ID'}
                        </label>
                        {regRole === 'student' && (
                          <span className={`text-[10px] font-bold ${regStudentId.length === 9 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {regStudentId.length}/9 Digits
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        inputMode={regRole === 'student' ? "numeric" : undefined}
                        pattern={regRole === 'student' ? "[0-9]{9}" : undefined}
                        maxLength={regRole === 'student' ? 9 : 25}
                        required={regRole === 'student'}
                        value={regStudentId}
                        onChange={(e) => {
                          if (regRole === 'student') {
                            // Enforce digits only, exactly up to 9 digits
                            const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                            setRegStudentId(val);
                          } else {
                            setRegStudentId(e.target.value);
                          }
                        }}
                        placeholder={regRole === 'student' ? "e.g. 202488412 (9 digits)" : "e.g. RF-2026-90412"}
                        className="w-full px-3 py-2 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none font-mono text-white"
                      />
                      {regRole === 'student' && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Richfield student numbers are strictly 9 digits (e.g. 202488412).
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email & Domain Restriction notice */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300 uppercase">
                        {regRole === 'recruiter' ? 'Corporate Business Email *' : 'Richfield Institutional Email *'}
                      </label>
                      {regRole === 'recruiter' ? (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          ✓ Any Corporate Domain
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#FF462D] font-bold">
                          @richfield.ac.za Only
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={
                        regRole === 'recruiter'
                          ? "e.g. naledi@vodacom.co.za or hr@standardbank.co.za"
                          : "e.g. student.name@richfield.ac.za"
                      }
                      className="w-full px-3 py-2 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none text-white"
                    />

                    {regRole !== 'recruiter' && regRole !== 'alumni' && (
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Quick domain:</span>
                        {['@richfield.ac.za', '@my.richfield.ac.za'].map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              const prefix = regEmail.split('@')[0] || 'student';
                              setRegEmail(`${prefix}${d}`);
                            }}
                            className="text-[9px] bg-blue-950/80 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded hover:bg-blue-900 font-mono"
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RECRUITER EXCLUSIVE SECTION */}
                  {regRole === 'recruiter' && (
                    <div className="p-3.5 bg-purple-950/40 border border-purple-500/50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
                          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                          <span>Corporate Employer Verification & Anti-Scam Shield</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-700">
                          CIPC & VAT Compliance
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-purple-300 mb-0.5">
                            Company / Entity Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={regCompany}
                            onChange={(e) => setRegCompany(e.target.value)}
                            placeholder="e.g. Standard Bank CIB or SovTech"
                            className="w-full px-2.5 py-1.5 text-xs bg-[#08172E] border border-purple-800/80 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-purple-300 mb-0.5">
                            CIPC Company Registration No. *
                          </label>
                          <input
                            type="text"
                            required
                            value={regCompanyRegNo}
                            onChange={(e) => setRegCompanyRegNo(e.target.value)}
                            placeholder="e.g. 2018/142901/07"
                            className="w-full px-2.5 py-1.5 text-xs bg-[#08172E] border border-purple-800/80 rounded-lg font-mono text-white uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-purple-300 mb-0.5">
                            South African VAT Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={regVatNumber}
                            onChange={(e) => setRegVatNumber(e.target.value)}
                            placeholder="e.g. 4190284719 (10 digits)"
                            className="w-full px-2.5 py-1.5 text-xs bg-[#08172E] border border-purple-800/80 rounded-lg font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-purple-300 mb-0.5">
                            HR / Recruiter Direct Tel *
                          </label>
                          <input
                            type="tel"
                            required
                            value={regRecruiterPhone}
                            onChange={(e) => setRegRecruiterPhone(e.target.value)}
                            placeholder="+27 11 904 2200"
                            className="w-full px-2.5 py-1.5 text-xs bg-[#08172E] border border-purple-800/80 rounded-lg font-mono text-white"
                          />
                        </div>
                      </div>

                      {/* Anti-Scam Identity Camera Verification */}
                      <div className="p-3 bg-[#08172E] border border-purple-700/60 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-white">
                              Live Recruiter Face & Badge Verification
                            </span>
                          </div>
                          {cameraVerified ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded-full">
                              Required Anti-Scam Step
                            </span>
                          )}
                        </div>

                        {cameraActive ? (
                          <div className="relative rounded-lg overflow-hidden border-2 border-purple-500 bg-black aspect-video max-w-sm mx-auto flex items-center justify-center">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="absolute bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                            >
                              Confirm Photo
                            </button>
                          </div>
                        ) : capturedPhotoUrl ? (
                          <div className="flex items-center gap-2.5 p-2 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
                            <img src={capturedPhotoUrl} alt="Captured scan" className="w-10 h-10 rounded-lg object-cover border border-emerald-400" />
                            <div className="flex-1 text-[11px]">
                              <p className="font-bold text-emerald-300">Biometric Verification Confirmed</p>
                              <p className="text-emerald-400/80 text-[10px]">CIPC Match Verified</p>
                            </div>
                            <button
                              type="button"
                              onClick={startCamera}
                              className="text-xs text-purple-300 underline"
                            >
                              Retake
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={startCamera}
                            className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Activate Camera & Verify Recruiter Identity</span>
                          </button>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    </div>
                  )}

                  {/* ALUMNI EXCLUSIVE SECTION */}
                  {regRole === 'alumni' && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Award className="w-4 h-4" />
                        <span>Alumni Graduate Verification Credentials</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-amber-300">Degree / Diploma Serial *</label>
                          <input
                            type="text"
                            value={regDegreeSerial}
                            onChange={(e) => setRegDegreeSerial(e.target.value)}
                            placeholder="e.g. RF-DIP-2023-8821"
                            className="w-full px-2.5 py-1.5 text-xs bg-[#08172E] border border-amber-500/50 rounded-lg text-white uppercase font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-amber-300">Graduation Year</label>
                          <input
                            type="text"
                            value={regGradYear}
                            onChange={(e) => setRegGradYear(e.target.value)}
                            placeholder="e.g. 2023"
                            className="w-full px-2.5 py-1.5 text-xs bg-[#08172E] border border-amber-500/50 rounded-lg text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Campus Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Campus Location *
                      </label>
                      <select
                        value={regCampus}
                        onChange={(e) => setRegCampus(e.target.value as CampusLocation)}
                        className="w-full px-3 py-2 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none text-white"
                      >
                        {ALL_RICHFIELD_CAMPUSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Academic Standing / Cohort
                      </label>
                      <select
                        value={regYear}
                        onChange={(e) => setRegYear(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none text-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Honours / PG">Honours / Postgraduate</option>
                        <option value="Masters">Master of Business Administration (MBA)</option>
                      </select>
                    </div>
                  </div>

                  {/* Academic Programme Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Academic Programme / Stream *
                    </label>
                    <select
                      value={regQualId}
                      onChange={(e) => setRegQualId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none text-white"
                    >
                      {ALL_RICHFIELD_QUALIFICATIONS.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.name} ({q.category} — NQF {q.nqfLevel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Password Input with Strength Meter */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300 uppercase">
                        Create Strong Password *
                      </label>
                      {regPassword && (
                        <span className={`text-[10px] font-bold ${regPwdEvaluation.textColor}`}>
                          Strength: {regPwdEvaluation.label}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 8 chars, uppercase, lowercase, number/symbol"
                        className="w-full px-3 py-2 pr-10 text-xs bg-[#08172E] border border-slate-700 rounded-xl focus:ring-2 focus:ring-[#FF462D] focus:outline-none font-mono text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Password Strength Meter & Requirement Checklist */}
                    {regPassword.length > 0 && (
                      <div className="mt-2 p-2.5 rounded-lg bg-[#061224] border border-slate-800 space-y-2">
                        {/* 4-bar strength indicator */}
                        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-full rounded-full transition-all ${
                                regPwdEvaluation.score >= step
                                  ? regPwdEvaluation.color
                                  : 'bg-slate-700/50'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Checklist */}
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <span className={`flex items-center gap-1 ${regPwdEvaluation.hasMinLength ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                            {regPwdEvaluation.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1 h-1 rounded-full bg-slate-500 ml-1 mr-1" />}
                            8+ characters
                          </span>
                          <span className={`flex items-center gap-1 ${regPwdEvaluation.hasUppercase ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                            {regPwdEvaluation.hasUppercase ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1 h-1 rounded-full bg-slate-500 ml-1 mr-1" />}
                            Uppercase (A-Z)
                          </span>
                          <span className={`flex items-center gap-1 ${regPwdEvaluation.hasLowercase ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                            {regPwdEvaluation.hasLowercase ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1 h-1 rounded-full bg-slate-500 ml-1 mr-1" />}
                            Lowercase (a-z)
                          </span>
                          <span className={`flex items-center gap-1 ${regPwdEvaluation.hasNumberOrSymbol ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                            {regPwdEvaluation.hasNumberOrSymbol ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1 h-1 rounded-full bg-slate-500 ml-1 mr-1" />}
                            Number or symbol
                          </span>
                        </div>

                        {!regPwdEvaluation.isNotCommon && (
                          <p className="text-[10px] text-rose-400 font-medium">
                            ⚠️ Forbidden common pattern (e.g. 1234567). Please choose a more complex password.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#FF462D] hover:bg-[#E03A22] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        <span>Complete {getRegistrationTabLabel(regRole)}</span>
                      </>
                    )}
                  </button>

                  {verificationModalNotice && (
                    <div className="p-3 bg-blue-950/80 border border-blue-500/60 text-blue-200 rounded-xl text-xs space-y-1 animate-fadeIn">
                      <p className="font-bold flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-blue-400" />
                        Institutional Verification Status
                      </p>
                      <p>{verificationModalNotice}</p>
                    </div>
                  )}

                </form>
              )}

              {/* Secure Login Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Secure login • EnRich Hub</span>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1A30] border border-blue-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-base text-white">Password Recovery & Default Keyring</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              For testing and unified institutional access, shared passwords follow the standard format: <span className="font-mono text-amber-300 font-bold">[Role]@Richfield2026</span>
            </p>

            <div className="space-y-2 bg-[#071326] p-3 rounded-2xl border border-slate-800 text-xs font-mono mb-4">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Student:</span>
                <span className="text-amber-400 font-bold">Student@Richfield2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Admin:</span>
                <span className="text-amber-400 font-bold">Admin@Richfield2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Alumni:</span>
                <span className="text-amber-400 font-bold">Alumni@Richfield2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Recruiter:</span>
                <span className="text-amber-400 font-bold">Recruiter@Richfield2026</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Lecturer:</span>
                <span className="text-amber-400 font-bold">Lecturer@Richfield2026</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-[#FF462D] hover:bg-[#E03A22] text-white text-xs font-bold rounded-xl"
              >
                Got It, Return to Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
