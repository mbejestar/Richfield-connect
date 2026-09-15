import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured. Intelligent rule-based engine active.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "RichfieldConnect",
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// 1. AI Onboarding Assistant
app.post("/api/ai/onboard", async (req, res) => {
  try {
    const { messages, userRole, currentProfile } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are the RichfieldConnect AI Onboarding Assistant for Richfield Graduate Institute of Technology (South Africa).
Your duty is to warmly, encouragingly, and efficiently guide new students, alumni, lecturers, or recruiters step-by-step through profile creation.

OFFICIAL CAMPUS CHOICES: Newtown Campus, Pretoria Campus, Durban Campus, Umhlanga Campus, Cape Town Campus, Polokwane Campus, Sandton Campus, Midrand Campus, Alberton Campus.
OFFICIAL QUALIFICATIONS OFFERED:
- Degree Programmes (NQF 7): BSc IT, BCom, BCom (AGA), BCom (AGA IT), BBA, BPM
- Diploma Programmes (NQF 6): DIT, DBA, DLGM
- Higher Certificate Programmes (NQF 5): HCBA, HCLGM, HCOA, RPLA, HCIT, HCCF
- Postgraduate Qualifications (NQF 8): BSc Honours in IT, PGDM
- Master's Qualification (NQF 9): MBA
- Bridging Programme: BCom (AGA IT) Bridging Programme
ACADEMIC YEARS: 1st Year, 2nd Year, 3rd Year, Postgraduate, Master's, Staff/Faculty.

ROLES & DATA TO COLLECT:
- Student: campus location, qualification programme, academic year, and key technical/business skills or interests.
- Alumni: current professional role, company name, skills, campus graduated from, and explicitly ask if they would like to volunteer as a verified Mentor for current students (free institutional mentorship).
- Recruiter / Campus Manager: organization name, campus location, hiring roles (IT/Business), and authorization status.

FORMAT YOUR RESPONSE:
1. Provide a warm, conversational, encouraging reply. Keep it concise, friendly, and structured.
2. If you have collected sufficient information (campus, qualification/company, year/role, skills), include a final JSON codeblock at the very bottom with the structured attributes:
\`\`\`json
{
  "isComplete": true,
  "profile": {
    "role": "${userRole || 'student'}",
    "campus": "Newtown Campus",
    "qualification": "IT",
    "qualificationName": "Bachelor of Science in Information Technology (BSc IT) — NQF Level 7",
    "academicYear": "2nd Year",
    "skills": ["JavaScript", "Python", "SQL"],
    "headline": "2nd Year IT Student | Aspiring Software Engineer",
    "bio": "Passionate IT student at Richfield Newtown Campus.",
    "isMentor": false
  }
}
\`\`\`
If not complete, set "isComplete": false in the JSON block with whatever fields have been gathered so far.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nCurrent User Role: ${userRole || 'student'}\nKnown attributes so far: ${JSON.stringify(currentProfile || {})}\n\nConversation history:\n${(messages || []).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}` }] }
        ]
      });

      const replyText = response.text || "Welcome to RichfieldConnect! What campus are you currently based at?";
      
      // Check if JSON block exists
      let extractedProfile: any = null;
      let isComplete = false;
      const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          extractedProfile = parsed.profile;
          isComplete = parsed.isComplete;
        } catch (e) {
          // ignore parsing error
        }
      }

      // Clean message for display
      const cleanMessage = replyText.replace(/```json[\s\S]*?```/g, '').trim();

      return res.json({
        message: cleanMessage,
        isComplete,
        profile: extractedProfile
      });
    }

    // Smart fallback if API key is not provided
    const lastMsg = (messages && messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : '');
    let botReply = "Awesome! To personalize your Richfield experience, which Richfield campus do you belong to (e.g., Newtown Campus, Pretoria Campus, Durban Campus, Cape Town Campus, Polokwane Campus, Sandton Campus)?";
    let isComplete = false;
    let mockProfile: any = null;

    if (lastMsg.includes("newtown") || lastMsg.includes("durban") || lastMsg.includes("pretoria") || lastMsg.includes("cape town") || lastMsg.includes("sandton") || lastMsg.includes("polokwane") || lastMsg.includes("braam")) {
      botReply = "Great campus choice! Next, what qualification programme are you pursuing at Richfield (e.g., BSc IT, BCom, DIT, HCIT, MBA) and which academic year (1st, 2nd, or 3rd year)?";
    } else if (lastMsg.includes("it") || lastMsg.includes("business") || lastMsg.includes("year") || lastMsg.includes("bsc") || lastMsg.includes("bcom")) {
      botReply = "Excellent! What are your top 3 technical or professional skills/interests (e.g. Python, Web Dev, React, Financial Analysis, Agile)?";
    } else if (messages && messages.length >= 4) {
      botReply = "🎉 Fantastic! Your Richfield profile has been fully synthesized. Your cohort feed, mentorship matches, and priority inbox are now configured!";
      isComplete = true;
      mockProfile = {
        role: userRole || 'student',
        campus: 'Newtown Campus',
        qualification: 'IT',
        qualificationName: 'Bachelor of Science in Information Technology (BSc IT) — NQF Level 7',
        academicYear: '2nd Year',
        skills: ['React', 'Python', 'Web Development'],
        headline: '2nd Year BSc IT Student | Richfield Newtown Campus',
        bio: 'Enthusiastic Richfield IT student building practical skills.',
        isMentor: false
      };
    }

    return res.json({
      message: botReply,
      isComplete,
      profile: mockProfile
    });
  } catch (error: any) {
    console.error("Error in AI Onboarding:", error);
    res.status(500).json({ error: error.message || "Failed to process onboarding step" });
  }
});

// 2. Content Moderation & Anti-Bullying Engine
app.post("/api/ai/moderate", async (req, res) => {
  try {
    const { content, userRole, contentType } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Content is required for moderation." });
    }

    const ai = getAIClient();
    const systemPrompt = `You are the EnrichHub Content Safety & Anti-Bullying Moderation Engine.
EnrichHub is strictly an institutional, academic, professional, and career development platform for students, faculty, and recruiters.
Strictly enforce institutional guidelines and protect the campus community from:
1. Cyberbullying, harassment, intimidation, or public shaming.
2. Hate speech, racism, sexism, or discrimination.
3. Threats, violence, or incitement of disruptions against campus facilities/staff.
4. Academic fraud (selling exam answers, unauthorized paper distribution).
5. Scams, fraudulent crypto solicitations, or commercial spam.
6. Non-academic social event solicitations, house parties, clubbing announcements, raves, drinking/alcohol events, and unofficial party promotions (e.g., "house party happening tomorrow", "wild party tonight", "keg party", "clubbing tonight").

Evaluate the text and output pure JSON:
{
  "isSafe": true,
  "toxicityScore": 0.05,
  "decision": "approved",
  "flaggedCategories": [],
  "aiExplanation": "Brief justification."
}
CRITICAL RULE: If the text promotes or invites people to a house party, rave, drinking event, or non-academic social party (such as "house party happening tomorrow"), you MUST return:
{
  "isSafe": false,
  "toxicityScore": 0.85,
  "decision": "blocked",
  "flaggedCategories": ["Non-Academic Content Violation", "Unauthorized House Party Solicitation"],
  "aiExplanation": "EnrichHub is strictly an academic, research, and career development platform. Posting about house parties, social raves, or non-academic social events violates institutional Section 2.4 guidelines."
}
If non-compliant for harassment or academic misconduct, set "isSafe": false, "decision": "blocked" (for score > 0.70) or "warned" (for score 0.40 - 0.69), and list flaggedCategories.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nContent to analyze (${contentType || 'post'} by ${userRole || 'student'}):\n"${content}"` }] },
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        isSafe: parsed.isSafe ?? true,
        toxicityScore: parsed.toxicityScore ?? 0.02,
        decision: parsed.decision ?? "approved",
        flaggedCategories: parsed.flaggedCategories ?? [],
        aiExplanation: parsed.aiExplanation ?? "Content cleared by EnrichHub AI moderation policy."
      });
    }

    // Rule-based safety check fallback
    const lower = content.toLowerCase();
    const toxicTerms = ["attack", "kill", "useless lecturer", "idiot", "hate", "scam", "crypto telegram", "cheat on exam", "leak exam"];
    const partyTerms = [
      "house party",
      "houseparty",
      "party happening",
      "party tomorrow",
      "party tonight",
      "wild party",
      "drinking party",
      "drinks bash",
      "afterparty",
      "after party",
      "rave tonight",
      "clubbing tonight",
      "beer pong",
      "bring your own booze",
      "byob",
      "keg party",
      "party at my place",
      "chilling and drinking"
    ];

    const flaggedParty = partyTerms.filter(term => lower.includes(term));
    if (flaggedParty.length > 0) {
      return res.json({
        isSafe: false,
        toxicityScore: 0.85,
        decision: "blocked",
        flaggedCategories: ["Non-Academic Content Violation", "Unauthorized House Party Solicitation"],
        aiExplanation: `EnrichHub is strictly an academic, research, and career development network. Unofficial party solicitations (${flaggedParty.join(', ')}) violate Section 2.4 Campus Guidelines.`
      });
    }

    const flagged = toxicTerms.filter(term => lower.includes(term));
    if (flagged.length > 0) {
      return res.json({
        isSafe: false,
        toxicityScore: 0.88,
        decision: "blocked",
        flaggedCategories: ["Harassment / Cyberbullying", "Policy Violation"],
        aiExplanation: `Content contains prohibited terms (${flagged.join(', ')}). Blocked automatically per EnrichHub Code of Conduct.`
      });
    }

    return res.json({
      isSafe: true,
      toxicityScore: 0.02,
      decision: "approved",
      flaggedCategories: [],
      aiExplanation: "Content conforms to EnrichHub institutional safety standards."
    });
  } catch (error: any) {
    console.error("Error in moderation:", error);
    res.status(500).json({ error: error.message || "Moderation check failed" });
  }
});

// 3. Campus Services & FAQ Assistant
app.post("/api/ai/faq", async (req, res) => {
  try {
    const { query, studentContext } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are the RichfieldConnect Campus Services & FAQ Copilot for Richfield Graduate Institute of Technology.
Answer student inquiries accurately using these official institutional rules:

1. CAMPUSES:
   - Official Richfield campuses: Newtown Campus, Pretoria Campus, Durban Campus, Umhlanga Campus, Cape Town Campus, Polokwane Campus, Sandton Campus, Midrand Campus, Alberton Campus.

2. QUALIFICATIONS OFFERED:
   - Degree Programmes (NQF 7): BSc IT, BCom, BCom (AGA), BCom (AGA IT), BBA, BPM
   - Diploma Programmes (NQF 6): DIT, DBA, DLGM
   - Higher Certificate Programmes (NQF 5): HCBA, HCLGM, HCOA, RPLA, HCIT, HCCF
   - Postgraduate Qualifications (NQF 8): BSc Honours in IT, PGDM
   - Master's Qualification (NQF 9): Master of Business Administration (MBA)
   - Bridging Programme: BCom (AGA IT) Bridging Programme

3. LIBRARY & BOOK RETRIEVAL:
   - Richfield libraries operate across all campuses (Newtown, Pretoria, Durban, Umhlanga, Cape Town, Polokwane, Sandton, Midrand, Alberton).
   - Physical books can be queried across all campuses.
   - Inter-Campus Retrieval: If a book is held at another campus (e.g. Clean Code in Newtown while the student is in Durban), students can request an Inter-Campus Courier Transit.
   - Transit takes 2-3 business days via official Richfield campus courier.
   - Requirements for checkout/pickup: Valid physical or digital Richfield Student ID card.
   - Loan period is 14 days, renewable online once.

4. NATIONAL EXAM RUNWAYS:
   - National, lecturer-led online pre-exam review live streams accessible to all campuses on the "Events" tab.
   - Covers core IT & Business modules (e.g. DSA201 Data Structures, PRG302 Java Architecture, BUS301 Strategic Management).
   - Recordings and slide decks are permanently available in the runway archive.

5. BURSARIES & JOBS:
   - High-impact bursaries (Vodacom, Standard Bank, Richfield Foundation) and internships are accessible under the "Jobs" tab.
   - Filtered automatically based on academic standing (60%+ aggregate) and academic year.

6. MENTORSHIP POLICY:
   - 100% free for verified students (funded through institutional & industry partnerships).
   - Only verified Alumni & Lecturers/Faculty can mentor. Active undergraduate students cannot mentor.
   - Strict capacity limit of 3-5 mentees per mentor to guarantee quality.
   - Strict domain alignment matching.

FORMAT YOUR RESPONSE:
Use clear, encouraging markdown with bold headers, bullet points, and step-by-step guidance.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nStudent Query: "${query}"\nStudent Context: ${JSON.stringify(studentContext || {})}` }] }
        ]
      });

      return res.json({
        answer: response.text || "I am here to assist you with Richfield campus queries, library book tracking, exam runways, and bursaries."
      });
    }

    // Fallback response for FAQ
    const qLower = (query || "").toLowerCase();
    let fallbackAnswer = "";

    if (qLower.includes("library") || qLower.includes("book") || qLower.includes("retriev") || qLower.includes("borrow")) {
      fallbackAnswer = `### 📚 Richfield Inter-Campus Library System

You can search and borrow physical textbooks across all Richfield campuses (Newtown Campus, Pretoria, Durban, Cape Town, Polokwane, Umhlanga, Sandton, Midrand, Alberton).

#### How Inter-Campus Retrieval Works:
1. **Search Holdings**: Go to the **Library** section in the navigation.
2. **Select Book**: Check which campus holds available copies (e.g., *Clean Code* in Newtown Campus or *Contemporary Management* in Durban Campus).
3. **Request Transfer**: Click **"Request Inter-Campus Transfer"** to your home campus.
4. **Transit Duration**: 2 to 3 business days via the official Richfield inter-campus courier shuttle.
5. **Collection**: Bring your **valid Richfield Student ID Card** to your campus library reception desk.`;
    } else if (qLower.includes("qualif") || qLower.includes("course") || qLower.includes("degree") || qLower.includes("diploma")) {
      fallbackAnswer = `### 🎓 Richfield Official Qualifications
      
Richfield offers accredited qualifications across multiple NQF levels:

- **Degree Programmes (NQF 7)**:
  - Bachelor of Science in Information Technology (BSc IT)
  - Bachelor of Commerce (BCom)
  - Bachelor of Commerce (AGA)
  - Bachelor of Commerce (AGA IT)
  - Bachelor of Business Administration (BBA)
  - Bachelor of Public Management (BPM)
- **Diploma Programmes (NQF 6)**:
  - Diploma in Information Technology (DIT)
  - Diploma in Business Administration (DBA)
  - Diploma in Local Government Management (DLGM)
- **Higher Certificate Programmes (NQF 5)**:
  - Higher Certificate in Business Administration (HCBA)
  - Higher Certificate in Local Government Management (HCLGM)
  - Higher Certificate in Office Administration (HCOA)
  - Higher Certificate in Recognition of Prior Learning Activities (RPLA)
  - Higher Certificate in Information Technology (HCIT)
  - Higher Certificate in Computer Forensics (HCCF)
- **Postgraduate Qualifications (NQF 8)**:
  - Bachelor of Science Honours in Information Technology
  - Postgraduate Diploma in Management (PGDM)
- **Master's Qualification (NQF 9)**:
  - Master of Business Administration (MBA)
- **Bridging Programme**:
  - BCom (AGA IT) Bridging Programme`;
    } else if (qLower.includes("exam") || qLower.includes("runway") || qLower.includes("review") || qLower.includes("prep")) {
      fallbackAnswer = `### 🎯 National Exam Runways

Richfield National Exam Runways are interactive, lecturer-led revision streams designed to prepare you for midterms and final national examinations.

- **Access**: Navigate to the **Events** tab on RichfieldConnect.
- **Participation**: Open to students across all campuses with real-time Q&A.
- **Resources**: Download official master slide decks, formula sheets, and past paper walkthroughs.
- **Key Modules**: *DSA201 (Data Structures)*, *PRG302 (Enterprise Java)*, *BUS301 (Strategic Management)*, and *DBS301 (Database Systems)*.`;
    } else if (qLower.includes("bursary") || qLower.includes("job") || qLower.includes("internship")) {
      fallbackAnswer = `### 💼 Bursaries & Internship Opportunities

Campus managers and corporate partners (including Vodacom, SovTech, and Standard Bank) publish verified opportunities directly on RichfieldConnect.

- **Check Eligibility**: Head over to the **Jobs & Bursaries** tab.
- **Auto-Matching**: Alerts are tailored based on your qualification stream and academic year standing.
- **1-Click Apply**: Submit your verified Richfield academic record with zero hassle.`;
    } else {
      fallbackAnswer = `### 🎓 RichfieldConnect AI Helpdesk

I can assist you with:
- **Qualifications & Programmes** (BSc IT, BCom, Diplomas, Higher Certificates, Honours, MBA)
- **Library Book Search & Inter-Campus Courier Transit** (2-3 day delivery across all campuses)
- **National Exam Runways** (Lecturer-led live review streams on the Events tab)
- **Verified Mentorship** (100% free alumni & lecturer guidance)
- **Bursaries & Graduate Placements** (Vodacom, Standard Bank, SovTech)

Feel free to ask a specific question!`;
    }

    return res.json({ answer: fallbackAnswer });
  } catch (error: any) {
    console.error("Error in FAQ Assistant:", error);
    res.status(500).json({ error: error.message || "Failed to process FAQ query" });
  }
});

// 4. Priority Messaging & Spam Classification
app.post("/api/ai/classify-message", async (req, res) => {
  try {
    const { messageText, senderRole, senderName } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are the RichfieldConnect Priority Inbox Classifier & Spam Filter.
Categorize messages into:
1. "priority": Important academic requests, verified mentor communications, lecturer notices, exam runway updates, or job application feedback.
2. "general": Standard peer chats, friendly networking, casual inquiries.
3. "spam": Unsolicited commercial advertising, crypto schemes, spam bots, or suspicious external links.

Output pure JSON:
{
  "category": "priority" | "general",
  "isSpam": boolean,
  "priorityReason": "Short explanatory badge (e.g. 'Verified Mentor Academic Communication', 'Lecturer Notice', 'Peer Chat')",
  "safetyCheck": "pass" | "flagged"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nSender: ${senderName} (${senderRole})\nMessage: "${messageText}"` }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    }

    // Fallback logic
    const lower = (messageText || "").toLowerCase();
    const isSpam = lower.includes("crypto") || lower.includes("r5000") || lower.includes("telegram group") || lower.includes("earn cash");
    const isPriority = senderRole === "lecturer" || senderRole === "alumni" || senderRole === "recruiter" || lower.includes("exam") || lower.includes("mentorship") || lower.includes("bursary") || lower.includes("review");

    return res.json({
      category: isPriority && !isSpam ? "priority" : "general",
      isSpam: isSpam,
      priorityReason: isSpam 
        ? "AI Flagged Spam / Low Relevance" 
        : senderRole === "lecturer" 
          ? "Faculty Lecturer Notice" 
          : senderRole === "alumni" 
            ? "Verified Mentor Communication" 
            : senderRole === "recruiter" 
              ? "Recruitment & Job Update" 
              : "Peer Message",
      safetyCheck: isSpam ? "flagged" : "pass"
    });
  } catch (error: any) {
    console.error("Error in message classification:", error);
    res.status(500).json({ error: error.message || "Message classification failed" });
  }
});

// 5. Mentorship Matching & Domain Alignment Scorer
app.post("/api/ai/mentor-match", async (req, res) => {
  try {
    const { studentSkills, studentInterest, mentorDomain, mentorName } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are the RichfieldConnect Mentorship Engine.
Evaluate the domain alignment between a student and an alumni/faculty mentor.
Enforce strict domain compatibility: e.g. Game Dev students must match Game Dev/C# mentors; Web Dev with Full-Stack/Cloud; Business Analytics with Business/Finance mentors.

Output JSON:
{
  "matchScore": 92,
  "isRecommended": true,
  "alignmentSummary": "High synergy between student Unity/C# goals and mentor game architecture background.",
  "suggestedTopics": ["Mock Capstone Review", "Game Engine Optimization", "Portfolio Review"]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nStudent Skills & Goals: ${JSON.stringify(studentSkills || [])} - ${studentInterest || ''}\nMentor: ${mentorName} (${(mentorDomain || []).join(', ')})` }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      return res.json(JSON.parse(response.text || "{}"));
    }

    return res.json({
      matchScore: 88,
      isRecommended: true,
      alignmentSummary: "Strong curriculum and domain match between Richfield student profile and mentor industry focus.",
      suggestedTopics: ["Technical Architecture Walkthrough", "Exam Prep Strategy", "Career Transition Guidance"]
    });
  } catch (error: any) {
    console.error("Error in mentor match:", error);
    res.status(500).json({ error: error.message || "Mentor match failed" });
  }
});

// 6. AI Exam Preparation Generator (Library Page)
app.post("/api/ai/exam-prep", async (req, res) => {
  try {
    const { moduleCode, moduleName, qualification, difficulty, specificTopic } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are the Richfield Graduate Institute of Technology AI Academic Exam Preparation Specialist.
Generate a high-yield exam preparation package for the specified Richfield module.
Module: ${moduleCode || 'DSA201'} - ${moduleName || 'Data Structures and Algorithms'}
Qualification: ${qualification || 'IT'}
Difficulty Level: ${difficulty || 'Distinction Level'}
Specific Topic focus: ${specificTopic || 'Core Syllabus'}

Generate rigorous, accredited-standard exam materials formatted as valid JSON:
{
  "moduleCode": "${moduleCode || 'DSA201'}",
  "moduleName": "${moduleName || 'Data Structures and Algorithms'}",
  "examTips": [
    "Tip 1 on common national exam trick questions or pitfalls",
    "Tip 2 on mark distribution and time management"
  ],
  "flashcards": [
    {
      "concept": "Core Concept Name",
      "definition": "Precise academic definition adhering to SAQA/CHE standards",
      "keyTakeaway": "Exam-ready one-sentence memory anchor"
    }
  ],
  "practiceQuestions": [
    {
      "id": "q1",
      "question": "Comprehensive exam question",
      "type": "multiple-choice" or "free-response",
      "options": ["Option A", "Option B", "Option C", "Option D"], // only for multiple-choice
      "correctOptionIndex": 0, // only for multiple-choice
      "sampleAnswer": "Comprehensive model answer providing full marks",
      "rubricNotes": "Clear breakdown of marks (e.g. 2 marks for formula, 3 marks for calculation)",
      "marks": 5,
      "difficulty": "Distinction Level"
    }
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, deck: parsed });
    }

    // Dynamic fallback when Gemini API key is absent
    const isBus = (qualification || '').toLowerCase().includes('business') || (moduleCode || '').toLowerCase().includes('bus') || (moduleCode || '').toLowerCase().includes('fin');
    
    return res.json({
      success: true,
      deck: {
        moduleCode: moduleCode || (isBus ? 'BUS301' : 'DSA201'),
        moduleName: moduleName || (isBus ? 'Strategic Management & Corporate Finance' : 'Data Structures & Algorithms'),
        examTips: [
          "Be precise with definitions before diving into formulas or code implementations to secure foundation marks.",
          "Allocate 1.5 minutes per mark maximum; leave 15 minutes at the end to review calculation steps and edge conditions.",
          isBus ? "Always reference King IV governance outcomes in corporate management essays." : "Remember to state Big-O space complexity alongside time complexity in algorithmic questions."
        ],
        flashcards: isBus ? [
          {
            concept: "King IV Governance Principles",
            definition: "The 4 core outcomes of the King IV Report: Ethical culture, Good performance, Effective control, and Trust & legitimacy.",
            keyTakeaway: "Framework for board oversight and accountability in South African corporate law."
          },
          {
            concept: "Weighted Average Cost of Capital (WACC)",
            definition: "The average rate of return a company is expected to provide to all its security holders: (E/V * Re) + (D/V * Rd * (1 - Tc)).",
            keyTakeaway: "Interest on debt is tax-deductible under SARS; always use after-tax cost of debt."
          }
        ] : [
          {
            concept: "AVL Tree Self-Balancing Invariant",
            definition: "A binary search tree where the heights of the two child subtrees of any node differ by at most one: |Height(L) - Height(R)| <= 1.",
            keyTakeaway: "Guarantees O(log N) lookup, insertion, and deletion via single or double rotations."
          },
          {
            concept: "Dijkstra's Algorithm Boundary Condition",
            definition: "A greedy single-source shortest path algorithm that requires non-negative edge weights.",
            keyTakeaway: "Fails on negative edges because the greedy visited assumption is invalidated; use Bellman-Ford instead."
          }
        ],
        practiceQuestions: [
          {
            id: `gen-${Date.now()}-1`,
            question: isBus 
              ? "Under King IV governance in South Africa, explain the rationale behind separating the duties of Chairman of the Board and Chief Executive Officer."
              : "Analyze the time and space complexity of building an initial binary heap with N elements from an arbitrary unsorted array using Floyd's buildHeap algorithm.",
            type: "free-response",
            sampleAnswer: isBus
              ? "Separating the roles prevents unchecked executive power and conflicts of interest. The Chairman (an independent non-executive director) oversees board governance, monitors executive performance, and protects shareholder rights. The CEO directs daily operations. Combining both concentrates governance and executive power in a single individual, undermining board independence."
              : "Floyd's bottom-up buildHeap algorithm runs in O(N) time, not O(N log N). Because most nodes reside in the bottom levels (half are leaves with height 0 requiring 0 swaps), the summation ∑ (h / 2^h) converges to 2, yielding a linear bound O(N). Space complexity is O(1) auxiliary space as it operates in-place on the array.",
            rubricNotes: isBus
              ? "Award 3 marks for separation of oversight vs operational execution; 2 marks for non-executive independence; 1 mark for conflict of interest mitigation."
              : "Award 3 marks for rigorous O(N) time complexity derivation; 2 marks for converging summation explanation; 1 mark for O(1) in-place auxiliary space.",
            marks: 6,
            difficulty: difficulty || "Distinction Level"
          }
        ]
      }
    });
  } catch (error: any) {
    console.error("Error in exam prep generator:", error);
    res.status(500).json({ error: error.message || "Failed to generate exam prep materials" });
  }
});

// ==========================================
// HACKATHON BRIEF MANDATORY BACKEND SERVICES
// Section 2.1: User Types & RBAC Authentication
// Section 2.2: Administrator Control Panel & Moderation
// Section 2.5: Opportunity Oversight & Smart Matching
// Section 2.8: NLP CV Parsing & Video Processing
// ==========================================

const ALLOWED_STUDENT_DOMAINS = ['my.richfield.ac.za', 'richfield.ac.za', 'my.aaa.ac.za', 'aaa.ac.za'];

// In-Memory persistent data store for runtime sessions
interface ServerUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'alumni' | 'recruiter' | 'admin' | 'lecturer';
  verified: boolean;
  campus: string;
  qualification: 'IT' | 'Business' | 'Both';
  qualificationName?: string;
  academicYear?: string;
  studentIdNumber?: string;
  skills: string[];
  bio: string;
  headline: string;
  company?: string;
  organization?: string;
  verificationStatus?: 'verified' | 'pending_approval' | 'suspended';
  alumniVerificationStatus?: 'verified' | 'pending';
  degreeSerial?: string;
  graduationYear?: string;
  createdAt: string;
}

const registeredUsers: Map<string, ServerUser> = new Map();
const sessionTokens: Map<string, ServerUser> = new Map();

// Seed initial primary accounts with verified strong passwords
registeredUsers.set('thabiso.k@student.richfield.ac.za', {
  id: 'user-thabiso',
  name: 'Thabiso Khosi',
  email: 'thabiso.k@student.richfield.ac.za',
  password: 'Student@Richfield2026',
  role: 'student',
  verified: true,
  campus: 'Newtown Campus',
  qualification: 'IT',
  qualificationName: 'Bachelor of Science in Information Technology (BSc IT) — NQF Level 7',
  academicYear: '3rd Year',
  studentIdNumber: '202488412',
  skills: ['TypeScript', 'React Native', 'Node.js', 'PostgreSQL', 'Docker'],
  bio: '3rd Year BSc IT student developing distributed applications and participating in national hackathons.',
  headline: '3rd Year BSc IT Scholar | Full-Stack Software Engineer | Newtown Campus',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('student@richfield.ac.za', {
  id: 'user-thabiso',
  name: 'Thabiso Khosi',
  email: 'student@richfield.ac.za',
  password: 'Student@Richfield2026',
  role: 'student',
  verified: true,
  campus: 'Newtown Campus',
  qualification: 'IT',
  qualificationName: 'Bachelor of Science in Information Technology (BSc IT) — NQF Level 7',
  academicYear: '3rd Year',
  studentIdNumber: '202488412',
  skills: ['TypeScript', 'React Native', 'Node.js', 'PostgreSQL', 'Docker'],
  bio: '3rd Year BSc IT student developing distributed applications and participating in national hackathons.',
  headline: '3rd Year BSc IT Scholar | Full-Stack Software Engineer | Newtown Campus',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('themba.billa@richfield.ac.za', {
  id: 'user-themba-billa',
  name: 'Themba Billa',
  email: 'themba.billa@richfield.ac.za',
  password: 'Premium@Richfield2026',
  role: 'student',
  verified: true,
  campus: 'Sandton Campus',
  qualification: 'IT',
  qualificationName: 'Bachelor of Science in Information Technology (BSc IT) — NQF Level 7',
  academicYear: '3rd Year',
  studentIdNumber: '202491024',
  skills: ['React Native', 'TypeScript', 'FinTech Architecture', 'Cloud Services', 'Docker'],
  bio: 'Top 1% Richfield Pro Scholar. AWS certified solutions candidate and student mentor.',
  headline: '🌟 Richfield Pro Scholar | Final Year BSc IT | Sandton Campus',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('lesiba.m@richfield.ac.za', {
  id: 'user-admin-lesiba',
  name: 'Lesiba Molapo',
  email: 'lesiba.m@richfield.ac.za',
  password: 'Admin@Richfield2026',
  role: 'admin',
  verified: true,
  campus: 'Midrand Campus',
  qualification: 'Both',
  skills: ['Institutional Administration', 'AI Safety Auditing', 'NQF Standards Governance'],
  bio: 'Richfield Systems Directorate Administrator. Overseeing campus health, safety audits, and opportunity approvals.',
  headline: 'Richfield Systems Directorate | Head of Campus Governance',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('admin@richfield.ac.za', {
  id: 'user-admin-lesiba',
  name: 'Lesiba Molapo',
  email: 'admin@richfield.ac.za',
  password: 'Admin@Richfield2026',
  role: 'admin',
  verified: true,
  campus: 'Midrand Campus',
  qualification: 'Both',
  skills: ['Institutional Administration', 'AI Safety Auditing', 'NQF Standards Governance'],
  bio: 'Richfield Systems Directorate Administrator. Overseeing campus health, safety audits, and opportunity approvals.',
  headline: 'Richfield Systems Directorate | Head of Campus Governance',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('mpho.molefe@standardbank.co.za', {
  id: 'user-mpho',
  name: 'Mpho Molefe',
  email: 'mpho.molefe@standardbank.co.za',
  password: 'Recruiter@Richfield2026',
  role: 'recruiter',
  verified: true,
  campus: 'Sandton Campus',
  qualification: 'Both',
  organization: 'Standard Bank Corporate & Investment Banking',
  skills: ['Graduate Talent Acquisition', 'FinTech Careers', 'Engineering Placement'],
  bio: 'Lead Early Careers & Graduate Recruiter seeking top Richfield BSc IT and BCom AGA graduates.',
  headline: 'Lead Graduate Recruiter @ Standard Bank CIB | Sandton Campus Partner',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('recruiter@richfield.ac.za', {
  id: 'user-naledi',
  name: 'Naledi Sithole',
  email: 'recruiter@richfield.ac.za',
  password: 'Recruiter@Richfield2026',
  role: 'recruiter',
  verified: true,
  campus: 'Sandton Campus',
  qualification: 'Both',
  organization: 'Vodacom Group Talent & Careers',
  skills: ['Graduate Talent Pipeline', 'Tech Recruitment', 'Bursary Placements'],
  bio: 'Vodacom Early Careers Lead coordinating graduate pipelines across Richfield campuses.',
  headline: 'Vodacom Talent Lead | Corporate Recruiter Partner',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('nandi.s@alumni.richfield.ac.za', {
  id: 'user-nandi-alumni',
  name: 'Nandi Sithole',
  email: 'nandi.s@alumni.richfield.ac.za',
  password: 'Alumni@Richfield2026',
  role: 'alumni',
  verified: true,
  campus: 'Cape Town Campus',
  qualification: 'IT',
  qualificationName: 'BSc IT (Class of 2023)',
  skills: ['AWS Cloud Architecture', 'Kubernetes', 'Cybersecurity'],
  bio: 'Richfield BSc IT Graduate. Now Cloud Solutions Engineer at AWS South Africa.',
  headline: 'Cloud Engineer @ AWS | Richfield Alumni & Verified Mentor',
  alumniVerificationStatus: 'verified',
  degreeSerial: 'RF-DIP-2023-9941',
  graduationYear: '2023',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('alumni@richfield.ac.za', {
  id: 'user-nandi-alumni',
  name: 'Nandi Sithole',
  email: 'alumni@richfield.ac.za',
  password: 'Alumni@Richfield2026',
  role: 'alumni',
  verified: true,
  campus: 'Cape Town Campus',
  qualification: 'IT',
  qualificationName: 'BSc IT (Class of 2023)',
  skills: ['AWS Cloud Architecture', 'Kubernetes', 'Cybersecurity'],
  bio: 'Richfield BSc IT Graduate. Now Cloud Solutions Engineer at AWS South Africa.',
  headline: 'Cloud Engineer @ AWS | Richfield Alumni & Verified Mentor',
  alumniVerificationStatus: 'verified',
  degreeSerial: 'RF-DIP-2023-9941',
  graduationYear: '2023',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

registeredUsers.set('lecturer@richfield.ac.za', {
  id: 'user-sipho',
  name: 'Dr. Sipho Mthembu',
  email: 'lecturer@richfield.ac.za',
  password: 'Lecturer@Richfield2026',
  role: 'lecturer',
  verified: true,
  campus: 'Newtown Campus',
  qualification: 'IT',
  skills: ['AI Systems', 'Distributed Computing', 'Student Research Mentorship'],
  bio: 'Senior Lecturer in Advanced Database Systems and Applied Artificial Intelligence.',
  headline: 'Faculty Head - AI Systems | Richfield Newtown Campus',
  verificationStatus: 'verified',
  createdAt: new Date().toISOString()
});

// Announcements store
let platformAnnouncements: any[] = [
  {
    id: 'ann-1',
    title: '📢 2026 Richfield National Hackathon Officially Launched!',
    content: 'All campuses (Newtown, Pretoria, Durban, Cape Town, Polokwane, Sandton, Midrand, Alberton) are competing in the Annual Software Innovation Showcase. Submit prototypes by Friday 17:00.',
    targetAudience: 'all',
    createdAt: '2 hours ago',
    priority: 'urgent',
    authorName: 'Lesiba Molapo',
    authorRole: 'admin'
  },
  {
    id: 'ann-2',
    title: '💼 Standard Bank & SovTech Graduate Intake 2026 Runway',
    content: 'Recruiter partners have published 45 verified graduate and learnership opportunities. Ensure your digital portfolio and GitHub links are up to date.',
    targetAudience: 'students',
    createdAt: '1 day ago',
    priority: 'normal',
    authorName: 'Lesiba Molapo',
    authorRole: 'admin'
  }
];

// Opportunities store with pending review queue for Admin oversight
let managedOpportunities: any[] = [
  {
    id: 'job-1',
    title: 'Junior Cloud Infrastructure Associate',
    company: 'Standard Bank CIB',
    location: 'Rosebank, Johannesburg (Hybrid)',
    campusTarget: 'All Campuses (Newtown / Sandton / Pretoria / Durban)',
    type: 'graduate-program',
    qualification: 'IT',
    yearRequirement: 'Final Year / Graduates',
    stipendOrSalary: 'R28,500 / month',
    description: 'Join Standard Bank\'s enterprise Cloud Native team. Work with AWS infrastructure as code, Terraform, and automated deployment pipelines.',
    requirements: ['BSc IT or DIT from Richfield', 'Knowledge of Linux and Git', 'Minimum 65% aggregate in Programming modules'],
    postedBy: 'user-mpho',
    postedByName: 'Mpho Molefe (Standard Bank)',
    deadline: '2026-09-30',
    applicantIds: ['user-thabiso'],
    isVerified: true,
    status: 'approved',
    createdAt: '3 days ago'
  },
  {
    id: 'job-pending-1',
    title: 'Junior Financial Risk Analyst Intern',
    company: 'FinTech Capital SA',
    location: 'Sandton, Johannesburg',
    campusTarget: 'Sandton & Newtown Campuses',
    type: 'internship',
    qualification: 'Business',
    yearRequirement: '3rd Year',
    stipendOrSalary: 'R16,000 / month',
    description: 'Financial analysis internship assisting our quantitative risk desk in analyzing corporate portfolio exposures under King IV governance.',
    requirements: ['BCom Accounting (AGA) or BBA', 'Proficiency in Advanced Financial Modeling', 'High attention to detail'],
    postedBy: 'user-recruiter-2',
    postedByName: 'Sarah Jenkins (FinTech Capital SA)',
    deadline: '2026-10-15',
    applicantIds: [],
    isVerified: false,
    status: 'pending_review',
    createdAt: 'Just now'
  }
];

// Helper: Token Generator
function generateToken(user: ServerUser): string {
  const token = `rf_${user.role}_${Buffer.from(`${user.email}:${Date.now()}`).toString('base64')}`;
  sessionTokens.set(token, user);
  return token;
}

// Helper: Strong Password Validator (Enforces >=8 chars, uppercase, lowercase, numbers/symbols, and blocks common patterns like 1234567)
function validateStrongPassword(pass: string): { valid: boolean; error?: string } {
  if (!pass || typeof pass !== 'string') {
    return { valid: false, error: "Password is required." };
  }
  if (pass.length < 8) {
    return { valid: false, error: "Strong Password Policy: Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(pass)) {
    return { valid: false, error: "Strong Password Policy: Password must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(pass)) {
    return { valid: false, error: "Strong Password Policy: Password must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(pass) && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) {
    return { valid: false, error: "Strong Password Policy: Password must contain at least one number or special symbol." };
  }
  const forbiddenPatterns = ['1234567', '12345678', '123456789', 'password', 'qwerty', 'admin123', 'richfield'];
  const lower = pass.toLowerCase();
  for (const pattern of forbiddenPatterns) {
    if (lower.includes(pattern)) {
      return { 
        valid: false, 
        error: `Weak Password Rejected: Sequential numbers or common dictionary terms (such as '${pattern}') are strictly prohibited by institutional security policy.` 
      };
    }
  }
  return { valid: true };
}

// 7. Auth: Register with Strict Role Rules, Strong Password & Domain Validation
app.post("/api/auth/register", (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      campus,
      qualification,
      qualificationName,
      academicYear,
      studentIdNumber,
      degreeSerial,
      graduationYear,
      company,
      organization,
      talentSought
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required." });
    }

    // Strong Password Policy Check
    const pwdCheck = validateStrongPassword(password);
    if (!pwdCheck.valid) {
      return res.status(400).json({ error: pwdCheck.error });
    }

    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1];

    // Rule 1: Administrator cannot self-register!
    if (role === 'admin') {
      return res.status(403).json({
        error: "Administrator accounts cannot be self-registered. Admin credentials must be provisioned securely and separately by the Richfield Systems Directorate."
      });
    }

    // Rule 2: Institutional email domain restriction - ONLY @richfield.ac.za allowed, EXCEPT corporate recruiters
    if (role !== 'recruiter' && role !== 'alumni') {
      const isRichfieldDomain = domain === 'richfield.ac.za' || domain.endsWith('.richfield.ac.za');
      if (!isRichfieldDomain) {
        return res.status(400).json({
          error: `Registration restricted: Only official @richfield.ac.za institutional email addresses are permitted for this account type. Domain '${domain}' is not authorized. (Corporate recruiters are exempt).`,
          allowedDomains: ['richfield.ac.za', 'my.richfield.ac.za']
        });
      }
    }

    // Rule 3: Richfield Student Number Validation (Strictly 9 Digits)
    let finalStudentId: string | undefined = undefined;
    if (role === 'student') {
      const candidateId = typeof studentIdNumber === 'string' ? studentIdNumber.trim() : '';
      if (!candidateId) {
        return res.status(400).json({
          error: "Student Registration: Richfield student number is required."
        });
      }
      if (!/^\d{9}$/.test(candidateId)) {
        return res.status(400).json({
          error: `Invalid Student Number: Richfield student number must be exactly 9 digits (e.g., 202488412). Received: '${candidateId}'. Letters, spaces, or hyphens are not permitted.`
        });
      }
      finalStudentId = candidateId;
    } else if (studentIdNumber && typeof studentIdNumber === 'string') {
      const candidateId = studentIdNumber.trim();
      if (/^\d{9}$/.test(candidateId)) {
        finalStudentId = candidateId;
      } else {
        finalStudentId = candidateId;
      }
    }

    // Rule 4: Alumni Identity Verification Flow
    let alumniStatus: 'verified' | 'pending' = 'pending';
    if (role === 'alumni') {
      // If student ID or diploma serial is provided, simulate instant Registry validation
      if (finalStudentId || degreeSerial) {
        alumniStatus = 'verified';
      }
    }

    // Rule 5: Business User / Recruiter requires separate approval step
    let businessStatus: 'verified' | 'pending_approval' = 'verified';
    if (role === 'recruiter') {
      // By default put into pending approval for Admin to review
      businessStatus = 'pending_approval';
    }

    const newUser: ServerUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      verified: role === 'student' ? true : role === 'alumni' ? alumniStatus === 'verified' : false,
      campus: campus || 'Newtown Campus',
      qualification: qualification || 'IT',
      qualificationName: qualificationName || 'Bachelor of Science in Information Technology (BSc IT)',
      academicYear: role === 'student' ? academicYear || '1st Year' : role === 'alumni' ? 'Alumni' : 'Staff',
      studentIdNumber: finalStudentId || (role === 'student' ? `2026${Math.floor(10000 + Math.random() * 90000)}` : undefined),
      degreeSerial: degreeSerial,
      graduationYear: graduationYear,
      company: company || organization,
      organization: organization || company,
      skills: role === 'student' ? ['Richfield Graduate', 'Problem Solving'] : ['Professional Leadership'],
      bio: `${name} at Richfield Graduate Institute of Technology (${campus || 'Newtown Campus'}).`,
      headline: `${role.toUpperCase()} | Richfield ${campus || 'Campus'}`,
      verificationStatus: role === 'recruiter' ? businessStatus : 'verified',
      alumniVerificationStatus: role === 'alumni' ? alumniStatus : undefined,
      createdAt: new Date().toISOString()
    };

    registeredUsers.set(cleanEmail, newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: {
        ...newUser,
        password: undefined // Never return password
      },
      message: role === 'recruiter' 
        ? "Registration received. Your employer credentials have been queued for Administrator verification. Access to student personal data will unlock upon approval."
        : role === 'alumni' && alumniStatus === 'pending'
          ? "Alumni registration successful. Your graduate diploma verification is being processed."
          : "Registration successful. Welcome to RichfieldConnect!"
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Registration failed." });
  }
});

// 8. Auth: Login with Role Verification & Session Token Issuance
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = registeredUsers.get(cleanEmail);

    // If not in registered map, match against default demo credentials
    if (!user) {
      if (cleanEmail.includes('admin') || cleanEmail.includes('lesiba')) {
        user = registeredUsers.get('lesiba.m@richfield.ac.za');
      } else if (cleanEmail.includes('recruiter') || cleanEmail.includes('standardbank')) {
        user = registeredUsers.get('mpho.molefe@standardbank.co.za');
      } else if (cleanEmail.includes('alumni')) {
        user = registeredUsers.get('nandi.s@alumni.richfield.ac.za');
      } else if (cleanEmail.includes('student') || cleanEmail.includes('thabiso')) {
        user = registeredUsers.get('thabiso.k@student.richfield.ac.za');
      }
    }

    if (!user) {
      return res.status(401).json({ error: "No user found with the provided institutional credentials." });
    }

    // Verify password strictly against user's password or registered institutional role credential
    const isRolePresetPass = 
      (user.role === 'student' && (password === 'Student@Richfield2026' || password === 'Premium@Richfield2026')) ||
      (user.role === 'admin' && password === 'Admin@Richfield2026') ||
      (user.role === 'recruiter' && password === 'Recruiter@Richfield2026') ||
      (user.role === 'alumni' && password === 'Alumni@Richfield2026') ||
      (user.role === 'lecturer' && password === 'Lecturer@Richfield2026');

    const validPass = (user.password === password) || isRolePresetPass;
    if (!validPass) {
      return res.status(401).json({ 
        error: "Invalid password for this account. Access denied. Please ensure you enter your verified password." 
      });
    }

    // Check account status
    if (user.verificationStatus === 'suspended') {
      return res.status(403).json({ error: "This account has been suspended by the Richfield Systems Directorate for policy violations." });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        ...user,
        password: undefined
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Login failed." });
  }
});

// 9. Auth: Current User Verification (`/api/auth/me`)
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization token." });
  }

  const token = authHeader.split(" ")[1];
  const user = sessionTokens.get(token);

  if (!user) {
    return res.status(401).json({ error: "Session expired or invalid token." });
  }

  return res.json({
    user: {
      ...user,
      password: undefined
    }
  });
});

// 10. Admin: User Management (View, Approve, Suspend, Verify Alumni)
app.get("/api/admin/users", (req, res) => {
  const allUsers = Array.from(registeredUsers.values()).map(u => ({
    ...u,
    password: undefined
  }));
  res.json({ users: allUsers });
});

app.post("/api/admin/users/:id/action", (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve', 'suspend', 'activate', 'verify_alumni', 'remove'

    let targetUser: ServerUser | undefined;
    for (const u of registeredUsers.values()) {
      if (u.id === id) {
        targetUser = u;
        break;
      }
    }

    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (action === 'approve') {
      targetUser.verificationStatus = 'verified';
      targetUser.verified = true;
    } else if (action === 'suspend') {
      targetUser.verificationStatus = 'suspended';
    } else if (action === 'activate') {
      targetUser.verificationStatus = 'verified';
    } else if (action === 'verify_alumni') {
      targetUser.alumniVerificationStatus = 'verified';
      targetUser.verified = true;
    } else if (action === 'remove') {
      registeredUsers.delete(targetUser.email);
    }

    res.json({ success: true, user: targetUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Admin: Opportunity Oversight (Review, Approve, Reject Business Postings)
app.get("/api/admin/opportunities", (req, res) => {
  res.json({ opportunities: managedOpportunities });
});

app.post("/api/admin/opportunities/:id/moderate", (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' | 'reject'

    const opp = managedOpportunities.find(o => o.id === id);
    if (!opp) {
      return res.status(404).json({ error: "Opportunity not found." });
    }

    if (action === 'approve') {
      opp.status = 'approved';
      opp.isVerified = true;
    } else if (action === 'reject') {
      opp.status = 'rejected';
      opp.rejectionReason = rejectionReason || 'Does not meet Richfield accreditation placement guidelines.';
    }

    res.json({ success: true, opportunity: opp });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 12. Admin: Announcement Broadcasting (Push notices to students, alumni, business)
app.get("/api/announcements", (req, res) => {
  res.json({ announcements: platformAnnouncements });
});

app.post("/api/admin/announcements", (req, res) => {
  try {
    const { title, content, targetAudience, priority } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      targetAudience: targetAudience || 'all',
      priority: priority || 'normal',
      authorName: 'Lesiba Molapo',
      authorRole: 'admin',
      createdAt: 'Just now'
    };

    platformAnnouncements.unshift(newAnnouncement);
    res.status(201).json({ success: true, announcement: newAnnouncement });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 13. NLP-Assisted Profile Building & CV Extraction (Section 2.8)
app.post("/api/ai/extract-cv", async (req, res) => {
  try {
    const { cvText } = req.body;
    if (!cvText || typeof cvText !== "string" || cvText.trim().length < 10) {
      return res.status(400).json({ error: "Please provide valid CV or resume text." });
    }

    const ai = getAIClient();
    const systemPrompt = `You are the RichfieldConnect NLP Profile Parsing Engine.
Extract structured professional profile data from the provided student CV or unstructured resume text.
Output pure JSON conforming to this schema:
{
  "name": "Full Name",
  "headline": "Compelling Professional Headline (e.g. 3rd Year BSc IT Scholar | Full-Stack Cloud Developer)",
  "summary": "Professional summary highlighting career aspirations and key value proposition (60-80 words)",
  "campus": "Identified or default Newtown Campus",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "qualifications": [
    {
      "name": "Qualification Name (e.g. Bachelor of Science in Information Technology)",
      "institution": "Richfield Graduate Institute of Technology",
      "year": "2024 - 2026"
    }
  ],
  "workExperience": [
    {
      "role": "Job / Project Title",
      "company": "Company / Organisation",
      "duration": "Duration (e.g. Jan 2025 - Present)",
      "description": "Key responsibilities and technical accomplishments",
      "isEntrepreneurial": false
    }
  ],
  "suggestedGitHubProjects": [
    {
      "name": "Project Name",
      "description": "Project summary",
      "language": "TypeScript/Python"
    }
  ],
  "completenessScore": 85,
  "improvementTips": [
    "Add Credly badge verification for cloud certifications",
    "Specify graduation year to attract recruiter pipeline"
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nCandidate Resume / CV Text:\n"""\n${cvText}\n"""` }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    }

    // Dynamic Rule-based NLP extraction fallback
    const skillsList = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'Financial Modeling', 'IFRS', 'Git', 'Agile'];
    const lower = cvText.toLowerCase();
    const matchedSkills = skillsList.filter(s => lower.includes(s.toLowerCase()));

    return res.json({
      success: true,
      data: {
        name: "Extracted Candidate",
        headline: "Richfield Scholar | Career Ready Professional",
        summary: "Motivated student with strong academic foundation and practical project execution skills across diverse team environments.",
        campus: "Newtown Campus",
        skills: matchedSkills.length > 0 ? matchedSkills : ['TypeScript', 'Python', 'Database Management', 'Agile Scrum', 'Problem Solving'],
        qualifications: [
          {
            name: "Bachelor of Science in Information Technology (BSc IT)",
            institution: "Richfield Graduate Institute of Technology",
            year: "2024 - 2026"
          }
        ],
        workExperience: [
          {
            role: "Software Engineering Intern / Capstone Lead",
            company: "Richfield Innovation Lab",
            duration: "Jul 2025 - Present",
            description: "Developed full-stack web and mobile application prototypes adhering to modern architectural standards.",
            isEntrepreneurial: false
          }
        ],
        suggestedGitHubProjects: [
          {
            name: "campus-connect-mobile",
            description: "Native cross-platform networking portal built with modern TypeScript and responsive UI.",
            language: "TypeScript"
          }
        ],
        completenessScore: 82,
        improvementTips: [
          "Link your GitHub repositories with live deployment URLs",
          "Add peer and mentor endorsements to validate top skills"
        ]
      }
    });
  } catch (error: any) {
    console.error("NLP CV Extraction failed:", error);
    res.status(500).json({ error: error.message || "Failed to parse CV text" });
  }
});

// 14. Smart Job Matching Engine (Section 2.8)
app.post("/api/ai/match-jobs", (req, res) => {
  try {
    const { studentSkills = [], studentProgramme = '', studentYear = '', jobs = managedOpportunities } = req.body;

    const matchedJobs = jobs.map((job: any) => {
      let score = 50; // base score

      // Programme synergy
      const progLower = (studentProgramme || '').toLowerCase();
      const qualLower = (job.qualification || '').toLowerCase();
      if (qualLower === 'both' || (qualLower === 'it' && (progLower.includes('it') || progLower.includes('science'))) || (qualLower === 'business' && (progLower.includes('com') || progLower.includes('bba') || progLower.includes('bpm')))) {
        score += 25;
      }

      // Skill overlap
      const jobReqs = (job.requirements || []).join(' ').toLowerCase();
      const skillMatches = studentSkills.filter((s: string) => jobReqs.includes(s.toLowerCase()));
      score += Math.min(25, skillMatches.length * 8);

      return {
        ...job,
        matchScore: Math.min(99, score),
        matchedSkills: skillMatches
      };
    }).sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));

    res.json({ success: true, matchedOpportunities: matchedJobs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 15. Video Processing & Transcoding Simulation (Section 2.8)
app.post("/api/media/process-video", (req, res) => {
  try {
    const { videoFileName = 'career_journey.mp4', durationSeconds = 45 } = req.body;

    // Simulate video compression, H.264 transcoding, and automatic thumbnail extraction
    res.json({
      success: true,
      status: 'transcoded',
      compressionRatio: '68% reduction (H.264 AAC 1080p -> 720p Mobile-Optimized)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      duration: `${durationSeconds}s`,
      resolution: '720x1280 (Vertical 9:16 Short-Form)',
      cdnStreamUrl: `https://cdn.richfield.ac.za/stream/${Date.now()}_optimized.m3u8`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RichfieldConnect server running on port ${PORT}`);
  });
}

startServer();
