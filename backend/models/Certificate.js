const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
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
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    issuedBy: {
      type: String,
      required: true,
    },
    certificateCode: {
      type: String,
      unique: true,
      required: true,
    },
    certificateURL: {
      type: String, // Path to access PDF download
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for id mapping
certificateSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Certificate', certificateSchema);
