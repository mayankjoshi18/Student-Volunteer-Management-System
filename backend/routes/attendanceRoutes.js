const express = require('express');
const router = express.Router();
const {
  generateEventQRCode,
  markAttendanceThroughQR,
  updateAttendance,
  attendanceReports,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/generate/:eventId', protect, authorize('coordinator', 'admin'), generateEventQRCode);
router.post('/checkin', protect, authorize('student'), markAttendanceThroughQR);
router.put('/update/:registrationId', protect, authorize('coordinator', 'admin'), updateAttendance);
router.get('/reports/:eventId', protect, authorize('coordinator', 'admin'), attendanceReports);

module.exports = router;
