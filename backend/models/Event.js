const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time slot is required'], // e.g. "09:00 AM - 12:00 PM"
    },
    slots: {
      type: Number,
      required: [true, 'Number of slots is required'], // maxParticipants
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    hours: {
      type: Number,
      required: [true, 'Volunteer hours credit is required'], // volunteerHours
    },
    coordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coordinatorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    category: {
      type: String,
      enum: ['education', 'environment', 'health', 'community', 'disaster-relief'],
      required: [true, 'Event category is required'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
    },
    qrCode: {
      type: String, // Base64 representation of QR Code image
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to map Event MongoDB structure directly to frontend's expected properties
eventSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Event', eventSchema);
