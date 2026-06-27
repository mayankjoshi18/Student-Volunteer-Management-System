const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentDepartment: {
      type: String,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    hoursApproved: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for id mapping
registrationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Registration', registrationSchema);
