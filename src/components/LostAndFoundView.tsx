import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Upload, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Tag, 
  User, 
  Building2, 
  Filter, 
  Plus, 
  X, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  FileText, 
  HelpCircle,
  Phone,
  Mail,
  Eye,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  PackageSearch
} from 'lucide-react';
import { 
  LostAndFoundItem, 
  LostFoundCategory, 
  LostFoundStatus, 
  CampusLocation, 
  UserProfile, 
  UserRole,
  LostFoundClaim
} from '../types';
import { mockLostFoundItems } from '../mockData';

interface LostAndFoundViewProps {
  currentUser: UserProfile;
  onNavigateToAnnouncements?: () => void;
  onOpenDirectMessage?: (userId: string) => void;
  items?: LostAndFoundItem[];
  onUpdateItems?: (items: LostAndFoundItem[]) => void;
}

const CATEGORIES: LostFoundCategory[] = [
  'Electronics & Laptops',
  'Phones & Chargers',
  'Student Cards & IDs',
  'Keys & Access Tags',
  'Notebooks & Textbooks',
  'Bags & Backpacks',
  'Clothing & Jackets',
  'Water Bottles & Containers',
  'Glasses & Personal Items',
  'Calculators & Tech Accessories',
  'Other Essentials'
];

const CAMPUS_OPTIONS: CampusLocation[] = [
  'Newtown Campus',
  'Pretoria Campus',
  'Durban Campus',
  'Umhlanga Campus',
  'Cape Town Campus',
  'Polokwane Campus',
  'Sandton Campus',
  'Midrand Campus',
  'Alberton Campus'
];

// Presets for rapid testing of photo upload
const PHOTO_PRESETS = [
  { label: 'Laptop Charger', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80' },
  { label: 'Scientific Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80' },
  { label: 'Student ID & Lanyard', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' },
  { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80' },
  { label: 'Backpack / Bag', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Keys & Tag', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80' }
];

export const LostAndFoundView: React.FC<LostAndFoundViewProps> = ({
  currentUser,
  onNavigateToAnnouncements,
  onOpenDirectMessage,
  items: propItems,
  onUpdateItems
}) => {
  // 1. Storage & State Initialization
  const STORAGE_KEY = 'richfield_digital_lost_found_v1';
  const [internalItems, setInternalItems] = useState<LostAndFoundItem[]>(() => {
    if (propItems && propItems.length > 0) return propItems;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return mockLostFoundItems;
  });

  const items = propItems || internalItems;

  const saveItems = (updatedItems: LostAndFoundItem[]) => {
    setInternalItems(updatedItems);
    if (onUpdateItems) {
      onUpdateItems(updatedItems);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'open' | 'security' | 'recovered' | 'mine'>('all');

  // 3. Modals State
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<LostAndFoundItem | null>(null);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<LostAndFoundItem | null>(null);

  // Form State for Reporting Found Item
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<LostFoundCategory>('Electronics & Laptops');
  const [formCampus, setFormCampus] = useState<CampusLocation>(
    (currentUser.campus as CampusLocation) || 'Newtown Campus'
  );
  const [formSpecificLocation, setFormSpecificLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formPhotoPreview, setFormPhotoPreview] = useState<string | null>(null);
  const [formHeldAtSecurity, setFormHeldAtSecurity] = useState(true);
  const [formSecurityDesk, setFormSecurityDesk] = useState('Campus Main Entrance Security Desk');
  const [formSecurityRef, setFormSecurityRef] = useState('');
  const [formVerificationQuestion, setFormVerificationQuestion] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State for Claiming
  const [claimProof, setClaimProof] = useState('');
  const [claimContact, setClaimContact] = useState(currentUser.email || '');
  const [claimStudentId, setClaimStudentId] = useState(currentUser.studentIdNumber || '');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccessFeedback, setClaimSuccessFeedback] = useState<string | null>(null);

  // File Upload Handler (reads as DataURL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormPhotoPreview(result);
        setFormPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Found Item
  const handleReportFoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSpecificLocation.trim()) return;

    setFormSubmitting(true);

    const generatedId = `lf-${Date.now()}`;
    const generatedRef = formHeldAtSecurity 
      ? formSecurityRef.trim() || `RF-SEC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      : undefined;

    const newItem: LostAndFoundItem = {
      id: generatedId,
      type: 'found',
      title: formTitle.trim(),
      category: formCategory,
      description: formDescription.trim() || `Found at ${formCampus} in ${formSpecificLocation}.`,
      campusLocation: formCampus,
      specificLocation: formSpecificLocation.trim(),
      photoUrl: formPhotoUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      dateFoundOrLost: 'Just now',
      status: formHeldAtSecurity ? 'at_campus_security' : 'open',
      reportedByUserId: currentUser.id,
      reportedByName: currentUser.name,
      reportedByRole: currentUser.role,
      reportedByAvatar: currentUser.avatar,
      reportedByCampus: currentUser.campus,
      heldAtSecurityDesk: formHeldAtSecurity,
      securityDeskName: formHeldAtSecurity ? formSecurityDesk.trim() : undefined,
      securityReferenceNumber: generatedRef,
      verificationQuestion: formVerificationQuestion.trim() || undefined,
      claims: []
    };

    saveItems([newItem, ...items]);
    setFormSubmitting(false);

    // Reset Form
    setFormTitle('');
    setFormSpecificLocation('');
    setFormDescription('');
    setFormPhotoUrl('');
    setFormPhotoPreview(null);
    setFormVerificationQuestion('');
    setShowReportModal(false);
  };

  // Submit Claim for Item
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForClaim || !claimProof.trim()) return;

    setClaimSubmitting(true);

    const newClaim: LostFoundClaim = {
      id: `claim-${Date.now()}`,
      claimantUserId: currentUser.id,
      claimantName: currentUser.name,
      claimantRole: currentUser.role,
      claimantAvatar: currentUser.avatar,
      claimantStudentId: claimStudentId.trim() || undefined,
      proofDescription: claimProof.trim(),
      contactEmailOrPhone: claimContact.trim(),
      timestamp: 'Just now',
      status: 'pending',
      adminOrFinderNotes: selectedItemForClaim.heldAtSecurityDesk
        ? `Item logged at ${selectedItemForClaim.securityDeskName || 'Campus Security'}. Please bring Student Card and reference ${selectedItemForClaim.securityReferenceNumber || 'this claim'}.`
        : 'Claim sent to finder. You may also contact them via EnrichHub Messages.'
    };

    const updated = items.map(item => {
      if (item.id === selectedItemForClaim.id) {
        return {
          ...item,
          status: 'pending_verification' as LostFoundStatus,
          claims: [...item.claims, newClaim]
        };
      }
      return item;
    });

    saveItems(updated);
    setClaimSubmitting(false);
    setClaimSuccessFeedback('Claim submitted successfully! Check verification instructions below.');

    setTimeout(() => {
      setSelectedItemForClaim(null);
      setClaimProof('');
      setClaimSuccessFeedback(null);
    }, 2500);
  };

  // Approve Claim / Mark as Recovered (by finder or admin)
  const handleApproveClaim = (itemId: string, claimId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        const targetClaim = item.claims.find(c => c.id === claimId);
        return {
          ...item,
          status: 'recovered' as LostFoundStatus,
          resolvedAt: 'Today',
          resolvedToUserId: targetClaim?.claimantUserId,
          resolvedToUserName: targetClaim?.claimantName,
          claims: item.claims.map(c => c.id === claimId ? { ...c, status: 'approved' as const } : c)
        };
      }
      return item;
    });
    saveItems(updated);
  };

  // Mark as Handed to Security
  const handleHandToSecurity = (itemId: string, deskName: string, refNum: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'at_campus_security' as LostFoundStatus,
          heldAtSecurityDesk: true,
          securityDeskName: deskName,
          securityReferenceNumber: refNum
        };
      }
      return item;
    });
    saveItems(updated);
  };

  // Filtering Logic
  const filteredItems = items.filter(item => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.specificLocation.toLowerCase().includes(q) || item.campusLocation.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc && !matchCategory) return false;
    }

    // 2. Campus Filter
    if (selectedCampus !== 'All' && item.campusLocation !== selectedCampus) {
      return false;
    }

    // 3. Category Filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // 4. Status Tab Filter
    if (selectedStatusTab === 'open') {
      return item.status === 'open';
    } else if (selectedStatusTab === 'security') {
      return item.status === 'at_campus_security';
    } else if (selectedStatusTab === 'recovered') {
      return item.status === 'recovered';
    } else if (selectedStatusTab === 'mine') {
      const isReporter = item.reportedByUserId === currentUser.id;
      const isClaimant = item.claims.some(c => c.claimantUserId === currentUser.id);
      return isReporter || isClaimant;
    }

    return true;
  });

  // Calculate Metrics
  const totalCount = items.length;
  const securityCount = items.filter(i => i.status === 'at_campus_security').length;
  const recoveredCount = items.filter(i => i.status === 'recovered').length;
  const openCount = items.filter(i => i.status === 'open' || i.status === 'pending_verification').length;

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12">
      
      {/* Top Navigation Banner & Tab Toggle */}
      <div className="bg-gradient-to-r from-[#002B66] via-blue-900 to-[#001D47] text-white rounded-2xl p-5 sm:p-6 shadow-md border-b-4 border-[#E31B23]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#E31B23] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                RICHFIELD CAMPUS UTILITY
              </span>
              <span className="bg-white/10 text-blue-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/15">
                9 Campuses Active
              </span>
              {onNavigateToAnnouncements && (
                <button
                  onClick={onNavigateToAnnouncements}
                  className="text-xs text-blue-200 hover:text-white underline ml-2 flex items-center gap-1 font-semibold"
                >
                  <span>← Back to Announcements</span>
                </button>
              )}
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <PackageSearch className="w-6 h-6 text-amber-300" />
              <span>Digital Lost & Found</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              Upload photos of found belongings tagged by exact campus location. Fast, verified, and transparent recovery for Richfield students and faculty.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#E31B23] to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-red-400/40 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>+ Upload Found Item</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider block">Total Logged</span>
            <span className="text-lg font-black text-white">{totalCount} items</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">With Campus Security</span>
            <span className="text-lg font-black text-emerald-300">{securityCount} at desks</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider block">Awaiting Owner</span>
            <span className="text-lg font-black text-amber-300">{openCount} active</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider block">Returned & Recovered</span>
            <span className="text-lg font-black text-white">{recoveredCount} recovered</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Row 1: Search and Campus Selector */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item title, lab/room, campus or description (e.g. charger, student ID, lab 302)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B66]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Campus Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin className="w-4 h-4 text-[#002B66]" />
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002B66]"
            >
              <option value="All">📍 All 9 Campuses</option>
              {CAMPUS_OPTIONS.map(campus => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Tag className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002B66]"
            >
              <option value="All">🏷️ All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Status Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedStatusTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                selectedStatusTab === 'all'
                  ? 'bg-white text-[#002B66] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setSelectedStatusTab('open')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                selectedStatusTab === 'open'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unclaimed ({openCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab('security')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                selectedStatusTab === 'security'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              At Security Desks ({securityCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab('recovered')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                selectedStatusTab === 'recovered'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recovered ({recoveredCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab('mine')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                selectedStatusTab === 'mine'
                  ? 'bg-white text-purple-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Activity
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset lost and found items to default sample list?')) {
                saveItems(mockLostFoundItems);
              }
            }}
            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium"
            title="Restore default mock items"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Items</span>
          </button>
        </div>
      </div>

      {/* Main Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <PackageSearch className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800">No items match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, campus selection, or category. You can also upload a newly found item.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCampus('All');
              setSelectedCategory('All');
              setSelectedStatusTab('all');
            }}
            className="px-4 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const isAtSecurity = item.status === 'at_campus_security';
            const isRecovered = item.status === 'recovered';
            const isPendingVerification = item.status === 'pending_verification';
            const isReporter = item.reportedByUserId === currentUser.id;
            const hasUserClaimed = item.claims.some(c => c.claimantUserId === currentUser.id);

            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlays */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={item.photoUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>

                      {/* Status Badge */}
                      {isRecovered ? (
                        <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Recovered</span>
                        </span>
                      ) : isAtSecurity ? (
                        <span className="bg-blue-700 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-300" />
                          <span>At Security Desk</span>
                        </span>
                      ) : isPendingVerification ? (
                        <span className="bg-amber-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Clock className="w-3 h-3" />
                          <span>Verification In Progress</span>
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <AlertCircle className="w-3 h-3" />
                          <span>Unclaimed</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Photo Gradient for contrast */}
                    <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    
                    {/* Date found badge */}
                    <div className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white/90 drop-shadow flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.dateFoundOrLost}</span>
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="p-4 space-y-2.5">
                    {/* Campus & Exact Room Tag */}
                    <div className="flex items-start gap-1.5 text-xs text-blue-900 font-bold bg-blue-50/80 p-2 rounded-xl border border-blue-100">
                      <MapPin className="w-3.5 h-3.5 text-[#E31B23] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#002B66] font-black">{item.campusLocation}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-700 font-semibold">{item.specificLocation}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-blue-800 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Security Desk Reference if applicable */}
                    {isAtSecurity && item.securityReferenceNumber && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[11px] text-emerald-900 space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.securityDeskName || 'Campus Security Desk'}</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-mono">
                          Ref: <strong>{item.securityReferenceNumber}</strong>
                        </div>
                      </div>
                    )}

                    {/* Reporter info */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Reported by <strong className="text-slate-700">{item.reportedByName}</strong></span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{item.reportedByRole}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedItemForDetails(item)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details & Claims</span>
                  </button>

                  {!isRecovered ? (
                    hasUserClaimed ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Claim Pending</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedItemForClaim(item)}
                        className="px-3.5 py-1.5 bg-[#002B66] hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <span>This is Mine!</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Returned</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Report Found Item */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E31B23]">
                  CAMPUS SERVICE
                </span>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#002B66]" />
                  <span>Report a Found Item</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload a photo and location tag so the owner can recover their item transparently.
                </p>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportFoundSubmit} className="space-y-3.5">
              {/* Item Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Name / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. HP Laptop Charger, Richfield Student ID Card, Casio Calculator"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                />
              </div>

              {/* Category & Campus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Item Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as LostFoundCategory)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Location *
                  </label>
                  <select
                    value={formCampus}
                    onChange={(e) => setFormCampus(e.target.value as CampusLocation)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                  >
                    {CAMPUS_OPTIONS.map(campus => (
                      <option key={campus} value={campus}>{campus}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exact Spot Found on Campus */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Campus Spot Tag *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E31B23]" />
                  <input
                    type="text"
                    required
                    value={formSpecificLocation}
                    onChange={(e) => setFormSpecificLocation(e.target.value)}
                    placeholder="e.g. Lab 302 Desk 14, Library 2nd Floor Quiet Pod, Cafeteria Table 5"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Item Photo (Upload or Choose Demo Preset) *
                </label>
                
                {/* File Drop Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#002B66] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/60"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {formPhotoPreview || formPhotoUrl ? (
                    <div className="relative inline-block">
                      <img 
                        src={formPhotoPreview || formPhotoUrl} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="h-28 max-w-full rounded-lg object-cover shadow-sm mx-auto" 
                      />
                      <span className="block text-[10px] text-blue-700 font-bold mt-1">
                        Click to replace photo
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        Click or drag a photo here to upload
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Supports JPG, PNG, WEBP from your phone or device
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Presets for Instant One-Click Photo Testing */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Or select a demo photo preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setFormPhotoUrl(preset.url);
                          setFormPhotoPreview(preset.url);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                          formPhotoUrl === preset.url
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Description & Condition
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe color, brand, or where it was placed..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                />
              </div>

              {/* Custody: Handed to Campus Security vs with Finder */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Handed to Campus Security Desk?
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formHeldAtSecurity}
                    onChange={(e) => setFormHeldAtSecurity(e.target.checked)}
                    className="w-4 h-4 text-[#002B66] rounded cursor-pointer"
                  />
                </div>

                {formHeldAtSecurity && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                        Security Desk Name
                      </label>
                      <input
                        type="text"
                        value={formSecurityDesk}
                        onChange={(e) => setFormSecurityDesk(e.target.value)}
                        placeholder="e.g. Newtown Main Gate Desk A"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                        Security Reference / Ticket #
                      </label>
                      <input
                        type="text"
                        value={formSecurityRef}
                        onChange={(e) => setFormSecurityRef(e.target.value)}
                        placeholder="Leave empty to auto-generate"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Security Verification Question */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Owner Verification Question
                </label>
                <input
                  type="text"
                  value={formVerificationQuestion}
                  onChange={(e) => setFormVerificationQuestion(e.target.value)}
                  placeholder="e.g. 'What sticker is on the back?' or 'What are the initials written inside?'"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Helps ensure only the rightful owner can verify and claim the item.
                </span>
              </div>

              {/* Submit / Cancel */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || !formTitle.trim() || !formSpecificLocation.trim()}
                  className="px-5 py-2.5 bg-[#002B66] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-40"
                >
                  {formSubmitting ? 'Publishing...' : 'Publish Found Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Claim Item */}
      {selectedItemForClaim && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                  RECOVERY CLAIM
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Claim: {selectedItemForClaim.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedItemForClaim.campusLocation} • {selectedItemForClaim.specificLocation}
                </p>
              </div>
              <button 
                onClick={() => setSelectedItemForClaim(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {claimSuccessFeedback ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-extrabold text-sm text-emerald-900">Claim Registered Successfully!</h3>
                <p className="text-xs text-emerald-700">
                  {selectedItemForClaim.heldAtSecurityDesk 
                    ? `Please proceed to ${selectedItemForClaim.securityDeskName || 'Campus Security'} with your student card and reference ${selectedItemForClaim.securityReferenceNumber || 'your name'}.`
                    : `Notification sent to finder ${selectedItemForClaim.reportedByName}. You can also connect via direct messages.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                {/* Item Summary Card */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <img 
                    src={selectedItemForClaim.photoUrl} 
                    alt={selectedItemForClaim.title} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold text-slate-900 block">{selectedItemForClaim.title}</span>
                    <span className="text-slate-500 block">Found: {selectedItemForClaim.dateFoundOrLost}</span>
                    {selectedItemForClaim.heldAtSecurityDesk && (
                      <span className="inline-block bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        Logged at {selectedItemForClaim.securityDeskName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Finder's Verification Question if provided */}
                {selectedItemForClaim.verificationQuestion && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Finder's Verification Challenge
                    </span>
                    <p className="text-xs font-bold text-amber-900">
                      "{selectedItemForClaim.verificationQuestion}"
                    </p>
                  </div>
                )}

                {/* Proof of Ownership */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe Proof of Ownership / Identifying Features *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={claimProof}
                    onChange={(e) => setClaimProof(e.target.value)}
                    placeholder="Provide details only the true owner would know: wallpaper/passcode, stickers, engraving, scratch marks, or what's inside..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B66]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Richfield Student Number (9 Digits)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={9}
                        value={claimStudentId}
                        onChange={(e) => setClaimStudentId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        placeholder="e.g. 202488412"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                      />
                    </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Email / Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={claimContact}
                      onChange={(e) => setClaimContact(e.target.value)}
                      placeholder="Your contact information"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedItemForClaim(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={claimSubmitting || !claimProof.trim()}
                    className="px-5 py-2.5 bg-[#002B66] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-40"
                  >
                    {claimSubmitting ? 'Verifying...' : 'Submit Claim Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 3: View Details & Claims */}
      {selectedItemForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#002B66]">
                  ITEM PROFILE & AUDIT LOG
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  {selectedItemForDetails.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reference: #{selectedItemForDetails.id}
                </p>
              </div>
              <button 
                onClick={() => setSelectedItemForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 h-52">
                <img 
                  src={selectedItemForDetails.photoUrl} 
                  alt={selectedItemForDetails.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className="font-extrabold text-slate-900 capitalize">
                    {selectedItemForDetails.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Location Tag</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                    <span>{selectedItemForDetails.campusLocation}</span>
                  </div>
                  <div className="text-slate-600 pl-4">{selectedItemForDetails.specificLocation}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                  <span className="font-semibold text-slate-800">{selectedItemForDetails.category}</span>
                </div>

                {selectedItemForDetails.heldAtSecurityDesk && (
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg space-y-0.5">
                    <div className="font-bold text-blue-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>{selectedItemForDetails.securityDeskName || 'Campus Security'}</span>
                    </div>
                    <div className="text-[10px] text-blue-800">
                      Ticket Ref: <strong>{selectedItemForDetails.securityReferenceNumber || 'Registered'}</strong>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Reported By</span>
                  <span className="font-bold text-slate-800">{selectedItemForDetails.reportedByName} ({selectedItemForDetails.reportedByRole})</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold block text-slate-900">Finder Notes:</span>
              <p>{selectedItemForDetails.description}</p>
            </div>

            {/* Registered Claims Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center justify-between">
                <span>Claims & Verifications ({selectedItemForDetails.claims.length})</span>
                {selectedItemForDetails.claims.length === 0 && (
                  <span className="text-[11px] text-slate-400 font-normal">No claims registered yet</span>
                )}
              </h4>

              {selectedItemForDetails.claims.map(claim => {
                const isReporter = selectedItemForDetails.reportedByUserId === currentUser.id;
                const isAdmin = currentUser.role === 'admin';

                return (
                  <div key={claim.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{claim.claimantName}</span>
                        {claim.claimantStudentId && (
                          <span className="text-[10px] text-slate-500 font-mono">({claim.claimantStudentId})</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        claim.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Proof submitted:</strong> "{claim.proofDescription}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Contact: {claim.contactEmailOrPhone}</span>
                      
                      {/* Finder or Admin can approve this claim */}
                      {(isReporter || isAdmin) && claim.status === 'pending' && (
                        <button
                          onClick={() => {
                            handleApproveClaim(selectedItemForDetails.id, claim.id);
                            setSelectedItemForDetails(null);
                          }}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve Claim & Mark Returned</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hand to security quick action if finder still holds item */}
            {(selectedItemForDetails.reportedByUserId === currentUser.id || currentUser.role === 'admin') && 
              !selectedItemForDetails.heldAtSecurityDesk && 
              selectedItemForDetails.status !== 'recovered' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Handed this item into campus security? Update the custody status:</span>
                </div>
                <button
                  onClick={() => {
                    handleHandToSecurity(
                      selectedItemForDetails.id,
                      `${selectedItemForDetails.campusLocation} Main Security Counter`,
                      `RF-SEC-${Math.floor(100 + Math.random() * 900)}`
                    );
                    setSelectedItemForDetails(null);
                  }}
                  className="px-3 py-1.5 bg-[#002B66] text-white rounded-lg font-bold shrink-0 shadow-xs text-xs"
                >
                  Mark Logged at Security
                </button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
