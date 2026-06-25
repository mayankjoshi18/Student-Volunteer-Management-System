const User = require('../models/User');
const Registration = require('../models/Registration');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.usn,
        hoursLogged: user.hoursLogged,
        points: user.points,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate.toISOString().split('T')[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, department, studentId, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (department) user.department = department;
    if (studentId !== undefined) user.usn = studentId; // Map to USN
    if (bio !== undefined) user.bio = bio;

    // Handle avatar image if uploaded via Multer
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.usn,
        hoursLogged: user.hoursLogged,
        points: user.points,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate.toISOString().split('T')[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please enter current and new password' });
    }

    const user = await User.findById(req.user._id);

    // Verify current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get detailed volunteer hours logs for students
 * @route   GET /api/users/hours
 * @access  Private (Student)
 */
const viewVolunteerHours = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      studentId: req.user._id,
      status: 'approved',
      attended: true,
    }).sort({ eventDate: -1 });

    const logs = registrations.map((r) => ({
      id: r._id,
      eventId: r.eventId,
      eventTitle: r.eventTitle,
      eventDate: r.eventDate.toISOString().split('T')[0],
      hoursApproved: r.hoursApproved,
      feedback: r.feedback,
    }));

    res.status(200).json({
      success: true,
      totalHours: req.user.hoursLogged,
      totalPoints: req.user.points,
      logs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  viewVolunteerHours,
};
