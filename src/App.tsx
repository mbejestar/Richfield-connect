import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { FeedView } from './components/FeedView';
import { MentorshipView } from './components/MentorshipView';
import { NetworkView } from './components/NetworkView';
import { MessagesView } from './components/MessagesView';
import { JobsView } from './components/JobsView';
import { EventsView } from './components/EventsView';
import { LibraryView } from './components/LibraryView';
import { CodeHubView } from './components/CodeHubView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminView } from './components/AdminView';
import { ProfileView } from './components/ProfileView';
import { EduMatchView } from './components/EduMatchView';
import { StudyWellnessView } from './components/StudyWellnessView';
import { LostAndFoundView } from './components/LostAndFoundView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AuthView } from './components/AuthView';
import { ShieldAlert } from 'lucide-react';

import { 
  mockUsers, 
  mockPosts, 
  mockMentors, 
  mockSessions, 
  mockMessages, 
  mockJobs, 
  mockExamRunways, 
  mockCampusEvents, 
  mockBooks, 
  mockTransfers, 
  mockModerationLogs,
  mockLostFoundItems,
  DEFAULT_ROLE_CREDENTIALS 
} from './mockData';

import { 
  UserProfile, 
  UserRole, 
  Post, 
  MentorshipSession, 
  DirectMessage, 
  JobOpportunity, 
  BookTransferRequest, 
  ModerationLog,
  LostAndFoundItem
} from './types';

export default function App() {
  // 1. User & RBAC State (Defaults to 3rd Year Student Thabiso Khosi)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('richfield_saved_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return mockUsers[0];
  });
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 3. AI Assistant Modal State
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // 4. Application Data States
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [mentors, setMentors] = useState<UserProfile[]>(mockMentors);
  const [sessions, setSessions] = useState<MentorshipSession[]>(mockSessions);
  const [messages, setMessages] = useState<DirectMessage[]>(mockMessages);
  const [jobs, setJobs] = useState<JobOpportunity[]>(mockJobs);
  const [books, setBooks] = useState(mockBooks);
  const [transfers, setTransfers] = useState<BookTransferRequest[]>(mockTransfers);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(mockModerationLogs);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>(['user-2', 'user-3']);

  // 5. Lost and Found Shared State
  const [lostAndFoundItems, setLostAndFoundItems] = useState<LostAndFoundItem[]>(() => {
    try {
      const saved = localStorage.getItem('richfield_digital_lost_found_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return mockLostFoundItems;
  });

  const handleUpdateLostFoundItems = (newItems: LostAndFoundItem[]) => {
    setLostAndFoundItems(newItems);
    try {
      localStorage.setItem('richfield_digital_lost_found_v1', JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveLostFoundClaim = (itemId: string, claimId: string) => {
    const updated = lostAndFoundItems.map(item => {
      if (item.id === itemId) {
        const targetClaim = item.claims.find(c => c.id === claimId);
        return {
          ...item,
          status: 'recovered' as const,
          resolvedAt: 'Today',
          resolvedToUserId: targetClaim?.claimantUserId,
          resolvedToUserName: targetClaim?.claimantName,
          claims: item.claims.map(c => c.id === claimId ? { ...c, status: 'approved' as const } : c)
        };
      }
      return item;
    });
    handleUpdateLostFoundItems(updated);
  };

  const handleRejectLostFoundClaim = (itemId: string, claimId: string) => {
    const updated = lostAndFoundItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          claims: item.claims.map(c => c.id === claimId ? { ...c, status: 'rejected' as const } : c),
          status: item.claims.some(c => c.id !== claimId && c.status === 'pending') ? 'pending_verification' as const : 'open' as const
        };
      }
      return item;
    });
    handleUpdateLostFoundItems(updated);
  };

  const handleVerifyRecruiter = (userId: string) => {
    setCurrentUser(prev => {
      if (prev.id === userId || prev.role === 'recruiter') {
        const updated = {
          ...prev,
          verified: true,
          verificationStatus: 'verified' as const
        };
        try {
          localStorage.setItem('richfield_saved_user', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      }
      return prev;
    });
  };

  // Handle Login & Logout
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'recruiter') {
      setActiveTab('jobs');
    } else if (user.role === 'alumni') {
      setActiveTab('mentor');
    } else {
      setActiveTab('feed');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('richfield_saved_user');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  // Global search handler
  const handleGlobalSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('lost') || q.includes('found') || q.includes('item') || q.includes('charger') || q.includes('recovery')) {
      setActiveTab('lostfound');
    } else if (q.includes('announcement') || q.includes('feed') || q.includes('notice')) {
      setActiveTab('feed');
    } else if (q.includes('edumatch') || q.includes('game') || q.includes('quiz') || q.includes('challenge') || q.includes('buddy') || q.includes('streak') || q.includes('play')) {
      setActiveTab('edumatch');
    } else if (q.includes('profile') || q.includes('portfolio') || q.includes('cv') || q.includes('resume')) {
      setActiveTab('profile');
    } else if (q.includes('job') || q.includes('bursary') || q.includes('intern')) {
      setActiveTab('jobs');
    } else if (q.includes('book') || q.includes('library') || q.includes('isbn') || q.includes('transfer')) {
      setActiveTab('library');
    } else if (q.includes('mentor') || q.includes('tutor')) {
      setActiveTab('mentor');
    } else if (q.includes('exam') || q.includes('runway') || q.includes('event')) {
      setActiveTab('events');
    } else if (q.includes('code') || q.includes('snippet') || q.includes('ts') || q.includes('python')) {
      setActiveTab('codehub');
    } else {
      setActiveTab('network');
    }
  };

  // Explicit User Switcher (Supports Themba Billa Pro Student vs Thabiso Khosi Standard)
  const handleSelectUser = (userIdOrObj: string | UserProfile) => {
    if (typeof userIdOrObj === 'string') {
      const found = mockUsers.find(u => u.id === userIdOrObj);
      if (found) {
        setCurrentUser(found);
        try {
          localStorage.setItem('richfield_saved_user', JSON.stringify(found));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setCurrentUser(userIdOrObj);
      try {
        localStorage.setItem('richfield_saved_user', JSON.stringify(userIdOrObj));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Role Switcher (RBAC Perspective Simulator)
  const handleRoleSelect = (role: UserRole) => {
    const targetUser = mockUsers.find(u => u.role === role) || {
      ...currentUser,
      role: role,
      name: role === 'admin' ? 'Lesiba (Richfield Admin)' :
            role === 'alumni' ? 'Mpho Molefe (Alumni)' :
            role === 'recruiter' ? 'Vodacom Campus Talent Partner' : 'Richfield Student'
    };
    handleSelectUser(targetUser);

    // Enforce role landing & page transition
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'recruiter') {
      // Recruiter lands immediately on Talent Hub & AI Top 10 Student Radar
      setActiveTab('jobs');
    } else if (role === 'alumni') {
      setActiveTab('mentor');
    } else {
      // If student or lecturer was on an admin-only page, switch to campus feed
      if (activeTab === 'admin') {
        setActiveTab('feed');
      }
    }
  };

  // Create Post Handler (With Anti-Bullying / Toxicity AI Scan & Institutional Academic Policy)
  const handleCreatePost = async (newPostData: Partial<Post>): Promise<{ success: boolean; reason?: string }> => {
    const rawContent = (newPostData.content || '').toLowerCase();
    
    // Immediate client-side strict policy scan for non-academic party solicitations & harassment
    const partyTerms = [
      'house party', 'houseparty', 'party happening', 'party tomorrow', 'party tonight', 
      'wild party', 'drinking party', 'drinks bash', 'afterparty', 'after party', 
      'rave tonight', 'clubbing tonight', 'beer pong', 'byob', 'keg party', 'party at my place'
    ];
    const toxicTerms = ['attack', 'kill', 'useless lecturer', 'idiot', 'hate', 'scam', 'cheat on exam', 'leak exam'];

    const matchedParty = partyTerms.find(t => rawContent.includes(t));
    if (matchedParty) {
      const reason = `EnrichHub is strictly an academic, research, and career development platform. Posting about unauthorized social events or "${matchedParty}" violates Section 2.4 Campus Guidelines.`;
      const newLog: ModerationLog = {
        id: `log-${Date.now()}`,
        contentType: 'post',
        contentSnippet: newPostData.content || '',
        authorId: currentUser.id,
        authorName: currentUser.name,
        aiToxicityScore: 0.85,
        flaggedReason: 'Non-Academic Content / House Party Solicitation',
        timestamp: 'Just now',
        actionTaken: 'blocked'
      };
      setModerationLogs(prev => [newLog, ...prev]);
      return { success: false, reason };
    }

    const matchedToxic = toxicTerms.find(t => rawContent.includes(t));
    if (matchedToxic) {
      const reason = `Your post was blocked by EnrichHub Safety Guard: Content violates Anti-Bullying and Academic Conduct policies (${matchedToxic}).`;
      const newLog: ModerationLog = {
        id: `log-${Date.now()}`,
        contentType: 'post',
        contentSnippet: newPostData.content || '',
        authorId: currentUser.id,
        authorName: currentUser.name,
        aiToxicityScore: 0.92,
        flaggedReason: 'Cyberbullying / Academic Misconduct',
        timestamp: 'Just now',
        actionTaken: 'blocked'
      };
      setModerationLogs(prev => [newLog, ...prev]);
      return { success: false, reason };
    }

    try {
      const response = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostData.content,
          authorName: currentUser.name,
          role: currentUser.role
        })
      });

      const moderationResult = await response.json();

      if (!moderationResult.isSafe) {
        const violationReason = moderationResult.aiExplanation || moderationResult.flaggedReason || 'Your post was flagged by EnrichHub Safety Guard for policy violation.';
        // Log violation for Admin audit
        const newLog: ModerationLog = {
          id: `log-${Date.now()}`,
          contentType: 'post',
          contentSnippet: newPostData.content || '',
          authorId: currentUser.id,
          authorName: currentUser.name,
          aiToxicityScore: moderationResult.toxicityScore || 0.85,
          flaggedReason: moderationResult.flaggedCategories?.[0] || moderationResult.flaggedReason || 'Harassment / Policy Violation',
          timestamp: 'Just now',
          actionTaken: moderationResult.toxicityScore > 0.7 ? 'blocked' : 'flagged'
        };
        setModerationLogs(prev => [newLog, ...prev]);

        return {
          success: false,
          reason: violationReason
        };
      }

      // If safe, publish to the cohort feed
      const newPost: Post = {
        id: `post-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorHeadline: currentUser.headline,
        authorCampus: currentUser.campus,
        authorRole: currentUser.role,
        content: newPostData.content || '',
        cohort: newPostData.cohort || 'General',
        qualificationCategory: newPostData.qualificationCategory || 'All',
        likesCount: 0,
        likedBy: [],
        comments: [],
        createdAt: 'Just now',
        tags: newPostData.tags || ['EnrichHub'],
        codeSnippet: newPostData.codeSnippet
      };

      setPosts(prev => [newPost, ...prev]);
      return { success: true };

    } catch (err) {
      // Fallback local safe publish with policy verification
      const newPost: Post = {
        id: `post-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorHeadline: currentUser.headline,
        authorCampus: currentUser.campus,
        authorRole: currentUser.role,
        content: newPostData.content || '',
        cohort: newPostData.cohort || 'General',
        qualificationCategory: newPostData.qualificationCategory || 'All',
        likesCount: 0,
        likedBy: [],
        comments: [],
        createdAt: 'Just now',
        tags: newPostData.tags || ['EnrichHub'],
        codeSnippet: newPostData.codeSnippet
      };

      setPosts(prev => [newPost, ...prev]);
      return { success: true };
    }
  };

  // Like Post
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likedBy.includes(currentUser.id);
        return {
          ...p,
          likesCount: hasLiked ? p.likesCount - 1 : p.likesCount + 1,
          likedBy: hasLiked ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id]
        };
      }
      return p;
    }));
  };

  // Add Comment
  const handleAddComment = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `comm-${Date.now()}`,
              authorId: currentUser.id,
              authorName: currentUser.name,
              authorRole: currentUser.role,
              authorAvatar: currentUser.avatar,
              content: commentText,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return p;
    }));
  };

  // Request Mentorship Session (Creates Pending Call Request for Mentor Review)
  const handleRequestMentorship = async (
    mentorId: string, 
    topic: string, 
    domain: string, 
    notes?: string,
    scheduledTime?: string,
    meetPlatform?: string
  ): Promise<{ success: boolean; message: string }> => {
    const targetMentor = mentors.find(m => m.id === mentorId);
    if (!targetMentor) return { success: false, message: 'Mentor not found.' };

    // Capacity Check
    const currentMentees = targetMentor.currentMenteesCount || 0;
    const maxCapacity = targetMentor.maxMentees || 4;
    if (currentMentees >= maxCapacity) {
      return { success: false, message: `Mentor is currently at full capacity (${maxCapacity}/${maxCapacity} mentees).` };
    }

    const timeString = scheduledTime || 'Thursday, 14:00 SAST';

    try {
      const response = await fetch('/api/ai/mentorship-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: currentUser,
          mentorProfile: targetMentor,
          requestedTopic: topic
        })
      });

      const data = await response.json();

      const newSession: MentorshipSession = {
        id: `sess-${Date.now()}`,
        mentorId: targetMentor.id,
        mentorName: targetMentor.name,
        mentorDomain: domain,
        menteeId: currentUser.id,
        menteeName: currentUser.name,
        menteeYear: currentUser.academicYear || '3rd Year',
        topic: topic,
        scheduledTime: timeString,
        status: 'pending',
        meetLink: `https://meet.google.com/enrich-call-${Math.floor(100 + Math.random() * 900)}`,
        studentNotes: notes,
        isSafetyMonitored: true
      };

      setSessions(prev => [newSession, ...prev]);

      return {
        success: true,
        message: data.feedback || `Call request sent to ${targetMentor.name}! Waiting for mentor confirmation.`
      };

    } catch (err) {
      const newSession: MentorshipSession = {
        id: `sess-${Date.now()}`,
        mentorId: targetMentor.id,
        mentorName: targetMentor.name,
        mentorDomain: domain,
        menteeId: currentUser.id,
        menteeName: currentUser.name,
        menteeYear: currentUser.academicYear || '3rd Year',
        topic: topic,
        scheduledTime: timeString,
        status: 'pending',
        meetLink: `https://meet.google.com/enrich-call-${Math.floor(100 + Math.random() * 900)}`,
        studentNotes: notes,
        isSafetyMonitored: true
      };

      setSessions(prev => [newSession, ...prev]);
      return { success: true, message: `Call request sent to ${targetMentor.name}! Waiting for mentor confirmation.` };
    }
  };

  const handleAcceptMentorshipSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'accepted',
          meetLink: s.meetLink || `https://meet.google.com/enrich-call-${s.id.replace('sess-', '')}`
        };
      }
      return s;
    }));

    // Increment mentor's active mentee count
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setMentors(prev => prev.map(m => m.id === session.mentorId ? { ...m, currentMenteesCount: (m.currentMenteesCount || 0) + 1 } : m));
    }
  };

  const handleDeclineMentorshipSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'declined' };
      }
      return s;
    }));
  };

  // Send Direct Message (with Priority Classifier)
  const handleSendMessage = async (receiverId: string, receiverName: string, text: string) => {
    try {
      const response = await fetch('/api/ai/prioritize-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          recipientRole: 'mentor'
        })
      });

      const data = await response.json();

      const newMsg: DirectMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        receiverId: receiverId,
        content: text,
        timestamp: 'Just now',
        category: data.category || 'priority',
        priorityReason: data.reason || 'Student Communication',
        isSpam: data.isSpam || false
      };

      setMessages(prev => [newMsg, ...prev]);
      return { success: true, priorityReason: data.reason, isSpam: data.isSpam };

    } catch (err) {
      const newMsg: DirectMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        receiverId: receiverId,
        content: text,
        timestamp: 'Just now',
        category: 'priority',
        priorityReason: 'Verified Student Peer Message',
        isSpam: false
      };

      setMessages(prev => [newMsg, ...prev]);
      return { success: true };
    }
  };

  // Connect user in Network
  const handleSendConnection = (targetUserId: string) => {
    if (!connectedUserIds.includes(targetUserId)) {
      setConnectedUserIds(prev => [...prev, targetUserId]);
    }
  };

  // 1-Click Apply for Job / Bursary
  const handleApplyJob = async (jobId: string): Promise<{ success: boolean; message: string }> => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId && !j.applicantIds.includes(currentUser.id)) {
        return {
          ...j,
          applicantIds: [...j.applicantIds, currentUser.id]
        };
      }
      return j;
    }));

    return {
      success: true,
      message: `Application submitted successfully! Your verified Richfield academic transcript and student profile have been transmitted to the recruiter.`
    };
  };

  // Create Job (Recruiter / Campus Manager)
  const handleCreateJob = async (newJobData: Partial<JobOpportunity>): Promise<{ success: boolean; message: string }> => {
    const newJob: JobOpportunity = {
      id: `job-${Date.now()}`,
      title: newJobData.title || '',
      company: newJobData.company || '',
      location: newJobData.location || 'Johannesburg, South Africa',
      campusTarget: newJobData.campusTarget || 'All Richfield Campuses',
      type: newJobData.type || 'bursary',
      qualification: newJobData.qualification || 'Both',
      yearRequirement: newJobData.yearRequirement || 'All Years',
      stipendOrSalary: newJobData.stipendOrSalary || 'Market Related',
      description: newJobData.description || '',
      requirements: newJobData.requirements || [],
      deadline: newJobData.deadline || 'December 31, 2026',
      postedBy: currentUser.id,
      postedByName: currentUser.name,
      applicantIds: [],
      isVerified: true,
      createdAt: 'Just now'
    };

    setJobs(prev => [newJob, ...prev]);
    return { success: true, message: 'Bursary opportunity published to Richfield students.' };
  };

  // Inter-Campus Book Transfer
  const handleRequestTransfer = async (
    bookId: string,
    bookTitle: string,
    fromCampus: string,
    toCampus: string,
    studentIdNumber: string
  ): Promise<{ success: boolean; message: string }> => {
    // Validate Richfield Student Number: strictly 9 digits
    const cleanId = studentIdNumber.trim().replace(/\D/g, '');
    if (cleanId.length !== 9) {
      return { success: false, message: 'Invalid Richfield Student Number format. Richfield student number must be exactly 9 digits (e.g., 202488421).' };
    }

    const newTransfer: BookTransferRequest = {
      id: `tr-${Date.now()}`,
      bookId: bookId,
      bookTitle: bookTitle,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentIdNumber: studentIdNumber,
      fromCampus: fromCampus,
      toCampus: toCampus,
      status: 'in-transit',
      courierTrackingNumber: `RF-SHUTTLE-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedArrival: 'In 2 Business Days'
    };

    setTransfers(prev => [newTransfer, ...prev]);
    return {
      success: true,
      message: `Inter-campus transfer approved! Dispatched via Richfield Courier Shuttle (Tracking: ${newTransfer.courierTrackingNumber}). ETA: 2 business days.`
    };
  };

  // Admin Log Actions
  const handleApproveLog = (logId: string) => {
    setModerationLogs(prev => prev.map(l => l.id === logId ? { ...l, actionTaken: 'approved' } : l));
  };

  const handleRejectLog = (logId: string) => {
    setModerationLogs(prev => prev.map(l => l.id === logId ? { ...l, actionTaken: 'blocked' } : l));
  };

  // If logged out, display dedicated AuthView screen
  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 1. Global Navbar */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleRoleSelect}
        onSelectUser={handleSelectUser}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onSearchSelect={handleGlobalSearch}
        unreadCount={messages.filter(m => m.category === 'priority').length}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* 2. Main App Body (Sidebar + Content Workspace) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentUser={currentUser}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
            onSwitchPerspective={() => {
              const nextRole: UserRole = 
                currentUser.role === 'student' ? 'alumni' :
                currentUser.role === 'alumni' ? 'recruiter' :
                currentUser.role === 'recruiter' ? 'admin' : 'student';
              handleRoleSelect(nextRole);
            }}
            unreadMessagesCount={messages.filter(m => m.category === 'priority').length}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-slate-900 h-full shadow-2xl z-10 flex flex-col justify-between">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                currentUser={currentUser}
                onOpenAIAssistant={() => {
                  setShowAIAssistant(true);
                  setMobileMenuOpen(false);
                }}
                onSwitchPerspective={() => {
                  const nextRole: UserRole = 
                    currentUser.role === 'student' ? 'alumni' :
                    currentUser.role === 'alumni' ? 'recruiter' :
                    currentUser.role === 'recruiter' ? 'admin' : 'student';
                  handleRoleSelect(nextRole);
                }}
                unreadMessagesCount={messages.filter(m => m.category === 'priority').length}
              />
            </div>
          </div>
        )}

        {/* Dynamic View Canvas */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto">
          {activeTab === 'feed' && (
            <FeedView
              posts={posts}
              currentUser={currentUser}
              onCreatePost={handleCreatePost}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onOpenAIAssistant={() => setShowAIAssistant(true)}
              onNavigateToEduMatch={() => setActiveTab('edumatch')}
              onNavigateToLostFound={() => setActiveTab('lostfound')}
            />
          )}

          {activeTab === 'lostfound' && (
            <LostAndFoundView
              currentUser={currentUser}
              items={lostAndFoundItems}
              onUpdateItems={handleUpdateLostFoundItems}
              onNavigateToAnnouncements={() => setActiveTab('feed')}
              onOpenDirectMessage={(userId) => {
                setActiveTab('messages');
              }}
            />
          )}

          {activeTab === 'study' && (
            <StudyWellnessView
              currentUser={currentUser}
              onNavigateToEduMatch={() => setActiveTab('edumatch')}
              onNavigateToMentor={() => setActiveTab('mentor')}
              onSwitchUser={handleSelectUser}
            />
          )}

          {activeTab === 'edumatch' && (
            <EduMatchView
              currentUser={currentUser}
              onNavigateToMessages={(recipientName, initialMessage) => {
                setActiveTab('messages');
              }}
              onNavigateToLibrary={(query) => {
                setActiveTab('library');
              }}
              onNavigateToNetwork={() => setActiveTab('network')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onUpdateUser={(updated) => {
                setCurrentUser(prev => ({ ...prev, ...updated }));
              }}
              onOpenAIAssistant={() => setShowAIAssistant(true)}
            />
          )}

          {activeTab === 'mentor' && (
            <MentorshipView
              mentors={mentors}
              sessions={sessions}
              currentUser={currentUser}
              onRequestSession={handleRequestMentorship}
              onAcceptSession={handleAcceptMentorshipSession}
              onDeclineSession={handleDeclineMentorshipSession}
              onNavigateToJobs={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'network' && (
            <NetworkView
              users={mockUsers}
              currentUser={currentUser}
              onSendConnection={handleSendConnection}
              onStartDirectMessage={(u) => {
                setActiveTab('messages');
              }}
              connectedUserIds={connectedUserIds}
              onNavigateToEduMatch={() => setActiveTab('edumatch')}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesView
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'jobs' && (
            <JobsView
              jobs={jobs}
              currentUser={currentUser}
              onApplyJob={handleApplyJob}
              onCreateJob={handleCreateJob}
            />
          )}

          {activeTab === 'events' && (
            <EventsView
              events={mockCampusEvents}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              books={books}
              transfers={transfers}
              currentUser={currentUser}
              onRequestTransfer={handleRequestTransfer}
            />
          )}

          {activeTab === 'codehub' && (
            <CodeHubView
              currentUser={currentUser}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              currentUser={currentUser}
            />
          )}

          {activeTab === 'admin' && (
            currentUser.role === 'admin' ? (
              <AdminView
                logs={moderationLogs}
                currentUser={currentUser}
                onApproveLog={handleApproveLog}
                onRejectLog={handleRejectLog}
                lostAndFoundItems={lostAndFoundItems}
                onApproveLostFoundClaim={handleApproveLostFoundClaim}
                onRejectLostFoundClaim={handleRejectLostFoundClaim}
                onVerifyRecruiter={handleVerifyRecruiter}
              />
            ) : (
              <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-lg space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    RBAC Security Clearance Restricted
                  </span>
                  <h2 className="text-xl font-black text-slate-900 pt-2">
                    Access Denied: Institutional Admin Clearance Required
                  </h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    The Richfield Directorate Admin Console is strictly reserved for verified institutional administrators. Your current active role is <strong className="text-indigo-900 font-bold capitalize">{currentUser.role} ({currentUser.name})</strong>.
                  </p>
                </div>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab(currentUser.role === 'recruiter' ? 'jobs' : 'feed')}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow transition-all"
                  >
                    Return to {currentUser.role === 'recruiter' ? 'Talent Hub & AI Radar' : 'Campus Feed'}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition-all"
                  >
                    Switch to Admin Role
                  </button>
                </div>
              </div>
            )
          )}
        </main>

      </div>

      {/* 3. AI Assistant Modal (Profile Onboarding & Campus Copilot) */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        currentUser={currentUser}
        onUpdateProfile={(updated) => {
          setCurrentUser(prev => ({ ...prev, ...updated }));
        }}
      />

    </div>
  );
}
