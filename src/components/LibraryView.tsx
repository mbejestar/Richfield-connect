import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Layers, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { LibraryBook, BookTransferRequest, UserProfile } from '../types';
import { AiExamPrepStudio } from './AiExamPrepStudio';

interface LibraryViewProps {
  books: LibraryBook[];
  transfers: BookTransferRequest[];
  currentUser: UserProfile;
  onRequestTransfer: (bookId: string, bookTitle: string, fromCampus: string, toCampus: string, studentIdNumber: string) => Promise<{ success: boolean; message: string }>;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  transfers,
  currentUser,
  onRequestTransfer
}) => {
  const [activeLibraryTab, setActiveLibraryTab] = useState<'catalog' | 'exam-prep'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQualification, setSelectedQualification] = useState<'All' | 'IT' | 'Business' | 'General'>('All');
  const [selectedBookForTransfer, setSelectedBookForTransfer] = useState<LibraryBook | null>(null);
  
  const [studentIdInput, setStudentIdInput] = useState(currentUser.studentIdNumber || '202488421');
  const [targetCampus, setTargetCampus] = useState(currentUser.campus);
  const [sourceCampus, setSourceCampus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferFeedback, setTransferFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredBooks = books.filter(book => {
    if (selectedQualification !== 'All' && book.qualification !== selectedQualification && book.qualification !== 'General') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchIsbn = book.isbn.toLowerCase().includes(q);
      const matchModule = book.moduleCodes.some(m => m.toLowerCase().includes(q));
      if (!matchTitle && !matchAuthor && !matchIsbn && !matchModule) return false;
    }
    return true;
  });

  const handleOpenTransferModal = (book: LibraryBook) => {
    setSelectedBookForTransfer(book);
    const firstAvailableCampus = Object.entries(book.campusHoldings).find(([_, count]) => count > 0)?.[0] || 'Pretoria Campus';
    setSourceCampus(firstAvailableCampus);
    setTransferFeedback(null);
  };

  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForTransfer || !studentIdInput.trim()) return;

    setIsSubmitting(true);
    setTransferFeedback(null);

    const res = await onRequestTransfer(
      selectedBookForTransfer.id,
      selectedBookForTransfer.title,
      sourceCampus,
      targetCampus,
      studentIdInput.trim()
    );

    setIsSubmitting(false);

    if (res.success) {
      setTransferFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setSelectedBookForTransfer(null);
      }, 2000);
    } else {
      setTransferFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-900">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Library & Inter-Campus Book Retrieval
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Search physical textbooks across all 10 Richfield campus libraries with 2–3 day inter-campus courier transfers
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 flex items-center gap-2.5 shrink-0">
          <Truck className="w-4 h-4 text-indigo-700 shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold text-indigo-950 block">Inter-Campus Shuttle Service</span>
            <span className="text-indigo-800/80 text-[10px]">Free student pickup at your home campus library</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center space-x-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveLibraryTab('catalog')}
          className={`flex-1 text-xs font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeLibraryTab === 'catalog'
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Campus Textbook Catalog & Courier</span>
        </button>

        <button
          onClick={() => setActiveLibraryTab('exam-prep')}
          className={`flex-1 text-xs font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeLibraryTab === 'exam-prep'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Exam Prep Studio & Flashcards</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-amber-400 text-purple-950">
            Gemini AI
          </span>
        </button>
      </div>

      {/* RENDER MODE 1: AI EXAM PREP STUDIO */}
      {activeLibraryTab === 'exam-prep' && (
        <AiExamPrepStudio currentUser={currentUser} />
      )}

      {/* RENDER MODE 2: CAMPUS BOOK CATALOG & TRANSFERS */}
      {activeLibraryTab === 'catalog' && (
        <>
          {/* Active Inter-Campus Retrieval Orders (if any) */}
      {transfers.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs sm:text-sm">Active Inter-Campus Transfer Orders</h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold border border-amber-500/30">
              {transfers.length} In Transit / Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {transfers.map((tr) => (
              <div key={tr.id} className="bg-white/10 rounded-lg p-3 text-xs space-y-1 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{tr.bookTitle}</span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                    tr.status === 'ready-for-pickup' ? 'bg-emerald-500 text-white' :
                    tr.status === 'in-transit' ? 'bg-amber-500 text-slate-900' :
                    'bg-indigo-500 text-white'
                  }`}>
                    {tr.status.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="text-indigo-200 text-[11px] flex items-center gap-1.5">
                  <span>From: {tr.fromCampus}</span>
                  <span>➜</span>
                  <span>To: {tr.toCampus}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-white/10">
                  <span>Courier: <strong>{tr.courierTrackingNumber}</strong></span>
                  <span>ETA: <strong>{tr.estimatedArrival}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbook title, author, module code (e.g. DSA201, PRG302, BUS301), ISBN..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Qualification:</span>
          <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg">
            {(['All', 'IT', 'Business', 'General'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQualification(q)}
                className={`text-xs font-bold px-3 py-1 rounded-md transition-all ${
                  selectedQualification === q
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {q === 'All' ? 'All Catalog' : `${q} Textbooks`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredBooks.map((book) => {
          const userCampusHolding = book.campusHoldings[currentUser.campus] || 0;
          const totalHoldings = Object.values(book.campusHoldings).reduce((a, b) => a + b, 0);

          return (
            <div
              key={book.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 border-l-4 border-indigo-500"
            >
              <div>
                {/* Module Pill & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {book.moduleCodes.map((m) => (
                      <span key={m} className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {m}
                      </span>
                    ))}
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {book.qualification}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    userCampusHolding > 0 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : totalHoldings > 0 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {userCampusHolding > 0 
                      ? `${userCampusHolding} on shelf at ${currentUser.campus.split(' ')[0]}` 
                      : totalHoldings > 0 
                      ? 'Available for Transfer' 
                      : 'Borrowed'}
                  </span>
                </div>

                {/* Title & Author */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-2 hover:text-indigo-900 cursor-pointer">
                  {book.title}
                </h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  by {book.author} (Edition: {book.edition})
                </p>

                {/* Shelf Location & Campus Holdings Map */}
                <div className="mt-2.5 bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span className="font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      Shelf Code: {book.shelfLocation}
                    </span>
                    <span className="text-slate-500 text-[10px]">ISBN: {book.isbn}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/60">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Nationwide Campus Inventory:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(book.campusHoldings).map(([campus, count]) => (
                        <span
                          key={campus}
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                            count > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {campus.replace(' Campus', '').replace(' (Main)', '')}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Loan: <strong>14 Days (Renewable)</strong>
                </span>

                {userCampusHolding > 0 ? (
                  <button
                    onClick={() => alert(`This textbook is in stock at your home campus (${currentUser.campus}) on Shelf ${book.shelfLocation}. Please present your student card at the library counter.`)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Reserve at Counter</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenTransferModal(book)}
                    disabled={totalHoldings === 0}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-40"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Request Transfer</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
      </>
      )}

      {/* INTER-CAMPUS TRANSFER MODAL */}
      {selectedBookForTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-3.5">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Inter-Campus Book Transfer</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transferring <strong>{selectedBookForTransfer.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedBookForTransfer(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Inter-Campus Courier Protocol (2–3 Business Days)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                The book will be dispatched via Richfield Courier Shuttle from the holding campus directly to your local campus library desk.
              </p>
            </div>

            <form onSubmit={handleConfirmTransfer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Richfield Student Number (9 Digits) *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  required
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="e.g. 202488421 (9 digits)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dispatching Campus</label>
                  <select
                    value={sourceCampus}
                    onChange={(e) => setSourceCampus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {Object.entries(selectedBookForTransfer.campusHoldings)
                      .filter(([_, count]) => count > 0)
                      .map(([campus, count]) => (
                        <option key={campus} value={campus}>
                          {campus} ({count} copies)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Destination Campus</label>
                  <input
                    type="text"
                    disabled
                    value={targetCampus}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 font-bold"
                  />
                </div>
              </div>

              {transferFeedback && (
                <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  transferFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}>
                  {transferFeedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{transferFeedback.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedBookForTransfer(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Validating ID...' : 'Confirm Inter-Campus Dispatch'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
