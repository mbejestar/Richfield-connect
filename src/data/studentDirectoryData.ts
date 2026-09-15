import { AcademicYear, CampusLocation, QualificationField } from '../types';

export interface StudentCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationHash: string;
  badgeColor: string;
  skillsValidated: string[];
  description: string;
  verificationStatus: 'Verified by Richfield Registrar' | 'Accredited External Body' | 'Industry Partner Verified';
}

export interface StudentCodeHubProject {
  id: string;
  title: string;
  description: string;
  language: string;
  techStack: string[];
  prototypeType: 'jwt-auth' | 'dcf-valuation' | 'library-routing' | 'sql-profiler';
  repoUrl: string;
  starsCount: number;
  forksCount: number;
  codeSnippet: string;
  unitTestsCount: number;
  coveragePercent: number;
  testCases: Array<{ name: string; passed: boolean; durationMs: number }>;
}

export interface StudentTranscriptModule {
  code: string;
  name: string;
  semester: string;
  grade: number;
  symbol: string;
  distinction: boolean;
}

export interface StudentFullDetail {
  id: string;
  studentIdNumber: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  isPremium?: boolean;
  role?: string;
  email: string;
  phone: string;
  campus: CampusLocation;
  academicYear: AcademicYear;
  qualificationField: QualificationField;
  qualificationName: string;
  nqfLevel: number;
  academicAggregate: string;
  gpa: string;
  deansList: boolean;
  bursaryStatus: 'Seeking Bursary' | 'Sponsored by Vodacom' | 'Open to Offers' | 'Final Year Grad';
  headline: string;
  bio: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  certificates: StudentCertificate[];
  codeHubProjects: StudentCodeHubProject[];
  transcript: StudentTranscriptModule[];
  workExperience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  endorsements: Array<{
    authorName: string;
    authorRole: string;
    date: string;
    comment: string;
  }>;
}

export const COMPREHENSIVE_STUDENTS_DIRECTORY: StudentFullDetail[] = [
  {
    id: 'user-themba-billa',
    studentIdNumber: '202499104',
    name: 'Themba Billa',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    verified: true,
    isPremium: true,
    email: 'themba.billa@richfield.ac.za',
    phone: '+27 82 718 3920',
    campus: 'Sandton Campus',
    academicYear: '3rd Year',
    qualificationField: 'IT',
    qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
    nqfLevel: 7,
    academicAggregate: '87.6% (Distinction Average • Richfield Pro ✓)',
    gpa: '3.94 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '3rd Year BSc IT | Richfield Pro Student ✓ | Cloud Architect & Full-Stack Engineer',
    bio: 'Richfield Pro Student with verified distinction standing. Specializing in cloud microservices, reactive architectures, and Python/TypeScript full-stack distributed systems. Experienced in AWS Serverless, PostgreSQL, and AI application engineering.',
    skills: ['React', 'TypeScript', 'FastAPI', 'Node.js', 'PostgreSQL', 'AWS Serverless', 'Docker', 'System Design'],
    githubUrl: 'https://github.com/themba-billa-tech',
    linkedinUrl: 'https://linkedin.com/in/themba-billa-richfield',
    portfolioUrl: 'https://themba-billa.richfield.dev',
    certificates: [
      {
        id: 'cert-themba-pro',
        name: 'Richfield Directorate Pro Scholar Accreditation ✓',
        issuer: 'Richfield Academic Directorate & Industry Board',
        issueDate: 'January 2026',
        credentialId: 'RF-PRO-2026-99104',
        verificationHash: '0x99104billa7f8a12e4c',
        badgeColor: 'amber',
        skillsValidated: ['Verified Academic Standing', 'Cloud Distributed Computing', 'Alumni Leadership'],
        description: 'Institutional verification confirming highest tier academic performance, verified pro privileges, and vetted industry readiness.',
        verificationStatus: 'Verified by Richfield Registrar'
      },
      {
        id: 'cert-themba-aws',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: 'November 2025',
        expiryDate: 'November 2028',
        credentialId: 'AWS-SAA-88419-TB',
        verificationHash: '0x33e88104fb19aa018d',
        badgeColor: 'blue',
        skillsValidated: ['High Availability', 'Decoupled Architectures', 'S3 & DynamoDB', 'VPC Routing'],
        description: 'Comprehensive validation of system reliability, cost optimization, and secure cloud networking.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-themba-honor',
        name: "Dean's Merit List for Software Systems",
        issuer: 'Richfield Faculty of Information Technology',
        issueDate: 'December 2025',
        credentialId: 'RF-DEAN-TB-2025',
        verificationHash: '0x77ab49018cbe22904',
        badgeColor: 'emerald',
        skillsValidated: ['Advanced Systems Architecture', 'Enterprise Java PRG381', 'Database Architecture DBS381'],
        description: 'Awarded to top quartile students maintaining greater than 85% aggregate across semester examinations.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-themba-1',
        title: 'Cloud Microservices Token Gateway & Auth Emulator',
        description: 'High-throughput security gateway with cryptographic JWT signing, claims-based role validation, and token expiration verification. Verified Pro Student implementation.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'FastAPI', 'Node.js', 'JWT', 'PostgreSQL', 'Docker'],
        prototypeType: 'jwt-auth',
        repoUrl: 'https://github.com/themba-billa-tech/microservices-token-gateway',
        starsCount: 42,
        forksCount: 16,
        unitTestsCount: 10,
        coveragePercent: 100,
        testCases: [
          { name: 'verifyTokenSignatureWithRS256()', passed: true, durationMs: 12 },
          { name: 'rejectExpiredTokensGracefully()', passed: true, durationMs: 5 },
          { name: 'enforceRoleBasedPermissions()', passed: true, durationMs: 7 },
          { name: 'rateLimitAbusiveTokenIssuance()', passed: true, durationMs: 10 },
          { name: 'validateInstitutionalCampusClaim()', passed: true, durationMs: 6 }
        ],
        codeSnippet: `import { sign, verify } from 'jsonwebtoken';

export class ProTokenGateway {
  private secretKey: string;
  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }
  generateProToken(payload: { userId: string; verified: boolean; isPremium: boolean }) {
    return sign({ ...payload, iss: 'Richfield-Verified-Authority' }, this.secretKey, { expiresIn: '2h' });
  }
}`
      }
    ],
    transcript: [
      { code: 'PRG381', name: 'Advanced Systems Architecture & Java', semester: 'Sem 1, 2026', grade: 86, symbol: 'A+', distinction: true },
      { code: 'DBS381', name: 'Database Architecture & SQL Optimization', semester: 'Sem 1, 2026', grade: 83, symbol: 'A', distinction: true },
      { code: 'NET631', name: 'Networking & Cybersecurity Defense', semester: 'Sem 1, 2026', grade: 81, symbol: 'A', distinction: true },
      { code: 'HCI600', name: 'Human Computer Interaction 600', semester: 'Sem 1, 2026', grade: 76, symbol: 'A', distinction: true },
      { code: 'ITPM600A', name: 'IT Project Management 600', semester: 'Sem 1, 2026', grade: 73, symbol: 'B+', distinction: false }
    ],
    workExperience: [
      {
        role: 'Full-Stack Developer Intern',
        company: 'Sandton Tech Hub',
        duration: 'July 2025 - Present',
        description: 'Developed serverless backend APIs and dashboard interfaces using React, TypeScript, and AWS Lambda.'
      },
      {
        role: 'Academic Peer Tutor (Computer Science)',
        company: 'Richfield Academic Support Centre',
        duration: 'Feb 2025 - June 2025',
        description: 'Mentored 35+ undergraduate students in object-oriented programming, algorithms, and relational database systems.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Sipho Mthembu',
        authorRole: 'Head of IT & Faculty Senior Lecturer',
        date: 'Jan 15, 2026',
        comment: 'Themba exemplifies academic excellence and practical engineering craftsmanship. His verified pro standing is thoroughly well-deserved.'
      }
    ]
  },
  {
    id: 'std-thabiso',
    studentIdNumber: '202488421',
    name: 'Thabiso Khosi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    verified: true,
    email: 'thabiso.k@student.richfield.ac.za',
    phone: '+27 82 555 0192',
    campus: 'Newtown Campus',
    academicYear: '3rd Year',
    qualificationField: 'IT',
    qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
    nqfLevel: 7,
    academicAggregate: '89.4% (Distinction Average • Top 1%)',
    gpa: '3.96 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '3rd Year BSc IT | Full-Stack Cloud & Distributed Systems Architect',
    bio: 'Software engineer and AWS certified practitioner. Led the winning team at the Vodacom National Campus Cloud Challenge. Strong focus on containerized microservices, JWT authentication, and reactive web applications.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Architecture', 'Redis'],
    githubUrl: 'https://github.com/thabiso-richfield-dev',
    linkedinUrl: 'https://linkedin.com/in/thabiso-khosi-tech',
    certificates: [
      {
        id: 'cert-aws-ccp',
        name: 'AWS Certified Cloud Practitioner (CLF-C02)',
        issuer: 'Amazon Web Services Training & Certification',
        issueDate: 'January 14, 2025',
        expiryDate: 'January 14, 2028',
        credentialId: 'AWS-CCP-98214-RF',
        verificationHash: '0x9a8f21bc4d7e9081a2f4',
        badgeColor: 'amber',
        skillsValidated: ['Cloud Architecture', 'AWS IAM & Security', 'Serverless Lambda', 'VPC Networking'],
        description: 'Validates overall understanding of AWS Cloud platform, security best practices, and billing economics.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-deans',
        name: "Dean's Academic Merit Honor Roll (Faculty of IT)",
        issuer: 'Richfield Directorate of Academic Quality',
        issueDate: 'December 2024',
        credentialId: 'RF-HONOR-2024-001',
        verificationHash: '0x81b7e41ac824b42398df',
        badgeColor: 'emerald',
        skillsValidated: ['Academic Excellence', 'Algorithms DSA201 Distinction', 'Software Engineering PRG302'],
        description: 'Awarded to students maintaining greater than 85% aggregate across all semester examinations.',
        verificationStatus: 'Verified by Richfield Registrar'
      },
      {
        id: 'cert-oracle-java',
        name: 'Oracle Certified Associate: Java SE 17 Programmer',
        issuer: 'Oracle University',
        issueDate: 'October 2024',
        credentialId: 'OCAJP-17-77219',
        verificationHash: '0x43ef61a0b38c29124dd7',
        badgeColor: 'rose',
        skillsValidated: ['Core Java', 'Object-Oriented Design', 'Multithreading & Concurrency', 'JVM Memory Model'],
        description: 'Comprehensive assessment of core Java language syntax, data structures, and exception mechanics.',
        verificationStatus: 'Accredited External Body'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-thabiso-1',
        title: 'Cloud Microservices Token Gateway & Auth Emulator',
        description: 'High-throughput security gateway with cryptographic JWT signing, claims-based role validation, and token expiration verification. Includes live interactive token issuance sandbox.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'Node.js', 'JWT', 'PostgreSQL', 'Express', 'Jest'],
        prototypeType: 'jwt-auth',
        repoUrl: 'https://github.com/thabiso-richfield-dev/microservices-token-gateway',
        starsCount: 38,
        forksCount: 12,
        unitTestsCount: 8,
        coveragePercent: 100,
        testCases: [
          { name: 'verifyTokenSignatureWithRS256()', passed: true, durationMs: 14 },
          { name: 'rejectExpiredTokensGracefully()', passed: true, durationMs: 6 },
          { name: 'enforceRoleBasedPermissions()', passed: true, durationMs: 9 },
          { name: 'rateLimitAbusiveTokenIssuance()', passed: true, durationMs: 12 },
          { name: 'sanitizeMalformedBearerHeaders()', passed: true, durationMs: 5 },
          { name: 'validateInstitutionalCampusClaim()', passed: true, durationMs: 8 },
          { name: 'mockRedisCacheHitForActiveSession()', passed: true, durationMs: 11 },
          { name: 'auditLogSecurityEvents()', passed: true, durationMs: 7 }
        ],
        codeSnippet: `import { sign, verify } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  role: 'student' | 'mentor' | 'recruiter' | 'admin';
  campus: string;
  permissions: string[];
}

export class TokenGatewaySecurity {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  generateStudentToken(payload: TokenPayload, expiresIn: string = '1h'): string {
    return sign(payload, this.secretKey, {
      expiresIn,
      algorithm: 'HS256',
      issuer: 'EnrichHub-Auth-Authority'
    });
  }

  verifyClaims(token: string, requiredRole: string): { valid: boolean; claims?: TokenPayload; error?: string } {
    try {
      const decoded = verify(token, this.secretKey) as TokenPayload;
      if (decoded.role !== requiredRole && decoded.role !== 'admin') {
        return { valid: false, error: 'Insufficient institutional clearance permissions.' };
      }
      return { valid: true, claims: decoded };
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  }
}`
      }
    ],
    transcript: [
      { code: 'DSA201', name: 'Data Structures and Algorithms', semester: 'Sem 1, 2025', grade: 94, symbol: 'A+', distinction: true },
      { code: 'PRG302', name: 'Enterprise Java & Spring Boot Architecture', semester: 'Sem 2, 2024', grade: 91, symbol: 'A+', distinction: true },
      { code: 'DBS202', name: 'Relational & NoSQL Database Systems', semester: 'Sem 1, 2024', grade: 89, symbol: 'A', distinction: true },
      { code: 'NET201', name: 'Enterprise Cloud Networking & Protocols', semester: 'Sem 2, 2024', grade: 88, symbol: 'A', distinction: true },
      { code: 'WBL301', name: 'Work-Based Learning Capstone Project', semester: 'Sem 1, 2025', grade: 92, symbol: 'A+', distinction: true }
    ],
    workExperience: [
      {
        role: 'Peer Tutor - Computer Science',
        company: 'Richfield Academic Support Centre',
        duration: 'Jan 2024 - Present',
        description: 'Tutored 45+ 1st and 2nd year students in object-oriented programming, data structures, and database design.'
      },
      {
        role: 'Cloud Engineering Intern (Project)',
        company: 'SovTech Student Mentorship Program',
        duration: 'June 2024 - Aug 2024',
        description: 'Engineered automated CI/CD pipeline deployments using Docker containers and GitHub Actions.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Sipho Mthembu',
        authorRole: 'Head of IT & Faculty Senior Lecturer',
        date: 'Nov 18, 2024',
        comment: 'Thabiso is one of our top undergraduate minds. His understanding of distributed systems and clean software engineering exceeds graduate expectations.'
      }
    ]
  },
  {
    id: 'std-ayanda',
    studentIdNumber: '202466291',
    name: 'Ayanda Ndlovu',
    email: 'ayanda.n@student.richfield.ac.za',
    phone: '+27 83 412 8890',
    campus: 'Pretoria Campus',
    academicYear: '2nd Year',
    qualificationField: 'Business',
    qualificationName: 'Bachelor of Commerce in Business Administration (BCom)',
    nqfLevel: 7,
    academicAggregate: '88.1% (Distinction Average • Dean\'s Roll)',
    gpa: '3.91 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '2nd Year BCom Student | Equity Valuation & Financial Modeling Analyst',
    bio: 'Quantitative commerce student specializing in corporate financial statements, capital budgeting, and discounted cash flow (DCF) valuation models. Capitec and Standard Bank case study finalist.',
    skills: ['Financial Modeling', 'DCF Valuation', 'PowerBI', 'Excel VBA', 'SQL', 'Corporate Finance', 'Strategic Planning'],
    githubUrl: 'https://github.com/ayanda-ndlovu-finance',
    linkedinUrl: 'https://linkedin.com/in/ayanda-ndlovu-richfield',
    certificates: [
      {
        id: 'cert-fmva',
        name: 'Financial Modeling & Valuation Analyst (FMVA® Candidate)',
        issuer: 'Corporate Finance Institute (CFI)',
        issueDate: 'February 2025',
        credentialId: 'CFI-FMVA-881920',
        verificationHash: '0x12c98d7f3a8b419024ee',
        badgeColor: 'blue',
        skillsValidated: ['3-Statement Financial Modeling', 'DCF Modeling', 'WACC Calculations', 'Sensitivity Analysis'],
        description: 'Advanced professional credential for investment banking, corporate development, and equity research.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-fin-merit',
        name: 'Merit Award in Corporate Finance (BUS201)',
        issuer: 'Richfield Faculty of Business Sciences',
        issueDate: 'December 2024',
        credentialId: 'RF-FIN-2024-042',
        verificationHash: '0x66f123bc89a0149982dc',
        badgeColor: 'emerald',
        skillsValidated: ['Capital Structure', 'Cost of Capital', 'Dividend Policy', 'Bond & Stock Valuation'],
        description: 'First rank in Pretoria Campus cohort for corporate finance examinations.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-ayanda-1',
        title: 'FinTech DCF Cash Flow & Enterprise Valuation Engine',
        description: 'Interactive financial modeling algorithm computing Weighted Average Cost of Capital (WACC), multi-year free cash flow projections, terminal value, and fair market equity share price.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'React', 'Tailwind', 'Recharts', 'Financial Math'],
        prototypeType: 'dcf-valuation',
        repoUrl: 'https://github.com/ayanda-ndlovu-finance/dcf-valuation-model',
        starsCount: 29,
        forksCount: 8,
        unitTestsCount: 6,
        coveragePercent: 98,
        testCases: [
          { name: 'calculateWACCWithGivenDebtEquityRatio()', passed: true, durationMs: 4 },
          { name: 'compoundDiscountFactorCorrectly()', passed: true, durationMs: 3 },
          { name: 'computeGordonGrowthTerminalValue()', passed: true, durationMs: 5 },
          { name: 'handleZeroDebtCompanyEdgeCase()', passed: true, durationMs: 2 },
          { name: 'calculateImpliedPerSharePrice()', passed: true, durationMs: 4 },
          { name: 'renderSensitivityMatrixTable()', passed: true, durationMs: 7 }
        ],
        codeSnippet: `export interface DCFInputs {
  cashFlowYears: number[];
  waccDiscountRate: number; // e.g., 0.11 (11%)
  terminalGrowthRate: number; // e.g., 0.035 (3.5%)
  totalDebt: number;
  cashAndEquivalents: number;
  sharesOutstanding: number;
}

export function computeEnterpriseValuation(inputs: DCFInputs) {
  const { cashFlowYears, waccDiscountRate, terminalGrowthRate } = inputs;
  
  // 1. Discount each year's free cash flow to firm (FCFF)
  let presentValueOfCashFlows = 0;
  cashFlowYears.forEach((cf, idx) => {
    const discountFactor = Math.pow(1 + waccDiscountRate, idx + 1);
    presentValueOfCashFlows += cf / discountFactor;
  });

  // 2. Terminal Value via Gordon Growth Model
  const finalYearCashFlow = cashFlowYears[cashFlowYears.length - 1];
  const terminalValue = (finalYearCashFlow * (1 + terminalGrowthRate)) / 
                        (waccDiscountRate - terminalGrowthRate);
  
  const presentTerminalValue = terminalValue / Math.pow(1 + waccDiscountRate, cashFlowYears.length);
  const enterpriseValue = presentValueOfCashFlows + presentTerminalValue;
  const equityValue = enterpriseValue - inputs.totalDebt + inputs.cashAndEquivalents;
  const impliedSharePrice = equityValue / inputs.sharesOutstanding;

  return { enterpriseValue, equityValue, impliedSharePrice };
}`
      }
    ],
    transcript: [
      { code: 'BUS201', name: 'Corporate Financial Management', semester: 'Sem 2, 2024', grade: 92, symbol: 'A+', distinction: true },
      { code: 'ACC102', name: 'Financial Accounting & Reporting Standards', semester: 'Sem 1, 2024', grade: 89, symbol: 'A', distinction: true },
      { code: 'ECO201', name: 'Microeconomics & Strategic Market Theory', semester: 'Sem 2, 2024', grade: 86, symbol: 'A', distinction: true },
      { code: 'QNT101', name: 'Business Statistics & Probability Modeling', semester: 'Sem 1, 2024', grade: 90, symbol: 'A+', distinction: true }
    ],
    workExperience: [
      {
        role: 'Research Assistant - Financial Economics',
        company: 'Richfield School of Commerce',
        duration: 'Jul 2024 - Present',
        description: 'Compiled data tables on JSE listed tech companies, analyzing earnings multiples and dividend yields.'
      }
    ],
    endorsements: [
      {
        authorName: 'Mpho Molefe',
        authorRole: 'Lead Business Analyst @ Standard Bank & Richfield Alumni',
        date: 'Dec 02, 2024',
        comment: 'Ayanda built one of the most mathematically sound DCF valuation models I have seen from a second-year undergraduate.'
      }
    ]
  },
  {
    id: 'std-siphesihle',
    studentIdNumber: '202433109',
    name: 'Siphesihle Zondi',
    email: 's.zondi@student.richfield.ac.za',
    phone: '+27 84 990 1234',
    campus: 'Umhlanga Campus',
    academicYear: '3rd Year',
    qualificationField: 'Business',
    qualificationName: 'Bachelor of Commerce in Accounting (BCom AGA)',
    nqfLevel: 7,
    academicAggregate: '91.2% (Cum Laude Track • SAICA/AGA Stream)',
    gpa: '3.98 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '3rd Year BCom AGA | Chartered Accountant Pathway & Audit Lead',
    bio: 'High-distinction accounting scholar with complete mastery of IFRS standards, managerial costing, and statutory tax legislation. Ranked 1st in the Richfield Inter-Campus Tax & Audit Sprint 2026.',
    skills: ['IFRS 15 / IFRS 16', 'SARS Corporate Tax Law', 'Auditing Procedures', 'Cost Accounting', 'SAP ERP', 'Excel Modeling'],
    githubUrl: 'https://github.com/siphesihle-zondi-aga',
    linkedinUrl: 'https://linkedin.com/in/siphesihle-zondi-aga',
    certificates: [
      {
        id: 'cert-saica-student',
        name: 'SAICA Student Associate (AGA(SA) Stream)',
        issuer: 'South African Institute of Chartered Accountants',
        issueDate: 'March 2024',
        credentialId: 'SAICA-AGA-2024-771',
        verificationHash: '0x99a12c8b7123ef0084ba',
        badgeColor: 'purple',
        skillsValidated: ['Auditing Standards', 'Corporate Ethics', 'Financial Reporting', 'Taxation Compliance'],
        description: 'Designates active accreditation status on the Associate General Accountant pathway.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-cum-laude',
        name: 'Academic Merit Distinction: Advanced Financial Accounting',
        issuer: 'Richfield Faculty of Business & Accounting Sciences',
        issueDate: 'December 2024',
        credentialId: 'RF-ACC-2024-002',
        verificationHash: '0x3344bba8901efca23199',
        badgeColor: 'emerald',
        skillsValidated: ['IFRS Standards', 'Consolidated Statements', 'Tax Deferrals'],
        description: 'First rank in national accounting examination across all 9 Richfield campuses.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-siphesihle-1',
        title: 'SQL Database Index Performance Profiler',
        description: 'Benchmarking simulator comparing Full Table Scans vs B-Tree clustered indices for high-volume financial accounting transactions.',
        language: 'SQL',
        techStack: ['PostgreSQL', 'SQL Queries', 'Index Optimization', 'EXPLAIN ANALYZE'],
        prototypeType: 'sql-profiler',
        repoUrl: 'https://github.com/siphesihle-zondi-aga/sql-index-profiler',
        starsCount: 22,
        forksCount: 5,
        unitTestsCount: 5,
        coveragePercent: 100,
        testCases: [
          { name: 'benchmarkSequentialScanOn100kLedgerRows()', passed: true, durationMs: 42 },
          { name: 'benchmarkBTreeIndexLookupByAccountCode()', passed: true, durationMs: 2 },
          { name: 'verifyIdempotentTransactionCommit()', passed: true, durationMs: 8 },
          { name: 'validateDoubleEntryBalanceConstraint()', passed: true, durationMs: 5 },
          { name: 'auditTrialLogIntegrityCheck()', passed: true, durationMs: 4 }
        ],
        codeSnippet: `-- EnrichHub Financial Ledger SQL Query Optimization Test
CREATE INDEX idx_general_ledger_acct_date 
ON general_ledger(account_code, transaction_date DESC);

-- Query execution time drops from 48.2ms to 1.8ms
EXPLAIN ANALYZE 
SELECT transaction_id, debit_amount, credit_amount, running_balance 
FROM general_ledger 
WHERE account_code = '1010-CASH' 
  AND transaction_date BETWEEN '2026-01-01' AND '2026-06-30'
ORDER BY transaction_date DESC;`
      }
    ],
    transcript: [
      { code: 'FAC301', name: 'Advanced Financial Accounting & IFRS', semester: 'Sem 1, 2025', grade: 93, symbol: 'A+', distinction: true },
      { code: 'AUD302', name: 'Internal & Statutory Auditing Standards', semester: 'Sem 2, 2024', grade: 91, symbol: 'A+', distinction: true },
      { code: 'TAX301', name: 'South African Corporate Taxation Law', semester: 'Sem 1, 2025', grade: 90, symbol: 'A+', distinction: true },
      { code: 'MAC202', name: 'Management Accounting & Cost Variance', semester: 'Sem 2, 2024', grade: 89, symbol: 'A', distinction: true }
    ],
    workExperience: [
      {
        role: 'Audit Assistant (Vacation Work)',
        company: 'SNG Grant Thornton South Africa',
        duration: 'Dec 2024 - Jan 2025',
        description: 'Assisted senior audit associates with substantive testing of cash, receivables, and fixed asset registers.'
      }
    ],
    endorsements: [
      {
        authorName: 'Prof. Anesh Naidoo',
        authorRole: 'Senior Faculty in Accounting & Governance',
        date: 'Jan 15, 2025',
        comment: 'Siphesihle holds one of the highest GPA rankings in our institution and exhibits exceptional analytical integrity.'
      }
    ]
  },
  {
    id: 'std-kagiso',
    studentIdNumber: '202444192',
    name: 'Kagiso Dlamini',
    email: 'kagiso.d@student.richfield.ac.za',
    phone: '+27 82 881 9901',
    campus: 'Durban Campus',
    academicYear: '3rd Year',
    qualificationField: 'IT',
    qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
    nqfLevel: 7,
    academicAggregate: '85.2% (Distinction in Software Engineering)',
    gpa: '3.82 / 4.00',
    deansList: true,
    bursaryStatus: 'Seeking Bursary',
    headline: '3rd Year BSc IT | Logistics Algorithm & Graph Theory Specialist',
    bio: 'Software developer with deep passion for graph optimization, spatial routing, and computational geometry. Built the Inter-Campus Courier Dispatch Simulator optimizing courier runs across Richfield campuses.',
    skills: ['Java', 'Graph Algorithms', 'Dijkstra Routing', 'C#', 'Spring Boot', 'SQL', 'Docker'],
    githubUrl: 'https://github.com/kagisod-richfield',
    linkedinUrl: 'https://linkedin.com/in/kagiso-dlamini-richfield',
    certificates: [
      {
        id: 'cert-cisco-ccna',
        name: 'Cisco Certified Network Associate (CCNA Routing & Switching)',
        issuer: 'Cisco Networking Academy',
        issueDate: 'August 2024',
        credentialId: 'CSCO-CCNA-229104',
        verificationHash: '0x77ba90124feadca10988',
        badgeColor: 'blue',
        skillsValidated: ['IP Routing Protocols (OSPF)', 'VLAN Trunking', 'Network Security & ACLs', 'IPv6 Subnetting'],
        description: 'Comprehensive network architecture, packet switching, and IP routing certification.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-durban-hack',
        name: 'Winner: Durban Regional Tech Innovation Hackathon',
        issuer: 'Richfield Durban Campus Innovation Hub',
        issueDate: 'November 2024',
        credentialId: 'RF-DBN-HACK-2024',
        verificationHash: '0x55ef019234aa109bca88',
        badgeColor: 'amber',
        skillsValidated: ['Algorithmic Optimization', 'Rapid Prototyping', 'System Presentation'],
        description: '1st place for delivering real-time logistics optimization algorithms for suburban supply chains.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-kagiso-1',
        title: 'Inter-Campus Logistics Courier Router (Dijkstra Algorithm)',
        description: 'Interactive graph routing engine that calculates the absolute shortest path and lowest transit fuel cost across Richfield campuses.',
        language: 'Java',
        techStack: ['Java', 'Graph Theory', 'Dijkstra', 'Priority Queues', 'REST API'],
        prototypeType: 'library-routing',
        repoUrl: 'https://github.com/kagisod-richfield/campus-courier-dijkstra',
        starsCount: 31,
        forksCount: 9,
        unitTestsCount: 7,
        coveragePercent: 97,
        testCases: [
          { name: 'findShortestPathNewtownToDurban()', passed: true, durationMs: 8 },
          { name: 'detectUnreachableNodesGracefully()', passed: true, durationMs: 3 },
          { name: 'calculateTotalFuelAndTransitCost()', passed: true, durationMs: 5 },
          { name: 'handleZeroWeightSelfLoopEdge()', passed: true, durationMs: 2 },
          { name: 'optimizeMultiStopDropRoute()', passed: true, durationMs: 9 },
          { name: 'benchmarkGraphDenseAdjacencyMatrix()', passed: true, durationMs: 14 },
          { name: 'verifyDirectedVsUndirectedEdges()', passed: true, durationMs: 4 }
        ],
        codeSnippet: `public class DijkstraCampusRouter {
  public static RouteResult findShortestRoute(Graph graph, String startCampus, String targetCampus) {
    Map<String, Double> distances = new HashMap<>();
    Map<String, String> previous = new HashMap<>();
    PriorityQueue<CampusNode> pq = new PriorityQueue<>(Comparator.comparingDouble(n -> n.distance));

    for (String campus : graph.getCampuses()) {
      distances.put(campus, Double.POSITIVE_INFINITY);
    }
    distances.put(startCampus, 0.0);
    pq.add(new CampusNode(startCampus, 0.0));

    while (!pq.isEmpty()) {
      CampusNode current = pq.poll();
      if (current.campus.equals(targetCampus)) break;

      for (Edge edge : graph.getEdges(current.campus)) {
        double newDist = distances.get(current.campus) + edge.distanceKm;
        if (newDist < distances.get(edge.destination)) {
          distances.put(edge.destination, newDist);
          previous.put(edge.destination, current.campus);
          pq.add(new CampusNode(edge.destination, newDist));
        }
      }
    }
    return reconstructRoute(previous, distances, startCampus, targetCampus);
  }
}`
      }
    ],
    transcript: [
      { code: 'DSA201', name: 'Data Structures and Algorithms', semester: 'Sem 1, 2025', grade: 91, symbol: 'A+', distinction: true },
      { code: 'PRG381', name: 'Advanced Object-Oriented Systems in Java', semester: 'Sem 2, 2024', grade: 88, symbol: 'A', distinction: true },
      { code: 'NET202', name: 'Computer Networks and Protocols', semester: 'Sem 1, 2024', grade: 86, symbol: 'A', distinction: true },
      { code: 'DBS301', name: 'Database Administration & Query Optimization', semester: 'Sem 2, 2024', grade: 84, symbol: 'B+', distinction: false }
    ],
    workExperience: [
      {
        role: 'Student Lab Technician',
        company: 'Richfield Durban Campus Computing Labs',
        duration: 'Feb 2024 - Present',
        description: 'Maintained Linux and Windows workstation servers, configured local VLAN switches and test environments.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Sipho Mthembu',
        authorRole: 'Faculty Head - AI Systems',
        date: 'Nov 29, 2024',
        comment: 'Kagiso produces elegant, maintainable code with thorough unit test suites.'
      }
    ]
  },
  {
    id: 'std-nandi',
    studentIdNumber: '202455829',
    name: 'Nandi Sithole',
    email: 'nandi.s@student.richfield.ac.za',
    phone: '+27 82 119 7733',
    campus: 'Cape Town Campus',
    academicYear: '3rd Year',
    qualificationField: 'IT',
    qualificationName: 'Bachelor of Science in IT (Cybersecurity Track)',
    nqfLevel: 7,
    academicAggregate: '88.3% (Distinction Average)',
    gpa: '3.90 / 4.00',
    deansList: true,
    bursaryStatus: 'Sponsored by Vodacom',
    headline: '3rd Year BSc IT | Cybersecurity & SOC Threat Intelligence Specialist',
    bio: 'Security researcher with hands-on expertise in vulnerability scanning, threat modeling, and SOC log analysis. Led the Cape Town CTF squad to victory in the National Inter-Varsity Cybersecurity Competition.',
    skills: ['Vulnerability Assessment', 'Python Automation', 'Network Security', 'Wireshark', 'SIEM / Splunk', 'Linux Security'],
    githubUrl: 'https://github.com/nandis-cyber-ct',
    linkedinUrl: 'https://linkedin.com/in/nandi-sithole-cyber',
    certificates: [
      {
        id: 'cert-comptia-sec',
        name: 'CompTIA Security+ (SY0-701)',
        issuer: 'CompTIA Certification Association',
        issueDate: 'December 2024',
        credentialId: 'COMP0019284910',
        verificationHash: '0x112233445566aabbccdd',
        badgeColor: 'rose',
        skillsValidated: ['Threat Analysis', 'Cryptography', 'Identity & Access Management', 'Incident Response'],
        description: 'Global benchmark for foundational security operational skills and risk management.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-ctf-champ',
        name: '1st Place Trophy: Richfield National Cyber CTF 2025',
        issuer: 'Richfield Center for Cybersecurity Innovation',
        issueDate: 'January 2025',
        credentialId: 'RF-CTF-2025-GOLD',
        verificationHash: '0x99887766554433221100',
        badgeColor: 'amber',
        skillsValidated: ['Zero-Day Remediation', 'Reverse Engineering', 'Penetration Testing'],
        description: 'Top overall individual score in inter-campus offensive security & defensive blue-team simulations.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-nandi-1',
        title: 'Cloud Microservices Token Gateway & Auth Emulator',
        description: 'Security testing suite verifying JWT signature tamper resistance and preventing token replay attacks.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'Node.js', 'Crypto', 'JWT', 'Jest'],
        prototypeType: 'jwt-auth',
        repoUrl: 'https://github.com/nandis-cyber-ct/jwt-guard-tester',
        starsCount: 34,
        forksCount: 11,
        unitTestsCount: 9,
        coveragePercent: 100,
        testCases: [
          { name: 'rejectModifiedHeaderPayloadSignature()', passed: true, durationMs: 4 },
          { name: 'blockNoneAlgorithmAttackVectors()', passed: true, durationMs: 2 },
          { name: 'preventKeyConfusionRSAToHMAC()', passed: true, durationMs: 6 },
          { name: 'enforceStrictExpiryTimestamps()', passed: true, durationMs: 3 }
        ],
        codeSnippet: `// Security Validation for JWT None-Algorithm Vulnerability
export function testTamperResistance(token: string, secretKey: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Header inspection
  const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
  if (header.alg === 'none' || header.alg === 'NONE') {
    throw new SecurityException('CRITICAL: Insecure none algorithm detected and rejected.');
  }
  return true;
}`
      }
    ],
    transcript: [
      { code: 'SEC301', name: 'Applied Cryptography & Network Defense', semester: 'Sem 1, 2025', grade: 95, symbol: 'A+', distinction: true },
      { code: 'FOR202', name: 'Computer Forensics & Chain of Custody', semester: 'Sem 2, 2024', grade: 90, symbol: 'A+', distinction: true },
      { code: 'PRG201', name: 'Systems Programming in Python & C', semester: 'Sem 1, 2024', grade: 88, symbol: 'A', distinction: true },
      { code: 'NET201', name: 'Enterprise Cloud Security Infrastructure', semester: 'Sem 2, 2024', grade: 87, symbol: 'A', distinction: true }
    ],
    workExperience: [
      {
        role: 'SOC Analyst Trainee',
        company: 'Vodacom Early Talent Cyber Academy',
        duration: 'Jan 2025 - Present',
        description: 'Analyzing firewall telemetry logs and security events in simulated enterprise enterprise SOC environments.'
      }
    ],
    endorsements: [
      {
        authorName: 'Devon Govender',
        authorRole: 'Cybersecurity Analyst at Luno & Richfield Alumni',
        date: 'Dec 10, 2024',
        comment: 'Nandi demonstrates world-class intuition for identifying edge-case security vulnerabilities and threat models.'
      }
    ]
  },
  {
    id: 'std-tshepo',
    studentIdNumber: '202481923',
    name: 'Tshepo Mokoena',
    email: 't.mokoena@student.richfield.ac.za',
    phone: '+27 83 229 4410',
    campus: 'Polokwane Campus',
    academicYear: '2nd Year',
    qualificationField: 'Business',
    qualificationName: 'Bachelor of Business Administration (BBA)',
    nqfLevel: 7,
    academicAggregate: '84.5% (Top 5% in Faculty)',
    gpa: '3.75 / 4.00',
    deansList: true,
    bursaryStatus: 'Seeking Bursary',
    headline: '2nd Year BBA | Operations & Supply Chain Strategist',
    bio: 'Business administration scholar with focus on lean logistics, agricultural trade corridors, and municipal economic development. Limpopo regional finalist in Agri-Logistics Innovation.',
    skills: ['Supply Chain Logistics', 'Operations Management', 'Lean Six Sigma', 'ERP Systems', 'Procurement'],
    githubUrl: 'https://github.com/tshepo-mokoena-bba',
    linkedinUrl: 'https://linkedin.com/in/tshepo-mokoena-bba',
    certificates: [
      {
        id: 'cert-six-sigma',
        name: 'Lean Six Sigma Yellow Belt (LSSYB)',
        issuer: 'International Six Sigma Institute',
        issueDate: 'October 2024',
        credentialId: 'ISSI-YB-2024-991',
        verificationHash: '0x887766112233aabbccdd',
        badgeColor: 'amber',
        skillsValidated: ['DMAIC Process', 'Root Cause Analysis', 'Waste Reduction', 'Process Flow Optimization'],
        description: 'Quality management framework for operational excellence and defect minimization.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-ops-merit',
        name: 'Dean\'s Merit Certificate in Operations Science',
        issuer: 'Richfield Faculty of Business & Management',
        issueDate: 'December 2024',
        credentialId: 'RF-OPS-2024-031',
        verificationHash: '0x1234567890abcdef1234',
        badgeColor: 'emerald',
        skillsValidated: ['Supply Chain Design', 'Inventory Management', 'ERP Coordination'],
        description: 'Top academic score in Polokwane Campus cohort for operations management.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-tshepo-1',
        title: 'Inter-Campus Logistics Courier Router (Dijkstra Algorithm)',
        description: 'Supply chain routing simulation adapting graph shortest paths for provincial transport depots.',
        language: 'Java',
        techStack: ['Java', 'Logistics Modeling', 'Dijkstra', 'Graph Theory'],
        prototypeType: 'library-routing',
        repoUrl: 'https://github.com/tshepo-mokoena-bba/supply-chain-routing',
        starsCount: 19,
        forksCount: 4,
        unitTestsCount: 5,
        coveragePercent: 95,
        testCases: [
          { name: 'verifyPolokwaneDepotTransitTime()', passed: true, durationMs: 6 },
          { name: 'optimizeFleetVehicleUtilization()', passed: true, durationMs: 4 }
        ],
        codeSnippet: `// Supply Chain Fleet Routing Node Cost Calculator
public double calculateOperatingCost(double distanceKm, double fuelPricePerLiter, double tollFees) {
  double fuelConsumed = (distanceKm / 100.0) * 28.5; // Commercial truck consumption
  return (fuelConsumed * fuelPricePerLiter) + tollFees;
}`
      }
    ],
    transcript: [
      { code: 'OPS201', name: 'Operations & Supply Chain Management', semester: 'Sem 2, 2024', grade: 90, symbol: 'A+', distinction: true },
      { code: 'BUS101', name: 'Business Enterprise Foundations', semester: 'Sem 1, 2024', grade: 86, symbol: 'A', distinction: true },
      { code: 'HRM201', name: 'Human Resource & Labor Relations Management', semester: 'Sem 2, 2024', grade: 83, symbol: 'B+', distinction: false }
    ],
    workExperience: [
      {
        role: 'Operations Coordinator (Part-time)',
        company: 'Polokwane Fresh Produce Logistics',
        duration: 'Mar 2024 - Present',
        description: 'Tracked dispatch manifests, driver route schedules, and refrigeration compliance.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Nomsa Khumalo',
        authorRole: 'Senior Lecturer in Business Science',
        date: 'Dec 05, 2024',
        comment: 'Tshepo combines practical commercial groundedness with exceptional organizational rigor.'
      }
    ]
  },
  {
    id: 'std-lerato',
    studentIdNumber: '202499120',
    name: 'Lerato Molefe',
    email: 'lerato.m@student.richfield.ac.za',
    phone: '+27 82 441 9002',
    campus: 'Sandton Campus',
    academicYear: '3rd Year',
    qualificationField: 'Both',
    qualificationName: 'BCom (AGA IT) Professional Articulation',
    nqfLevel: 7,
    academicAggregate: '89.1% (Distinction in Financial Information Systems)',
    gpa: '3.94 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '3rd Year BCom AGA IT | FinTech Systems & Financial Data Engineering',
    bio: 'Unique dual-competency candidate bridging chartered accounting standards with modern database engineering and Python analytics. Capitec Mobile Money Datathon 2nd place winner.',
    skills: ['SQL Warehousing', 'IFRS Standards', 'Python for Finance', 'Financial Modeling', 'Audit Automation', 'PostgreSQL'],
    githubUrl: 'https://github.com/leratomolefe-fintech',
    linkedinUrl: 'https://linkedin.com/in/lerato-molefe-fintech',
    certificates: [
      {
        id: 'cert-azure-data',
        name: 'Microsoft Certified: Azure Data Fundamentals (DP-900)',
        issuer: 'Microsoft Worldwide Learning',
        issueDate: 'November 2024',
        credentialId: 'MSFT-DP900-33291',
        verificationHash: '0x445566778899aabbccdd',
        badgeColor: 'blue',
        skillsValidated: ['Relational & Non-Relational Data Concepts', 'Azure Synapse Analytics', 'Power BI Integration'],
        description: 'Foundational knowledge of core data concepts and cloud data services on Microsoft Azure.',
        verificationStatus: 'Accredited External Body'
      },
      {
        id: 'cert-rf-dual-merit',
        name: 'Dean\'s Dual Faculty Excellence Award (IT & Commerce)',
        issuer: 'Richfield Academic Directorate',
        issueDate: 'December 2024',
        credentialId: 'RF-DUAL-2024-001',
        verificationHash: '0x9900aabbccddeeff1122',
        badgeColor: 'emerald',
        skillsValidated: ['Financial Data Pipelines', 'Audit Trail Architecture', 'IFRS Database Compliance'],
        description: 'Special distinction for top overall aggregate in the dual IT-Commerce articulation stream.',
        verificationStatus: 'Verified by Richfield Registrar'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-lerato-1',
        title: 'FinTech DCF Cash Flow & Enterprise Valuation Engine',
        description: 'Automated valuation model with integrated sensitivity tables and Monte Carlo simulation parameters.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'React', 'Financial Analysis', 'PostgreSQL'],
        prototypeType: 'dcf-valuation',
        repoUrl: 'https://github.com/leratomolefe-fintech/fintech-valuation-suite',
        starsCount: 26,
        forksCount: 7,
        unitTestsCount: 7,
        coveragePercent: 99,
        testCases: [
          { name: 'verifyAutomatedIFRSCashFlowTaxAdjustment()', passed: true, durationMs: 5 },
          { name: 'benchmarkPostgresReconciliationSpeed()', passed: true, durationMs: 8 }
        ],
        codeSnippet: `// Automated IFRS Deferred Tax Reconciliation
export function calculateDeferredTaxLiability(carryingAmount: number, taxBase: number, taxRate: number = 0.27) {
  const temporaryDifference = carryingAmount - taxBase;
  return {
    temporaryDifference,
    deferredTaxLiability: temporaryDifference > 0 ? temporaryDifference * taxRate : 0,
    deferredTaxAsset: temporaryDifference < 0 ? Math.abs(temporaryDifference) * taxRate : 0
  };
}`
      }
    ],
    transcript: [
      { code: 'FIS301', name: 'Financial Information Systems Architecture', semester: 'Sem 1, 2025', grade: 94, symbol: 'A+', distinction: true },
      { code: 'DBS202', name: 'Enterprise Database Systems & SQL', semester: 'Sem 2, 2024', grade: 91, symbol: 'A+', distinction: true },
      { code: 'FAC201', name: 'Corporate Financial Reporting II', semester: 'Sem 1, 2024', grade: 88, symbol: 'A', distinction: true }
    ],
    workExperience: [
      {
        role: 'FinTech Systems Intern',
        company: 'Standard Bank Innovation Lab',
        duration: 'June 2024 - Aug 2024',
        description: 'Engineered automated reconciliation queries comparing transactional database logs with statutory general ledgers.'
      }
    ],
    endorsements: [
      {
        authorName: 'Mpho Molefe',
        authorRole: 'Lead Business Analyst @ Standard Bank',
        date: 'Dec 14, 2024',
        comment: 'Lerato possesses the rare ability to discuss both complex database indexing and intricate IFRS standards with total fluency.'
      }
    ]
  },
  {
    id: 'std-bongani',
    studentIdNumber: '202411029',
    name: 'Bongani Nkosi',
    email: 'b.nkosi@student.richfield.ac.za',
    phone: '+27 82 770 1294',
    campus: 'Midrand Campus',
    academicYear: '2nd Year',
    qualificationField: 'IT',
    qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
    nqfLevel: 7,
    academicAggregate: '86.4% (Distinction Average)',
    gpa: '3.84 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '2nd Year BSc IT | Mobile App Developer & Offline-First API Architect',
    bio: 'Mobile software developer with two production apps on Google Play. Specializes in offline-first synchronization, SQLite caches, and responsive client UX.',
    skills: ['Flutter', 'Dart', 'Node.js', 'REST APIs', 'PostgreSQL', 'SQLite', 'Git'],
    githubUrl: 'https://github.com/bonganinkosi-mobile',
    linkedinUrl: 'https://linkedin.com/in/bongani-nkosi-mobile',
    certificates: [
      {
        id: 'cert-google-flutter',
        name: 'Google Associate Android Developer Candidate',
        issuer: 'Google Developers Certification',
        issueDate: 'December 2024',
        credentialId: 'GOOG-AAD-2024-991',
        verificationHash: '0x112233aabbccddeeff00',
        badgeColor: 'blue',
        skillsValidated: ['Android Architecture', 'Background Services', 'Local Persistence', 'Responsive UI Layouts'],
        description: 'Demonstrates proficiency in designing, testing, and shipping robust mobile software.',
        verificationStatus: 'Accredited External Body'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-bongani-1',
        title: 'Cloud Microservices Token Gateway & Auth Emulator',
        description: 'Offline-first JWT token storage emulator with biometric biometric unlock simulation.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'Flutter / Dart', 'JWT', 'SQLite'],
        prototypeType: 'jwt-auth',
        repoUrl: 'https://github.com/bonganinkosi-mobile/mobile-token-vault',
        starsCount: 20,
        forksCount: 6,
        unitTestsCount: 6,
        coveragePercent: 96,
        testCases: [
          { name: 'storeTokenInEncryptedDeviceVault()', passed: true, durationMs: 4 },
          { name: 'refreshExpiredTokensSilently()', passed: true, durationMs: 7 }
        ],
        codeSnippet: `// Mobile Offline Auth Interceptor
export class MobileAuthInterceptor {
  private localVaultToken: string | null = null;

  async attachAuthorizationHeader(headers: Record<string, string>): Promise<Record<string, string>> {
    if (this.localVaultToken) {
      headers['Authorization'] = 'Bearer ' + this.localVaultToken;
    }
    return headers;
  }
}`
      }
    ],
    transcript: [
      { code: 'PRG201', name: 'Mobile Application Architecture & UI', semester: 'Sem 2, 2024', grade: 91, symbol: 'A+', distinction: true },
      { code: 'DBS201', name: 'Database Fundamentals & Storage Models', semester: 'Sem 1, 2024', grade: 86, symbol: 'A', distinction: true }
    ],
    workExperience: [
      {
        role: 'Freelance Mobile App Developer',
        company: 'Self-Employed',
        duration: 'Jun 2023 - Present',
        description: 'Built campus community apps with offline event caching and push notifications.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Sipho Mthembu',
        authorRole: 'Head of IT & Faculty Senior Lecturer',
        date: 'Jan 08, 2025',
        comment: 'Bongani is exceptionally proactive in shipping production apps and writing clean, tested UI code.'
      }
    ]
  },
  {
    id: 'std-zanele',
    studentIdNumber: '202477218',
    name: 'Zanele Khumalo',
    email: 'z.khumalo@student.richfield.ac.za',
    phone: '+27 83 991 2240',
    campus: 'Alberton Campus',
    academicYear: '3rd Year',
    qualificationField: 'Business',
    qualificationName: 'Bachelor of Commerce in Marketing & Management (BCom)',
    nqfLevel: 7,
    academicAggregate: '83.2% (Top of Marketing Stream)',
    gpa: '3.70 / 4.00',
    deansList: true,
    bursaryStatus: 'Open to Offers',
    headline: '3rd Year BCom | Digital Growth & Customer Data Strategist',
    bio: 'Marketing science student passionate about user analytics, customer lifetime value (CLV) optimization, and enterprise CRM adoption. Alberton Campus Student Representative Council vice-chair.',
    skills: ['Customer Analytics', 'Google Analytics 4', 'HubSpot CRM', 'Brand Strategy', 'Consumer Behavior', 'SQL'],
    githubUrl: 'https://github.com/zanele-khumalo-mktg',
    linkedinUrl: 'https://linkedin.com/in/zanele-khumalo-bcom',
    certificates: [
      {
        id: 'cert-ga4',
        name: 'Google Analytics 4 (GA4) Professional Certification',
        issuer: 'Google Skillshop',
        issueDate: 'August 2024',
        credentialId: 'GA4-CERT-881920',
        verificationHash: '0xaabbccddeeff00112233',
        badgeColor: 'amber',
        skillsValidated: ['Event Tracking', 'Attribution Modeling', 'Conversion Funnels', 'Audience Segmentation'],
        description: 'Enterprise measurement and data analysis validation from Google.',
        verificationStatus: 'Accredited External Body'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-zanele-1',
        title: 'FinTech DCF Cash Flow & Enterprise Valuation Engine',
        description: 'Cohort churn and customer acquisition cost (CAC) payback simulation model.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'React', 'Marketing Analytics'],
        prototypeType: 'dcf-valuation',
        repoUrl: 'https://github.com/zanele-khumalo-mktg/cac-clv-engine',
        starsCount: 17,
        forksCount: 3,
        unitTestsCount: 4,
        coveragePercent: 94,
        testCases: [
          { name: 'calculateCustomerLifetimeValueLTV()', passed: true, durationMs: 3 },
          { name: 'validateCACPaybackPeriodMonths()', passed: true, durationMs: 4 }
        ],
        codeSnippet: `export function calculateLTVtoCAC(clv: number, cac: number): { ratio: number; health: string } {
  const ratio = clv / cac;
  return {
    ratio,
    health: ratio >= 3.0 ? 'Exceptional Unit Economics' : ratio >= 1.5 ? 'Sustainable' : 'Needs Optimization'
  };
}`
      }
    ],
    transcript: [
      { code: 'MKT301', name: 'Strategic Brand & Digital Marketing', semester: 'Sem 1, 2025', grade: 89, symbol: 'A', distinction: true },
      { code: 'BUS202', name: 'Consumer Behavior & Market Research', semester: 'Sem 2, 2024', grade: 85, symbol: 'A', distinction: true }
    ],
    workExperience: [
      {
        role: 'Campus Brand Ambassador Lead',
        company: 'Vodacom Early Talent Network',
        duration: 'Jan 2024 - Present',
        description: 'Coordinated student engagement events, hackathon registrations, and digital promotion campaigns.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Nomsa Khumalo',
        authorRole: 'Senior Lecturer in Business Science',
        date: 'Dec 18, 2024',
        comment: 'Zanele possesses superior communication skills, strategic vision, and data literacy.'
      }
    ]
  },
  {
    id: 'std-spiva',
    studentIdNumber: '202510822',
    name: 'Spiva Ongeziwe',
    email: 'spiva.o@student.richfield.ac.za',
    phone: '+27 84 330 9912',
    campus: 'Newtown Campus',
    academicYear: '1st Year',
    qualificationField: 'IT',
    qualificationName: 'Bachelor of Science in Information Technology (BSc IT)',
    nqfLevel: 7,
    academicAggregate: '87.0% (Distinction Average)',
    gpa: '3.88 / 4.00',
    deansList: true,
    bursaryStatus: 'Seeking Bursary',
    headline: '1st Year BSc IT | Rising Algorithmic Programmer & Problem Solver',
    bio: 'First year standout student with strong foundations in Python, discrete mathematics, and web technologies. Active participant in coding challenges and campus hackathons.',
    skills: ['Python', 'Algorithms', 'Discrete Math', 'HTML/CSS/JS', 'Git'],
    githubUrl: 'https://github.com/spiva-ongeziwe-it',
    linkedinUrl: 'https://linkedin.com/in/spiva-ongeziwe',
    certificates: [
      {
        id: 'cert-python-pcep',
        name: 'PCEP – Certified Entry-Level Python Programmer',
        issuer: 'OpenEDG Python Institute',
        issueDate: 'December 2024',
        credentialId: 'PCEP-30-02-99120',
        verificationHash: '0xbbccddeeff0011223344',
        badgeColor: 'emerald',
        skillsValidated: ['Core Syntax', 'Data Structures (Lists, Dicts)', 'Functions & Modules'],
        description: 'International certification demonstrating fundamental Python development competence.',
        verificationStatus: 'Accredited External Body'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-spiva-1',
        title: 'Inter-Campus Logistics Courier Router (Dijkstra Algorithm)',
        description: 'First-year algorithm implementation exploring shortest paths and graph representations.',
        language: 'Java',
        techStack: ['Python', 'Algorithms', 'Graph Theory'],
        prototypeType: 'library-routing',
        repoUrl: 'https://github.com/spiva-ongeziwe-it/campus-routes',
        starsCount: 14,
        forksCount: 2,
        unitTestsCount: 4,
        coveragePercent: 100,
        testCases: [
          { name: 'testGraphNodeInitialization()', passed: true, durationMs: 2 },
          { name: 'testBFSBreadthFirstSearch()', passed: true, durationMs: 3 }
        ],
        codeSnippet: `# Breadth First Search Path Finder
def bfs_shortest_path(graph, start, goal):
    explored = []
    queue = [[start]]
    while queue:
        path = queue.pop(0)
        node = path[-1]
        if node not in explored:
            neighbours = graph[node]
            for neighbour in neighbours:
                new_path = list(path)
                new_path.append(neighbour)
                queue.append(new_path)
                if neighbour == goal:
                    return new_path
            explored.append(node)
    return None`
      }
    ],
    transcript: [
      { code: 'PRG101', name: 'Programming Foundations with Python', semester: 'Sem 1, 2025', grade: 92, symbol: 'A+', distinction: true },
      { code: 'MAT101', name: 'Discrete Mathematics for Computing', semester: 'Sem 1, 2025', grade: 88, symbol: 'A', distinction: true }
    ],
    workExperience: [
      {
        role: 'Campus Tech Squad Volunteer',
        company: 'Richfield Student Affairs',
        duration: 'Jan 2025 - Present',
        description: 'Assisted new students during orientation with student portal logins and software installations.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Sipho Mthembu',
        authorRole: 'Head of IT & Faculty Senior Lecturer',
        date: 'Feb 12, 2025',
        comment: 'Spiva displays tremendous natural talent and enthusiasm for computational problem solving.'
      }
    ]
  },
  {
    id: 'std-palesa',
    studentIdNumber: '202452119',
    name: 'Palesa Moloi',
    email: 'palesa.m@student.richfield.ac.za',
    phone: '+27 82 994 0019',
    campus: 'Midrand Campus',
    academicYear: '2nd Year',
    qualificationField: 'Business',
    qualificationName: 'Diploma in Business Administration (DBA)',
    nqfLevel: 6,
    academicAggregate: '82.8% (Dean\'s Honor Roll)',
    gpa: '3.68 / 4.00',
    deansList: true,
    bursaryStatus: 'Seeking Bursary',
    headline: '2nd Year DBA | Talent Acquisition & Human Capital Operations',
    bio: 'Diploma in Business Administration student focused on talent management, workplace relations, and lean enterprise operations. Coordinates student leadership forums at Midrand Campus.',
    skills: ['Human Resources', 'Labor Law (BCEA)', 'Recruitment Operations', 'Office Administration', 'Payroll'],
    githubUrl: 'https://github.com/palesa-moloi-dba',
    linkedinUrl: 'https://linkedin.com/in/palesa-moloi-dba',
    certificates: [
      {
        id: 'cert-sabpp-student',
        name: 'SABPP Student HR Practitioner Certificate',
        issuer: 'SA Board for People Practices (SABPP)',
        issueDate: 'October 2024',
        credentialId: 'SABPP-STU-2024-81',
        verificationHash: '0xccddeeff001122334455',
        badgeColor: 'purple',
        skillsValidated: ['HR Standards', 'Fair Labor Practice', 'Employee Wellness', 'Performance Management'],
        description: 'Professional body endorsement for emerging South African HR leaders.',
        verificationStatus: 'Accredited External Body'
      }
    ],
    codeHubProjects: [
      {
        id: 'proj-palesa-1',
        title: 'FinTech DCF Cash Flow & Enterprise Valuation Engine',
        description: 'Workplace training ROI calculation and staff retention cost analyzer.',
        language: 'TypeScript',
        techStack: ['TypeScript', 'React', 'HR Analytics'],
        prototypeType: 'dcf-valuation',
        repoUrl: 'https://github.com/palesa-moloi-dba/hr-analytics-model',
        starsCount: 15,
        forksCount: 2,
        unitTestsCount: 3,
        coveragePercent: 92,
        testCases: [
          { name: 'calculateEmployeeTurnoverCost()', passed: true, durationMs: 4 }
        ],
        codeSnippet: `// Employee Turnover Financial Impact
export function calculateTurnoverLoss(annualSalary: number, vacancyWeeks: number) {
  const weeklyRate = annualSalary / 52;
  const lostProductivity = weeklyRate * vacancyWeeks;
  const recruitmentCost = annualSalary * 0.15;
  return lostProductivity + recruitmentCost;
}`
      }
    ],
    transcript: [
      { code: 'HRM201', name: 'Human Resource Management Principles', semester: 'Sem 2, 2024', grade: 88, symbol: 'A', distinction: true },
      { code: 'BUS102', name: 'Commercial Law & Labor Frameworks', semester: 'Sem 1, 2024', grade: 84, symbol: 'B+', distinction: false }
    ],
    workExperience: [
      {
        role: 'Student Assistant - Administration',
        company: 'Richfield Midrand Campus',
        duration: 'Mar 2024 - Present',
        description: 'Maintained student attendance registers, coordinated timetable updates, and assisted campus registrar.'
      }
    ],
    endorsements: [
      {
        authorName: 'Dr. Nomsa Khumalo',
        authorRole: 'Senior Lecturer in Business Science',
        date: 'Nov 12, 2024',
        comment: 'Palesa is exceptionally conscientious, articulate, and dedicated to organizational integrity.'
      }
    ]
  }
];
