import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'faq'>('onboarding');
  
  // Onboarding conversational state
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onboardingName, setOnboardingName] = useState(currentUser.name);
  const [onboardingRole, setOnboardingRole] = useState(currentUser.role);
  const [onboardingYear, setOnboardingYear] = useState(currentUser.academicYear || '3rd Year');
  const [onboardingQualification, setOnboardingQualification] = useState(currentUser.qualification);
  const [onboardingCampus, setOnboardingCampus] = useState(currentUser.campus);
  const [onboardingSkills, setOnboardingSkills] = useState(currentUser.skills.join(', '));
  const [onboardingBio, setOnboardingBio] = useState(currentUser.bio);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(currentUser.completedOnboarding);

  // FAQ Chat Copilot state
  const [faqMessages, setFaqMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am your **Richfield AI Campus Copilot**.\n\nI can answer questions regarding **Inter-Campus Library Transfers**, **National Exam Runways**, **Bursaries & Internships**, **Anti-Bullying Policies**, or **Mentorship Rules**. How can I assist you today?`,
      timestamp: 'Just now'
    }
  ]);
  const [faqInput, setFaqInput] = useState('');
  const [isFaqLoading, setIsFaqLoading] = useState(false);

  if (!isOpen) return null;

  const quickFaqPrompts = [
    "How does inter-campus book transfer work from Durban to Newtown Campus?",
    "When is the next National Exam Runway for DSA201?",
    "What bursaries are available for IT students with >65% aggregate?",
    "Can 1st year students become mentors?",
    "What qualifications are offered at Richfield across Degrees, Diplomas & Higher Certificates?"
  ];

  const handleSendFaq = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setFaqMessages(prev => [...prev, userMsg]);
    setFaqInput('');
    setIsFaqLoading(true);

    try {
      const response = await fetch('/api/ai/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          userContext: {
            role: currentUser.role,
            academicYear: currentUser.academicYear,
            qualification: currentUser.qualification,
            campus: currentUser.campus
          }
        })
      });

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "I'm ready to answer any questions about Richfield Graduate Institute programs and campus facilities.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setFaqMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "The Richfield AI Copilot is currently operating in offline mode. Please consult your student handbook or try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setFaqMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsFaqLoading(false);
    }
  };

  const handleSaveOnboarding = async () => {
    setIsSynthesizing(true);
    
    // Call server AI onboarding synthesis
    try {
      const skillsArray = onboardingSkills.split(',').map(s => s.trim()).filter(Boolean);
      
      const response = await fetch('/api/ai/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 5,
          userAnswers: {
            name: onboardingName,
            role: onboardingRole,
            academicYear: onboardingYear,
            qualification: onboardingQualification,
            campus: onboardingCampus,
            skills: skillsArray,
            bio: onboardingBio
          }
        })
      });

      const data = await response.json();

      onUpdateProfile({
        name: onboardingName,
        role: onboardingRole,
        academicYear: onboardingYear,
        qualification: onboardingQualification,
        campus: onboardingCampus,
        skills: skillsArray,
        bio: data.suggestedBio || onboardingBio,
        headline: data.suggestedHeadline || `${onboardingYear} ${onboardingQualification} Student @ Richfield`,
        completedOnboarding: true
      });

      setOnboardingComplete(true);
    } catch (err) {
      onUpdateProfile({
        name: onboardingName,
        role: onboardingRole,
        academicYear: onboardingYear,
        qualification: onboardingQualification,
        campus: onboardingCampus,
        completedOnboarding: true
      });
      setOnboardingComplete(true);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        
        {/* Header matching Screenshot #5 */}
        <div className="bg-gradient-to-r from-[#002B66] via-blue-900 to-orange-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-300 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">Richfield AI Assistant</h2>
              <p className="text-xs text-blue-100">AI Profile Onboarding & Campus Services Copilot</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all ${
              activeTab === 'onboarding'
                ? 'border-orange-500 text-orange-800 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ✨ AI Profile Onboarding
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all ${
              activeTab === 'faq'
                ? 'border-[#002B66] text-[#002B66] bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            💬 Campus FAQ & Guidance
          </button>
        </div>

        {/* TAB 1: AI ONBOARDING STEPPER */}
        {activeTab === 'onboarding' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            
            {onboardingComplete ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">Profile Configured with AI!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your cohort feeds ({onboardingYear} • {onboardingQualification}), campus location ({onboardingCampus}), and mentorship matcher are now active.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => setOnboardingComplete(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Reconfigure Details
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#002B66] rounded-xl shadow hover:bg-blue-900"
                  >
                    Enter RichfieldConnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* AI Assistant Intro Prompt */}
                <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <Bot className="w-6 h-6 text-[#002B66] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-[#002B66] block">AI Step-by-Step Onboarding Engine:</span>
                    <p>
                      Let's tailor your experience! Tell me about your academic status at Richfield Graduate Institute so I can route you to the correct cohort feed and mentorship pool.
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={onboardingName}
                      onChange={(e) => setOnboardingName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Platform Role</label>
                      <select
                        value={onboardingRole}
                        onChange={(e) => setOnboardingRole(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option value="student">Student (Undergraduate)</option>
                        <option value="alumni">Alumni / Mentor</option>
                        <option value="lecturer">Lecturer / Faculty</option>
                        <option value="recruiter">Campus Recruiter / Partner</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
                      <select
                        value={onboardingYear}
                        onChange={(e) => setOnboardingYear(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option value="1st Year">1st Year Student</option>
                        <option value="2nd Year">2nd Year Student</option>
                        <option value="3rd Year">3rd Year (Final Year)</option>
                        <option value="Graduated">Graduated / Alumni</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Qualification Stream</label>
                      <select
                        value={onboardingQualification}
                        onChange={(e) => setOnboardingQualification(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option value="IT">Faculty of IT & Computer Science</option>
                        <option value="Business">Faculty of Business Administration</option>
                        <option value="Both">Both Qualifications</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Primary Campus</label>
                      <select
                        value={onboardingCampus}
                        onChange={(e) => setOnboardingCampus(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option value="Newtown Campus">Newtown Campus</option>
                        <option value="Pretoria Campus">Pretoria Campus</option>
                        <option value="Durban Campus">Durban Campus</option>
                        <option value="Umhlanga Campus">Umhlanga Campus</option>
                        <option value="Cape Town Campus">Cape Town Campus</option>
                        <option value="Polokwane Campus">Polokwane Campus</option>
                        <option value="Sandton Campus">Sandton Campus</option>
                        <option value="Midrand Campus">Midrand Campus</option>
                        <option value="Alberton Campus">Alberton Campus</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Key Technical & Professional Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={onboardingSkills}
                      onChange={(e) => setOnboardingSkills(e.target.value)}
                      placeholder="e.g. React, TypeScript, Java, Spring Boot, Financial Modeling"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      About You / Academic Passions
                    </label>
                    <textarea
                      rows={2}
                      value={onboardingBio}
                      onChange={(e) => setOnboardingBio(e.target.value)}
                      placeholder="Brief description for alumni mentors and peer study groups..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={handleSaveOnboarding}
                    disabled={isSynthesizing}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSynthesizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Profile...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Complete Profile Setup</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: CAMPUS FAQ & COPILOT CHAT */}
        {activeTab === 'faq' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Quick Chips */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Quick Questions:
              </span>
              {quickFaqPrompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendFaq(q)}
                  className="text-[11px] font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {faqMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-xl ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === 'user' ? 'bg-[#002B66] text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs space-y-1 shadow-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#002B66] text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isFaqLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                  <Bot className="w-4 h-4 text-orange-500 animate-bounce" />
                  <span>Richfield AI Copilot is typing...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendFaq(faqInput);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={faqInput}
                  onChange={(e) => setFaqInput(e.target.value)}
                  placeholder="Ask anything about exams, library, bursaries, code reviews..."
                  className="flex-1 bg-slate-100 focus:bg-white text-xs text-slate-900 rounded-xl px-4 py-2.5 border border-slate-200 focus:border-[#002B66] focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={isFaqLoading || !faqInput.trim()}
                  className="px-4 py-2.5 bg-[#002B66] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
