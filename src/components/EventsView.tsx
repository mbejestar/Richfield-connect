import React, { useState } from 'react';
import { 
  Calendar, 
  Video, 
  Download, 
  Users, 
  Clock, 
  MapPin, 
  Sparkles, 
  GraduationCap, 
  CheckCircle,
  ExternalLink,
  BookOpen,
  Trophy,
  Award,
  FileSpreadsheet,
  Target,
  ChevronRight,
  X,
  Send,
  Building,
  Briefcase
} from 'lucide-react';
import { CampusEventItem, UserProfile } from '../types';

interface EventsViewProps {
  events: CampusEventItem[];
  currentUser: UserProfile;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, currentUser }) => {
  const isBusinessStudent = currentUser.qualification === 'Business' || (currentUser.qualificationName || '').includes('BCom') || (currentUser.qualificationName || '').includes('BBA');

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'business-all' | 'datathon' | 'business-bootcamp' | 'exam-runway' | 'it-bootcamp'>(
    isBusinessStudent ? 'business-all' : 'all'
  );
  const [selectedQualification, setSelectedQualification] = useState<'All' | 'IT' | 'Business'>('All');
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(['evt-biz-datathon-1', 'exam-1']);
  
  // Registration Modal State
  const [registeringEvent, setRegisteringEvent] = useState<CampusEventItem | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState(`${currentUser.name} (${currentUser.studentIdNumber || '202488421'})`);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Selected Detail Modal
  const [detailEvent, setDetailEvent] = useState<CampusEventItem | null>(null);

  const filteredEvents = events.filter(e => {
    // Type Filter
    if (selectedFilter === 'business-all') {
      if (e.qualification !== 'Business' && e.qualification !== 'Both') return false;
    } else if (selectedFilter !== 'all') {
      if (e.eventType !== selectedFilter) return false;
    }

    // Stream Filter
    if (selectedQualification !== 'All') {
      if (e.qualification !== selectedQualification && e.qualification !== 'Both') return false;
    }

    return true;
  });

  const handleOpenRegister = (evt: CampusEventItem) => {
    setRegisteringEvent(evt);
    setTeamName(evt.eventType === 'datathon' ? 'Richfield Analytics Alpha' : '');
    setRegSuccessMessage(null);
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (!registeredEventIds.includes(registeringEvent.id)) {
      setRegisteredEventIds([...registeredEventIds, registeringEvent.id]);
    }

    setRegSuccessMessage(`Registration confirmed! Your spot for "${registeringEvent.title}" has been reserved. Check your Richfield email for calendar invite and sprint briefing kit.`);
    setTimeout(() => {
      setRegisteringEvent(null);
      setRegSuccessMessage(null);
    }, 2000);
  };

  const handleToggleRegisterSimple = (id: string) => {
    if (registeredEventIds.includes(id)) {
      setRegisteredEventIds(registeredEventIds.filter(x => x !== id));
    } else {
      setRegisteredEventIds([...registeredEventIds, id]);
    }
  };

  const getEventTypeBadge = (type?: string) => {
    switch (type) {
      case 'datathon':
        return {
          label: 'National Datathon',
          color: 'bg-purple-100 text-purple-900 border-purple-200',
          icon: Trophy
        };
      case 'business-bootcamp':
        return {
          label: 'Business Sprint Bootcamp',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          icon: Briefcase
        };
      case 'it-bootcamp':
        return {
          label: 'Tech / Cloud Bootcamp',
          color: 'bg-blue-100 text-blue-900 border-blue-200',
          icon: Target
        };
      case 'exam-runway':
      default:
        return {
          label: 'Pre-Exam Runway',
          color: 'bg-indigo-100 text-indigo-900 border-indigo-200',
          icon: GraduationCap
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-900">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Campus Bootcamps, Datathons & National Runways
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Inter-campus competitive sprints, corporate business datathons, and lecturer-led pre-exam review live streams
          </p>
        </div>

        {/* Business Student Callout or Live Sprint Indicator */}
        <div className="bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-lg px-3.5 py-2 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-[11px]">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span>Business Datathon 2026</span>
              <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-extrabold uppercase">R75,000</span>
            </span>
            <span className="text-purple-900 text-[10px] font-medium">Standard Bank & Vodacom Sponsor</span>
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
        
        {/* Primary Event Category Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-wrap gap-1 p-0.5 bg-slate-100 rounded-lg">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'business-all', label: '📊 Business Bootcamps & Datathons', highlight: true },
              { id: 'datathon', label: '🏆 Datathons' },
              { id: 'business-bootcamp', label: '💼 Business Bootcamps' },
              { id: 'exam-runway', label: '🎯 Exam Runways' },
              { id: 'it-bootcamp', label: '☁️ IT & Cloud' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  selectedFilter === tab.id
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : tab.highlight
                      ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.highlight && isBusinessStudent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Qualification Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stream:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {(['All', 'Business', 'IT'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQualification(q)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                    selectedQualification === q
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Context Notification */}
        {selectedFilter === 'business-all' && (
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-lg p-2.5 flex items-start gap-2.5 text-xs text-purple-950">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Richfield Business & Commercial Excellence Sprint Program</p>
              <p className="text-[11px] text-purple-800/90 mt-0.5">
                Designed for BCom, BBA, and AGA students. Participations include corporate datasets, executive presentation pitch decks to JSE industry leaders, and cash bursary prizes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEventIds.includes(evt.id);
          const badge = getEventTypeBadge(evt.eventType);
          const BadgeIcon = badge.icon;
          const isDatathonOrBootcamp = evt.eventType === 'datathon' || evt.eventType === 'business-bootcamp' || evt.eventType === 'it-bootcamp';

          return (
            <div
              key={evt.id}
              className={`bg-white rounded-xl p-4 sm:p-5 border shadow-sm transition-all flex flex-col justify-between space-y-3.5 ${
                evt.eventType === 'datathon' 
                  ? 'border-purple-200 hover:border-purple-300 border-l-4 border-l-purple-600' 
                  : evt.eventType === 'business-bootcamp'
                    ? 'border-emerald-200 hover:border-emerald-300 border-l-4 border-l-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 border-l-4 border-l-indigo-600'
              }`}
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${badge.color}`}>
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>

                    {evt.moduleCode && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {evt.moduleCode}
                      </span>
                    )}

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {evt.academicYear}
                    </span>

                    {evt.isNational && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        National
                      </span>
                    )}
                  </div>

                  {evt.prizePool ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      {evt.prizePool.split('+')[0]}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      {evt.status === 'registration-open' ? 'Reg Open' : 'Upcoming'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-slate-900 mt-2.5 leading-snug">
                  {evt.title}
                </h3>
                {evt.moduleName && (
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {evt.moduleName}
                  </p>
                )}

                {/* Host / Sponsor Info */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100">
                  {evt.sponsor ? (
                    <Building className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  )}
                  <span className="truncate">
                    <strong>{evt.sponsor ? 'Industry Sponsor:' : 'Lead Faculty:'}</strong> {evt.sponsor || `${evt.hostName || ''} (${evt.hostCampus || ''})`}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{evt.dateTime}</span>
                </div>

                {/* Problem Statement or Focus Topics */}
                {evt.problemStatement ? (
                  <div className="mt-2.5 bg-purple-50/50 rounded-lg p-2.5 border border-purple-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase block tracking-wider">
                      Case Study / Problem Statement:
                    </span>
                    <p className="text-[11px] text-slate-700 leading-relaxed line-clamp-3">
                      {evt.problemStatement}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2.5 bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-700 block uppercase">Exam Runway Focus Topics:</span>
                    {evt.keyTopics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Team Requirements / Deliverables */}
                {evt.teamRequirement && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Users className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Format: <strong>{evt.teamRequirement}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.attendeesCount + (isRegistered ? 1 : 0)} participating</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Problem Brief / Dataset / Slides Link */}
                  {(evt.datasetUrl || evt.slidesUrl) && (
                    <a
                      href={evt.datasetUrl || evt.slidesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      title={evt.datasetUrl ? 'Download Sprint Dataset' : 'Download Master Slides'}
                    >
                      {evt.datasetUrl ? <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" /> : <Download className="w-3.5 h-3.5 text-indigo-600" />}
                      <span className="hidden sm:inline">{evt.datasetUrl ? 'Dataset' : 'Slides'}</span>
                    </a>
                  )}

                  {/* Details / Briefing Button */}
                  <button
                    onClick={() => setDetailEvent(evt)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Details
                  </button>

                  {/* Register / RSVP Button */}
                  <button
                    onClick={() => {
                      if (isDatathonOrBootcamp) {
                        handleOpenRegister(evt);
                      } else {
                        handleToggleRegisterSimple(evt.id);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                      isRegistered
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : evt.eventType === 'datathon'
                          ? 'bg-purple-700 hover:bg-purple-800 text-white active:scale-95'
                          : evt.eventType === 'business-bootcamp'
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        {isDatathonOrBootcamp ? <Trophy className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                        <span>{isDatathonOrBootcamp ? 'Register Team' : 'RSVP Runway'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Registration Modal for Bootcamps and Datathons */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Sprint Team Registration</h3>
                  <p className="text-[11px] text-slate-500">Richfield Business & Technology Competition</p>
                </div>
              </div>
              <button
                onClick={() => setRegisteringEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccessMessage ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Team Registration Submitted</h4>
                <p className="text-xs text-slate-600 leading-relaxed px-4">
                  {regSuccessMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRegistration} className="space-y-4 pt-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-bold text-slate-800">{registeringEvent.title}</p>
                  <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                    Prize Pool: {registeringEvent.prizePool || 'Institutional Certificate & Industry Mentorship'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{registeringEvent.dateTime}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Pretoria FinTech Quant Squad"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Team Members (Names & Student IDs) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="1. Your Name (RF-XXXX-XXXX)&#10;2. Teammate 2 (RF-XXXX-XXXX)&#10;3. Teammate 3 (RF-XXXX-XXXX)"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Requirement: {registeringEvent.teamRequirement || 'Open to all registered Richfield students.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Registration</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                  {detailEvent.eventType.replace('-', ' ')}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5">{detailEvent.title}</h3>
                <p className="text-xs text-slate-600">{detailEvent.dateTime}</p>
              </div>
              <button
                onClick={() => setDetailEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailEvent.prizePool && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <span className="font-bold text-amber-950 block flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  Prizes & Industry Incentives:
                </span>
                <p className="text-amber-900 mt-0.5">{detailEvent.prizePool}</p>
              </div>
            )}

            {detailEvent.problemStatement && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Problem Statement / Case Study</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {detailEvent.problemStatement}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Core Evaluation Topics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailEvent.keyTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Host: <strong>{detailEvent.hostName || 'Richfield Faculty'}</strong>
              </span>
              <button
                onClick={() => setDetailEvent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

