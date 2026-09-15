export type UserRole = 'student' | 'alumni' | 'recruiter' | 'admin' | 'lecturer';

export type CampusLocation = 
  | 'Newtown Campus' 
  | 'Pretoria Campus' 
  | 'Durban Campus' 
  | 'Umhlanga Campus' 
  | 'Cape Town Campus' 
  | 'Polokwane Campus' 
  | 'Sandton Campus' 
  | 'Midrand Campus' 
  | 'Alberton Campus';

export type QualificationField = 'IT' | 'Business' | 'Both';
export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | 'Honours / PG' | 'Masters' | 'Alumni' | 'Staff' | 'Final Year / Graduates' | 'Graduated' | 'All Years';

export type QualificationCategory = 
  | 'Degree Programmes' 
  | 'Diploma Programmes' 
  | 'Higher Certificate Programmes' 
  | 'Postgraduate Qualifications' 
  | 'Master\'s Qualification' 
  | 'Bridging Programme';

export interface RichfieldQualification {
  id: string;
  name: string;
  shortCode: string;
  nqfLevel: number;
  category: QualificationCategory;
  faculty: 'Information Technology' | 'Business & Management Sciences';
  duration: string;
  description: string;
  credits: number;
}

export interface AuthCredential {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  userId: string;
  badge: string;
  description: string;
  name: string;
  campus: string;
}

export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  isEntrepreneurial?: boolean; // Founded business, startup, freelance, venture
}

export interface GitHubRepoItem {
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  stars?: number;
  liveDemoUrl?: string;
}

export interface LiveProjectItem {
  title: string;
  liveUrl: string;
  description: string;
  techStack: string[];
}

export interface DigitalBadgeItem {
  id: string;
  name: string;
  issuer: string;
  badgeUrl?: string;
  date: string;
  credentialUrl?: string;
}

export interface SkillEndorsement {
  skill: string;
  endorsedBy: string[]; // names of users
  count: number;
}

export interface WrittenRecommendation {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string; // e.g., 'Alumni / Cloud Architect at AWS', 'PRG302 Lecturer'
  authorAvatar?: string;
  text: string;
  content?: string;
  date: string;
  verified?: boolean;
  relationship: 'Alumni Mentor' | 'Lecturer / Academic Supervisor' | 'Industry Placement Manager' | 'Peer Lead' | string;
}

export interface ProfileVisibilitySettings {
  profileVisibility?: 'public' | 'institution_only' | 'recruiter_only';
  showEmailToBusiness: boolean;
  showPhoneToBusiness: boolean;
  showAcademicTranscript: boolean;
  showCvToPublic: boolean;
  showProjectsToAll: boolean;
  showElevatorPitchVideo?: boolean;
  showContactInfo?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  campus: CampusLocation | string;
  qualification: QualificationField;
  qualificationName?: string;
  academicYear?: AcademicYear;
  skills: string[];
  bio: string;
  headline: string;
  studentIdNumber?: string;
  
  // Section 2.3 Comprehensive Digital Portfolio
  enrolmentYear?: number | string;
  graduationYear?: number | string;
  workExperience?: WorkExperienceItem[];
  entrepreneurialExperience?: WorkExperienceItem[];
  githubUrl?: string;
  githubProjects?: GitHubRepoItem[];
  portfolioWebsites?: LiveProjectItem[];
  digitalBadges?: DigitalBadgeItem[];
  certifications?: Array<{ name: string; authority: string; license?: string; date: string }>;
  credlyUrl?: string;
  linkedinUrl?: string;
  behanceUrl?: string;
  cvFileUrl?: string;
  cvFileName?: string;
  elevatorPitchVideoUrl?: string;
  academicAchievements?: string[];
  leadershipRoles?: string[];
  clubsAndSocieties?: string[];
  careerInterests?: string[];
  visibilitySettings?: ProfileVisibilitySettings;
  endorsements?: SkillEndorsement[];
  recommendations?: WrittenRecommendation[];

  // Alumni/Mentor specific
  company?: string;
  currentRole?: string;
  isMentor?: boolean;
  mentorDomain?: string[];
  maxMentees?: number;
  currentMenteesCount?: number;
  alumniVerificationStatus?: 'verified' | 'pending' | 'unverified';
  degreeSerial?: string;
  graduationCeremony?: string;
  
  // Recruiter / Business specific
  organization?: string;
  authorizedStatus?: boolean;
  companyWebsite?: string;
  companyLocation?: string;
  companyDescription?: string;
  talentSought?: string[];
  verificationStatus?: 'pending_approval' | 'verified' | 'suspended';
  
  // Premium Student & Pro Features
  isPremium?: boolean;
  premiumTier?: 'free' | 'premium';
  premiumBadge?: string;
  enrolledCourses?: string[]; // course codes
  completedOnboarding?: boolean;
  connectionsCount?: number;
  postsCount?: number;
  applicationsCount?: number;
}

export interface CourseAssessment {
  id: string;
  name: string;
  type: 'Assignment' | 'Test' | 'Project' | 'Exam' | 'Quiz';
  weight: number; // percentage e.g. 20
  score?: number; // scored percentage e.g. 75
  dueDate?: string;
  status: 'Completed' | 'Upcoming' | 'In Progress';
}

export interface StudentCourse {
  id: string;
  code: string;
  name: string;
  year: string; // e.g. '2026'
  semester: 'S1' | 'S2' | 'Year';
  faculty: 'Information Technology' | 'Business & Management Sciences';
  color: string; // accent color class e.g. 'border-amber-500'
  colorHex?: string;
  currentMark?: number; // e.g. 58 or 64
  statusText?: string; // e.g. 'Pass · 58%' or 'S2'
  goalTarget: number; // e.g. 70
  credits: number;
  assessments: CourseAssessment[];
  notesCount?: number;
  lecturerName?: string;
  syllabusOutline?: string;
}

export interface StudyFortnightPlan {
  id: string;
  totalTargetHours: number;
  generatedDate: string;
  availabilityNote?: string;
  dailyAllocations: Array<{
    day: string; // e.g. 'Thu 10 Sep'
    slots: Array<{
      time: string;
      courseCode: string;
      courseName: string;
      focusTopic: string;
      durationMinutes: number;
    }>;
  }>;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole?: UserRole;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  authorCampus: CampusLocation | string;
  authorHeadline: string;
  content: string;
  cohort: '1st Year' | '2nd Year' | '3rd Year' | 'General';
  qualificationCategory: 'IT' | 'Business' | 'All';
  tags: string[];
  likesCount: number;
  likedBy: string[];
  comments: PostComment[];
  createdAt: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  
  // Section 2.4 Short-form Video & Multi-media
  mediaType?: 'text' | 'video' | 'project';
  videoUrl?: string;
  videoThumbnail?: string;
  videoTitle?: string;
  videoDuration?: string;
  clapsCount?: number;
  insightsCount?: number;

  moderation?: {
    status: 'approved' | 'flagged' | 'blocked';
    score: number;
    reason?: string;
    flaggedKeywords?: string[];
  };
}

// Digital Lost & Found Types
export type LostFoundItemType = 'found' | 'lost';
export type LostFoundStatus = 'open' | 'pending_verification' | 'recovered' | 'at_campus_security';
export type LostFoundCategory = 
  | 'Electronics & Laptops'
  | 'Phones & Chargers'
  | 'Student Cards & IDs'
  | 'Keys & Access Tags'
  | 'Notebooks & Textbooks'
  | 'Bags & Backpacks'
  | 'Clothing & Jackets'
  | 'Water Bottles & Containers'
  | 'Glasses & Personal Items'
  | 'Calculators & Tech Accessories'
  | 'Other Essentials';

export interface LostFoundClaim {
  id: string;
  claimantUserId: string;
  claimantName: string;
  claimantRole: UserRole;
  claimantAvatar?: string;
  claimantStudentId?: string;
  proofDescription: string;
  contactEmailOrPhone: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  adminOrFinderNotes?: string;
}

export interface LostAndFoundItem {
  id: string;
  type: LostFoundItemType; // 'found' (someone found item) or 'lost' (someone lost item)
  title: string;
  category: LostFoundCategory;
  description: string;
  campusLocation: CampusLocation | string;
  specificLocation: string; // e.g. "Computer Lab 304, Row 3", "Library 2nd Floor Quiet Zone"
  photoUrl: string;
  dateFoundOrLost: string; // e.g. 'Today, 11:30 AM' or '2026-09-12'
  status: LostFoundStatus;
  
  // Reporter details
  reportedByUserId: string;
  reportedByName: string;
  reportedByRole: UserRole;
  reportedByAvatar?: string;
  reportedByCampus?: string;
  
  // Transparency & Recovery flow
  heldAtSecurityDesk?: boolean;
  securityDeskName?: string; // e.g. "Main Gate Security Desk #1"
  securityReferenceNumber?: string; // e.g. "RF-SEC-2026-081"
  verificationQuestion?: string; // Finder asks a question only the real owner knows
  
  // Claims
  claims: LostFoundClaim[];
  resolvedAt?: string;
  resolvedToUserId?: string;
  resolvedToUserName?: string;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorDomain: string;
  menteeId: string;
  menteeName: string;
  menteeYear: AcademicYear | string;
  topic: string;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  studentNotes?: string;
  safetyAudited?: boolean;
  safetyNotes?: string;
  meetLink?: string;
  isSafetyMonitored?: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  timestamp: string;
  category: 'priority' | 'general';
  priorityReason?: string;
  isSpam: boolean;
  read?: boolean;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  campusTarget: string;
  type: 'bursary' | 'internship' | 'graduate-program' | 'entry-level' | 'learnership' | 'part-time';
  qualification: 'IT' | 'Business' | 'Both';
  yearRequirement: '1st Year' | '2nd Year' | '3rd Year' | 'Final Year / Graduates' | 'All Years';
  stipendOrSalary: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedByName: string;
  deadline: string;
  applicantIds: string[];
  isVerified: boolean;
  createdAt: string;
  
  // Section 2.2 & 2.5 Administrator Oversight & Smart Matching
  status?: 'approved' | 'pending_review' | 'rejected';
  rejectionReason?: string;
  matchScore?: number;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 
    | 'all' 
    | 'students' 
    | 'alumni' 
    | 'business'
    | 'it_1st_year'
    | 'it_2nd_year'
    | 'it_3rd_year'
    | 'business_1st_year'
    | 'business_2nd_year'
    | 'business_3rd_year'
    | 'both_business'
    | 'lecturers'
    | string;
  createdAt: string;
  priority: 'normal' | 'urgent';
  authorName: string;
  authorRole: 'admin';
}

export interface AlumniCareerTrajectory {
  id: string;
  alumniName: string;
  programme: string; // e.g., 'BSc IT', 'BCom Accounting (AGA)', 'DIT'
  campus: string;
  gradYear: string;
  initialRole: string;
  currentRole: string;
  company: string;
  companyLogo?: string;
  salaryBand?: string;
  careerMilestones: Array<{ year: string; role: string; company: string }>;
  keySkillsLearned: string[];
  adviceForStudents: string;
  willingToMentor: boolean;
}

export interface RealTimeNotification {
  id: string;
  type: 'connection_request' | 'message' | 'opportunity_match' | 'admin_announcement' | 'post_reaction' | 'mentorship_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface ExamRunwayEvent {
  id: string;
  title: string;
  moduleCode: string;
  moduleName: string;
  qualification: 'IT' | 'Business';
  academicYear: '1st Year' | '2nd Year' | '3rd Year';
  lecturerName: string;
  lecturerCampus: CampusLocation | string;
  dateTime: string;
  streamUrl: string;
  slidesUrl?: string;
  attendeesCount: number;
  isNational: boolean;
  status: 'upcoming' | 'live' | 'recorded';
  keyTopics: string[];
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category?: 'IT' | 'Business' | 'General Science' | 'Mathematics';
  qualification?: 'IT' | 'Business' | 'General';
  edition: string;
  moduleCodes: string[];
  shelfLocation: string;
  campusHoldings: Record<string, number>;
  holdingCampuses?: {
    campus: CampusLocation | string;
    availableCopies: number;
    totalCopies: number;
    shelfLocation: string;
  }[];
  coverImage?: string;
}

export interface BookTransferRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  studentIdNumber?: string;
  studentNumber?: string;
  fromCampus: string;
  toCampus: string;
  status: 'requested' | 'in-transit' | 'transit' | 'ready-for-pickup' | 'ready' | 'collected';
  courierTrackingNumber: string;
  estimatedArrival: string;
}

export type InterCampusRequest = BookTransferRequest;

export interface ModerationLog {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  authorId?: string;
  authorName: string;
  userRole?: UserRole;
  contentType: 'post' | 'comment' | 'message' | 'mentorship_note';
  contentSnippet: string;
  aiToxicityScore: number;
  toxicityScore?: number;
  flaggedReason: string;
  flaggedCategories?: string[];
  actionTaken: 'approved' | 'flagged' | 'blocked';
  decision?: 'blocked' | 'warned' | 'approved';
  aiExplanation?: string;
}

export type ModerationAuditLog = ModerationLog;

export interface CodeSnippetItem {
  id: string;
  title: string;
  authorName: string;
  authorCampus: CampusLocation | string;
  language: 'typescript' | 'javascript' | 'python' | 'java' | 'csharp' | 'sql' | 'html';
  description: string;
  code: string;
  likes: number;
  commentsCount?: number;
  tags: string[];
  createdAt?: string;
}

export type EventCategoryType = 'exam-runway' | 'business-bootcamp' | 'datathon' | 'it-bootcamp';

export interface CampusEventItem {
  id: string;
  title: string;
  eventType: EventCategoryType;
  moduleCode?: string;
  moduleName?: string;
  qualification: 'IT' | 'Business' | 'Both';
  academicYear: '1st Year' | '2nd Year' | '3rd Year' | 'All Years';
  hostName: string;
  hostRole: string;
  hostCampus: CampusLocation | string;
  lecturerName?: string;
  lecturerCampus?: CampusLocation | string;
  dateTime: string;
  streamUrl?: string;
  slidesUrl?: string;
  datasetUrl?: string;
  attendeesCount: number;
  isNational: boolean;
  status: 'upcoming' | 'live' | 'recorded' | 'registration-open';
  keyTopics: string[];
  prizePool?: string;
  sponsor?: string;
  teamRequirement?: string;
  problemStatement?: string;
}

export interface TopStudentCandidate {
  id: string;
  rank: number;
  name: string;
  email: string;
  campus: CampusLocation | string;
  qualificationName: string;
  qualificationField: 'IT' | 'Business' | 'Both';
  qualification?: 'IT' | 'Business' | 'Both';
  academicYear: AcademicYear;
  academicAggregate: string; // e.g. "89% (Distinction Average)"
  gpa?: string;
  aiMatchScore: number; // e.g. 99, 98, 96
  skills: string[];
  headline: string;
  bio: string;
  aiRecommendationRationale: string;
  recommendationReason?: string;
  keyStrengths: string[];
  achievements?: string[];
  datathonAchievement?: string;
  codeHubSnippetsCount?: number;
  portfolioUrl?: string;
  githubOrLinkedin?: string;
  bursaryStatus: 'Seeking Bursary' | 'Sponsored by Vodacom' | 'Open to Offers' | 'Final Year Grad';
  candidateStatus: 'available' | 'interview-requested' | 'shortlisted' | 'bursary-offered';
}

export interface ExamPrepFlashcard {
  id: string;
  concept?: string;
  definition?: string;
  keyTakeaway?: string;
  moduleCode?: string;
  front?: string;
  back?: string;
  topic?: string;
}

export interface ExamPrepPracticeQuestion {
  id?: string;
  moduleCode?: string;
  question: string;
  type?: 'multiple-choice' | 'free-response';
  options?: string[];
  correctOptionIndex?: number;
  sampleAnswer?: string;
  modelAnswer?: string;
  rubricNotes?: string;
  marks: number;
  difficulty?: 'Foundation' | 'Intermediate' | 'Distinction Level' | string;
  topic?: string;
}

export interface ExamPrepDeck {
  id?: string;
  moduleCode: string;
  moduleName: string;
  qualification: 'IT' | 'Business';
  difficulty?: 'Standard Exam' | 'Comprehensive Final' | 'Honors Distinction' | string;
  specificTopic?: string;
  createdAt?: string;
  chaptersCovered?: string[];
  highYieldFormulas?: { name: string; formula: string; context: string }[];
  examPitfalls?: string[];
  revisionTips?: string[];
  flashcards: ExamPrepFlashcard[];
  practiceQuestions?: ExamPrepPracticeQuestion[];
  questions?: { question: string; marks: number; modelAnswer: string; topic?: string }[];
}

export interface MockInterviewScenario {
  id: string;
  track: 'Business Analyst' | 'Financial & Risk Analyst' | 'Cloud / Full-Stack Engineer' | 'Data Scientist & BI';
  question: string;
  competency: string;
  starTip: string;
  idealKeywords: string[];
}

export interface EduMatchSubject {
  id: string;
  name: string;
  code: string;
  category: 'IT' | 'Business' | 'Mathematics';
  description: string;
  subTopics: string[];
  iconName: string;
  activeLearnersCount: number;
}

export interface EduMatchQuestion {
  id: string;
  subjectId: string;
  subTopic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface EduMatchedPeer {
  id: string;
  name: string;
  avatar?: string;
  campus: string;
  academicYear: string;
  qualification: string;
  subject: string;
  subjectScore: number;
  strongIn: string[];
  needsHelpWith: string[];
  matchScore: number;
  matchReason: string;
  studyStreak: number;
  xpPoints: number;
  isStudyBuddy: boolean;
  onlineStatus: 'online' | 'studying' | 'offline';
  recommendedLibraryResource?: {
    title: string;
    code: string;
    author: string;
  };
}

export interface EduMatchChallengeRecord {
  id: string;
  opponentId: string;
  opponentName: string;
  subject: string;
  userScore: number;
  opponentScore: number;
  totalQuestions: number;
  result: 'won' | 'lost' | 'tied';
  xpEarned: number;
  date: string;
}
