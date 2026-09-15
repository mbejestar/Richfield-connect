import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Sparkles, 
  Check, 
  Copy, 
  Terminal, 
  Share2, 
  ThumbsUp, 
  MessageSquare,
  BookOpen,
  Cpu
} from 'lucide-react';
import { UserProfile } from '../types';

interface CodeSnippetItem {
  id: string;
  title: string;
  authorName: string;
  authorCampus: string;
  language: 'typescript' | 'python' | 'sql' | 'java';
  code: string;
  description: string;
  likes: number;
  outputPreview?: string;
  tags: string[];
}

interface CodeHubViewProps {
  currentUser: UserProfile;
}

export const CodeHubView: React.FC<CodeHubViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'community'>('editor');
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'python' | 'sql'>('typescript');
  
  const sampleCodes = {
    typescript: `// Richfield IT Capstone: Microservices Token Validator\ninterface StudentTokenPayload {\n  studentId: string;\n  campus: string;\n  isEnrolled: boolean;\n}\n\nfunction validateCampusAccess(payload: StudentTokenPayload): boolean {\n  if (!payload.isEnrolled) return false;\n  console.log(\`Access granted to \${payload.studentId} at \${payload.campus}\`);\n  return true;\n}\n\n// Run check\nvalidateCampusAccess({\n  studentId: "202488421",\n  campus: "Newtown Campus",\n  isEnrolled: true\n});`,
    python: `# DSA201 Data Structures: Binary Search Tree Optimization\nclass Node:\n    def __init__(self, key):\n        self.left = None\n        self.right = None\n        self.val = key\n\ndef search_node(root, key):\n    if root is None or root.val == key:\n        return root\n    if root.val < key:\n        return search_node(root.right, key)\n    return search_node(root.left, key)\n\nprint("BST Module Verified for National Exam Runway")`,
    sql: `-- PRG302 Database Query: Campus Library Book Utilization Rate\nSELECT \n    b.title,\n    b.module_code,\n    COUNT(r.request_id) AS total_intercampus_transfers\nFROM library_books b\nLEFT JOIN transfer_requests r ON b.book_id = r.book_id\nWHERE r.status = 'delivered'\nGROUP BY b.book_id\nORDER BY total_intercampus_transfers DESC\nLIMIT 10;`
  };

  const [activeCode, setActiveCode] = useState(sampleCodes.typescript);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Community Snippets
  const [communitySnippets, setCommunitySnippets] = useState<CodeSnippetItem[]>([
    {
      id: 'snip-1',
      title: 'Spring Boot REST Controller for Student Portal',
      authorName: 'Sipho Zulu',
      authorCampus: 'Pretoria Campus',
      language: 'java',
      description: 'Clean boilerplate for PRG302 3rd-year enterprise architecture assignment.',
      likes: 38,
      code: `@RestController\n@RequestMapping("/api/v1/students")\npublic class StudentController {\n    @GetMapping("/{id}")\n    public ResponseEntity<StudentDTO> getStudent(@PathVariable String id) {\n        return ResponseEntity.ok(studentService.findById(id));\n    }\n}`,
      tags: ['PRG302', 'Java', 'SpringBoot', '3rdYear']
    },
    {
      id: 'snip-2',
      title: 'React Custom Hook for Richfield Library Search',
      authorName: 'Thabiso Khosi',
      authorCampus: 'Newtown Campus',
      language: 'typescript',
      description: 'Debounced search hook with caching for campus book lookups.',
      likes: 29,
      code: `export function useLibrarySearch(query: string, delay = 300) {\n  const [results, setResults] = useState([]);\n  // Debounce logic...\n  return results;\n}`,
      tags: ['React', 'TypeScript', 'Frontend', 'Capstone']
    },
    {
      id: 'snip-3',
      title: 'Python NLP Sentiment Model for Peer Study Feedback',
      authorName: 'Nomvula Dlamini',
      authorCampus: 'Braamfontein Campus',
      language: 'python',
      description: 'Fine-tuned sentiment scoring pipeline extracting student learning feedback tokens for institutional analytics.',
      likes: 54,
      code: `import numpy as np\n\ndef analyze_peer_sentiment(text: str) -> dict:\n    positive_tokens = {'clarified', 'helped', 'excellent', 'solved', 'mastered'}\n    words = [w.lower().strip() for w in text.split()]\n    pos_count = sum(1 for w in words if w in positive_tokens)\n    sentiment_score = min(1.0, pos_count / max(1, len(words) * 0.2))\n    return {\n        "sentiment_score": round(sentiment_score, 3),\n        "feedback_classification": "Enriching" if sentiment_score >= 0.5 else "Neutral"\n    }\n\n# Run validation test\nprint(analyze_peer_sentiment("Tshepo clarified recursion and helped solve the BST error!"))`,
      tags: ['Python', 'NLP', 'DataScience', 'AI-Ethics']
    },
    {
      id: 'snip-4',
      title: 'PostgreSQL High-Throughput Load Shedding Failover Store',
      authorName: 'Kagiso Molefe',
      authorCampus: 'Bryanston Campus',
      language: 'sql',
      description: 'Resilient partition scheme preserving campus exam submission state even during network flapping and power transitions.',
      likes: 47,
      code: `-- Partitioned Exam Submissions Table by Academic Semester\nCREATE TABLE IF NOT EXISTS exam_submissions (\n    submission_id UUID DEFAULT gen_random_uuid(),\n    student_number VARCHAR(30) NOT NULL,\n    module_code VARCHAR(10) NOT NULL,\n    submission_payload JSONB NOT NULL,\n    campus_node VARCHAR(50) NOT NULL,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    PRIMARY KEY (submission_id, created_at)\n) PARTITION BY RANGE (created_at);\n\n-- Fast-lookup index for campus registrar audit\nCREATE INDEX idx_campus_exam_audit ON exam_submissions (module_code, campus_node);`,
      tags: ['PostgreSQL', 'Database', 'FaultTolerance', 'DBS381']
    },
    {
      id: 'snip-5',
      title: 'FastAPI JWT Auth & Biometric Hash Middleware',
      authorName: 'Lerato Nkosi',
      authorCampus: 'Durban Campus',
      language: 'python',
      description: 'Microservice middleware authenticating corporate recruiters and verifying CIPC registration numbers.',
      likes: 42,
      code: `from fastapi import FastAPI, HTTPException, Security, status\nfrom fastapi.security import HTTPBearer, HTTPAuthorizationCredentials\nimport hmac, hashlib\n\nsecurity = HTTPBearer()\n\ndef verify_recruiter_hmac(credentials: HTTPAuthorizationCredentials, secret_key: str):\n    token = credentials.credentials\n    # Authenticate token against Richfield enterprise registry\n    if not token.startswith("RF_REC_"): \n        raise HTTPException(status_code=403, detail="Unverified Recruiter Credentials")\n    return {"status": "authenticated", "auth_level": "Level_3_Enterprise"}`,
      tags: ['FastAPI', 'Security', 'Enterprise', 'SWE281']
    },
    {
      id: 'snip-6',
      title: 'Discounted Cash Flow (DCF) & Bond Yield Engine',
      authorName: 'Michael Van Zyl',
      authorCampus: 'Cape Town Campus',
      language: 'python',
      description: 'Financial mathematics utility calculating terminal value and enterprise valuation for BCom Accounting & FinTech Honours.',
      likes: 33,
      code: `def calculate_dcf_valuation(cash_flows: list, wacc: float, terminal_growth: float) -> dict:\n    discounted_cf = [cf / ((1 + wacc) ** (i + 1)) for i, cf in enumerate(cash_flows)]\n    terminal_value = (cash_flows[-1] * (1 + terminal_growth)) / (wacc - terminal_growth)\n    discounted_tv = terminal_value / ((1 + wacc) ** len(cash_flows))\n    enterprise_value = sum(discounted_cf) + discounted_tv\n    return {\n        "sum_discounted_cash_flows": round(sum(discounted_cf), 2),\n        "terminal_value": round(discounted_tv, 2),\n        "enterprise_value": round(enterprise_value, 2)\n    }`,
      tags: ['FinTech', 'Accounting', 'Python', 'BCom']
    }
  ]);

  const handleLanguageChange = (lang: 'typescript' | 'python' | 'sql') => {
    setSelectedLanguage(lang);
    setActiveCode(sampleCodes[lang]);
    setConsoleOutput(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (selectedLanguage === 'typescript') {
        setConsoleOutput(`[Execution Success: Node.js v20.10.0]\nAccess granted to 202488421 at Newtown Campus\nExit code: 0 (Execution time: 42ms)`);
      } else if (selectedLanguage === 'python') {
        setConsoleOutput(`[Python 3.11.4 Output]\nBST Module Verified for National Exam Runway\nMemory used: 12.4MB`);
      } else {
        setConsoleOutput(`[PostgreSQL Query Result: 3 rows affected]\n| title | module_code | total_intercampus_transfers |\n| Algorithms 4th Ed | DSA201 | 42 |\n| Clean Architecture | PRG302 | 31 |\n| Database Systems | DB201 | 28 |`);
      }
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-900">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Richfield CodeHub
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Interactive student sandbox, algorithm playground, and project snippet collaboration for IT cohorts
          </p>
        </div>

        <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg max-w-fit">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Playground
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeTab === 'community'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Community Snippets ({communitySnippets.length})
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        /* LIVE PLAYGROUND VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          
          {/* Code Editor (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col">
            
            {/* Top Editor Bar */}
            <div className="bg-slate-900 px-3.5 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] text-slate-400 font-mono ml-1.5">sandbox.{selectedLanguage === 'typescript' ? 'ts' : selectedLanguage === 'python' ? 'py' : 'sql'}</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1">
                {(['typescript', 'python', 'sql'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}

                <button
                  onClick={handleCopyCode}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded ml-1"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="flex-1 p-3.5 bg-slate-950">
              <textarea
                value={activeCode}
                onChange={(e) => setActiveCode(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full bg-transparent text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-900 selection:text-white"
              />
            </div>

            {/* Editor Footer Actions */}
            <div className="bg-slate-900/90 px-3.5 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Virtual Execution Runtime</span>
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run & Test</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Console / Output Window (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 rounded-xl border border-slate-800 p-3.5 shadow-md flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs pb-1.5 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Console Output</span>
              </div>

              {consoleOutput ? (
                <pre className="font-mono text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  {consoleOutput}
                </pre>
              ) : (
                <div className="p-4 text-center text-slate-500 text-xs italic">
                  Click "Run & Test" to execute code.
                </div>
              )}
            </div>

            {/* AI Optimization Tip */}
            <div className="bg-indigo-950/60 border border-indigo-900/60 rounded-lg p-2.5 text-xs text-indigo-200 space-y-1">
              <div className="flex items-center gap-1 font-bold text-indigo-300 text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Richfield Code Standard</span>
              </div>
              <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                Adhere to modular separation and type safety for IT Capstone and PRG coursework.
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* COMMUNITY SNIPPETS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {communitySnippets.map((snip) => (
            <div
              key={snip.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-2.5 flex flex-col justify-between border-l-4 border-indigo-500"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{snip.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      by <strong>{snip.authorName}</strong> ({snip.authorCampus})
                    </p>
                  </div>
                  <span className="text-[9px] uppercase font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.2 rounded">
                    {snip.language}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1.5">{snip.description}</p>

                {/* Code Preview */}
                <div className="mt-2 bg-slate-950 p-2.5 rounded-lg overflow-x-auto text-[11px] font-mono text-emerald-400 border border-slate-800">
                  <pre>{snip.code}</pre>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {snip.tags.map((t) => (
                    <span key={t} className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => alert("Liked snippet! Added to your saved references.")}
                  className="flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-700 text-[11px]"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{snip.likes} Helpful</span>
                </button>

                <button
                  onClick={() => {
                    setActiveCode(snip.code);
                    setSelectedLanguage(snip.language as any);
                    setActiveTab('editor');
                  }}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow"
                >
                  Open in Sandbox
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
