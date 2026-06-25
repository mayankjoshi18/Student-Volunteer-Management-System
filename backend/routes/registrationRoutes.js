const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  updateRegistrationStatus,
  getAllRegistrations,
  getRegistrationsByStudent,
  getRegistrationsByEvent,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('coordinator', 'admin'), getAllRegistrations);
router.post('/register/:eventId', protect, authorize('student'), registerForEvent);
router.post('/cancel/:id', protect, cancelRegistration);
router.put('/:id/status', protect, authorize('coordinator', 'admin'), updateRegistrationStatus);
router.get('/student/:id', protect, getRegistrationsByStudent);
router.get('/event/:id', protect, authorize('coordinator', 'admin'), getRegistrationsByEvent);

module.exports = router;
