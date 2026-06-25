const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * @desc    Get QR code for an event check-in
 * @route   GET /api/attendance/generate/:eventId
 * @access  Private (Coordinator/Admin)
 */
const generateEventQRCode = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      eventId: event._id,
      eventTitle: event.title,
      qrCode: event.qrCode, // Base64 data URL
      checkinUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/checkin?eventId=${event._id}`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Mark attendance through scanning event QR code
 * @route   POST /api/attendance/checkin
 * @access  Private (Student)
 */
const markAttendanceThroughQR = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    if (!eventId) {
      return res.status(400).json({ success: false, error: 'Please provide event ID' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check if the student is registered for the event
    const registration = await Registration.findOne({ studentId, eventId });
    if (!registration) {
      return res.status(400).json({ success: false, error: 'You must register for the event before checking in' });
    }

    if (registration.status !== 'approved') {
      return res.status(400).json({ success: false, error: 'Your event registration must be approved before you can check in' });
    }

    if (registration.attended) {
      return res.status(400).json({ success: false, error: 'You have already checked in and marked attendance for this event' });
    }

    // Create check-in log
    const checkin = await Attendance.create({
      studentId,
      eventId,
    });

    // Update Registration details
    registration.attended = true;
    registration.hoursApproved = event.hours; // Auto grant event hours
    await registration.save();

    // Increment Student hours and points
    const user = await User.findById(studentId);
    user.hoursLogged += event.hours;
    user.points += event.hours * 30; // 30 points per hour
    await user.save();

    res.status(200).json({
      success: true,
      message: `Checked in successfully for "${event.title}"! ${event.hours} volunteer hours and ${event.hours * 30} points have been credited to your profile.`,
      registration,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Manual attendance update by Coordinator/Admin (also updates student hours/points)
 * @route   PUT /api/attendance/update/:registrationId
 * @access  Private (Coordinator/Admin)
 */
const updateAttendance = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const { attended, hoursApproved, feedback } = req.body;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration record not found' });
    }

    const prevAttended = registration.attended;
    const prevHours = registration.hoursApproved;

    // Apply updates
    registration.attended = attended === undefined ? registration.attended : !!attended;
    registration.hoursApproved = attended ? parseInt(hoursApproved || 0) : 0;
    if (feedback !== undefined) registration.feedback = feedback;

    await registration.save();

    // Update Student aggregates
    const student = await User.findById(registration.studentId);
    if (student) {
      // Remove old points if they were previously checked in
      if (prevAttended) {
        student.hoursLogged = Math.max(0, student.hoursLogged - prevHours);
        student.points = Math.max(0, student.points - prevHours * 30);
      }
      
      // Add new hours/points if checked in now
      if (registration.attended) {
        student.hoursLogged += registration.hoursApproved;
        student.points += registration.hoursApproved * 30;
      }
      await student.save();
    }

    res.status(200).json({
      success: true,
      registration,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get attendance reports for a specific event
 * @route   GET /api/attendance/reports/:eventId
 * @access  Private (Coordinator/Admin)
 */
const attendanceReports = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const registrations = await Registration.find({ eventId, status: 'approved' });
    const checkins = await Attendance.find({ eventId });

    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter((r) => r.attended).length;
    const absentees = totalRegistered - totalAttended;

    res.status(200).json({
      success: true,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
      },
      summary: {
        totalApprovedParticipants: totalRegistered,
        totalAttended,
        totalAbsent: absentees,
        attendancePercentage: totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0,
      },
      participantsList: registrations.map((r) => ({
        registrationId: r._id,
        studentId: r.studentId,
        name: r.studentName,
        email: r.studentEmail,
        department: r.studentDepartment,
        attended: r.attended,
        hoursApproved: r.hoursApproved,
        checkinTime: checkins.find((c) => c.studentId.toString() === r.studentId.toString())?.timestamp || null,
      })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateEventQRCode,
  markAttendanceThroughQR,
  updateAttendance,
  attendanceReports,
};
