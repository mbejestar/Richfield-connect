import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  ShieldCheck, 
  Building2, 
  Activity,
  ArrowUpRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Calendar,
  AlertCircle,
  Video,
  Code,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface AnalyticsViewProps {
  currentUser: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentUser }) => {
  const canAccessAdmin = currentUser.role === 'admin';
  const canAccessBusiness = currentUser.role === 'admin' || currentUser.role === 'recruiter';

  const [activeDashboard, setActiveDashboard] = useState<'personal' | 'business' | 'admin'>(() => {
    if (currentUser.role === 'admin') return 'admin';
    if (currentUser.role === 'recruiter') return 'business';
    return 'personal';
  });

  // Automatically reset dashboard if currentUser role changes
  useEffect(() => {
    if (activeDashboard === 'admin' && !canAccessAdmin) {
      setActiveDashboard('personal');
    } else if (activeDashboard === 'business' && !canAccessBusiness) {
      setActiveDashboard('personal');
    }
  }, [currentUser.role, canAccessAdmin, canAccessBusiness, activeDashboard]);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const resolvedDashboard = 
    activeDashboard === 'admin' && !canAccessAdmin ? 'personal' :
    activeDashboard === 'business' && !canAccessBusiness ? 'personal' :
    activeDashboard;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-4 border-[#002B66]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#002B66]" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Institutional Intelligence & Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Section 2.7: Role-tailored telemetry, conversion funnels, and demographic insight engines
          </p>
        </div>

        {/* Dashboard Role Selector */}
        {canAccessBusiness || canAccessAdmin ? (
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
            <button
              onClick={() => setActiveDashboard('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                resolvedDashboard === 'personal'
                  ? 'bg-[#002B66] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </button>

            {canAccessBusiness && (
              <button
                onClick={() => setActiveDashboard('business')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  resolvedDashboard === 'business'
                    ? 'bg-[#002B66] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Business Dashboard</span>
              </button>
            )}

            {canAccessAdmin && (
              <button
                onClick={() => setActiveDashboard('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  resolvedDashboard === 'admin'
                    ? 'bg-[#002B66] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Student Academic Telemetry (POPI-Compliant Private View)</span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* DASHBOARD 1: STUDENT DASHBOARD (Section 2.7)                 */}
      {/* ============================================================ */}
      {resolvedDashboard === 'personal' && (
        <div className="space-y-4">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Profile Views</span>
                <Eye className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">342</p>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +28% this month
              </span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Active Connections</span>
                <Users className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">56</p>
              <span className="text-[10px] font-bold text-indigo-600">
                4 Campuses & 8 Alumni
              </span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Applications Submitted</span>
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">5</p>
              <span className="text-[10px] font-bold text-purple-600">
                2 Shortlisted, 1 Interview
              </span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Skills In Demand Match</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">92%</p>
              <span className="text-[10px] font-bold text-emerald-600">
                High Match for Cloud/IT
              </span>
            </div>
          </div>

          {/* Visualization 1: Profile Views Over Time (SVG Line Graph with Area Gradient) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Profile Views Over Time</h3>
                  <p className="text-[11px] text-slate-500">Recruiter and peer views logged over the past 8 weeks</p>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Weekly Aggregate
                </span>
              </div>

              {/* Line Graph SVG */}
              <div className="h-44 w-full pt-2">
                <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="profileGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#002B66" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#002B66" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Area fill */}
                  <path
                    d="M 0,110 L 50,95 L 100,80 L 150,88 L 200,60 L 250,50 L 300,35 L 350,25 L 400,15 L 400,130 L 0,130 Z"
                    fill="url(#profileGrad)"
                  />

                  {/* Line stroke */}
                  <path
                    d="M 0,110 L 50,95 L 100,80 L 150,88 L 200,60 L 250,50 L 300,35 L 350,25 L 400,15"
                    fill="none"
                    stroke="#002B66"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {[
                    { x: 0, y: 110, val: '14' },
                    { x: 50, y: 95, val: '22' },
                    { x: 100, y: 80, val: '31' },
                    { x: 150, y: 88, val: '28' },
                    { x: 200, y: 60, val: '45' },
                    { x: 250, y: 50, val: '52' },
                    { x: 300, y: 35, val: '68' },
                    { x: 350, y: 25, val: '74' },
                    { x: 400, y: 15, val: '88' },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#E31B23" strokeWidth="2.5" />
                    </g>
                  ))}
                </svg>
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold px-1 pt-1">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span>Week 5</span>
                  <span>Week 6</span>
                  <span>Week 7</span>
                  <span>Current</span>
                </div>
              </div>
            </div>

            {/* Visualization 2: Connection Growth (Interactive Histogram / Bar Chart) */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Connection Growth by Cohort</h3>
                  <p className="text-[11px] text-slate-500">Distribution of your professional network across roles</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  +12 This Week
                </span>
              </div>

              {/* Bar Chart */}
              <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
                {[
                  { label: 'Peers (IT)', count: 28, height: '85%', color: 'bg-[#002B66]' },
                  { label: 'Peers (Biz)', count: 12, height: '42%', color: 'bg-blue-600' },
                  { label: 'Alumni', count: 8, height: '30%', color: 'bg-amber-600' },
                  { label: 'Recruiters', count: 5, height: '22%', color: 'bg-purple-600' },
                  { label: 'Lecturers', count: 3, height: '14%', color: 'bg-red-600' },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-700">{b.count}</span>
                    <div className="w-full bg-slate-100 rounded-t-lg relative h-28 flex items-end overflow-hidden">
                      <div className={`w-full ${b.color} rounded-t-lg transition-all duration-700`} style={{ height: b.height }} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-600 text-center truncate w-full">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2.7: Application Status Tracker for Jobs Applied To */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#002B66]" />
                  <h3 className="font-bold text-sm text-slate-900">Job & Internship Application Tracker</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">5 Active Submissions</span>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { role: 'Vodacom 2026 IT Graduate Scheme', company: 'Vodacom SA', status: 'Shortlisted', progress: 75, color: 'bg-amber-500', note: 'Technical assessment passed • Interview May 4' },
                  { role: 'Junior Full-Stack Engineer', company: 'SovTech Enterprise', status: 'Interview Scheduled', progress: 85, color: 'bg-emerald-500', note: 'Panel interview with Engineering Directorate' },
                  { role: 'FinTech Systems Intern', company: 'Standard Bank Group', status: 'Under Review', progress: 40, color: 'bg-blue-600', note: 'Curriculum & transcript reviewed by recruiter' },
                  { role: 'Cloud Infrastructure Associate', company: 'AWS Partner South Africa', status: 'Application Submitted', progress: 20, color: 'bg-slate-400', note: 'CV sent via RichfieldConnect portal' }
                ].map((app, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{app.role}</h4>
                        <span className="text-[10px] text-slate-500">{app.company}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        app.status === 'Interview Scheduled' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${app.color}`} style={{ width: `${app.progress}%` }} />
                    </div>

                    <p className="text-[10px] text-slate-500 italic flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {app.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2.7: Skills in Demand Based on Current Listings */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900">Skills In Demand on RichfieldConnect</h3>
                </div>
                <span className="text-[10px] bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                  Live Market Analysis
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Derived in real-time from requirements in active corporate recruiter listings across Johannesburg, Durban & Pretoria.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { skill: 'Cloud Architecture (AWS / Azure)', frequency: '88% of IT Listings', pct: 88, color: 'bg-indigo-600', match: true },
                  { skill: 'React Native & Mobile Dev', frequency: '82% of Software Roles', pct: 82, color: 'bg-blue-600', match: true },
                  { skill: 'Python & SQL Analytics', frequency: '76% of FinTech Postings', pct: 76, color: 'bg-emerald-600', match: true },
                  { skill: 'DevOps, Docker & CI/CD', frequency: '68% of Infrastructure Listings', pct: 68, color: 'bg-amber-600', match: false },
                  { skill: 'Financial Modeling (BCom)', frequency: '62% of Business Roles', pct: 62, color: 'bg-purple-600', match: false }
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        {s.skill}
                        {s.match && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            In Your Portfolio
                          </span>
                        )}
                      </span>
                      <span className="text-slate-500 text-[10px]">{s.frequency}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* DASHBOARD 2: BUSINESS / RECRUITER DASHBOARD (Section 2.7)    */}
      {/* ============================================================ */}
      {resolvedDashboard === 'business' && (
        <div className="space-y-4">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Active Vacancies</span>
              <p className="text-2xl font-black text-slate-900">4</p>
              <span className="text-[10px] font-bold text-purple-600">3 Graduate, 1 Internship</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Applicants</span>
              <p className="text-2xl font-black text-purple-900">58</p>
              <span className="text-[10px] font-bold text-emerald-600">100% Richfield Verified</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">View-to-Apply Conversion</span>
              <p className="text-2xl font-black text-emerald-600">18.4%</p>
              <span className="text-[10px] text-slate-500">Above industry standard (11%)</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Shortlisted Candidates</span>
              <p className="text-2xl font-black text-blue-900">12</p>
              <span className="text-[10px] font-bold text-blue-600">Ready for Interview</span>
            </div>
          </div>

          {/* Section 2.7: Applicant Counts Per Listing (Comparative Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Applicant Counts Per Opportunity</h3>
                  <p className="text-[11px] text-slate-500">Live candidate volume across your active and closed listings</p>
                </div>
                <span className="text-[10px] bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                  Live Counts
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Junior Cloud Infrastructure Associate', applicants: 24, views: 128, status: 'Active', fill: '80%', color: 'bg-indigo-600' },
                  { title: 'React Native Mobile Developer', applicants: 18, views: 96, status: 'Active', fill: '60%', color: 'bg-blue-600' },
                  { title: 'FinTech Graduate Analyst Intern', applicants: 11, views: 72, status: 'Active', fill: '40%', color: 'bg-purple-600' },
                  { title: 'Software QA & Test Engineer', applicants: 5, views: 32, status: 'Closed', fill: '20%', color: 'bg-slate-400' },
                ].map((opp, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none">{opp.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">{opp.views} views</span>
                        <span className="text-[#002B66] font-bold">{opp.applicants} candidates</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div className={`h-full rounded-full ${opp.color}`} style={{ width: opp.fill }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2.7: View-to-Apply Conversion Rates & Funnel Progress */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">View-to-Apply Conversion Funnel</h3>
                  <p className="text-[11px] text-slate-500">Student progression from search discovery to submission</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Healthy Funnel
                </span>
              </div>

              {/* Funnel Visual */}
              <div className="space-y-2.5 pt-2">
                {[
                  { step: '1. Opportunity Impressions in Feed', count: 1240, drop: '100%', color: 'bg-slate-700' },
                  { step: '2. Job Detail Page Expanded', count: 480, drop: '38.7% retain', color: 'bg-blue-700' },
                  { step: '3. CV & Portfolio Upload Clicked', count: 112, drop: '23.3% retain', color: 'bg-indigo-700' },
                  { step: '4. Final Application Submitted', count: 58, drop: '51.8% convert', color: 'bg-emerald-600' }
                ].map((f, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800">{f.step}</span>
                      <span className="text-slate-900 font-black">{f.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Conversion step efficiency</span>
                      <span className="font-bold text-indigo-900">{f.drop}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2.7: Candidate Demographics (Doughnut Chart & Qualification Breakdown) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Candidate Demographics by Qualification</h3>
                  <p className="text-[11px] text-slate-500">Richfield qualification backgrounds of your applicant pool</p>
                </div>
              </div>

              {/* Doughnut Visual */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Circle 1: BSc IT (45%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#002B66" strokeWidth="4.5" strokeDasharray="45 55" strokeDashoffset="0" />
                    {/* Circle 2: Diploma in IT (25%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-45" />
                    {/* Circle 3: BCom Informatics (20%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#7c3aed" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-70" />
                    {/* Circle 4: BIT / Honours (10%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e11d48" strokeWidth="4.5" strokeDasharray="10 90" strokeDashoffset="-90" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900">58</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Candidates</span>
                  </div>
                </div>

                <div className="space-y-1.5 w-full text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#002B66]" />
                      BSc in Information Technology
                    </span>
                    <span className="font-bold text-slate-900">45% (26)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      Diploma in Information Technology
                    </span>
                    <span className="font-bold text-slate-900">25% (15)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      BCom in Business Informatics
                    </span>
                    <span className="font-bold text-slate-900">20% (12)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                      BIT / Postgraduate Honours
                    </span>
                    <span className="font-bold text-slate-900">10% (5)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Year Cohort & Skills Breakdown */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Applicant Academic Standing & Skills</h3>
                  <p className="text-[11px] text-slate-500">Readiness level of candidate pipeline</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Final Year Students (3rd Year)</span>
                    <span className="font-bold text-slate-900">55% (32)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[55%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Recent Alumni (Graduated 2024-2025)</span>
                    <span className="font-bold text-slate-900">25% (15)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[25%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Penultimate Year (2nd Year - Internships)</span>
                    <span className="font-bold text-slate-900">20% (11)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[20%] rounded-full" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Top Skills Demonstrated</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React Native', 'AWS Cloud', 'SQL', 'TypeScript', 'Docker', 'RESTful APIs', 'Node.js', 'FinTech Analysis'].map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
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

      {/* ============================================================ */}
      {/* DASHBOARD 3: ADMINISTRATOR DASHBOARD (Section 2.7)           */}
      {/* ============================================================ */}
      {resolvedDashboard === 'admin' && (
        <div className="space-y-4">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Platform Active Users (MAU)</span>
              <p className="text-2xl font-black text-slate-900">2,840</p>
              <span className="text-[10px] font-bold text-emerald-600">↑ 18.2% vs last month</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Content Dispatched</span>
              <p className="text-2xl font-black text-blue-900">4,120</p>
              <span className="text-[10px] font-bold text-blue-600">Posts, Videos, Code Hub</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Flagged Queue Resolution</span>
              <p className="text-2xl font-black text-emerald-600">100%</p>
              <span className="text-[10px] text-slate-500">0 unmoderated violations</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Campus Engagement Rate</span>
              <p className="text-2xl font-black text-purple-900">84.6%</p>
              <span className="text-[10px] font-bold text-purple-600">Across 9 Campuses</span>
            </div>
          </div>

          {/* Section 2.7: Registration Trends & Active Users by Role */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Registration Trends Line Graph */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Platform Registration Trends (6 Months)</h3>
                  <p className="text-[11px] text-slate-500">Cumulative verified user onboarding across Richfield and AAA</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  +420 Nov - Apr
                </span>
              </div>

              {/* Line Chart */}
              <div className="h-44 w-full pt-2">
                <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E31B23" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#E31B23" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                  <path
                    d="M 0,120 L 80,105 L 160,85 L 240,65 L 320,38 L 400,18 L 400,130 L 0,130 Z"
                    fill="url(#regGrad)"
                  />

                  <path
                    d="M 0,120 L 80,105 L 160,85 L 240,65 L 320,38 L 400,18"
                    fill="none"
                    stroke="#E31B23"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {[
                    { x: 0, y: 120, val: '1,420' },
                    { x: 80, y: 105, val: '1,680' },
                    { x: 160, y: 85, val: '1,990' },
                    { x: 240, y: 65, val: '2,240' },
                    { x: 320, y: 38, val: '2,580' },
                    { x: 400, y: 18, val: '2,840' },
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#002B66" strokeWidth="3" />
                  ))}
                </svg>
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold px-1 pt-1">
                  <span>Nov 2025</span>
                  <span>Dec 2025</span>
                  <span>Jan 2026</span>
                  <span>Feb 2026</span>
                  <span>Mar 2026</span>
                  <span>Apr 2026</span>
                </div>
              </div>
            </div>

            {/* Active Users by Role (Doughnut Chart) */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Active Users by Portal Role</h3>
                  <p className="text-[11px] text-slate-500">Demographic composition of the 2,840 active participants</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Students (68%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#002B66" strokeWidth="4.5" strokeDasharray="68 32" strokeDashoffset="0" />
                    {/* Alumni (18%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#d97706" strokeWidth="4.5" strokeDasharray="18 82" strokeDashoffset="-68" />
                    {/* Business / Recruiters (9%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#7c3aed" strokeWidth="4.5" strokeDasharray="9 91" strokeDashoffset="-86" />
                    {/* Faculty / Admins (5%) */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#dc2626" strokeWidth="4.5" strokeDasharray="5 95" strokeDashoffset="-95" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900">2.8k</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Total Users</span>
                  </div>
                </div>

                <div className="space-y-1.5 w-full text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#002B66]" />
                      Current Students (Undergrad/PG)
                    </span>
                    <span className="font-bold text-slate-900">68% (1,931)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      Verified Alumni Mentors
                    </span>
                    <span className="font-bold text-slate-900">18% (511)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      Corporate Partners & Recruiters
                    </span>
                    <span className="font-bold text-slate-900">9% (256)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      Faculty Lecturers & Directorate Admins
                    </span>
                    <span className="font-bold text-slate-900">5% (142)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Event Engagement & Flagged Content Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Event Engagement Metrics */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#002B66]" />
                  <h3 className="font-bold text-sm text-slate-900">Institutional Event Engagement</h3>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Directorate Managed
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { title: '2026 Richfield National Technology & Career Fair', attendees: 384, capacity: 500, date: 'April 24, 2026', color: 'bg-emerald-600' },
                  { title: 'Alumni Masterclass: Kubernetes & Cloud Engineering', attendees: 192, capacity: 200, date: 'May 12, 2026', color: 'bg-blue-600' },
                  { title: 'Richfield National Hackathon Finals & Pitch Day', attendees: 156, capacity: 160, date: 'May 30, 2026', color: 'bg-amber-600' }
                ].map((ev, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800">{ev.title}</span>
                      <span className="text-indigo-900">{ev.attendees} / {ev.capacity} RSVPs</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ev.color}`} style={{ width: `${(ev.attendees / ev.capacity) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{ev.date}</span>
                      <span className="font-bold">{((ev.attendees / ev.capacity) * 100).toFixed(0)}% Capacity</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Volume & Moderation Health */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">Content Volume & Safety Status</h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Zero Outstanding Flags
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Text Feed Posts</span>
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">2,914</p>
                  <span className="text-[10px] text-slate-500">99.8% Safe rating</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Elevator Pitch Videos</span>
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">418</p>
                  <span className="text-[10px] text-slate-500">Transcoded & checked</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Code Hub Repos</span>
                    <Code className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">540</p>
                  <span className="text-[10px] text-slate-500">GitHub verified links</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Moderation SLA</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-xl font-extrabold text-emerald-700">&lt; 4 min</p>
                  <span className="text-[10px] text-slate-500">Average review latency</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
