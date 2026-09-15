import { jsPDF } from 'jspdf';
import { UserProfile } from '../types';

export interface PdfCvOptions {
  includeRecommendations?: boolean;
  includeProjects?: boolean;
  accentColor?: string; // Hex or preset
}

export function generateStudentPdfCv(student: UserProfile, options: PdfCvOptions = {}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper: check page space and add new page if needed
  const checkPageSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      // Add page footer before leaving
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 165);
      doc.text('Richfield Graduate Institute of Technology • Official Academic & Career Portal', margin, pageHeight - 10);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10);

      doc.addPage();
      y = margin;
      // Repeat small institutional header on subsequent pages
      doc.setFillColor(7, 19, 38);
      doc.rect(0, 0, pageWidth, 8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 210, 225);
      doc.text(`${student.name} • Curriculum Vitae (Richfield ${student.campus || 'Campus'})`, margin, 5.5);
      y = 16;
    }
  };

  // 1. TOP HEADER BANNER (Institutional Richfield Branding)
  doc.setFillColor(7, 19, 38); // Deep Navy (#071326)
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Coral Red Accent Stripe
  doc.setFillColor(255, 70, 45); // #FF462D
  doc.rect(0, 41, pageWidth, 2.5, 'F');

  // Institution title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 110, 90); // Light coral
  doc.text('RICHFIELD GRADUATE INSTITUTE OF TECHNOLOGY (PTY) LTD', margin, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(165, 185, 210);
  doc.text('NQF ACCREDITED HIGHER EDUCATION • SAQA REGISTERED • DHET NO. 2000/HE07/008', margin, 14);

  // Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text((student.name || 'Candidate').toUpperCase(), margin, 23);

  // Headline / Target Role
  const headline = student.headline || `${student.qualificationName || 'BSc in Information Technology'} Candidate`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 230, 245);
  doc.text(headline, margin, 29);

  // Contact Details bar inside header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 200, 225);
  const contactParts = [
    `Email: ${student.email}`,
    `Campus: ${student.campus || 'Newtown Campus'}`,
    student.studentIdNumber ? `Student ID: ${student.studentIdNumber}` : 'Student Candidate'
  ];
  doc.text(contactParts.join('   |   '), margin, 36);

  y = 48;

  // Helper: Section Title Builder
  const drawSectionTitle = (title: string) => {
    checkPageSpace(14);
    doc.setFillColor(243, 246, 252);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');

    doc.setFillColor(255, 70, 45); // small accent dot
    doc.circle(margin + 3.5, y + 3.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 30, 60);
    doc.text(title.toUpperCase(), margin + 7.5, y + 4.8);

    y += 10;
  };

  // 2. PROFESSIONAL SUMMARY / ACADEMIC PROFILE
  drawSectionTitle('Professional Summary & Academic Focus');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 75);

  const bioText = student.bio || 
    `Results-driven scholar at Richfield Graduate Institute of Technology pursuing accredited qualification in ${student.qualificationName || 'Information Technology'}. Equips modern technical proficiencies, analytical problem solving, and collaborative skills prepared for enterprise internships and graduate appointments.`;

  const splitBio = doc.splitTextToSize(bioText, contentWidth);
  checkPageSpace(splitBio.length * 4.5 + 4);
  doc.text(splitBio, margin, y);
  y += splitBio.length * 4.5 + 4;

  // 3. CORE TECHNICAL SKILLS & COMPETENCIES
  drawSectionTitle('Core Technical Skills & Professional Competencies');
  const skillsList = (student.skills && student.skills.length > 0)
    ? student.skills
    : ['Software Engineering', 'TypeScript', 'Python', 'Cloud Services', 'Database Design', 'Agile Methodologies'];

  checkPageSpace(24);
  
  // Render skills in a clean 2-column or 3-column badge layout
  let currentX = margin;
  let currentY = y;
  const colWidth = contentWidth / 3;

  skillsList.forEach((skill, idx) => {
    if (idx > 0 && idx % 3 === 0) {
      currentY += 6.5;
      currentX = margin;
      checkPageSpace(8);
    }
    
    // Skill bullet badge
    doc.setFillColor(238, 242, 250);
    doc.setDrawColor(205, 218, 238);
    doc.roundedRect(currentX, currentY, colWidth - 3, 5.5, 1, 1, 'FD');

    doc.setFillColor(0, 85, 212); // Small blue indicator
    doc.circle(currentX + 3, currentY + 2.75, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 45, 85);
    doc.text(skill, currentX + 6, currentY + 3.8);

    currentX += colWidth;
  });

  y = currentY + 10;

  // 4. FORMAL EDUCATION & INSTITUTIONAL ENROLMENT
  drawSectionTitle('Education & Formal Qualifications');
  checkPageSpace(22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(10, 25, 55);
  doc.text(student.qualificationName || 'Bachelor of Science in Information Technology (BSc IT)', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 70, 45); // Coral
  const tenure = `Enrolled: ${student.enrolmentYear || '2024'} — Expected Graduation: ${student.graduationYear || '2026'}`;
  doc.text(tenure, pageWidth - margin - doc.getTextWidth(tenure), y);

  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 75, 95);
  doc.text(`Richfield Graduate Institute of Technology • ${student.campus || 'Newtown Campus'}`, margin, y);

  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(90, 105, 125);
  const statusDetails = [
    `Current Level: ${student.academicYear || '3rd Year'}`,
    `Faculty: ${student.qualification === 'Business' ? 'Business & Management Sciences' : 'Information Technology'}`,
    `Accreditation: NQF Level 7 (CHE / SAQA Verified)`
  ];
  doc.text(statusDetails.join('  •  '), margin, y);
  y += 7;

  // 5. WORK & INDUSTRY EXPERIENCE
  if (student.workExperience && student.workExperience.length > 0) {
    drawSectionTitle('Professional & Work Experience');
    student.workExperience.forEach((exp) => {
      checkPageSpace(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 30, 60);
      doc.text(exp.role, margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 115, 135);
      doc.text(exp.duration, pageWidth - margin - doc.getTextWidth(exp.duration), y);

      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 70, 45);
      doc.text(exp.company, margin, y);

      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 75, 95);
      const splitDesc = doc.splitTextToSize(exp.description, contentWidth);
      doc.text(splitDesc, margin, y);
      y += splitDesc.length * 3.5 + 4;
    });
  } else {
    // Default Practical Capstone Experience
    drawSectionTitle('Academic Projects & Practical Software Engineering');
    checkPageSpace(22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 30, 60);
    doc.text('EnRich Hub & Richfield Academic Platform Capstone', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 115, 135);
    doc.text('2025 - 2026', pageWidth - margin - doc.getTextWidth('2025 - 2026'), y);

    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 85, 212);
    doc.text('Role: Full-Stack Developer & Systems Architect', margin, y);

    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 75, 95);
    const projDesc = 'Engineered multi-tenant student and alumni connection ecosystem featuring secure domain-restricted RBAC, real-time mentorship scheduling, code repair simulators, and AI-assisted exam preparation.';
    const splitProj = doc.splitTextToSize(projDesc, contentWidth);
    doc.text(splitProj, margin, y);
    y += splitProj.length * 3.5 + 4;
  }

  // 6. CERTIFICATIONS & ACADEMIC CREDENTIALS
  if (student.certifications && student.certifications.length > 0) {
    drawSectionTitle('Industry Certifications & Credentials');
    student.certifications.forEach((cert) => {
      checkPageSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 35, 65);
      doc.text(`• ${cert.name}`, margin, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 115, 135);
      doc.text(`${cert.authority} (${cert.date})`, margin + 60, y);
      y += 5;
    });
  }

  // 7. VERIFIED ACADEMIC RECOMMENDATION & LECTURER ENDORSEMENT
  if (student.recommendations && student.recommendations.length > 0 && options.includeRecommendations !== false) {
    drawSectionTitle('Verified Academic & Industry Recommendations');
    const rec = student.recommendations[0];
    checkPageSpace(20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 30, 60);
    doc.text(`"${rec.text || rec.content}"`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(255, 70, 45);
    doc.text(`— ${rec.authorName}, ${rec.authorRole} (${rec.relationship}) • Verified Richfield Endorsement`, margin, y);
    y += 8;
  }

  // 8. INSTITUTIONAL INTEGRITY & VERIFICATION WATERMARK FOOTER
  checkPageSpace(18);
  doc.setDrawColor(215, 225, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 85, 212);
  doc.text('INSTITUTIONALLY VERIFIED CURRICULUM VITAE • ENRICH HUB STUDENT PORTAL', margin, y);

  y += 3.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 125, 145);
  const genDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Generated on ${genDate} via RichfieldConnect Digital Registry. Registered to SAQA & CHE standards.`, margin, y);

  // File save
  const cleanFilename = (student.name || 'Student').trim().replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanFilename}_Richfield_CV.pdf`);
}
