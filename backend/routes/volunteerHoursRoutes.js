const express = require('express');
const router = express.Router();
const { totalHoursPerStudent, autoCalculateVolunteerHours } = require('../controllers/volunteerHoursController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/report/student/:studentId', protect, totalHoursPerStudent);
router.post('/recalculate/:studentId', protect, authorize('coordinator', 'admin'), autoCalculateVolunteerHours);

module.exports = router;
