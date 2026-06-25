const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    usn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows null/empty for admins and coordinators
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'coordinator', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      trim: true,
    },
    hoursLogged: {
      type: Number,
      default: 0, // totalVolunteerHours
    },
    points: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(this.name || this.email)}`;
      },
    },
    bio: {
      type: String,
      default: 'New member of the volunteer network!',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for studentId to align with frontend type properties
userSchema.virtual('studentId').get(function () {
  return this.usn;
}).set(function (value) {
  this.usn = value;
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
