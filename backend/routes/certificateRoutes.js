const express = require('express');
const router = express.Router();
const {
  generatePDFCertificate,
  getCertificatesByStudent,
  getCertificateByCode,
  downloadCertificate,
  getAllCertificates,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('coordinator', 'admin'), getAllCertificates);
router.post('/generate', protect, authorize('coordinator', 'admin'), generatePDFCertificate);
router.get('/student/:studentId', protect, getCertificatesByStudent);
router.get('/verify/:code', getCertificateByCode);
router.get('/download/:id', protect, downloadCertificate);

module.exports = router;
