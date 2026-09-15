import React, { useState } from 'react';
import { 
  Inbox, 
  Sparkles, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  CheckCheck, 
  Filter, 
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Building2,
  HelpCircle,
  X,
  CheckCircle
} from 'lucide-react';
import { DirectMessage, UserProfile } from '../types';

interface MessagesViewProps {
  messages: DirectMessage[];
  currentUser: UserProfile;
  onSendMessage: (receiverId: string, receiverName: string, text: string) => Promise<{ success: boolean; priorityReason?: string; isSpam?: boolean }>;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  messages,
  currentUser,
  onSendMessage
}) => {
  const [activeCategory, setActiveCategory] = useState<'priority' | 'general'>('priority');
  const [selectedMessageId, setSelectedMessageId] = useState<string>(messages[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Campus Administrator Inquiry Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminDept, setAdminDept] = useState('Academic Records & Transcripts');
  const [adminTopic, setAdminTopic] = useState('Module Enrollment & Verification');
  const [adminQuery, setAdminQuery] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);
  const [isAdminSending, setIsAdminSending] = useState(false);

  const priorityMessages = messages.filter(m => m.category === 'priority');
  const generalMessages = messages.filter(m => m.category === 'general');

  const currentList = (activeCategory === 'priority' ? priorityMessages : generalMessages).filter(m => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return m.senderName.toLowerCase().includes(q) || m.content.toLowerCase().includes(q);
  });

  const activeMessage = messages.find(m => m.id === selectedMessageId) || currentList[0];

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    setIsSending(true);
    await onSendMessage(activeMessage.senderId, activeMessage.senderName, replyText.trim());
    setReplyText('');
    setIsSending(false);
  };

  const handleSendAdminInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminQuery.trim()) return;

    setIsAdminSending(true);
    const content = `[Official Student Inquiry | Dept: ${adminDept} | Topic: ${adminTopic}]\nStudent ID: ${currentUser.id} (Campus: ${currentUser.campus || 'Richfield Main'})\n\n${adminQuery.trim()}`;
    await onSendMessage('admin-lesiba-1', 'Lesiba (Campus Administrator & Registrar)', content);

    setAdminSuccessMsg(`Inquiry dispatched directly to Lesiba (Campus Administrator & Registrar). Ticket Ref: RF-${Math.floor(100000 + Math.random() * 900000)}. Priority response guaranteed.`);
    setIsAdminSending(false);
    setTimeout(() => {
      setAdminSuccessMsg(null);
      setShowAdminModal(false);
      setAdminQuery('');
    }, 2200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3.5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Messages & Priority Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-sorted academic notices, verified mentor communications, and spam protection
          </p>
        </div>

        {/* Actions & Safety Guard */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-1.5 text-xs text-white bg-[#002B66] hover:bg-blue-900 px-3 py-1.5 rounded-lg font-bold shadow-sm transition-all active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Contact Campus Administrator</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Priority Message Safety Guard</span>
          </div>
        </div>
      </div>

      {/* Main Mailbox Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left Col: Category Tabs & List (5 cols) */}
        <div className="md:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          {/* Priority vs General Subtabs */}
          <div className="p-2.5 border-b border-slate-200 space-y-2 bg-white">
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveCategory('priority')}
                className={`py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                  activeCategory === 'priority'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Priority ({priorityMessages.length})</span>
              </button>

              <button
                onClick={() => setActiveCategory('general')}
                className={`py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                  activeCategory === 'general'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>General ({generalMessages.length})</span>
              </button>
            </div>

            {/* Search filter inside messages */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search inbox..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* List of Messages */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {currentList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No messages in this folder.
              </div>
            ) : (
              currentList.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`p-3 cursor-pointer transition-colors space-y-1 ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100/60 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{msg.senderName}</span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          msg.senderRole === 'alumni' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          msg.senderRole === 'lecturer' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                          msg.senderRole === 'recruiter' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                          'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {msg.content}
                    </p>

                    {/* AI Tag */}
                    <div className="flex items-center justify-between pt-0.5">
                      {msg.isSpam ? (
                        <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Flagged Spam</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded truncate max-w-[200px]">
                          {msg.priorityReason || 'Verified Message'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Col: Conversation View (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-white">
          {activeMessage ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {activeMessage.senderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{activeMessage.senderName}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="capitalize">{activeMessage.senderRole}</span>
                      <span>•</span>
                      <span>Richfield Verified</span>
                    </div>
                  </div>
                </div>

                {activeMessage.priorityReason && (
                  <div className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full text-[11px] font-bold border border-indigo-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{activeMessage.priorityReason}</span>
                  </div>
                )}
              </div>

              {/* Message Thread Body */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {activeMessage.isSpam && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Spam Warning:</span>
                      This message was flagged by the RichfieldConnect AI filter due to unsolicited solicitation or low relevance. Do not click external links or send money.
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 max-w-xl">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-slate-700">{activeMessage.senderName}</span>
                    <span>{activeMessage.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {activeMessage.content}
                  </p>
                </div>
              </div>

              {/* Reply Input Form */}
              <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${activeMessage.senderName}...`}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Encrypted & Content-Audited
                    </span>
                    <button
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs">
              Select a message thread to view details
            </div>
          )}
        </div>

      </div>

      {/* OFFICIAL CAMPUS ADMINISTRATOR INQUIRY MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#002B66] text-white flex items-center justify-center font-bold shadow-sm">
                  <Building2 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Campus Administration & Registrar Desk</h3>
                  <p className="text-xs text-slate-500">Official inquiries, records, financial aid, and academic counsel</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminSuccessMsg ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Official Inquiry Logged</h4>
                <p className="text-xs text-slate-600 leading-relaxed px-4">
                  {adminSuccessMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendAdminInquiry} className="space-y-3.5">
                
                {/* Pre-filled Student Details */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sender Profile</span>
                    <span className="font-bold text-slate-800">{currentUser.name} ({currentUser.id})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus</span>
                    <span className="font-bold text-indigo-900">{currentUser.campus || 'Richfield Main'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Administrative Department</label>
                  <select
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="Academic Records & Transcripts">Academic Records & Transcripts Office</option>
                    <option value="Financial Aid & Bursaries">Financial Aid, Bursaries & Finance Office</option>
                    <option value="Campus Head of Academic Affairs">Campus Head of Academic Affairs</option>
                    <option value="Examinations & Graduation Board">Examinations & Graduation Board</option>
                    <option value="Student Wellness & Counseling">Student Wellness & Academic Support</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Topic</label>
                  <input
                    type="text"
                    required
                    value={adminTopic}
                    onChange={(e) => setAdminTopic(e.target.value)}
                    placeholder="e.g. Module registration clash, Transcript endorsement, Bursary clearance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Details & Question *</label>
                  <textarea
                    rows={4}
                    required
                    value={adminQuery}
                    onChange={(e) => setAdminQuery(e.target.value)}
                    placeholder="Provide detailed questions or requests for the administrator..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Directly sent to Lesiba (Campus Admin)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminModal(false)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdminSending || !adminQuery.trim()}
                      className="px-4 py-1.5 bg-[#002B66] hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isAdminSending ? 'Submitting...' : 'Submit Inquiry'}</span>
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
