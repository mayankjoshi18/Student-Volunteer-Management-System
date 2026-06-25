const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getAllEvents)
  .post(protect, authorize('coordinator', 'admin'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, authorize('coordinator', 'admin'), updateEvent)
  .delete(protect, authorize('coordinator', 'admin'), deleteEvent);

module.exports = router;
