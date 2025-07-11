// utils/generateResultPdf.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

export const generateResultPdf = async (
  filteredData: any[],
  studentInfo: any,
  semester: string,
  session: string,
  gpaData: {
    gpa: number;
    totalCredits: number;
    totalQualityPoints: number;
    degreeClass: string;
    gradeDistribution: Record<string, { count: number; percentage: number }>;
  }
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Set up fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Colors
  const primaryColor = rgb(0.38, 0.046, 0.033); // Brown-burgundy
  const secondaryColor = rgb(0.2, 0.2, 0.2);
  const accentColor = rgb(0.8, 0.1, 0.1);

  // Header Section
  page.drawText('Student Grade Report', {
    x: 50,
    y: 800,
    size: 24,
    font: titleFont,
    color: primaryColor,
  });

  page.drawText(`${semester === '1' ? 'First' : 'Second'} Semester - ${session}`, {
    x: 50,
    y: 770,
    size: 14,
    font: boldFont,
    color: secondaryColor,
  });

  page.drawText('Nigerian University 5.00 Grading System', {
    x: 50,
    y: 750,
    size: 12,
    font: font,
    color: secondaryColor,
  });

  // Divider line
  page.drawLine({
    start: { x: 50, y: 740 },
    end: { x: 545, y: 740 },
    thickness: 1,
    color: primaryColor,
  });

  // GPA Section
  page.drawText(`GPA: ${gpaData.gpa.toFixed(2)}`, {
    x: 50,
    y: 710,
    size: 18,
    font: boldFont,
    color: accentColor,
  });

  page.drawText(gpaData.degreeClass, {
    x: 50,
    y: 690,
    size: 14,
    font: boldFont,
    color: secondaryColor,
  });

  page.drawText(`Total Credits (TCU): ${gpaData.totalCredits}`, {
    x: 50,
    y: 660,
    size: 12,
    font: boldFont,
    color: secondaryColor,
  });

  page.drawText(`Quality Points (TOP): ${gpaData.totalQualityPoints.toFixed(2)}`, {
    x: 50,
    y: 640,
    size: 12,
    font: boldFont,
    color: secondaryColor,
  });

  // Divider line
  page.drawLine({
    start: { x: 50, y: 620 },
    end: { x: 545, y: 620 },
    thickness: 1,
    color: primaryColor,
  });

  // User Info Section
  page.drawText('User Test', {
    x: 50,
    y: 590,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  // Table-like user info
  page.drawText('Reg Number:', { x: 50, y: 560, size: 12, font: boldFont });
  page.drawText(studentInfo.reg_number, { x: 150, y: 560, size: 12, font: font });

  page.drawText('Program:', { x: 50, y: 540, size: 12, font: boldFont });
  page.drawText(studentInfo.program, { x: 150, y: 540, size: 12, font: font });

  page.drawText('Email:', { x: 50, y: 520, size: 12, font: boldFont });
  page.drawText(studentInfo.email, { x: 150, y: 520, size: 12, font: font });

  page.drawText('Year:', { x: 50, y: 500, size: 12, font: boldFont });
  page.drawText(`${studentInfo.academic_level}th Year`, { x: 150, y: 500, size: 12, font: font });

  // Divider line
  page.drawLine({
    start: { x: 50, y: 480 },
    end: { x: 545, y: 480 },
    thickness: 1,
    color: primaryColor,
  });

  // Course Performance Section
  page.drawText('Course Performance Details', {
    x: 50,
    y: 450,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  // Course table headers
  const headers = [
    { text: 'COURSE CODE', x: 50 },
    { text: 'COURSE NAME', x: 120 },
    { text: 'CU', x: 350 },
    { text: 'SCORE', x: 400 },
    { text: 'GRADE', x: 450 },
    { text: 'GP', x: 500 },
    { text: 'QP', x: 550 }
  ];

  headers.forEach(header => {
    page.drawText(header.text, {
      x: header.x,
      y: 430,
      size: 10,
      font: boldFont,
      color: primaryColor,
    });
  });

  // Course data rows
  let yPos = 410;
  filteredData.forEach(course => {
    page.drawText(course.course_code, { x: 50, y: yPos, size: 10, font: font });
    page.drawText(course.course_title, { x: 120, y: yPos, size: 10, font: font });
    page.drawText(course.credit_load.toString(), { x: 350, y: yPos, size: 10, font: font });
    page.drawText(course.score, { x: 400, y: yPos, size: 10, font: font });
    page.drawText(course.grade, { x: 450, y: yPos, size: 10, font: font });
    page.drawText((parseFloat(course.score)/20).toFixed(1), { x: 500, y: yPos, size: 10, font: font });
    page.drawText(course.quality_point, { x: 550, y: yPos, size: 10, font: font });
    yPos -= 20;
  });

  // Add new page for additional sections
  const secondPage = pdfDoc.addPage([595, 842]);

  // Grade Distribution Section
  secondPage.drawText('Performance Summary', {
    x: 50,
    y: 800,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  // Grade distribution table
  const gradeHeaders = [
    { text: 'Grade', x: 50 },
    { text: 'Range', x: 150 },
    { text: 'Count', x: 300 },
    { text: 'Percentage', x: 400 }
  ];

  gradeHeaders.forEach(header => {
    secondPage.drawText(header.text, {
      x: header.x,
      y: 770,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
  });

  const gradeData = [
    { grade: 'A', range: 'Excellent (70-100%)' },
    { grade: 'B', range: 'Very Good (60-69%)' },
    { grade: 'C', range: 'Good (50-59%)' },
    { grade: 'D', range: 'Fair (45-49%)' },
    { grade: 'E', range: 'Pass (40-44%)' },
    { grade: 'F', range: 'Fail (0-39%)' }
  ];

  let gradeYPos = 740;
  gradeData.forEach(grade => {
    const dist = gpaData.gradeDistribution[grade.grade] || { count: 0, percentage: 0 };
    
    secondPage.drawText(grade.grade, { x: 50, y: gradeYPos, size: 10, font: boldFont });
    secondPage.drawText(grade.range, { x: 150, y: gradeYPos, size: 10, font: font });
    secondPage.drawText(dist.count.toString(), { x: 300, y: gradeYPos, size: 10, font: font });
    secondPage.drawText(`${dist.percentage}%`, { x: 400, y: gradeYPos, size: 10, font: font });
    gradeYPos -= 20;
  });

  // Academic Performance Section
  secondPage.drawText('Academic Performance', {
    x: 50,
    y: 600,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  secondPage.drawText(gpaData.gpa.toFixed(2), {
    x: 50,
    y: 570,
    size: 24,
    font: boldFont,
    color: accentColor,
  });

  secondPage.drawText('Current GPA', {
    x: 50,
    y: 540,
    size: 14,
    font: font,
    color: secondaryColor,
  });

  secondPage.drawText(gpaData.degreeClass, {
    x: 50,
    y: 520,
    size: 14,
    font: boldFont,
    color: secondaryColor,
  });

  // Progress bar visualization
  const progressWidth = 400;
  const progressFilled = (gpaData.gpa / 5) * progressWidth;
  
  secondPage.drawRectangle({
    x: 50,
    y: 480,
    width: progressWidth,
    height: 20,
    borderWidth: 1,
    borderColor: primaryColor,
    color: rgb(0.9, 0.9, 0.9),
  });

  secondPage.drawRectangle({
    x: 50,
    y: 480,
    width: progressFilled,
    height: 20,
    color: primaryColor,
  });

  secondPage.drawText(`Progress on 5.00 Scale: ${((gpaData.gpa / 5) * 100).toFixed(1)}%`, {
    x: 50,
    y: 450,
    size: 12,
    font: font,
  });

  // GPA Scale Reference
  secondPage.drawText('GPA Scale Reference:', {
    x: 50,
    y: 400,
    size: 12,
    font: boldFont,
  });

  const scaleData = [
    { range: '4.50-5.00', class: 'First Class' },
    { range: '3.50-4.49', class: '2nd Class Upper' },
    { range: '2.40-3.49', class: '2nd Class Lower' },
    { range: '1.50-2.39', class: 'Third Class' },
    { range: '1.00-1.49', class: 'Pass' },
    { range: 'Below 1.00', class: 'Fail' }
  ];

  let scaleYPos = 380;
  scaleData.forEach(item => {
    secondPage.drawText(`${item.range}:`, { x: 50, y: scaleYPos, size: 10, font: boldFont });
    secondPage.drawText(item.class, { x: 150, y: scaleYPos, size: 10, font: font });
    scaleYPos -= 20;
  });

  // Footer
  secondPage.drawText('Official Grade Report', {
    x: 50,
    y: 200,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });

  secondPage.drawText(`This is an official academic transcript for ${semester === '1' ? 'First' : 'Second'} Semester of the ${session} academic session.`, {
    x: 50,
    y: 180,
    size: 10,
    font: font,
  });

  secondPage.drawText('Computed using the Nigerian University 5.00 Grade Point System', {
    x: 50,
    y: 160,
    size: 10,
    font: font,
  });

  secondPage.drawText(`Generated: ${new Date().toLocaleDateString()} • System: 5.00 Scale • Official Document`, {
    x: 50,
    y: 140,
    size: 10,
    font: font,
  });

  // Save the PDF
   const pdfBytes = await pdfDoc.save();
        const uint8Array = new Uint8Array(pdfBytes);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        saveAs(blob, `Result_${studentInfo.reg_number}_${session}_Semester_${semester}.pdf`);
};
  

//  const pdfBytes = await pdfDoc.save();
//         const uint8Array = new Uint8Array(pdfBytes);
//         const blob = new Blob([uint8Array], { type: 'application/pdf' });
//         saveAs(blob, `Result_${studentInfo.reg_number}_${session}_Semester_${semester}.pdf`);

