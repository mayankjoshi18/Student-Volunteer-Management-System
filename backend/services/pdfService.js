const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF Certificate for a student's participation in a volunteer event
 * @param {Object} data 
 * @param {string} data.studentName 
 * @param {string} data.eventTitle 
 * @param {number} data.hoursApproved 
 * @param {string} data.certificateCode 
 * @param {string} data.issuedBy 
 * @param {string} data.issuedAt 
 * @returns {Promise<string>} Relative path to the generated PDF file
 */
const generateCertificatePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const { studentName, eventTitle, hoursApproved, certificateCode, issuedBy, issuedAt } = data;
      
      // Ensure the certificates directory exists
      const certsDir = path.join(__dirname, '..', 'uploads', 'certificates');
      if (!fs.existsSync(certsDir)) {
        fs.mkdirSync(certsDir, { recursive: true });
      }

      const filename = `cert-${certificateCode}.pdf`;
      const filePath = path.join(certsDir, filename);

      // Create a document with landscape orientation (typical for certificates)
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 40, right: 40 }
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // --- Draw Certificate Background & Borders ---
      // Outer border (Deep Blue)
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(4)
         .stroke('#1e3a8a'); // blue-900

      // Inner border (Gold/Bronze)
      doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
         .lineWidth(1.5)
         .stroke('#d97706'); // amber-600

      // Draw decorative corners
      const drawCorner = (x, y, rotation) => {
        doc.save();
        doc.translate(x, y);
        doc.rotate(rotation);
        doc.rect(0, 0, 15, 1.5).fill('#d97706');
        doc.rect(0, 0, 1.5, 15).fill('#d97706');
        doc.restore();
      };
      
      drawCorner(32, 32, 0);
      drawCorner(doc.page.width - 32, 32, 90);
      drawCorner(doc.page.width - 32, doc.page.height - 32, 180);
      drawCorner(32, doc.page.height - 32, 270);

      // --- Certificate Text Content ---
      
      // Header: University Logo / Name Placeholder
      doc.font('Helvetica-Bold')
         .fillColor('#1e293b') // slate-800
         .fontSize(24)
         .text('APEX STATE UNIVERSITY', 0, 70, { align: 'center' });

      doc.font('Helvetica')
         .fillColor('#64748b') // slate-500
         .fontSize(10)
         .text('DEPARTMENT OF STUDENT ENGAGEMENT & OUTREACH', 0, 100, { align: 'center', characterSpacing: 1 });

      // Divider Line
      doc.moveTo(150, 120)
         .lineTo(doc.page.width - 150, 120)
         .lineWidth(0.5)
         .stroke('#cbd5e1');

      // Title: Certificate of Appreciation
      doc.font('Helvetica-Bold')
         .fillColor('#d97706') // amber-600
         .fontSize(32)
         .text('CERTIFICATE OF APPRECIATION', 0, 140, { align: 'center' });

      // Body text
      doc.font('Helvetica-Oblique')
         .fillColor('#475569') // slate-600
         .fontSize(14)
         .text('This is proudly presented to', 0, 195, { align: 'center' });

      // Recipient Name
      doc.font('Helvetica-Bold')
         .fillColor('#1e3a8a') // blue-900
         .fontSize(28)
         .text(studentName, 0, 220, { align: 'center' });

      // Core description
      doc.font('Helvetica')
         .fillColor('#475569') // slate-600
         .fontSize(13)
         .text(`for outstanding service and active participation as a student volunteer in the event`, 0, 265, { align: 'center' });

      doc.font('Helvetica-Bold')
         .fillColor('#1e293b')
         .fontSize(16)
         .text(`"${eventTitle}"`, 0, 290, { align: 'center' });

      doc.font('Helvetica')
         .fillColor('#475569')
         .fontSize(12)
         .text(`securing a contribution of `, 0, 320, { align: 'center', continued: true })
         .font('Helvetica-Bold')
         .fillColor('#10b981') // emerald-500
         .text(`${hoursApproved} approved volunteer hours`, { continued: true })
         .font('Helvetica')
         .fillColor('#475569')
         .text(` toward social welfare activities.`);

      // Signatures
      // Left side: Coordinator
      doc.moveTo(120, 440)
         .lineTo(280, 440)
         .lineWidth(1)
         .stroke('#94a3b8');
         
      doc.font('Helvetica-Bold')
         .fillColor('#1e293b')
         .fontSize(11)
         .text(issuedBy, 120, 448, { width: 160, align: 'center' });
         
      doc.font('Helvetica')
         .fillColor('#64748b')
         .fontSize(9)
         .text('Event Coordinator / Administrator', 120, 462, { width: 160, align: 'center' });

      // Right side: Dean/Admin
      doc.moveTo(doc.page.width - 280, 440)
         .lineTo(doc.page.width - 120, 440)
         .lineWidth(1)
         .stroke('#94a3b8');
         
      doc.font('Helvetica-Bold')
         .fillColor('#1e293b')
         .fontSize(11)
         .text('Dean Arthur Harrison', doc.page.width - 280, 448, { width: 160, align: 'center' });
         
      doc.font('Helvetica')
         .fillColor('#64748b')
         .fontSize(9)
         .text('Dean of Student Welfare', doc.page.width - 280, 462, { width: 160, align: 'center' });

      // Footer Meta (Certificate Code and Date)
      doc.font('Helvetica')
         .fillColor('#94a3b8')
         .fontSize(8.5)
         .text(`Certificate Code: ${certificateCode}`, 40, doc.page.height - 50, { align: 'left' });

      const dateStr = new Date(issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Issued Date: ${dateStr}`, doc.page.width - 240, doc.page.height - 50, { width: 200, align: 'right' });

      // End document
      doc.end();

      writeStream.on('finish', () => {
        resolve(`/uploads/certificates/${filename}`);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
      
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateCertificatePDF,
};
