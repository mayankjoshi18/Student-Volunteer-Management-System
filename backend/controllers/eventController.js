const Event = require('../models/Event');
const { generateEventQR } = require('../services/qrCodeService');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Coordinator/Admin)
 */
const createEvent = async (req, res, next) => {
  try {
    const { title, description, location, date, time, slots, hours, category, image } = req.body;

    const event = new Event({
      title,
      description,
      location,
      date,
      time,
      slots: parseInt(slots || 0),
      hours: parseInt(hours || 0),
      category,
      coordinatorId: req.user._id,
      coordinatorName: req.user.name,
    });

    if (image) event.image = image;

    // Save initially to generate Mongo ObjectId
    await event.save();

    // Generate Base64 QR code and save it
    const qrDataUrl = await generateEventQR(event._id);
    event.qrCode = qrDataUrl;
    await event.save();

    res.status(201).json({
      success: true,
      event,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all events (with search, filter, pagination)
 * @route   GET /api/events
 * @access  Public
 */
const getAllEvents = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by Status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search Query (Regex Title, Description, Location)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    // Pagination values
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: events.length,
      totalEvents,
      currentPage: pageNum,
      totalPages: Math.ceil(totalEvents / limitNum),
      events,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update event details
 * @route   PUT /api/events/:id
 * @access  Private (Coordinator/Admin)
 */
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Verify ownership (Coordinator cannot edit another coordinator's event, Admin can edit anything)
    if (req.user.role === 'coordinator' && event.coordinatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this event' });
    }

    // Update fields
    const allowedUpdates = [
      'title',
      'description',
      'location',
      'date',
      'time',
      'slots',
      'hours',
      'status',
      'category',
      'image',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.status(200).json({
      success: true,
      event,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Coordinator/Admin)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Verify ownership
    if (req.user.role === 'coordinator' && event.coordinatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this event' });
    }

    await Event.deleteOne({ _id: event._id });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
