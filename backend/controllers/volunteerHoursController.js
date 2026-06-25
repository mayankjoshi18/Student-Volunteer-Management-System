const Registration = require('../models/Registration');
const User = require('../models/User');
const Event = require('../models/Event');

/**
 * @desc    Get volunteer hours analysis for a student
 * @route   GET /api/hours/report/student/:studentId
 * @access  Private
 */
const totalHoursPerStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Check permissions
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const regs = await Registration.find({ studentId });
    const completedRegs = regs.filter((r) => r.attended && r.status === 'approved');

    // Category breakdown logic
    const categoryHours = {
      environment: 0,
      education: 0,
      health: 0,
      community: 0,
      'disaster-relief': 0,
    };
    const categoryCounts = {
      environment: 0,
      education: 0,
      health: 0,
      community: 0,
      'disaster-relief': 0,
    };

    // Find the category of events for completed registrations
    const eventIds = completedRegs.map((r) => r.eventId);
    const events = await Event.find({ _id: { $in: eventIds } });

    completedRegs.forEach((r) => {
      const e = events.find((evt) => evt._id.toString() === r.eventId.toString());
      if (e && categoryHours[e.category] !== undefined) {
        categoryHours[e.category] += r.hoursApproved;
        categoryCounts[e.category] += 1;
      }
    });

    // Monthly breakdown (Group by month of event date)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrendMap = {};

    // Initialize monthly trend with past 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      monthlyTrendMap[mName] = { month: mName, hours: 0, events: 0 };
    }

    completedRegs.forEach((r) => {
      const date = r.eventDate || new Date();
      const mName = monthNames[date.getMonth()];
      if (monthlyTrendMap[mName]) {
        monthlyTrendMap[mName].hours += r.hoursApproved;
        monthlyTrendMap[mName].events += 1;
      }
    });

    const monthlyTrend = Object.values(monthlyTrendMap);

    res.status(200).json({
      success: true,
      analytics: {
        totalHours: completedRegs.reduce((sum, r) => sum + r.hoursApproved, 0),
        totalEvents: completedRegs.length,
        pendingRegistrations: regs.filter((r) => r.status === 'pending').length,
        approvedRegistrations: regs.filter((r) => r.status === 'approved' && !r.attended).length,
        categoryHours,
        categoryCounts,
        monthlyTrend,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Auto calculate and sync aggregate hours and points for a student
 * @route   POST /api/hours/recalculate/:studentId
 * @access  Private (Coordinator/Admin)
 */
const autoCalculateVolunteerHours = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, error: 'Student volunteer not found' });
    }

    // Aggregate approved hours from registrations
    const regs = await Registration.find({
      studentId: student._id,
      status: 'approved',
      attended: true,
    });

    const totalHours = regs.reduce((sum, r) => sum + r.hoursApproved, 0);
    
    // Sync points: 30 points per hour
    student.hoursLogged = totalHours;
    student.points = totalHours * 30;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Volunteer hours auto-recalculated and synced successfully.',
      hoursLogged: student.hoursLogged,
      points: student.points,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  totalHoursPerStudent,
  autoCalculateVolunteerHours,
};
