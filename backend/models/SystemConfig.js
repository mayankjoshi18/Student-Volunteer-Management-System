const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema(
  {
    universityName: {
      type: String,
      default: 'Apex State University',
    },
    allowSelfRegistration: {
      type: Boolean,
      default: true,
    },
    autoApproveHours: {
      type: Boolean,
      default: false,
    },
    maxEventsPerStudent: {
      type: Number,
      default: 5,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for id mapping
systemConfigSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
