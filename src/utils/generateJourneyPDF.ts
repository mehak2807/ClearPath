import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Batch } from '@/data/mockData';

export const generateJourneyPDF = (batch: Batch) => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Helper function to add text with auto line break
  const addText = (text: string, x: number, y: number, options?: { align?: 'left' | 'center' | 'right' }) => {
    doc.text(text, x, y, options);
  };
  
  // Helper to check if new page is needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 270) { // A4 height - margin
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };
  
  // 1. HEADER
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Supply Chain Journey Report', 105, yPosition, { align: 'center' });
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ClearPath Transparency Platform', 105, yPosition, { align: 'center' });
  yPosition += 5;
  
  const now = new Date();
  doc.text(`Generated: ${now.toLocaleString()}`, 105, yPosition, { align: 'center' });
  yPosition += 10;
  
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // 2. BATCH INFORMATION
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Batch Information', 20, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text(`Batch ID: #${batch.id}`, 20, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Product: ${batch.productName}`, 20, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Origin: ${batch.origin}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Status: ${batch.status}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Created: ${batch.createdAt}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Last Updated: ${batch.lastUpdated}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Total Events: ${batch.journey.length}`, 20, yPosition);
  yPosition += 10;
  
  // 3. JOURNEY TIMELINE
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Journey Timeline', 20, yPosition);
  yPosition += 8;
  
  // Group events by section
  const sections = {
    origin: { label: 'ORIGIN (NODES 1-4)', events: [] as typeof batch.journey },
    transit: { label: 'GLOBAL TRANSIT (NODES 5-8)', events: [] as typeof batch.journey },
    final: { label: 'FINAL PRODUCT (NODES 9-12)', events: [] as typeof batch.journey }
  };
  
  batch.journey.forEach(event => {
    sections[event.section].events.push(event);
  });
  
  // Render each section
  Object.entries(sections).forEach(([key, section]) => {
    if (section.events.length === 0) return;
    
    checkPageBreak(15);
    
    // Section header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246); // Primary blue
    doc.text(section.label, 20, yPosition);
    yPosition += 6;
    
    doc.setDrawColor(59, 130, 246);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;
    
    // Events
    section.events.forEach((event, index) => {
      checkPageBreak(40);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      
      // Event number
      doc.setFillColor(59, 130, 246);
      doc.circle(20, yPosition, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`${index + 1}`, 20, yPosition + 1, { align: 'center' });
      
      // Actor info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(event.actor.name, 28, yPosition);
      
      if (event.actor.verified) {
        doc.setTextColor(16, 185, 129); // Verified green
        doc.text('✓', doc.getTextWidth(event.actor.name) + 30, yPosition);
      }
      yPosition += 5;
      
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(event.actor.role, 28, yPosition);
      yPosition += 5;
      
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.text(event.actor.id, 28, yPosition);
      yPosition += 6;
      
      // Action
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(event.action, 28, yPosition);
      yPosition += 5;
      
      // Details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const detailLines = doc.splitTextToSize(event.details, 160);
      doc.text(detailLines, 28, yPosition);
      yPosition += detailLines.length * 5;
      
      // Location and Time
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`📍 ${event.location}`, 28, yPosition);
      yPosition += 4;
      doc.text(`🕒 ${event.timestamp}`, 28, yPosition);
      yPosition += 6;
      
      // Data points
      if (event.dataPoints) {
        Object.entries(event.dataPoints).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 28, yPosition);
          yPosition += 4;
        });
        yPosition += 2;
      }
      
      // Digital signature
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      const signature = event.digitalSignature.length > 50 
        ? event.digitalSignature.substring(0, 50) + '...' 
        : event.digitalSignature;
      doc.text(`🔐 ${signature}`, 28, yPosition);
      yPosition += 8;
      
      // Separator
      doc.setDrawColor(220, 220, 220);
      doc.line(28, yPosition, 190, yPosition);
      yPosition += 8;
    });
    
    yPosition += 5;
  });
  
  // 4. FOOTER (on last page)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by ClearPath Supply Chain Platform', 105, 285, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
  }
  
  // 5. SAVE PDF
  const filename = `ClearPath_Journey_${batch.id}_${Date.now()}.pdf`;
  doc.save(filename);
};
