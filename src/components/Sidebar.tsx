import React from 'react';
import { 
  Home, 
  Code, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  LogOut,
  RefreshCw,
  User,
  Gamepad2,
  Heart,
  Megaphone,
  PackageSearch
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

export type NavTab = 
  | 'feed' 
  | 'lostfound'
  | 'study'
  | 'edumatch'
  | 'codehub' 
  | 'network' 
  | 'mentor' 
  | 'messages' 
  | 'jobs' 
  | 'events' 
  | 'library' 
  | 'analytics' 
  | 'admin'
  | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onOpenAIAssistant: () => void;
  onSwitchPerspective: () => void;
  unreadMessagesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAIAssistant,
  onSwitchPerspective,
  unreadMessagesCount = 0
}) => {
  const isRecruiter = currentUser.role === 'recruiter';
  const isLecturer = currentUser.role === 'lecturer';
  const isAdmin = currentUser.role === 'admin';

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; allowedRoles: UserRole[] }[] = [
    { 
      id: 'admin', 
      label: 'Admin Command', 
      icon: ShieldCheck, 
      allowedRoles: ['admin'] 
    },
    { 
      id: 'feed', 
      label: 'Announcements', 
      icon: Megaphone, 
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin', 'recruiter'] 
    },
    { 
      id: 'network', 
      label: isRecruiter ? 'Talent Network' : 'Campus Network', 
      icon: Users, 
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin', 'recruiter'] 
    },
    { 
      id: 'jobs', 
      label: isRecruiter ? 'Talent Hub & Postings' : 'Jobs & Bursaries', 
      icon: Briefcase,
      badge: isRecruiter ? 'Talent' : undefined,
      // Students and Alumni apply; Recruiters manage talent and post jobs. Lecturers do not apply for student jobs.
      allowedRoles: ['student', 'alumni', 'recruiter', 'admin'] 
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin', 'recruiter'] 
    },
    { 
      id: 'profile', 
      label: isRecruiter ? 'Recruiter Profile' : isLecturer ? 'Faculty Profile' : isAdmin ? 'Admin Profile' : 'Digital Portfolio', 
      icon: User, 
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin', 'recruiter'] 
    },
    { 
      id: 'lostfound', 
      label: isAdmin ? 'Lost & Found Desk' : 'Lost & Found', 
      icon: PackageSearch, 
      badge: 'NEW',
      // Campus physical lost and found is for Students, Staff, Lecturers and Campus Admins — NOT external corporate recruiters
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin'] 
    },
    { 
      id: 'events', 
      label: currentUser.qualification === 'Business' ? 'Bootcamps & Events' : 'Events & Runways', 
      icon: Calendar,
      // Campus events and student academic runways are for students, alumni, lecturers, and admins
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin'] 
    },
    { 
      id: 'mentor', 
      label: isLecturer ? 'Mentorship & Cohort' : 'Mentor Hub', 
      icon: GraduationCap, 
      allowedRoles: ['student', 'alumni', 'lecturer', 'admin'] 
    },
    { 
      id: 'library', 
      label: isLecturer ? 'Curriculum & Resources' : 'Library & Exam Prep', 
      icon: BookOpen, 
      allowedRoles: ['student', 'alumni', 'lecturer'] 
    },
    { 
      id: 'codehub', 
      label: 'CodeHub Projects', 
      icon: Code,
      // Student and Alumni coding projects
      allowedRoles: ['student', 'alumni'] 
    },
    { 
      id: 'study', 
      label: 'Study & Wellness', 
      icon: Heart, 
      badge: 'NEW',
      // Student study habit planner & wellness: strictly student and alumni
      allowedRoles: ['student', 'alumni'] 
    },
    { 
      id: 'edumatch', 
      label: 'EduMatch', 
      icon: Gamepad2, 
      badge: 'GAME',
      // Peer study partner games: strictly student
      allowedRoles: ['student'] 
    },
    { 
      id: 'analytics', 
      label: isRecruiter ? 'Recruitment Analytics' : 'Campus Analytics', 
      icon: BarChart3,
      // Institutional macro metrics: Admin, Lecturer, Recruiter
      allowedRoles: ['admin', 'lecturer', 'recruiter'] 
    },
  ];

  // Strictly enforce RBAC visibility
  const visibleNavItems = navItems.filter((item) => {
    return item.allowedRoles.includes(currentUser.role);
  });

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-400 border-r border-slate-800 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3.5 shadow-md select-none">
      
      {/* Top Nav Items */}
      <div className="space-y-1">
        <div className="px-3 py-1 mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>Core Navigation</span>
          <span className="text-[9px] text-red-400 font-semibold lowercase">({currentUser.role})</span>
        </div>

        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#002B66] text-white shadow-md border-l-4 border-[#E31B23]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-red-400'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-[#E31B23] text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Assistant Special Card Trigger */}
        <div className="pt-2">
          <button
            onClick={onOpenAIAssistant}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#001F4D] hover:bg-[#002B66] text-blue-100 border border-red-500/40 transition-all shadow-sm group"
          >
            <Sparkles className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
            <span className="flex-1 text-left">AI Copilot & Assistant</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-[#E31B23] text-white rounded font-semibold uppercase">
              Live
            </span>
          </button>
        </div>

        {/* High Density Mini-Widget tailored to user role */}
        <div className="pt-3">
          {currentUser.role === 'recruiter' ? (
            <div className="p-2.5 bg-slate-800/80 rounded-lg border-l-2 border-emerald-500 mt-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">AI Talent Radar</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-bold">Top 10</span>
              </div>
              <p className="text-xs text-white font-semibold leading-tight">Dean's Honor Roll & Coders</p>
              <p className="text-[10px] text-slate-400">92%+ AI match for IT & BCom</p>
            </div>
          ) : currentUser.role === 'admin' ? (
            <div className="p-2.5 bg-slate-800/80 rounded-lg border-l-2 border-red-500 mt-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Admin Console</span>
                <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded font-bold">Live</span>
              </div>
              <p className="text-xs text-white font-semibold leading-tight">Safety & Content Moderation</p>
              <p className="text-[10px] text-slate-400">Anti-Bullying Guard active</p>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-800/80 rounded-lg border-l-2 border-[#E31B23] mt-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Upcoming Runway</span>
                <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded font-bold">Active</span>
              </div>
              <p className="text-xs text-white font-semibold leading-tight">DSA201 & BUS301 Sprint</p>
              <p className="text-[10px] text-slate-400">AI Exam Prep Available in Library</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Card & AI Moderation Live Status */}
      <div className="pt-3 border-t border-slate-800 space-y-2 mt-4">
        
        {/* Real-time AI Status */}
        <div className="p-2 bg-slate-800/60 rounded-lg text-center border border-slate-800/80">
          <div className="inline-flex items-center text-[10px] font-semibold text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
            AI Moderation Active
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5">Campus Safety & Anti-Bullying Guard</p>
        </div>

        {/* User Card */}
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#002B66] border-2 border-[#E31B23] text-white font-black flex items-center justify-center text-xs shadow-inner shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] uppercase font-bold tracking-wider ${
                  currentUser.role === 'admin' ? 'text-red-400' : 'text-blue-300'
                }`}>
                  {currentUser.role}
                </span>
                <span className="text-[9px] text-slate-400">•</span>
                <span className="text-[9px] text-slate-400 truncate">
                  {currentUser.academicYear || currentUser.qualification}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between text-[10px]">
            <button
              onClick={onSwitchPerspective}
              className="font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-[#E31B23]" />
              Switch RBAC
            </button>
            <span className="text-slate-400">
              {currentUser.campus.split(' ')[0]}
            </span>
          </div>
        </div>

      </div>

    </aside>
  );
};
