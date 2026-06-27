const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendRegistrationConfirmation } = require('../services/emailService');

/**
 * @desc    Register a student for an event
 * @route   POST /api/registrations/register/:eventId
 * @access  Private (Student)
 */
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user._id;

    // Check user role
    if (req.user.role !== 'student') {
      return res.status(400).json({ success: false, error: 'Only student accounts can register for volunteer events.' });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    // Verify event is not completed/cancelled
    if (event.status !== 'upcoming' && event.status !== 'ongoing') {
      return res.status(400).json({ success: false, error: 'Registration is only open for upcoming or ongoing events.' });
    }

    // Check slots
    if (event.registeredCount >= event.slots) {
      return res.status(400).json({ success: false, error: 'This event has reached its maximum volunteer capacity.' });
    }

    // Check if already registered
    const alreadyRegistered = await Registration.findOne({ studentId, eventId });
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, error: 'You are already registered for this event.' });
    }

    // Create Registration
    const registration = await Registration.create({
      studentId,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentDepartment: req.user.department,
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      status: 'pending',
    });

    // Increment event registration count
    event.registeredCount += 1;
    await event.save();

    // Trigger confirmation email
    sendRegistrationConfirmation(req.user, event);

    res.status(201).json({
      success: true,
      registration,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cancel a student's registration
 * @route   POST /api/registrations/cancel/:id
 * @access  Private (Student)
 */
const cancelRegistration = async (req, res, next) => {
  try {
    const regId = req.params.id;
    const registration = await Registration.findById(regId);

    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration record not found.' });
    }

    // Verify student ownership (unless Admin/Coordinator cancels it)
    if (req.user.role === 'student' && registration.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this registration.' });
    }

    const eventId = registration.eventId;

    // Delete registration
    await Registration.deleteOne({ _id: regId });

    // Decrement event registration count
    const event = await Event.findById(eventId);
    if (event) {
      event.registeredCount = Math.max(0, event.registeredCount - 1);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Approve or Reject registration status
 * @route   PUT /api/registrations/:id/status
 * @access  Private (Coordinator/Admin)
 */
const updateRegistrationStatus = async (req, res, next) => {
  try {
    const regId = req.params.id;
    const { status } = req.body; // 'approved' | 'declined'

    if (!status || !['approved', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid registration status.' });
    }

    const registration = await Registration.findById(regId);
    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration record not found.' });
    }

    registration.status = status;
    await registration.save();

    res.status(200).json({
      success: true,
      registration,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    View all registrations (Admins/Coordinators)
 * @route   GET /api/registrations
 * @access  Private (Coordinator/Admin)
 */
const getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    View registrations for a specific student
 * @route   GET /api/registrations/student/:id
 * @access  Private
 */
const getRegistrationsByStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Check access permissions
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, error: 'Not authorized to view other volunteers registrations' });
    }

    const registrations = await Registration.find({ studentId }).sort({ registeredAt: -1 });
    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    View registrations for a specific event
 * @route   GET /api/registrations/event/:id
 * @access  Private (Coordinator/Admin)
 */
const getRegistrationsByEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const registrations = await Registration.find({ eventId }).sort({ registeredAt: -1 });
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  updateRegistrationStatus,
  getAllRegistrations,
  getRegistrationsByStudent,
  getRegistrationsByEvent,
};
