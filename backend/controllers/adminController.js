const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const SystemConfig = require('../models/SystemConfig');

/**
 * @desc    Get all users in the system
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const manageUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        studentId: u.usn,
        hoursLogged: u.hoursLogged,
        points: u.points,
        avatar: u.avatar,
        bio: u.bio,
        joinDate: u.joinDate.toISOString().split('T')[0],
      })),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Change role of a user
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!role || !['student', 'coordinator', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid user role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin/Coordinator)
 */
const dashboardAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCoordinators = await User.countDocuments({ role: 'coordinator' });
    const totalEvents = await Event.countDocuments();
    
    // Sum hoursLogged from all students
    const users = await User.find({ role: 'student' });
    const totalHoursLogged = users.reduce((sum, u) => sum + (u.hoursLogged || 0), 0);

    // Hourly trend (seeded/simulated for chart)
    const hourlyTrend = [
      { week: 'Wk 1', hours: Math.round(totalHoursLogged * 0.1) || 15 },
      { week: 'Wk 2', hours: Math.round(totalHoursLogged * 0.2) || 28 },
      { week: 'Wk 3', hours: Math.round(totalHoursLogged * 0.4) || 45 },
      { week: 'Wk 4', hours: Math.round(totalHoursLogged * 0.5) || 52 },
      { week: 'Wk 5', hours: Math.round(totalHoursLogged * 0.8) || 88 },
      { week: 'Wk 6', hours: totalHoursLogged || 115 },
    ];

    // Compute department stats
    const deptMap = {};
    users.forEach((u) => {
      const dept = u.department || 'General Science';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, hours: 0, students: 0 };
      }
      deptMap[dept].hours += u.hoursLogged;
      deptMap[dept].students += 1;
    });

    const deptStats = Object.values(deptMap);

    res.status(200).json({
      success: true,
      totalStudents,
      totalCoordinators,
      totalEvents,
      totalHoursLogged,
      hourlyTrend,
      deptStats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get global system configuration
 * @route   GET /api/admin/config
 * @access  Private
 */
const getSystemConfig = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }
    res.status(200).json({ success: true, config });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update global system configuration
 * @route   PUT /api/admin/config
 * @access  Private (Admin)
 */
const updateSystemConfig = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }

    const { universityName, allowSelfRegistration, autoApproveHours, maxEventsPerStudent, academicYear, maintenanceMode } = req.body;

    if (universityName !== undefined) config.universityName = universityName;
    if (allowSelfRegistration !== undefined) config.allowSelfRegistration = allowSelfRegistration;
    if (autoApproveHours !== undefined) config.autoApproveHours = autoApproveHours;
    if (maxEventsPerStudent !== undefined) config.maxEventsPerStudent = parseInt(maxEventsPerStudent);
    if (academicYear !== undefined) config.academicYear = academicYear;
    if (maintenanceMode !== undefined) config.maintenanceMode = maintenanceMode;

    await config.save();

    res.status(200).json({ success: true, config });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset and re-seed the system database
 * @route   POST /api/admin/reset-db
 * @access  Private (Admin)
 */
const resetDatabase = async (req, res, next) => {
  try {
    const { exec } = require('child_process');
    const path = require('path');
    const seedScript = path.join(__dirname, '..', 'scripts', 'seed.js');
    
    console.log(`Admin requested database reset. Running seed script: node "${seedScript}"`);
    
    exec(`node "${seedScript}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Database reset execution error: ${error.message}`);
        return res.status(500).json({ success: false, error: 'Database reset execution failed.' });
      }
      console.log(`Database reset stdout: ${stdout}`);
      res.status(200).json({ success: true, message: 'Database has been successfully reset and seeded.' });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  manageUsers,
  updateUserRole,
  deleteUser,
  dashboardAnalytics,
  getSystemConfig,
  updateSystemConfig,
  resetDatabase,
};
