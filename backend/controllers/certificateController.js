const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const { generateCertificatePDF } = require('../services/pdfService');
const { sendCertificateNotification } = require('../services/emailService');

/**
 * @desc    Issue a Certificate for a student's event completion
 * @route   POST /api/certificates/generate
 * @access  Private (Coordinator/Admin)
 */
const generatePDFCertificate = async (req, res, next) => {
  try {
    const { eventId, studentId } = req.body;

    if (!eventId || !studentId) {
      return res.status(400).json({ success: false, error: 'Please provide eventId and studentId' });
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ eventId, studentId });
    if (existingCert) {
      return res.status(200).json({
        success: true,
        message: 'Certificate already issued for this event.',
        certificate: existingCert,
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Verify registration and attendance
    const registration = await Registration.findOne({ eventId, studentId });
    if (!registration || !registration.attended || registration.status !== 'approved') {
      return res.status(400).json({ success: false, error: 'Certificate cannot be issued. Student has not checked in / completed this event.' });
    }

    // Create unique code
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const certificateCode = `CERT-VMS-EV${eventId.toString().slice(-4).toUpperCase()}-${uniqueSuffix}`;

    // PDF generation parameters
    const pdfData = {
      studentName: student.name,
      eventTitle: event.title,
      hoursApproved: registration.hoursApproved || event.hours,
      certificateCode,
      issuedBy: req.user.name,
      issuedAt: new Date().toISOString(),
    };

    // Generate the PDF
    const certificateURL = await generateCertificatePDF(pdfData);

    // Save Certificate Model
    const certificate = await Certificate.create({
      studentId: student._id,
      studentName: student.name,
      eventId: event._id,
      eventTitle: event.title,
      issuedBy: req.user.name,
      certificateCode,
      certificateURL,
    });

    // Trigger Notification Email
    sendCertificateNotification(student, event, certificateCode, certificateURL);

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully.',
      certificate,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get certificates for a student
 * @route   GET /api/certificates/student/:studentId
 * @access  Private
 */
const getCertificatesByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Check permissions
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const certificates = await Certificate.find({ studentId }).sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify a certificate by code
 * @route   GET /api/certificates/verify/:code
 * @access  Public
 */
const getCertificateByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const certificate = await Certificate.findOne({ certificateCode: code.toUpperCase() });

    if (!certificate) {
      return res.status(404).json({ success: false, error: 'Certificate code is invalid or not registered in our systems.' });
    }

    res.status(200).json({
      success: true,
      verified: true,
      certificate,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Download certificate PDF file
 * @route   GET /api/certificates/download/:id
 * @access  Private
 */
const downloadCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user._id.toString() !== certificate.studentId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to download this certificate' });
    }

    const filename = `cert-${certificate.certificateCode}.pdf`;
    const absolutePath = path.join(__dirname, '..', 'uploads', 'certificates', filename);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, error: 'Certificate PDF file not found on disk' });
    }

    res.download(absolutePath, filename);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all certificates in the system (Admins/Coordinators)
 * @route   GET /api/certificates
 * @access  Private (Coordinator/Admin)
 */
const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ issuedAt: -1 });
    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generatePDFCertificate,
  getCertificatesByStudent,
  getCertificateByCode,
  downloadCertificate,
  getAllCertificates,
};
