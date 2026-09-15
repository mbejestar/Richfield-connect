import { EduMatchSubject, EduMatchQuestion, EduMatchedPeer, EduMatchChallengeRecord } from './types';

export const EDUMATCH_SUBJECTS: EduMatchSubject[] = [
  {
    id: 'database',
    name: 'Database Architecture & SQL',
    code: 'DBS381',
    category: 'IT',
    description: 'Relational schemas, SQL queries, B-Tree indexes, 3NF/BCNF normalization, and ACID transactions.',
    subTopics: ['SQL Joins & Aggregations', 'Normalization (1NF-BCNF)', 'Indexing & Query Plans', 'ACID Transactions & Concurrency'],
    iconName: 'Database',
    activeLearnersCount: 342
  },
  {
    id: 'java',
    name: 'Java & Systems Design',
    code: 'PRG381',
    category: 'IT',
    description: 'Object-Oriented Programming, Multithreading, Spring Boot microservices, and Collections architecture.',
    subTopics: ['OOP & Polymorphism', 'Concurrency & Threads', 'Collections & Generics', 'Design Patterns (Factory, Observer)'],
    iconName: 'Code',
    activeLearnersCount: 418
  },
  {
    id: 'mathematics',
    name: 'Discrete Mathematics & Stats',
    code: 'MTH181',
    category: 'Mathematics',
    description: 'Set theory, boolean algebra, graph theory, combinatorics, and discrete probability matrices.',
    subTopics: ['Boolean Logic & Truth Tables', 'Graph Theory & Trees', 'Combinatorics & Permutations', 'Discrete Probability'],
    iconName: 'Binary',
    activeLearnersCount: 220
  },
  {
    id: 'networking',
    name: 'Cloud Infrastructure & Networks',
    code: 'NET381',
    category: 'IT',
    description: 'TCP/IP and OSI models, CIDR subnetting, AWS VPC security groups, and routing topologies.',
    subTopics: ['OSI & TCP/IP Stack', 'IPv4 Subnetting & CIDR', 'Routing Topologies (OSPF, BGP)', 'Cloud VPC & Gateways'],
    iconName: 'Network',
    activeLearnersCount: 285
  },
  {
    id: 'software-eng',
    name: 'Software Engineering & Agile',
    code: 'SWE281',
    category: 'IT',
    description: 'Microservices architecture, CI/CD automated test pipelines, UML diagrams, and Scrum sprints.',
    subTopics: ['Agile Scrum & Sprints', 'CI/CD Pipelines & DevOps', 'Microservices vs Monoliths', 'Test-Driven Development (TDD)'],
    iconName: 'Cpu',
    activeLearnersCount: 195
  },
  {
    id: 'business-fin',
    name: 'Management Accounting & FinTech',
    code: 'ACC281',
    category: 'Business',
    description: 'Break-even costing, financial ratio diagnostics, capital budgeting, and retail banking protocols.',
    subTopics: ['Break-Even Analysis', 'Financial Ratios & ROI', 'Capital Budgeting (NPV/IRR)', 'Payment Reconciliation'],
    iconName: 'Calculator',
    activeLearnersCount: 160
  }
];

export const EDUMATCH_DIAGNOSTIC_QUESTIONS: Record<string, EduMatchQuestion[]> = {
  database: [
    {
      id: 'db-q1',
      subjectId: 'database',
      subTopic: 'SQL Joins & Aggregations',
      question: 'Which SQL join returns all records from the left table, and the matched records from the right table, filling with NULL when there is no match?',
      options: ['INNER JOIN', 'LEFT OUTER JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
      correctIndex: 1,
      explanation: 'LEFT OUTER JOIN preserves every row from the left-hand relation regardless of whether a corresponding tuple exists in the right table.',
      difficulty: 'Beginner'
    },
    {
      id: 'db-q2',
      subjectId: 'database',
      subTopic: 'Normalization (1NF-BCNF)',
      question: 'A table is in Third Normal Form (3NF) if it is in 2NF and has no:',
      options: ['Partial key dependencies', 'Transitive functional dependencies', 'Foreign key constraints', 'Composite primary keys'],
      correctIndex: 1,
      explanation: '3NF strictly eliminates transitive functional dependencies (where non-prime attributes determine other non-prime attributes: X → Y and Y → Z).',
      difficulty: 'Intermediate'
    },
    {
      id: 'db-q3',
      subjectId: 'database',
      subTopic: 'Indexing & Query Plans',
      question: 'In a B-Tree database index on (LastName, FirstName), which of the following WHERE clauses CANNOT fully utilize the index structure?',
      codeSnippet: 'SELECT * FROM Students WHERE FirstName = "Sarah";',
      options: [
        'WHERE LastName = "Khumalo"',
        'WHERE LastName = "Khumalo" AND FirstName = "Sarah"',
        'WHERE FirstName = "Sarah"',
        'WHERE LastName LIKE "Khu%"'
      ],
      correctIndex: 2,
      explanation: 'Compound indexes follow the leftmost prefix rule. Searching exclusively on the secondary column (FirstName) skips the root sorting key, triggering a full table scan.',
      difficulty: 'Advanced'
    },
    {
      id: 'db-q4',
      subjectId: 'database',
      subTopic: 'ACID Transactions & Concurrency',
      question: 'Which ACID property guarantees that once a transaction has committed, its changes survive system crashes or power failures?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctIndex: 3,
      explanation: 'Durability ensures that write-ahead logs (WAL) or transaction records are flushed to non-volatile disk storage before acknowledging commit completion.',
      difficulty: 'Beginner'
    }
  ],
  java: [
    {
      id: 'java-q1',
      subjectId: 'java',
      subTopic: 'OOP & Polymorphism',
      question: 'In Java, which keyword is used by a subclass to invoke the constructor or overridden method of its immediate parent class?',
      options: ['this', 'super', 'parent', 'base'],
      correctIndex: 1,
      explanation: 'super() delegates directly to the superclass constructor or superclass implementation of a shadowed method.',
      difficulty: 'Beginner'
    },
    {
      id: 'java-q2',
      subjectId: 'java',
      subTopic: 'Concurrency & Threads',
      question: 'What happens when two concurrent threads attempt to execute a method marked with the synchronized keyword on the same object instance?',
      options: [
        'Both threads run concurrently using time-slicing',
        'One thread acquires the intrinsic monitor lock; the second thread blocks until the first releases it',
        'A ConcurrentModificationException is thrown immediately',
        'The Java Virtual Machine allocates two duplicate object instances'
      ],
      correctIndex: 1,
      explanation: 'In Java, synchronized locks on the object monitor (intrinsic lock). Only one thread can hold the lock at any given instant.',
      difficulty: 'Intermediate'
    },
    {
      id: 'java-q3',
      subjectId: 'java',
      subTopic: 'Collections & Generics',
      question: 'Which Java Collection implementation offers average O(1) time complexity for lookup, insertion, and deletion operations?',
      options: ['TreeMap', 'LinkedList', 'HashMap', 'Vector'],
      correctIndex: 2,
      explanation: 'HashMap uses array-backed hash buckets with hash codes, providing amortized O(1) retrieval and mutation under ideal distribution.',
      difficulty: 'Intermediate'
    },
    {
      id: 'java-q4',
      subjectId: 'java',
      subTopic: 'Design Patterns (Factory, Observer)',
      question: 'Which design pattern is best suited when an object needs to notify multiple dependent listeners automatically when its state changes?',
      options: ['Singleton Pattern', 'Observer Pattern', 'Adapter Pattern', 'Decorator Pattern'],
      correctIndex: 1,
      explanation: 'The Observer pattern defines a one-to-many dependency so that when one subject updates, all registered observers receive broadcast notifications.',
      difficulty: 'Beginner'
    }
  ],
  mathematics: [
    {
      id: 'mth-q1',
      subjectId: 'mathematics',
      subTopic: 'Boolean Logic & Truth Tables',
      question: 'By De Morgan’s Laws, what is the logical equivalent of ¬(A ∧ B)?',
      options: ['¬A ∧ ¬B', '¬A ∨ ¬B', 'A ∨ B', '¬(A ∨ B)'],
      correctIndex: 1,
      explanation: 'De Morgan’s law states that the negation of a conjunction is the disjunction of the negations: NOT(A AND B) = (NOT A) OR (NOT B).',
      difficulty: 'Beginner'
    },
    {
      id: 'mth-q2',
      subjectId: 'mathematics',
      subTopic: 'Graph Theory & Trees',
      question: 'How many edges does a connected undirected tree with n vertices have?',
      options: ['n', 'n - 1', 'n + 1', 'n(n - 1) / 2'],
      correctIndex: 1,
      explanation: 'Every acyclic connected tree with n vertices contains exactly (n - 1) edges.',
      difficulty: 'Intermediate'
    },
    {
      id: 'mth-q3',
      subjectId: 'mathematics',
      subTopic: 'Combinatorics & Permutations',
      question: 'In how many distinct ways can 5 Richfield students be seated in a row of 5 computer lab stations?',
      options: ['25', '60', '120', '720'],
      correctIndex: 2,
      explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120 distinct permutations.',
      difficulty: 'Intermediate'
    },
    {
      id: 'mth-q4',
      subjectId: 'mathematics',
      subTopic: 'Discrete Probability',
      question: 'If two fair 6-sided dice are rolled, what is the probability that the sum of the dice equals 7?',
      options: ['1/6 (6/36)', '1/12 (3/36)', '5/36', '7/36'],
      correctIndex: 0,
      explanation: 'There are 6 outcomes that sum to 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) out of 36 total outcomes = 6/36 = 1/6.',
      difficulty: 'Intermediate'
    }
  ],
  networking: [
    {
      id: 'net-q1',
      subjectId: 'networking',
      subTopic: 'OSI & TCP/IP Stack',
      question: 'At which OSI reference layer do routers primarily operate to inspect IP headers and forward packets?',
      options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
      correctIndex: 1,
      explanation: 'Layer 3 (Network Layer) handles logical IP addressing, path determination, and packet routing.',
      difficulty: 'Beginner'
    },
    {
      id: 'net-q2',
      subjectId: 'networking',
      subTopic: 'IPv4 Subnetting & CIDR',
      question: 'How many usable host IP addresses are available in a subnet with a /26 CIDR mask (e.g. 192.168.10.0/26)?',
      options: ['64', '62', '30', '126'],
      correctIndex: 1,
      explanation: 'A /26 mask leaves 32 - 26 = 6 host bits. 2^6 = 64 total addresses. Subtracting 2 (network identifier and broadcast address) leaves 62 usable host addresses.',
      difficulty: 'Intermediate'
    },
    {
      id: 'net-q3',
      subjectId: 'networking',
      subTopic: 'Routing Topologies (OSPF, BGP)',
      question: 'Which protocol is standard for routing traffic between distinct Autonomous Systems (AS) across the global Internet backbone?',
      options: ['OSPF', 'RIPv2', 'BGP (Border Gateway Protocol)', 'ICMP'],
      correctIndex: 2,
      explanation: 'BGP is an exterior gateway protocol (EGP) designed for routing between autonomous systems across inter-domain backbones.',
      difficulty: 'Intermediate'
    },
    {
      id: 'net-q4',
      subjectId: 'networking',
      subTopic: 'Cloud VPC & Gateways',
      question: 'In an AWS VPC architecture, what component enables EC2 instances in a private subnet to initiate outbound internet traffic while blocking inbound connections?',
      options: ['Internet Gateway (IGW)', 'NAT Gateway', 'Transit Gateway', 'VPC Peering Connection'],
      correctIndex: 1,
      explanation: 'A NAT Gateway translates private IP addresses to a public elastic IP for outbound traffic while preventing external hosts from initiating inbound sessions.',
      difficulty: 'Intermediate'
    }
  ]
};

// Matched Richfield peers with complementary skills across campuses
export const INITIAL_EDUMATCHED_PEERS: EduMatchedPeer[] = [
  {
    id: 'peer-sarah',
    name: 'Sarah Khumalo',
    avatar: '',
    campus: 'Newtown Campus',
    academicYear: '3rd Year',
    qualification: 'BSc in Information Technology',
    subject: 'Database Architecture & SQL (DBS381)',
    subjectScore: 92,
    strongIn: ['SQL Joins & Aggregations', 'Normalization (1NF-BCNF)'],
    needsHelpWith: ['B-Tree Indexing & Query Plans', 'ACID Isolation Levels'],
    matchScore: 94,
    matchReason: 'Sarah scored 92% in SQL Normalization & Joins. She is looking for a study partner skilled in B-Tree Indexing & Query Plans — exactly your strongest module!',
    studyStreak: 7,
    xpPoints: 1840,
    isStudyBuddy: false,
    onlineStatus: 'online',
    recommendedLibraryResource: {
      title: 'Database Systems: Design, Implementation & Management (13th Ed)',
      code: 'DBS-TEXT-2026',
      author: 'Coronel & Morris'
    }
  },
  {
    id: 'peer-kagiso',
    name: 'Kagiso Dlamini',
    avatar: '',
    campus: 'Durban Campus',
    academicYear: '3rd Year',
    qualification: 'BSc in Information Technology',
    subject: 'Java & Systems Design (PRG381)',
    subjectScore: 89,
    strongIn: ['Concurrency & Threads', 'Collections & Generics'],
    needsHelpWith: ['Spring Boot Microservices', 'Design Patterns'],
    matchScore: 91,
    matchReason: 'Cross-campus synergy! Kagiso (Durban) is a powerhouse in Java Concurrency and multithreading, while you excel in Microservices and Clean Architecture.',
    studyStreak: 12,
    xpPoints: 2310,
    isStudyBuddy: true,
    onlineStatus: 'studying',
    recommendedLibraryResource: {
      title: 'Core Java Volume I & II: Fundamentals & Advanced Features',
      code: 'JAVA-ADV-381',
      author: 'Cay S. Horstmann'
    }
  },
  {
    id: 'peer-ayanda',
    name: 'Ayanda Ndlovu',
    avatar: '',
    campus: 'Pretoria Campus',
    academicYear: '2nd Year',
    qualification: 'BCom in Business Administration',
    subject: 'Discrete Mathematics & Stats (MTH181)',
    subjectScore: 86,
    strongIn: ['Discrete Probability', 'Graph Theory & Trees'],
    needsHelpWith: ['Boolean Logic & Truth Tables', 'Combinatorics'],
    matchScore: 88,
    matchReason: 'Complementary strengths: Ayanda from Pretoria Campus has a 95% mastery in Probability & Trees, while looking for support on Boolean Algebra proofs.',
    studyStreak: 4,
    xpPoints: 1290,
    isStudyBuddy: false,
    onlineStatus: 'online',
    recommendedLibraryResource: {
      title: 'Discrete Mathematics and Its Applications (8th Ed)',
      code: 'MTH-DISC-181',
      author: 'Kenneth H. Rosen'
    }
  },
  {
    id: 'peer-spiva',
    name: 'Spiva Ongeziwe',
    avatar: '',
    campus: 'Cape Town Campus',
    academicYear: '3rd Year',
    qualification: 'BSc in Information Technology',
    subject: 'Cloud Infrastructure & Networks (NET381)',
    subjectScore: 90,
    strongIn: ['IPv4 Subnetting & CIDR', 'Routing Topologies (OSPF)'],
    needsHelpWith: ['Cloud VPC & Security Gateways', 'Network Security Audits'],
    matchScore: 93,
    matchReason: 'Spiva (Cape Town) is a CIDR subnetting calculator wizard looking to collaborate with students practicing AWS VPC architectures and gateways.',
    studyStreak: 9,
    xpPoints: 1950,
    isStudyBuddy: false,
    onlineStatus: 'studying',
    recommendedLibraryResource: {
      title: 'Computer Networking: A Top-Down Approach (8th Ed)',
      code: 'NET-TOP-381',
      author: 'Kurose & Ross'
    }
  },
  {
    id: 'peer-tshepo',
    name: 'Tshepo Mokoena',
    avatar: '',
    campus: 'Polokwane Campus',
    academicYear: '2nd Year',
    qualification: 'Diploma in Information Technology',
    subject: 'Database Architecture & SQL (DBS381)',
    subjectScore: 82,
    strongIn: ['Relational Schema Design', 'Entity Relationship Diagrams'],
    needsHelpWith: ['Complex SQL Subqueries', 'Database Indexing'],
    matchScore: 85,
    matchReason: 'Tshepo from Polokwane is building capstone schema designs and seeks a peer to co-review SQL query execution times.',
    studyStreak: 3,
    xpPoints: 890,
    isStudyBuddy: false,
    onlineStatus: 'offline',
    recommendedLibraryResource: {
      title: 'SQL Antipatterns: Avoiding the Pitfalls of Database Programming',
      code: 'SQL-PATT-2025',
      author: 'Bill Karwin'
    }
  }
];

export const INITIAL_CHALLENGE_RECORDS: EduMatchChallengeRecord[] = [
  {
    id: 'rec-1',
    opponentId: 'peer-kagiso',
    opponentName: 'Kagiso Dlamini (Durban)',
    subject: 'Java Multithreading Blitz',
    userScore: 4,
    opponentScore: 3,
    totalQuestions: 5,
    result: 'won',
    xpEarned: 120,
    date: 'Yesterday'
  },
  {
    id: 'rec-2',
    opponentId: 'peer-sarah',
    opponentName: 'Sarah Khumalo (Newtown)',
    subject: 'SQL Join & Normalization Sprint',
    userScore: 4,
    opponentScore: 4,
    totalQuestions: 5,
    result: 'tied',
    xpEarned: 80,
    date: '3 days ago'
  }
];

export const WEEKLY_CAMPUS_LEADERBOARD = [
  { campus: 'Newtown Campus (Gauteng)', points: 14250, studentsActive: 184, rank: 1, badge: '🥇 Provincial Leader' },
  { campus: 'Pretoria Campus (Gauteng)', points: 12800, studentsActive: 152, rank: 2, badge: '🥈 High Velocity' },
  { campus: 'Durban Campus (KZN)', points: 11950, studentsActive: 139, rank: 3, badge: '🥉 Coastal Contender' },
  { campus: 'Cape Town Campus (Western Cape)', points: 9800, studentsActive: 94, rank: 4, badge: '⭐ Rising Stars' },
  { campus: 'Polokwane Campus (Limpopo)', points: 8450, studentsActive: 81, rank: 5, badge: '🔥 Fastest Growth' }
];
