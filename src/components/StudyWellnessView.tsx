import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Plus, 
  Search, 
  Clock, 
  ArrowRight, 
  Pin, 
  Trash2, 
  Copy, 
  Share2,
  ExternalLink,
  Flame,
  CheckCircle,
  FileText,
  ChevronRight,
  Filter,
  UserCheck,
  X,
  Target,
  Zap,
  PhoneCall,
  Lock,
  Smile,
  Meh,
  Frown,
  Activity,
  Layers,
  Award,
  GraduationCap,
  Users
} from 'lucide-react';
import { UserProfile, StudentCourse, CourseAssessment, StudyFortnightPlan } from '../types';
import { mockUsers } from '../mockData';

// Refreshed pre-loaded courses with customized marks & syllabus modules
const INITIAL_COURSES: StudentCourse[] = [
  {
    id: 'c-hci600',
    code: 'HCI600',
    name: 'HUMAN COMPUTER INTERACTION & UX DESIGN 600',
    year: '2026',
    semester: 'S1',
    faculty: 'Information Technology',
    color: 'border-yellow-500',
    colorHex: '#EAB308',
    currentMark: 76,
    statusText: 'Merit · 76%',
    goalTarget: 82,
    credits: 15,
    notesCount: 6,
    lecturerName: 'Dr. Sipho Mthembu',
    syllabusOutline: 'Usability Heuristics, Cognitive Walkthroughs, WCAG 2.1 Accessibility, Wireframing, UX Quantitative Metrics, Task Analysis',
    assessments: [
      { id: 'a-1', name: 'Assignment 1: Mobile Interface Usability Audit', type: 'Assignment', weight: 20, score: 78, status: 'Completed', dueDate: '14 Feb 2026' },
      { id: 'a-2', name: 'Test 1: Cognitive Load & Ergonomics Theory', type: 'Test', weight: 25, score: 74, status: 'Completed', dueDate: '02 Mar 2026' },
      { id: 'a-3', name: 'Semester Capstone Project: High-Fidelity Prototype', type: 'Project', weight: 20, score: 80, status: 'Completed', dueDate: '20 Apr 2026' },
      { id: 'a-4', name: 'Final Summative Examination', type: 'Exam', weight: 35, status: 'Upcoming', dueDate: '15 Jun 2026' }
    ]
  },
  {
    id: 'c-itp600a',
    code: 'ITP600A',
    name: 'IT PROJECT & CLOUD ARCHITECTURE 600',
    year: '2026',
    semester: 'S2',
    faculty: 'Information Technology',
    color: 'border-cyan-500',
    colorHex: '#06B6D4',
    currentMark: 84,
    statusText: 'Distinction · 84%',
    goalTarget: 88,
    credits: 20,
    notesCount: 5,
    lecturerName: 'Prof. Alan Khuzwayo',
    syllabusOutline: 'Agile Scrum Lifecycle, Sprint Ceremonies, Architecture Diagrams, CI/CD Pipelines, Institutional Cloud Deployment, Industry Demo',
    assessments: [
      { id: 'a-5', name: 'Software Project Charter & SRS Document', type: 'Project', weight: 20, score: 86, status: 'Completed', dueDate: '10 Aug 2026' },
      { id: 'a-6', name: 'Midterm Sprint Demo & Code Review', type: 'Assignment', weight: 30, score: 82, status: 'Completed', dueDate: '15 Sep 2026' },
      { id: 'a-7', name: 'Final Industry Panel Pitch & Live Deploy', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '05 Nov 2026' }
    ]
  },
  {
    id: 'c-itpm600a',
    code: 'ITPM600A',
    name: 'IT PROJECT MANAGEMENT & AGILE LEADERSHIP 600',
    year: '2026',
    semester: 'S1',
    faculty: 'Information Technology',
    color: 'border-pink-500',
    colorHex: '#EC4899',
    currentMark: 72,
    statusText: 'Pass with Merit · 72%',
    goalTarget: 80,
    credits: 15,
    notesCount: 5,
    lecturerName: 'Dr. Lesiba Maruping',
    syllabusOutline: 'PMBOK Knowledge Areas, Critical Path Method (CPM), Earned Value Management (EVM), Risk Mitigation, Stakeholder Negotiation',
    assessments: [
      { id: 'a-8', name: 'Assignment 1: WBS & GANTT Optimization', type: 'Assignment', weight: 25, score: 75, status: 'Completed', dueDate: '20 Feb 2026' },
      { id: 'a-9', name: 'Test 1: Critical Path & Earned Value Formulas', type: 'Test', weight: 25, score: 70, status: 'Completed', dueDate: '18 Mar 2026' },
      { id: 'a-10', name: 'Final Exam: Enterprise Case Study Analysis', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '18 Jun 2026' }
    ]
  },
  {
    id: 'c-mis600a',
    code: 'MIS600A',
    name: 'MANAGEMENT INFO SYSTEMS & ENTERPRISE ERP 600',
    year: '2026',
    semester: 'S2',
    faculty: 'Information Technology',
    color: 'border-orange-500',
    colorHex: '#F97316',
    currentMark: 79,
    statusText: 'Merit · 79%',
    goalTarget: 85,
    credits: 15,
    notesCount: 4,
    lecturerName: 'Ms. Lerato Dlamini',
    syllabusOutline: 'Enterprise Resource Planning (ERP), Digital Supply Chains, Big Data Warehousing, Decision Support Systems (DSS), Cloud Governance',
    assessments: [
      { id: 'a-11', name: 'Case Study: Cloud ERP Digital Transformation', type: 'Assignment', weight: 25, score: 81, status: 'Completed', dueDate: '25 Aug 2026' },
      { id: 'a-12', name: 'Midterm Test: Data Governance & POPIA Compliance', type: 'Test', weight: 25, score: 77, status: 'Completed', dueDate: '22 Sep 2026' },
      { id: 'a-13', name: 'Summative Final Exam', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '10 Nov 2026' }
    ]
  },
  {
    id: 'c-net631',
    code: 'NET631',
    name: 'ADVANCED COMPUTER NETWORKING & INFRASTRUCTURE 631',
    year: '2026',
    semester: 'S1',
    faculty: 'Information Technology',
    color: 'border-purple-500',
    colorHex: '#A855F7',
    currentMark: 81,
    statusText: 'Distinction · 81%',
    goalTarget: 85,
    credits: 15,
    notesCount: 7,
    lecturerName: 'Eng. Devon Govender',
    syllabusOutline: 'OSI 7 Layers, Subnetting IPv4/IPv6, BGP & OSPF Routing, Wireshark Packet Inspection, VLAN Segmentation, Firewall ACLs',
    assessments: [
      { id: 'a-14', name: 'Lab Practical 1: Packet Tracer Multi-VLAN Routing', type: 'Assignment', weight: 25, score: 83, status: 'Completed', dueDate: '12 Feb 2026' },
      { id: 'a-15', name: 'Test 1: VLSM Subnetting Calculations', type: 'Test', weight: 25, score: 79, status: 'Completed', dueDate: '15 Mar 2026' },
      { id: 'a-16', name: 'Final Networking Exam', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '22 Jun 2026' }
    ]
  },
  {
    id: 'c-prg381',
    code: 'PRG381',
    name: 'ENTERPRISE SYSTEMS ARCHITECTURE & JAVA FULL-STACK',
    year: '2026',
    semester: 'S1',
    faculty: 'Information Technology',
    color: 'border-indigo-500',
    colorHex: '#6366F1',
    currentMark: 88,
    statusText: 'Distinction · 88%',
    goalTarget: 92,
    credits: 20,
    notesCount: 9,
    lecturerName: 'Dr. Sipho Mthembu',
    syllabusOutline: 'Spring Boot Microservices, Hibernate JPA, RESTful API Design, JWT Security, Multithreading & Concurrency, Docker Containerization',
    assessments: [
      { id: 'a-17', name: 'Assignment 1: Spring Data JPA & PostgreSQL Service', type: 'Assignment', weight: 25, score: 90, status: 'Completed', dueDate: '28 Feb 2026' },
      { id: 'a-18', name: 'Test 1: JVM Memory Heap & Concurrency Threads', type: 'Test', weight: 25, score: 86, status: 'Completed', dueDate: '25 Mar 2026' },
      { id: 'a-19', name: 'Final Java Microservices Exam', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '25 Jun 2026' }
    ]
  },
  {
    id: 'c-dbs381',
    code: 'DBS381',
    name: 'DISTRIBUTED DATABASE ARCHITECTURE & SQL OPTIMIZATION',
    year: '2026',
    semester: 'S1',
    faculty: 'Information Technology',
    color: 'border-emerald-500',
    colorHex: '#10B981',
    currentMark: 85,
    statusText: 'Distinction · 85%',
    goalTarget: 90,
    credits: 15,
    notesCount: 10,
    lecturerName: 'Prof. Linda Naidoo',
    syllabusOutline: 'Relational Calculus, ACID Transactions, B-Tree Indexing, Query Optimizer EXPLAIN ANALYZE, Stored Procedures, Normalization (1NF - BCNF)',
    assessments: [
      { id: 'a-20', name: 'Assignment 1: Complex SQL Queries & Window Functions', type: 'Assignment', weight: 25, score: 88, status: 'Completed', dueDate: '05 Mar 2026' },
      { id: 'a-21', name: 'Test 1: Transaction Isolation Levels & Locking', type: 'Test', weight: 25, score: 82, status: 'Completed', dueDate: '01 Apr 2026' },
      { id: 'a-22', name: 'Final Database Architecture Examination', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '29 Jun 2026' }
    ]
  },
  {
    id: 'c-cyb620',
    code: 'CYB620',
    name: 'DEFENSIVE CYBERSECURITY & THREAT HUNTING 620',
    year: '2026',
    semester: 'S1',
    faculty: 'Information Technology',
    color: 'border-teal-500',
    colorHex: '#14B8A6',
    currentMark: 80,
    statusText: 'Distinction · 80%',
    goalTarget: 85,
    credits: 15,
    notesCount: 5,
    lecturerName: 'Dr. Thandiwe Sithole',
    syllabusOutline: 'Penetration Testing, Cryptography, Zero-Trust Architecture, SIEM Log Analysis, Malware Analysis, Cloud Defense',
    assessments: [
      { id: 'a-23', name: 'Practical Lab 1: Vulnerability Scanning & Kali Linux', type: 'Assignment', weight: 25, score: 84, status: 'Completed', dueDate: '11 Mar 2026' },
      { id: 'a-24', name: 'Test 1: Public Key Cryptography & PKI Certificates', type: 'Test', weight: 25, score: 76, status: 'Completed', dueDate: '08 Apr 2026' },
      { id: 'a-25', name: 'Summative Security Defense Examination', type: 'Exam', weight: 50, status: 'Upcoming', dueDate: '02 Jul 2026' }
    ]
  }
];

export interface StudyNote {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  category: 'Lecture Summary' | 'Exam Trap' | 'Formula & Syntax' | 'Code Snippet';
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
}

export interface WellnessCheckIn {
  id: string;
  date: string;
  status: 'Tough' | 'OK' | 'Good';
  notes?: string;
}

interface StudyWellnessViewProps {
  currentUser: UserProfile;
  initialTab?: 'wellness' | 'courses' | 'study-plan' | 'motivations' | 'notes';
  onNavigateToEduMatch?: () => void;
  onNavigateToMentor?: () => void;
  onSwitchUser?: (user: UserProfile) => void;
}

export const StudyWellnessView: React.FC<StudyWellnessViewProps> = ({
  currentUser,
  initialTab = 'courses',
  onNavigateToEduMatch,
  onNavigateToMentor,
  onSwitchUser
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'wellness' | 'courses' | 'study-plan' | 'motivations' | 'notes'>(initialTab);

  // ----------------------------------------------------
  // COURSES MANAGEMENT STATE
  // ----------------------------------------------------
  const [courses, setCourses] = useState<StudentCourse[]>(() => {
    try {
      const saved = localStorage.getItem('richfield_student_courses_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COURSES;
  });

  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('2026');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('All');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<StudentCourse | null>(null);
  const [courseDetailSubTab, setCourseDetailSubTab] = useState<'assessments' | 'performance' | 'tutoring' | 'wizards'>('assessments');

  // Add Course Modal State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newYear, setNewYear] = useState('2026');
  const [newSemester, setNewSemester] = useState<'S1' | 'S2' | 'Year'>('S1');
  const [newFaculty, setNewFaculty] = useState<'Information Technology' | 'Business & Management Sciences'>('Information Technology');
  const [newGoal, setNewGoal] = useState(75);
  const [newCredits, setNewCredits] = useState(15);
  const [newLecturer, setNewLecturer] = useState('');

  // Add Assessment to Course Modal State
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
  const [newAssessName, setNewAssessName] = useState('');
  const [newAssessType, setNewAssessType] = useState<CourseAssessment['type']>('Assignment');
  const [newAssessWeight, setNewAssessWeight] = useState(20);
  const [newAssessScore, setNewAssessScore] = useState<number | ''>('');
  const [newAssessDueDate, setNewAssessDueDate] = useState('Tomorrow');

  // AI Outline Scan simulation
  const [isScanningOutline, setIsScanningOutline] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // ----------------------------------------------------
  // WELLNESS & CHECK-IN STATE
  // ----------------------------------------------------
  const [selectedMood, setSelectedMood] = useState<'Tough' | 'OK' | 'Good' | null>(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [privateReflectText, setPrivateReflectText] = useState('');
  const [requestedPeerCheckin, setRequestedPeerCheckin] = useState(false);
  const [activeAssessmentModal, setActiveAssessmentModal] = useState<string | null>(null);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  // Breathing exercise modal
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);

  const [checkInHistory, setCheckInHistory] = useState<WellnessCheckIn[]>([
    { id: 'chk-1', date: 'Yesterday', status: 'OK', notes: 'Exam revision underway. Feeling on track.' },
    { id: 'chk-2', date: '3 days ago', status: 'Good', notes: 'Nailed PRG381 assignment test!' },
    { id: 'chk-3', date: '5 days ago', status: 'Tough', notes: 'Long evening studying networking subnets.' }
  ]);

  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              if (current === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathCountdown(4);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  // ----------------------------------------------------
  // STUDY FORTNIGHT SCHEDULER STATE
  // ----------------------------------------------------
  const [freeTimeNote, setFreeTimeNote] = useState('');
  const [selectedTimeSlotPreference, setSelectedTimeSlotPreference] = useState<'Evenings & Weekends' | 'Morning Focus' | 'Flexible Day'>('Evenings & Weekends');
  const [fortnightPlan, setFortnightPlan] = useState<StudyFortnightPlan | null>(() => {
    try {
      const saved = localStorage.getItem('richfield_fortnight_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // ----------------------------------------------------
  // FOCUS TIMER (POMODORO) STATE
  // ----------------------------------------------------
  const [selectedTimerCourse, setSelectedTimerCourse] = useState('HCI600');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<0 | 1 | 2>(0); // 0: 25m focus, 1: 5m break, 2: 25m focus
  const intervalDurations = [25 * 60, 5 * 60, 25 * 60];
  const [timeLeft, setTimeLeft] = useState(intervalDurations[0]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(3);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(75);
  const [timerFeedback, setTimerFeedback] = useState<string | null>(null);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Ignored if audio context is blocked
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playChime();
            if (currentIntervalIndex === 0) {
              setCurrentIntervalIndex(1);
              setTotalFocusMinutes(m => m + 25);
              setTimerFeedback('🎉 25-minute study sprint complete! Take a 5-minute breather.');
              return intervalDurations[1];
            } else if (currentIntervalIndex === 1) {
              setCurrentIntervalIndex(2);
              setTimerFeedback('⚡ Break complete! Ready for your second 25-minute sprint.');
              return intervalDurations[2];
            } else {
              setIsTimerRunning(false);
              setCompletedSessionsCount(c => c + 1);
              setTotalFocusMinutes(m => m + 25);
              setCurrentIntervalIndex(0);
              setTimerFeedback('🏆 Fortnight study block checked off! +50 EduXP credited.');
              return intervalDurations[0];
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, currentIntervalIndex, soundEnabled]);

  // ----------------------------------------------------
  // MOTIVATIONS STATE
  // ----------------------------------------------------
  const [motivationSubTab, setMotivationSubTab] = useState<'for-me' | 'bridgeone' | 'students'>('for-me');
  const [studentQuotes, setStudentQuotes] = useState([
    {
      id: 'q-1',
      author: 'Philasande Ntuli',
      institution: 'Richfield Sandton Campus',
      quote: 'Don\'t count the days, make the days count. 3rd year will pass, but the degree and the tech mindset stay with you forever.',
      hearts: 48,
      userLiked: false
    },
    {
      id: 'q-2',
      author: 'Slindile Jokazi',
      institution: 'Richfield Durban Campus',
      quote: 'One chapter a night is better than 10 chapters the night before the exam. Small steady steps beat cramming panic every time.',
      hearts: 39,
      userLiked: false
    },
    {
      id: 'q-3',
      author: 'Annah Fakude',
      institution: 'Richfield Newtown Campus',
      quote: 'Resting is part of studying. Don\'t ever feel guilty for sleeping 8 hours so your brain can consolidate what you coded today.',
      hearts: 63,
      userLiked: true
    },
    {
      id: 'q-4',
      author: 'Sperance Hlatshwayo',
      institution: 'Richfield Pretoria Campus',
      quote: 'We didn\'t come this far to only come this far. Build the portfolio, reach out to alumni mentors, and claim your tech seat!',
      hearts: 77,
      userLiked: false
    }
  ]);
  const [newQuoteText, setNewQuoteText] = useState('');

  // ----------------------------------------------------
  // STUDY NOTES STATE
  // ----------------------------------------------------
  const [selectedNotesCourse, setSelectedNotesCourse] = useState<string>('All');
  const [notesSearchQuery, setNotesSearchQuery] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCourse, setNewNoteCourse] = useState('HCI600');
  const [newNoteCategory, setNewNoteCategory] = useState<StudyNote['category']>('Lecture Summary');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [notes, setNotes] = useState<StudyNote[]>([
    {
      id: 'note-1',
      courseCode: 'HCI600',
      courseName: 'HUMAN COMPUTER INTERACTION 600',
      title: 'Nielsen\'s 10 Usability Heuristics & Severity Ratings',
      category: 'Lecture Summary',
      content: '1. Visibility of system status\n2. Match between system and the real world\n3. User control and freedom (Emergency exit)\n4. Consistency and standards\n5. Error prevention > Error recovery\n6. Recognition rather than recall\n7. Flexibility and efficiency of use (Accelerators)\n8. Aesthetic and minimalist design\n9. Help users recognize, diagnose, and recover from errors\n10. Help and documentation.',
      tags: ['UX', 'Heuristics', 'Design'],
      pinned: true,
      createdAt: 'Yesterday'
    },
    {
      id: 'note-2',
      courseCode: 'NET631',
      courseName: 'NETWORKING 631',
      title: 'VLSM Subnet Calculation Quick Formula',
      category: 'Formula & Syntax',
      content: '• Subnet mask calculation: 2^(32 - CIDR) = Total IP addresses\n• Usable hosts: Total IPs - 2 (subtract Network ID and Broadcast ID)\n• /24 = 256 IPs (254 usable)\n• /27 = 32 IPs (30 usable)\n• /29 = 8 IPs (6 usable)\n• /30 = 4 IPs (2 usable for point-to-point router links)',
      tags: ['Subnetting', 'CIDR', 'IPv4'],
      pinned: true,
      createdAt: '3 days ago'
    },
    {
      id: 'note-3',
      courseCode: 'DBS381',
      courseName: 'DATABASE ARCHITECTURE & SQL',
      title: 'ACID Transactions & Row Lock Modes',
      category: 'Exam Trap',
      content: '• Atomicity: All or nothing execution (COMMIT or ROLLBACK)\n• Consistency: Database invariants and foreign keys preserved\n• Isolation: Serializable, Repeatable Read, Read Committed, Read Uncommitted\n• Durability: WAL (Write-Ahead Logging) persisted to disk before ack.',
      tags: ['ACID', 'Transactions', 'SQL'],
      pinned: false,
      createdAt: '5 days ago'
    }
  ]);

  // Persist courses to localStorage
  const saveCourses = (updated: StudentCourse[]) => {
    setCourses(updated);
    try {
      localStorage.setItem('richfield_student_courses_v3', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Add course handler
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const colors = [
      'border-yellow-500', 'border-cyan-500', 'border-pink-500', 
      'border-orange-500', 'border-purple-500', 'border-indigo-500', 'border-emerald-500'
    ];
    const pickedColor = colors[courses.length % colors.length];

    const newCourseObj: StudentCourse = {
      id: `c-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim().toUpperCase(),
      year: newYear,
      semester: newSemester,
      faculty: newFaculty,
      color: pickedColor,
      statusText: newSemester,
      goalTarget: Number(newGoal) || 75,
      credits: Number(newCredits) || 15,
      lecturerName: newLecturer.trim() || 'Richfield Faculty Lecturer',
      assessments: [
        { id: `a-${Date.now()}-1`, name: 'Semester Assignment 1', type: 'Assignment', weight: 20, status: 'Upcoming' },
        { id: `a-${Date.now()}-2`, name: 'Midterm Test', type: 'Test', weight: 30, status: 'Upcoming' },
        { id: `a-${Date.now()}-3`, name: 'Summative Final Examination', type: 'Exam', weight: 50, status: 'Upcoming' }
      ]
    };

    const updated = [newCourseObj, ...courses];
    saveCourses(updated);
    setShowAddCourseModal(false);
    setNewCode('');
    setNewName('');
    setNewLecturer('');
  };

  // Add Assessment Handler
  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForDetail || !newAssessName.trim()) return;

    const newAssess: CourseAssessment = {
      id: `a-${Date.now()}`,
      name: newAssessName.trim(),
      type: newAssessType,
      weight: Number(newAssessWeight) || 10,
      score: newAssessScore !== '' ? Number(newAssessScore) : undefined,
      status: newAssessScore !== '' ? 'Completed' : 'Upcoming',
      dueDate: newAssessDueDate
    };

    const updatedCourse = {
      ...selectedCourseForDetail,
      assessments: [...selectedCourseForDetail.assessments, newAssess]
    };

    const updatedAll = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    saveCourses(updatedAll);
    setSelectedCourseForDetail(updatedCourse);
    setShowAddAssessmentModal(false);
    setNewAssessName('');
    setNewAssessScore('');
  };

  // AI Scan Course Outline Handler
  const handleScanOutline = () => {
    setIsScanningOutline(true);
    setScanMessage(null);
    setTimeout(() => {
      setIsScanningOutline(false);
      if (selectedCourseForDetail) {
        const enrichedCourse = {
          ...selectedCourseForDetail,
          assessments: selectedCourseForDetail.assessments.length > 0 ? selectedCourseForDetail.assessments : [
            { id: `a-s1-${Date.now()}`, name: 'Diagnostic Capstone Assignment', type: 'Assignment' as const, weight: 20, score: 70, status: 'Completed' as const, dueDate: '10 Feb 2026' },
            { id: `a-s2-${Date.now()}`, name: 'Practical Midterm Lab Test', type: 'Test' as const, weight: 30, score: 65, status: 'Completed' as const, dueDate: '20 Mar 2026' },
            { id: `a-s3-${Date.now()}`, name: 'Comprehensive Final Summative Exam', type: 'Exam' as const, weight: 50, status: 'Upcoming' as const, dueDate: '25 Jun 2026' }
          ]
        };
        const updatedAll = courses.map(c => c.id === enrichedCourse.id ? enrichedCourse : c);
        saveCourses(updatedAll);
        setSelectedCourseForDetail(enrichedCourse);
        setScanMessage(
          currentUser.isPremium
            ? '✨ Richfield Pro AI Outline Scanner: Successfully extracted syllabus breakdown, critical weighting points, and exam traps!'
            : '✨ Course outline scanned and breakdown updated.'
        );
      }
    }, 1200);
  };

  // Plan my fortnight generator
  const handleGenerateFortnightPlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      const activeCoursesList = courses.filter(c => c.semester === 'S1' || c.semester === 'Year');
      const dailyDays = [
        'Thu 10 Sep', 'Fri 11 Sep', 'Sat 12 Sep', 'Sun 13 Sep', 'Mon 14 Sep',
        'Tue 15 Sep', 'Wed 16 Sep', 'Thu 17 Sep', 'Fri 18 Sep', 'Sat 19 Sep',
        'Sun 20 Sep', 'Mon 21 Sep', 'Tue 22 Sep', 'Wed 23 Sep'
      ];

      const allocations = dailyDays.map((day, dIdx) => {
        const c1 = activeCoursesList[dIdx % activeCoursesList.length] || activeCoursesList[0];
        const c2 = activeCoursesList[(dIdx + 2) % activeCoursesList.length] || activeCoursesList[1];
        return {
          day,
          slots: [
            {
              time: selectedTimeSlotPreference === 'Morning Focus' ? '08:00 - 09:30' : '18:00 - 19:30',
              courseCode: c1.code,
              courseName: c1.name,
              focusTopic: dIdx % 2 === 0 ? 'Core Lecture Revision & Note Condensation' : 'Past Test Question Drill & Code Practice',
              durationMinutes: 90
            },
            {
              time: selectedTimeSlotPreference === 'Morning Focus' ? '10:00 - 11:30' : '20:00 - 21:30',
              courseCode: c2.code,
              courseName: c2.name,
              focusTopic: dIdx % 3 === 0 ? 'Formula Sheet & Exam Traps Analysis' : 'Assignment Drafting & Practical Verification',
              durationMinutes: 90
            }
          ]
        };
      });

      const newPlan: StudyFortnightPlan = {
        id: `plan-${Date.now()}`,
        totalTargetHours: 32,
        generatedDate: 'Today',
        availabilityNote: freeTimeNote.trim() || selectedTimeSlotPreference,
        dailyAllocations: allocations
      };

      setFortnightPlan(newPlan);
      setIsGeneratingPlan(false);
      try {
        localStorage.setItem('richfield_fortnight_plan', JSON.stringify(newPlan));
      } catch (e) {
        console.error(e);
      }
    }, 1200);
  };

  // Filtered courses list
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                          c.name.toLowerCase().includes(courseSearchQuery.toLowerCase());
    const matchesYear = selectedYearFilter === 'All' || c.year === selectedYearFilter;
    const matchesSemester = selectedSemesterFilter === 'All' || c.semester === selectedSemesterFilter;
    return matchesSearch && matchesYear && matchesSemester;
  });

  // Calculate overall goal completion for a course
  const calculateCourseProgress = (course: StudentCourse) => {
    const scoredWeight = course.assessments
      .filter(a => a.status === 'Completed' && a.score !== undefined)
      .reduce((sum, a) => sum + (a.weight * ((a.score || 0) / 100)), 0);
    const totalWeightScored = course.assessments
      .filter(a => a.status === 'Completed' && a.score !== undefined)
      .reduce((sum, a) => sum + a.weight, 0);

    const weightedAvg = totalWeightScored > 0 ? Math.round((scoredWeight / totalWeightScored) * 100) : (course.currentMark || 0);
    return { weightedAvg, totalWeightScored };
  };

  // Helper to switch student
  const handleToggleStudent = () => {
    if (!onSwitchUser) return;
    if (currentUser.isPremium) {
      // Switch to standard Thabiso
      const thabiso = mockUsers.find(u => u.id === 'user-thabiso');
      if (thabiso) onSwitchUser(thabiso);
    } else {
      // Switch to premium Themba Billa
      const themba = mockUsers.find(u => u.id === 'user-themba-billa');
      if (themba) onSwitchUser(themba);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-12">

      {/* ========================================================================= */}
      {/* 1. STUDENT IDENTITY & PRO STATUS TOGGLE BANNER                            */}
      {/* ========================================================================= */}
      <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
        currentUser.isPremium 
          ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-amber-300 text-amber-950'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${
            currentUser.isPremium ? 'bg-amber-600' : 'bg-[#002B66]'
          }`}>
            {currentUser.isPremium ? <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" /> : <GraduationCap className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base">
                {currentUser.name}
              </span>
              {currentUser.isPremium ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                  <CheckCircle className="w-3 h-3 text-white" />
                  <span>Richfield Pro Student ✓</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Standard Student
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentUser.isPremium 
                ? '🌟 Pro Privileges Unlocked: 60-min Alumni sessions with a tick (✓), AI Outline Scanner & Fortnight Study Scheduler'
                : 'Standard student access with 20-minute alumni mentoring. Switch to Themba Billa to test Richfield Pro perks!'}
            </p>
          </div>
        </div>

        {onSwitchUser && (
          <button
            onClick={handleToggleStudent}
            className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all shadow-sm flex items-center gap-1.5 ${
              currentUser.isPremium 
                ? 'bg-white text-slate-800 border border-amber-300 hover:bg-amber-50' 
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>
              {currentUser.isPremium 
                ? 'Switch to Thabiso (Standard)' 
                : '🌟 Switch to Themba Billa (Pro ✓)'}
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVIGATION TABS                                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex flex-wrap items-center gap-1">
        <button
          onClick={() => { setActiveMainTab('courses'); setSelectedCourseForDetail(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'courses'
              ? 'bg-[#002B66] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeMainTab === 'courses' ? 'bg-blue-400/30 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {courses.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveMainTab('wellness'); setSelectedCourseForDetail(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'wellness'
              ? 'bg-[#002B66] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Wellness & Check-in</span>
        </button>

        <button
          onClick={() => { setActiveMainTab('study-plan'); setSelectedCourseForDetail(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'study-plan'
              ? 'bg-[#002B66] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>Study Plan</span>
          {fortnightPlan && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => { setActiveMainTab('motivations'); setSelectedCourseForDetail(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'motivations'
              ? 'bg-[#002B66] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Motivations</span>
        </button>

        <button
          onClick={() => { setActiveMainTab('notes'); setSelectedCourseForDetail(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'notes'
              ? 'bg-[#002B66] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pin className="w-4 h-4 text-teal-600" />
          <span>Study Notes</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
            {notes.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COURSES VIEW (Matching user prompt & screenshots)                   */}
      {/* ========================================================================= */}
      {activeMainTab === 'courses' && (
        <div className="space-y-4">
          
          {/* COURSE LIST VIEW */}
          {!selectedCourseForDetail && (
            <div className="space-y-4">
              {/* Header with Search & Year Filters */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Courses</span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {filteredCourses.length} courses
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage registered modules, mark breakdowns, and exam preparation targets.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="px-4 py-2 bg-[#002B66] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Course</span>
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      placeholder="Search your courses (e.g. HCI600, Networking, Database)..."
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {/* Year Filter Chips */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 text-xs">
                    {['2026', '2025', '2024'].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setSelectedYearFilter(yr)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                          selectedYearFilter === yr
                            ? 'bg-white text-[#002B66] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {yr === '2026' ? '2026 · Now' : yr}
                      </button>
                    ))}
                  </div>

                  {/* Semester Filter */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 text-xs">
                    {['All', 'S1', 'S2'].map((sem) => (
                      <button
                        key={sem}
                        onClick={() => setSelectedSemesterFilter(sem)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                          selectedSemesterFilter === sem
                            ? 'bg-white text-[#002B66] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>

                  {/* Reset Marks Button */}
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all course marks to the refreshed institutional default marks?')) {
                        saveCourses(INITIAL_COURSES);
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#002B66] bg-slate-100/70 hover:bg-slate-200/70 px-2.5 py-1 rounded-lg transition-colors ml-auto sm:ml-0 shrink-0"
                    title="Reset courses and marks to updated default curriculum"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Marks</span>
                  </button>
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredCourses.map((course) => {
                  const { weightedAvg } = calculateCourseProgress(course);
                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseForDetail(course);
                        setCourseDetailSubTab('assessments');
                      }}
                      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${course.color} flex flex-col justify-between space-y-3 group`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs font-black tracking-wider text-slate-800 group-hover:text-blue-700 transition-colors">
                              {course.code}
                            </span>
                            <h3 className="font-extrabold text-sm text-slate-900 leading-snug mt-0.5">
                              {course.name}
                            </h3>
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            course.currentMark && course.currentMark >= 50
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {course.statusText || `${course.semester} · Active`}
                          </span>
                        </div>

                        {/* Lecturer & Faculty */}
                        <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
                          <span>{course.faculty}</span>
                          <span>•</span>
                          <span>{course.lecturerName || 'Richfield Faculty'}</span>
                        </div>
                      </div>

                      {/* Footer: Progress toward Goal & Current Mark */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-blue-700" />
                            <span className="text-slate-600">
                              Mark: <strong className="text-[#002B66] font-black">{course.currentMark !== undefined ? `${course.currentMark}%` : 'N/A'}</strong>
                            </span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-slate-600">
                              Goal: <strong className="text-slate-900 font-bold">{course.goalTarget}%</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                          <span>Breakdown</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COURSE DETAIL VIEW (Matching Image 7) */}
          {selectedCourseForDetail && (
            <div className="space-y-4">
              
              {/* Top breadcrumb & back button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedCourseForDetail(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
                >
                  <span>← Back to all courses</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Academic Year {selectedCourseForDetail.year}</span>
                  <span className="text-xs font-bold text-[#002B66] bg-blue-50 px-2.5 py-1 rounded-lg">
                    {selectedCourseForDetail.semester}
                  </span>
                </div>
              </div>

              {/* Course Title Header */}
              <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm border-l-4 ${selectedCourseForDetail.color} space-y-2`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-black tracking-wider text-slate-600">
                      {selectedCourseForDetail.code}
                    </span>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                      {selectedCourseForDetail.name}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lecturer: {selectedCourseForDetail.lecturerName} • {selectedCourseForDetail.faculty} • {selectedCourseForDetail.credits} Credits
                    </p>
                  </div>

                  {/* Goal projection pill */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Course Target</span>
                    <span className="text-base font-black text-[#002B66]">
                      Goal {selectedCourseForDetail.goalTarget}% • {selectedCourseForDetail.currentMark ? `${selectedCourseForDetail.currentMark}% scored` : '0% scored'}
                    </span>
                  </div>
                </div>

                {/* Sub-tabs: Assessments | Performance | Tutoring | Wizards */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1 overflow-x-auto text-xs font-bold">
                  {(['assessments', 'performance', 'tutoring', 'wizards'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setCourseDetailSubTab(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        courseDetailSubTab === st
                          ? 'bg-[#002B66] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* DETAIL SUBTAB 1: ASSESSMENTS BREAKDOWN */}
              {courseDetailSubTab === 'assessments' && (
                <div className="space-y-4">
                  {/* PROJECTED GOAL CARD (Matching screenshot) */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          PROJECTED
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                          Goal {selectedCourseForDetail.goalTarget}% · {selectedCourseForDetail.currentMark ? `${selectedCourseForDetail.currentMark}% scored` : '0% scored'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            const newMark = prompt(`Enter updated overall current mark for ${selectedCourseForDetail.code} (0-100):`, selectedCourseForDetail.currentMark ? selectedCourseForDetail.currentMark.toString() : '75');
                            if (newMark !== null && !isNaN(Number(newMark))) {
                              const val = Math.min(100, Math.max(0, Math.round(Number(newMark))));
                              const updated = { 
                                ...selectedCourseForDetail, 
                                currentMark: val,
                                statusText: val >= 75 ? `Distinction · ${val}%` : val >= 60 ? `Merit · ${val}%` : val >= 50 ? `Pass · ${val}%` : `At Risk · ${val}%`
                              };
                              saveCourses(courses.map(c => c.id === updated.id ? updated : c));
                              setSelectedCourseForDetail(updated);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-xs font-bold text-[#002B66] flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Award className="w-3.5 h-3.5 text-[#002B66]" />
                          <span>Edit Mark ({selectedCourseForDetail.currentMark || 0}%)</span>
                        </button>

                        <button
                          onClick={() => {
                            const newG = prompt('Enter new goal percentage (e.g. 75):', selectedCourseForDetail.goalTarget.toString());
                            if (newG && !isNaN(Number(newG))) {
                              const updated = { ...selectedCourseForDetail, goalTarget: Number(newG) };
                              saveCourses(courses.map(c => c.id === updated.id ? updated : c));
                              setSelectedCourseForDetail(updated);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1"
                        >
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Set goal</span>
                        </button>

                        <button
                          onClick={handleScanOutline}
                          disabled={isScanningOutline}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-90 disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>{isScanningOutline ? 'Scanning Syllabus...' : '✨ Scan Outline'}</span>
                        </button>

                        <button
                          onClick={() => setShowAddAssessmentModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-[#002B66] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Assessment</span>
                        </button>
                      </div>
                    </div>

                    {scanMessage && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{scanMessage}</span>
                      </div>
                    )}

                    {/* Breakdown Assessment Items List */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                        <span>Assessment Name</span>
                        <div className="flex items-center gap-6">
                          <span>Weight</span>
                          <span className="text-right">Score (click to edit)</span>
                          <span>Status</span>
                        </div>
                      </div>

                      {selectedCourseForDetail.assessments.map((assess) => (
                        <div
                          key={assess.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${
                              assess.type === 'Exam' ? 'bg-rose-500' :
                              assess.type === 'Test' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <div>
                              <span className="font-bold text-slate-900 block">{assess.name}</span>
                              <span className="text-[10px] text-slate-400">{assess.type} • Due: {assess.dueDate || 'End of term'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-right">
                            <span className="font-mono font-bold text-slate-700">{assess.weight}%</span>
                            
                            {/* Interactive Editable Assessment Score */}
                            <button
                              onClick={() => {
                                const input = prompt(`Update score for "${assess.name}" (0-100):`, assess.score !== undefined ? assess.score.toString() : '80');
                                if (input !== null && !isNaN(Number(input))) {
                                  const newScoreVal = Math.min(100, Math.max(0, Math.round(Number(input))));
                                  const updatedAssessments = selectedCourseForDetail.assessments.map(a =>
                                    a.id === assess.id ? { ...a, score: newScoreVal, status: 'Completed' as const } : a
                                  );
                                  
                                  // Recalculate course mark based on completed assessment weights
                                  let totalCompletedWeight = 0;
                                  let weightedScoreSum = 0;
                                  updatedAssessments.forEach(a => {
                                    if (a.score !== undefined) {
                                      totalCompletedWeight += a.weight;
                                      weightedScoreSum += (a.score * a.weight);
                                    }
                                  });
                                  const computedAvg = totalCompletedWeight > 0 ? Math.round(weightedScoreSum / totalCompletedWeight) : selectedCourseForDetail.currentMark;
                                  
                                  const updatedCourse = {
                                    ...selectedCourseForDetail,
                                    assessments: updatedAssessments,
                                    currentMark: computedAvg,
                                    statusText: computedAvg && computedAvg >= 75 ? `Distinction · ${computedAvg}%` : computedAvg && computedAvg >= 60 ? `Merit · ${computedAvg}%` : computedAvg && computedAvg >= 50 ? `Pass · ${computedAvg}%` : `At Risk · ${computedAvg}%`
                                  };
                                  saveCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                                  setSelectedCourseForDetail(updatedCourse);
                                }
                              }}
                              className="font-mono font-black text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg min-w-[3.8rem] text-center transition-all cursor-pointer shadow-2xs"
                              title="Click to change mark"
                            >
                              {assess.score !== undefined ? `${assess.score}% ✎` : '✎ Add %'}
                            </button>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              assess.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {assess.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DETAIL SUBTAB 2: PERFORMANCE METRICS */}
              {courseDetailSubTab === 'performance' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">Performance Projections & Runway</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Current Average</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">{selectedCourseForDetail.currentMark || 64}%</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Passing criteria met</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Target Goal</span>
                      <p className="text-2xl font-black text-indigo-700 mt-1">{selectedCourseForDetail.goalTarget}%</p>
                      <span className="text-[10px] text-slate-500 font-medium">Distinction milestone</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Required on Exam</span>
                      <p className="text-2xl font-black text-amber-600 mt-1">68%</p>
                      <span className="text-[10px] text-slate-500 font-medium">To hit {selectedCourseForDetail.goalTarget}% final</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DETAIL SUBTAB 3: TUTORING & ALUMNI WITH TICK */}
              {courseDetailSubTab === 'tutoring' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        1-on-1 Tutoring & Mentorship for {selectedCourseForDetail.code}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Book a coaching session with a verified alumni mentor specializing in {selectedCourseForDetail.name}.
                      </p>
                    </div>

                    {onNavigateToMentor && (
                      <button
                        onClick={onNavigateToMentor}
                        className="px-4 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900 transition-colors self-start sm:self-auto"
                      >
                        Open Mentorship Hub
                      </button>
                    )}
                  </div>

                  {/* Privilege Comparison Box */}
                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    currentUser.isPremium
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950'
                      : 'bg-blue-50 border-blue-200 text-blue-950'
                  }`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-black text-sm">
                        {currentUser.isPremium
                          ? '🌟 Richfield Pro Student: 60-Minute Extended Session with Alumni with a Tick (✓)'
                          : 'Standard Student: 20-Minute Introductory Session'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {currentUser.isPremium
                        ? 'Because you are logged in as Themba Billa (Pro), you receive an extra 40 minutes per session with verified alumni with a tick (✓). Enjoy thorough line-by-line capstone project code reviews and mock exam prep.'
                        : 'Standard accounts have a 20-minute slot limit. Log in as Themba Billa to demonstrate the unlocked 60-minute deep dive with verified alumni!'}
                    </p>
                  </div>
                </div>
              )}

              {/* DETAIL SUBTAB 4: WIZARDS & FLASHCARDS */}
              {courseDetailSubTab === 'wizards' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">AI Exam Cram & Syllabus Wizards</h3>
                  <p className="text-xs text-slate-600">
                    Syllabus outline: {selectedCourseForDetail.syllabusOutline || 'Full course module guidelines available in Richfield LMS.'}
                  </p>
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-indigo-900 block">Generate 15 Flashcards for {selectedCourseForDetail.code}</span>
                      <span className="text-indigo-700 text-[11px]">Covers key exam trap formulas and definitions.</span>
                    </div>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold shadow-xs">
                      Start Cram Drill
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WELLNESS & CHECK-IN (Matching screenshots 1, 2, 10)                 */}
      {/* ========================================================================= */}
      {activeMainTab === 'wellness' && (
        <div className="space-y-4">
          
          {/* "Your wellness" (Private, REQUIRED) Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-[#002B66] to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                  <h2 className="text-lg font-black text-white">Your wellness</h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full border border-rose-400/40">
                    Private • Required
                  </span>
                </div>
                <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
                  Quick, private check-ins on how you're really doing — they help us notice when to reach out and support you. Your first check-in takes a minute.
                </p>
              </div>

              <button
                onClick={() => setBreathingActive(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 backdrop-blur-sm transition-all"
              >
                <Activity className="w-4 h-4 text-rose-300" />
                <span>Take a breath</span>
              </button>
            </div>
          </div>

          {/* "Check in on yourself" Card (Matching screenshot 1) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Check in on yourself</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  A 30-second check-in on how you're coping — private, with support if you need it.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            {/* 3 Mood Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => { setSelectedMood('Tough'); setCheckInSubmitted(false); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedMood === 'Tough'
                    ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <Frown className="w-7 h-7 text-rose-500 mx-auto mb-1.5" />
                <span className="font-extrabold text-sm text-slate-900 block">Tough</span>
                <span className="text-[11px] text-slate-500">Feeling overwhelmed or exhausted</span>
              </button>

              <button
                onClick={() => { setSelectedMood('OK'); setCheckInSubmitted(false); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedMood === 'OK'
                    ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <Meh className="w-7 h-7 text-amber-500 mx-auto mb-1.5" />
                <span className="font-extrabold text-sm text-slate-900 block">OK</span>
                <span className="text-[11px] text-slate-500">Getting through day-to-day</span>
              </button>

              <button
                onClick={() => { setSelectedMood('Good'); setCheckInSubmitted(false); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedMood === 'Good'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <Smile className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" />
                <span className="font-extrabold text-sm text-slate-900 block">Good</span>
                <span className="text-[11px] text-slate-500">Energized & in a steady study rhythm</span>
              </button>
            </div>

            {/* Checklist items matching screenshot */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Takes about 30 seconds</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Private — only you and support see it</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Get help fast if things are tough</span>
                </span>
              </div>

              <button
                onClick={() => {
                  if (!selectedMood) {
                    setSelectedMood('OK');
                  }
                  setCheckInSubmitted(true);
                  const newE: WellnessCheckIn = {
                    id: `chk-${Date.now()}`,
                    date: 'Today, Just now',
                    status: selectedMood || 'OK',
                    notes: privateReflectText.trim() || undefined
                  };
                  setCheckInHistory(prev => [newE, ...prev]);
                }}
                className="px-4 py-2 bg-[#002B66] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-900 transition-colors shadow"
              >
                <span>Do a check-in →</span>
              </button>
            </div>

            {/* Submitted Feedback */}
            {checkInSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Check-in recorded privately for {currentUser.name}.</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Thank you for being real with yourself. Your mental health matters as much as your degree. 24/7 Richfield Student Wellness Line: 0800 24 73 34.
                </p>
              </div>
            )}
          </div>

          {/* Wellness Assessments (Matching screenshot 10) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900">Wellness Assessments</h3>
            <p className="text-xs text-slate-500">
              Complete these periodic pulse checks to receive tailored coping strategies and study adjustments.
            </p>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  id: 'richfield-baseline',
                  title: 'Richfield Student Mental Stamina & Vitality Baseline',
                  frequency: 'SEMESTER START',
                  duration: '~8 min',
                  status: 'Available now',
                  desc: 'Benchmark your cognitive energy, study stress resilience, and exam pressure management across campus and online learning.'
                },
                {
                  id: 'student-wellness',
                  title: 'Holistic Student Well-Being & Balance Pulse',
                  frequency: 'EACH SEMESTER',
                  duration: '~10 min',
                  status: 'Available now',
                  desc: 'Evaluate sleep hygiene, commuting stamina, nutrition, social connection, and academic burnout early warnings.'
                },
                {
                  id: 'academic-skills',
                  title: 'High-Impact Study Strategy & Cognitive Diagnostic',
                  frequency: 'PRE-EXAM SEASON',
                  duration: '~15 min',
                  status: 'Available now',
                  desc: 'Evaluate time-blocking efficiency, lecture retention, practical coding lab comprehension, and active recall mastery.'
                },
                {
                  id: 'career-readiness',
                  title: 'Tech Graduate Employability & Corporate Confidence',
                  frequency: 'ANNUAL REVIEW',
                  duration: '~20 min',
                  status: 'Available now',
                  desc: 'Gauge interview readiness, software project portfolio strength, soft skills, and career networking confidence.'
                }
              ].map((asm) => (
                <div
                  key={asm.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900">{asm.title}</h4>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                        {asm.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{asm.desc}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                      <span>Duration: {asm.duration}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">{asm.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveAssessmentModal(asm.title);
                      setAssessmentStep(0);
                      setAssessmentAnswers({});
                      setAssessmentCompleted(false);
                    }}
                    className="px-4 py-2 bg-white hover:bg-[#002B66] text-[#002B66] hover:text-white border border-slate-200 hover:border-transparent rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    Start Assessment
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STUDY PLAN (Matching screenshot 3)                                  */}
      {/* ========================================================================= */}
      {activeMainTab === 'study-plan' && (
        <div className="space-y-4">
          
          {/* Study Groups Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-indigo-950 block">Study Groups</span>
                <span className="text-indigo-800">Study live, share notes & chat with your course group &gt;</span>
              </div>
            </div>

            {onNavigateToEduMatch && (
              <button
                onClick={onNavigateToEduMatch}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shrink-0"
              >
                Join Study Buddies
              </button>
            )}
          </div>

          {/* "Plan my next two weeks" Card (Matching screenshot 3) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                FORTNIGHT PLANNER
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                Plan my next two weeks?
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                I'll schedule about 30 hours of study across your courses for the next 14 days — weighted by what's active, what's due, and what looks toughest.
              </p>
            </div>

            {/* Availability input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                When are you generally free to study? (optional)
              </label>
              <input
                type="text"
                value={freeTimeNote}
                onChange={(e) => setFreeTimeNote(e.target.value)}
                placeholder="e.g. weekday evenings and Saturday afternoons — but not Wednesday nights"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />

              {/* Quick Preferences */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['Evenings & Weekends', 'Morning Focus', 'Flexible Day'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setSelectedTimeSlotPreference(pref)}
                    className={`text-[11px] px-3 py-1 rounded-lg font-bold border transition-colors ${
                      selectedTimeSlotPreference === pref
                        ? 'bg-[#002B66] text-white border-transparent'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateFortnightPlan}
              disabled={isGeneratingPlan}
              className="px-5 py-2.5 bg-[#002B66] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isGeneratingPlan ? 'Balancing 30 Hours Across Modules...' : 'Plan my fortnight'}</span>
            </button>
          </div>

          {/* Generated Fortnight Schedule View */}
          {fortnightPlan && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Your 14-Day Weighted Study Runway
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total Target: {fortnightPlan.totalTargetHours} Hours • Tailored to: {fortnightPlan.availabilityNote}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Active Schedule
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {fortnightPlan.dailyAllocations.map((alloc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <span className="font-bold text-xs text-[#002B66] block">{alloc.day}</span>
                    <div className="space-y-1.5">
                      {alloc.slots.map((slot, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-indigo-700">{slot.courseCode}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{slot.time} ({slot.durationMinutes}m)</span>
                          </div>
                          <span className="text-[11px] text-slate-600 block mt-0.5">{slot.focusTopic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pomodoro Focus Timer Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Live Study Focus Timer</h3>
                <p className="text-xs text-slate-500">25m Focus Block + 5m Restorative Breath</p>
              </div>

              <select
                value={selectedTimerCourse}
                onChange={(e) => setSelectedTimerCourse(e.target.value)}
                className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.code}>{c.code} - {c.name.slice(0, 20)}...</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-4xl sm:text-5xl font-mono font-black text-[#002B66]">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {currentIntervalIndex === 1 ? 'Restorative Break' : `Active Sprint: ${selectedTimerCourse}`}
              </span>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-5 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                </button>

                <button
                  onClick={() => { setIsTimerRunning(false); setTimeLeft(intervalDurations[currentIntervalIndex]); }}
                  className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl"
                  title="Reset Interval"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl"
                  title="Toggle Sound"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
              </div>

              {timerFeedback && (
                <p className="text-xs text-emerald-700 font-semibold mt-2">{timerFeedback}</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MOTIVATIONS (Matching screenshots 4, 5, 6)                         */}
      {/* ========================================================================= */}
      {activeMainTab === 'motivations' && (
        <div className="space-y-4">
          
          {/* 3 Segmented Sub-tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit text-xs font-bold">
            {(['for-me', 'bridgeone', 'students'] as const).map((mst) => (
              <button
                key={mst}
                onClick={() => setMotivationSubTab(mst)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  motivationSubTab === mst
                    ? 'bg-white text-[#002B66] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mst === 'for-me' ? 'For me' : mst === 'bridgeone' ? 'BridgeOne' : 'Students'}
              </button>
            ))}
          </div>

          {/* SUBTAB 1: "For me" Weekly Personalized Letter (Matching screenshot 4) */}
          {motivationSubTab === 'for-me' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 max-w-3xl leading-relaxed">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                WEEK OF 7 SEPTEMBER
              </span>

              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {currentUser.name.split(' ')[0]}, you don't have to carry it all at once.
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed">
                Whatever is weighing on you right now is real, and you don't have to pretend it isn't. Carrying a full load of courses like yours — from networking (NET631) and databases (DBS381) to project management (ITPM600A) and human-computer interaction (HCI600) — while also carrying everything else happening in your life takes more strength than most people will ever see.
              </p>

              <p className="text-sm text-slate-700 leading-relaxed">
                This week, don't aim for perfect; just aim for present. One module, one task, one hour at a time. You showed up, and that already counts for something.
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Richfield Student Wellness & Academic Care</span>
                <button
                  onClick={() => alert('Audio guidance: Take three deep breaths, align your workspace, and begin your first 25-minute sprint.')}
                  className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to voice note</span>
                </button>
              </div>
            </div>
          )}

          {/* SUBTAB 2: "BridgeOne" Seasonal Note (Matching screenshot 5) */}
          {motivationSubTab === 'bridgeone' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 max-w-3xl leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌸</span>
                <h2 className="text-xl font-black text-slate-900">
                  Fresh Season 🌸, A Fresh Mindset 🧠
                </h2>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Spring is officially here, and with it comes an invitation to reset. Maybe the first half of the semester didn't go the way you planned — you missed a deadline, an assessment didn't hit the target you wanted, or you felt the burn of mid-year fatigue.
              </p>

              <p className="text-sm text-slate-700 leading-relaxed">
                Here is your reminder: season changes, and so can your momentum. A fresh semester doesn't ask you to be a completely different student; it just asks you to give yourself another chance with better support. Lean on your lecturers, book an alumni mentor call, and remember you belong here.
              </p>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
                🌿 BridgeOne Wellness Tip: Take 10 minutes outside between lecture blocks. Natural light resets your circadian rhythms and focus.
              </div>
            </div>
          )}

          {/* SUBTAB 3: "Students" Quotes Wall (Matching screenshot 6) */}
          {motivationSubTab === 'students' && (
            <div className="space-y-4 max-w-3xl">
              
              {/* Share something box */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700">Share something that keeps you going...</span>
                  <span className="text-[10px] text-slate-400">Your name + campus show • Hearts only</span>
                </div>
                <textarea
                  rows={2}
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Share a short word of encouragement with other Richfield students..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (!newQuoteText.trim()) return;
                      const newQ = {
                        id: `q-${Date.now()}`,
                        author: currentUser.name,
                        institution: `${currentUser.campus || 'Sandton Campus'}`,
                        quote: newQuoteText.trim(),
                        hearts: 1,
                        userLiked: true
                      };
                      setStudentQuotes(prev => [newQ, ...prev]);
                      setNewQuoteText('');
                    }}
                    className="px-4 py-1.5 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900"
                  >
                    Share with campus
                  </button>
                </div>
              </div>

              {/* Quotes feed */}
              <div className="space-y-3">
                {studentQuotes.map((sq) => (
                  <div key={sq.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      "{sq.quote}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div>
                        <span className="font-bold text-slate-900">{sq.author}</span>
                        <span className="text-slate-400 text-[11px] block">{sq.institution}</span>
                      </div>

                      <button
                        onClick={() => {
                          setStudentQuotes(prev => prev.map(item => {
                            if (item.id === sq.id) {
                              return {
                                ...item,
                                hearts: item.userLiked ? item.hearts - 1 : item.hearts + 1,
                                userLiked: !item.userLiked
                              };
                            }
                            return item;
                          }));
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          sq.userLiked
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-slate-100 text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${sq.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{sq.hearts}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STUDY NOTES                                                        */}
      {/* ========================================================================= */}
      {activeMainTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-base text-slate-900">Keep Study Notes</h3>
              <p className="text-xs text-slate-500">Capture formula shortcuts, lecture synthesis, and exam reminders.</p>
            </div>
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="px-4 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notes.map((n) => (
              <div key={n.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {n.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400">{n.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{n.title}</h4>
                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {n.content}
                  </pre>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{n.createdAt}</span>
                  <div className="flex items-center gap-1">
                    {n.tags.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW COURSE                                                   */}
      {/* ========================================================================= */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#002B66]" />
                <h3 className="font-black text-base text-slate-900">Add Registered Course</h3>
              </div>
              <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. HCI600, PRG381, BMA301"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Human Computer Interaction 600"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  >
                    <option value="S1">Semester 1 (S1)</option>
                    <option value="S2">Semester 2 (S2)</option>
                    <option value="Year">Year-Long</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Goal %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Credits</label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lecturer / Faculty Lead</label>
                <input
                  type="text"
                  value={newLecturer}
                  onChange={(e) => setNewLecturer(e.target.value)}
                  placeholder="e.g. Dr. Sipho Mthembu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD ASSESSMENT TO COURSE                                         */}
      {/* ========================================================================= */}
      {showAddAssessmentModal && selectedCourseForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">
                Add Assessment for {selectedCourseForDetail.code}
              </h3>
              <button onClick={() => setShowAddAssessmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAssessment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assessment Name *</label>
                <input
                  type="text"
                  required
                  value={newAssessName}
                  onChange={(e) => setNewAssessName(e.target.value)}
                  placeholder="e.g. Assignment 1, Midterm Practical, Final Exam"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={newAssessType}
                    onChange={(e) => setNewAssessType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Test">Test</option>
                    <option value="Project">Project</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Weight (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newAssessWeight}
                    onChange={(e) => setNewAssessWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Scored Mark (% Optional)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAssessScore}
                    onChange={(e) => setNewAssessScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 72 (if already marked)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newAssessDueDate}
                    onChange={(e) => setNewAssessDueDate(e.target.value)}
                    placeholder="e.g. 15 Oct 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssessmentModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900"
                >
                  Add Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BREATHING EXERCISE MODAL                                         */}
      {/* ========================================================================= */}
      {breathingActive && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-700 rounded-3xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">4-4-4 Box Breathing</span>
              <button onClick={() => setBreathingActive(false)} className="hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="w-36 h-36 rounded-full mx-auto border-4 border-rose-500/40 flex flex-col items-center justify-center animate-pulse bg-rose-500/10">
                <span className="text-2xl font-black text-rose-300">{breathPhase}</span>
                <span className="text-4xl font-black text-white mt-1">{breathCountdown}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Inhale peace, hold steady, exhale the academic stress. You are doing great.
            </p>

            <button
              onClick={() => setBreathingActive(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow transition-colors"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: INTERACTIVE ASSESSMENT QUESTIONNAIRE                             */}
      {/* ========================================================================= */}
      {activeAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Richfield BridgeOne Health</span>
                <h3 className="font-black text-base text-slate-900">{activeAssessmentModal}</h3>
              </div>
              <button onClick={() => setActiveAssessmentModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!assessmentCompleted ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-700">Question {assessmentStep + 1} of 3</span>
                  <p className="text-sm font-extrabold text-slate-900">
                    {assessmentStep === 0 && 'Over the past 7 days, how manageable has your daily study schedule and module workload felt?'}
                    {assessmentStep === 1 && 'How would you rate your sleep quality and daytime cognitive energy during lectures and coding sprints?'}
                    {assessmentStep === 2 && 'Do you feel supported by your faculty peers, alumni mentors, and campus wellness staff?'}
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    '1 - Struggling significantly / Feeling overwhelmed',
                    '2 - Difficult at times, but pushing through',
                    '3 - Moderate / Normal student pressure',
                    '4 - Steady, clear, and well-managed',
                    '5 - Strong, energised, and ahead of deadlines'
                  ].map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setAssessmentAnswers(prev => ({ ...prev, [assessmentStep]: oIdx + 1 }));
                        if (assessmentStep < 2) {
                          setAssessmentStep(s => s + 1);
                        } else {
                          setAssessmentCompleted(true);
                        }
                      }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-xs font-medium text-slate-800 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Assessment Completed!</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                    Your baseline health score is <strong>82/100 (Optimal Stamina)</strong>. Your study resilience is solid, and we've registered your wellness baseline for this academic term.
                  </p>
                </div>
                <button
                  onClick={() => setActiveAssessmentModal(null)}
                  className="px-6 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900"
                >
                  Save & Return to Hub
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD STUDY NOTE MODAL                                             */}
      {/* ========================================================================= */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Add Study Note</h3>
              <button onClick={() => setShowAddNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
                const newN: StudyNote = {
                  id: `note-${Date.now()}`,
                  courseCode: newNoteCourse,
                  courseName: courses.find(c => c.code === newNoteCourse)?.name || newNoteCourse,
                  title: newNoteTitle.trim(),
                  category: newNoteCategory,
                  content: newNoteContent.trim(),
                  tags: ['Study', newNoteCourse],
                  pinned: false,
                  createdAt: 'Just now'
                };
                setNotes(prev => [newN, ...prev]);
                setShowAddNoteModal(false);
                setNewNoteTitle('');
                setNewNoteContent('');
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Course</label>
                  <select
                    value={newNoteCourse}
                    onChange={(e) => setNewNoteCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  >
                    <option value="Lecture Summary">Lecture Summary</option>
                    <option value="Exam Trap">Exam Trap</option>
                    <option value="Formula & Syntax">Formula & Syntax</option>
                    <option value="Code Snippet">Code Snippet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Heuristics Walkthrough Checklist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Content / Key Summary *</label>
                <textarea
                  rows={4}
                  required
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your study notes, formulas, or bullet points..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002B66] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
