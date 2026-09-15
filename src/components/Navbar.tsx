import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  UserCheck, 
  Sparkles, 
  Menu, 
  X, 
  Shield, 
  Briefcase, 
  GraduationCap, 
  ChevronDown,
  LogOut,
  KeyRound,
  BookOpen
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEFAULT_ROLE_CREDENTIALS } from '../mockData';

interface NavbarProps {
  currentUser: UserProfile;
  onSelectRole: (role: UserRole) => void;
  onSelectUser?: (userId: string) => void;
  onOpenAIAssistant: () => void;
  onSearchSelect: (query: string) => void;
  unreadCount: number;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  onSelectUser,
  onOpenAIAssistant,
  onSearchSelect,
  unreadCount,
  onOpenMobileMenu,
  onLogout,
  onOpenProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSelect(searchQuery.trim());
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-[#E31B23] text-white';
      case 'student':
        return 'bg-[#002B66] text-white';
      case 'recruiter':
        return 'bg-purple-700 text-white';
      case 'alumni':
        return 'bg-amber-600 text-white';
      case 'lecturer':
        return 'bg-blue-800 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#002B66] text-white shadow-md border-b-2 border-[#E31B23]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800/60"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#E31B23] text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-2 ring-white/30">
                E
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center">
                  EnrichHub
                </span>
                <span className="text-[9px] sm:text-[10px] text-blue-200 uppercase tracking-widest font-semibold hidden sm:inline">
                  Richfield Student & Career Ecosystem
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cohort feeds, bursaries, library books, mentors..."
                className="w-full bg-[#001D47] border border-blue-700/60 text-white placeholder-blue-300/70 text-xs sm:text-sm rounded-full pl-9 pr-4 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition-all shadow-inner"
              />
            </form>
          </div>

          {/* Right: Quick Role Switcher, AI Assistant & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* View Login Credentials Quick Trigger */}
            <button
              onClick={() => setShowCredentialsModal(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 text-xs font-semibold border border-blue-700/80 transition-colors"
              title="View all Login Credentials and Passwords"
            >
              <KeyRound className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-[11px]">Keyring</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E31B23] hover:bg-red-700 text-white text-xs font-bold shadow-md transition-transform active:scale-95 border border-red-300/40"
              title="Open Richfield AI Assistant (Onboarding & Campus FAQ)"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E31B23] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#002B66]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-[#002B66] text-white flex items-center justify-between border-b border-blue-900">
                    <span className="text-xs font-bold uppercase tracking-wider">Richfield Notifications</span>
                    <span className="text-[10px] bg-[#E31B23] text-white px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    <div className="p-3 hover:bg-blue-50/60 transition-colors cursor-pointer text-xs">
                      <p className="font-bold text-[#002B66]">🔍 Digital Lost & Found: Item Logged</p>
                      <p className="text-slate-600 mt-0.5">Lenovo ThinkPad 65W Charger found at Newtown Campus Lab 302 and logged at Security Desk.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">35 minutes ago</span>
                    </div>
                    <div className="p-3 hover:bg-blue-50/60 transition-colors cursor-pointer text-xs">
                      <p className="font-bold text-[#002B66]">📚 Inter-Campus Book In Transit</p>
                      <p className="text-slate-600 mt-0.5">Your transfer for &apos;Clean Code&apos; is en-route from Pretoria to Newtown Campus.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                    </div>
                    <div className="p-3 hover:bg-blue-50/60 transition-colors cursor-pointer text-xs">
                      <p className="font-bold text-[#002B66]">💼 Vodacom 2026 Bursary Alert</p>
                      <p className="text-slate-600 mt-0.5">New full tuition + stipend bursary posted for 2nd/3rd Year IT & Business.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#001F4D] hover:bg-[#00173B] transition-colors border border-blue-700/60 shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#E31B23] border border-red-300 text-white font-black flex items-center justify-center text-xs shadow-inner">
                  {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-blue-200 font-semibold">
                      {currentUser.role}: {currentUser.academicYear || currentUser.qualification}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed In Account:</p>
                      <p className="text-xs font-black text-[#002B66] mt-0.5 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                  </div>

                  {onOpenProfile && (
                    <div className="p-2 border-b border-slate-100">
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-center bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>View Digital Portfolio & Profile</span>
                      </button>
                    </div>
                  )}
                  
                  <div className="py-1.5 space-y-1">
                    <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Account Role:</p>
                    
                    <button
                      onClick={() => {
                        if (onSelectUser) {
                          onSelectUser('user-themba-billa');
                        } else {
                          onSelectRole('student');
                        }
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.id === 'user-themba-billa' ? 'bg-amber-50 text-amber-900 font-bold border-l-2 border-amber-500' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Themba Billa</span>
                          <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full">Pro ✓</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">Premium Student • 60m Alumni Calls with Tick ✓, AI Syllabus Scanner</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (onSelectUser) {
                          onSelectUser('user-thabiso');
                        } else {
                          onSelectRole('student');
                        }
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.id === 'user-thabiso' ? 'bg-blue-50 text-[#002B66] font-bold border-l-2 border-[#002B66]' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-[#002B66] shrink-0" />
                      <div>
                        <div className="font-bold">Thabiso Khosi (Standard)</div>
                        <div className="text-[10px] text-slate-500 font-normal">3rd Year IT • 20m Alumni Calls, Feeds, CodeHub</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSelectRole('admin'); setShowRoleMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.role === 'admin' ? 'bg-red-50 text-[#E31B23] font-bold border-l-2 border-[#E31B23]' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-[#E31B23] shrink-0" />
                      <div>
                        <div className="font-bold">Admin (Lesiba - Directorate)</div>
                        <div className="text-[10px] text-slate-500 font-normal">AI Moderation Audit, RBAC Verification, Health</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSelectRole('alumni'); setShowRoleMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.role === 'alumni' ? 'bg-blue-50 text-[#002B66] font-bold border-l-2 border-[#002B66]' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <div className="font-bold">Alumni (Mpho Molefe)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Standard Bank Lead BA, Mentorship Sessions</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSelectRole('recruiter'); setShowRoleMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.role === 'recruiter' ? 'bg-blue-50 text-[#002B66] font-bold border-l-2 border-[#002B66]' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-bold">Recruiter (Naledi Sithole)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Vodacom Bursaries, Student Applicant Analytics</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSelectRole('lecturer'); setShowRoleMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.role === 'lecturer' ? 'bg-blue-50 text-[#002B66] font-bold border-l-2 border-[#002B66]' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-blue-800 shrink-0" />
                      <div>
                        <div className="font-bold">Lecturer (Dr. Sipho Mthembu)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Faculty Head - AI Systems, Exam Runways</div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                    <button
                      onClick={() => { setShowRoleMenu(false); setShowCredentialsModal(true); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4 text-yellow-600" />
                      <span>View Passwords & Credentials</span>
                    </button>

                    <button
                      onClick={() => { setShowRoleMenu(false); onLogout(); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out / Switch User</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Shared Credentials Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-yellow-400" />
                <h3 className="font-black text-base text-white">Official Access Credentials</h3>
              </div>
              <button 
                onClick={() => setShowCredentialsModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 mb-4">
              Here are the shared passwords for all institutional roles across RichfieldConnect:
            </p>

            <div className="space-y-2.5">
              {DEFAULT_ROLE_CREDENTIALS.map((cred) => (
                <div key={cred.userId || cred.email} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getRoleBadgeColor(cred.role)}`}>
                      {cred.role} ({cred.label})
                    </span>
                    <span className="text-[11px] text-slate-400">{cred.name}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-300 pt-1">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-blue-300">{cred.email}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-200">
                    <span className="text-slate-400">Password:</span>
                    <span className="text-yellow-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      {cred.password}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => { setShowCredentialsModal(false); onLogout(); }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Go to Sign In Screen</span>
              </button>
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="px-4 py-2 bg-[#002B66] hover:bg-blue-800 text-white text-xs font-bold rounded-xl"
              >
                Close Keyring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
