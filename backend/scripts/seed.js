require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');
const SystemConfig = require('../models/SystemConfig');

// Pre-defined ObjectIds for consistent relations
const userIdMap = {
  alex: '660000000000000000000001',
  sarah: '660000000000000000000002',
  arthur: '660000000000000000000003',
  liam: '660000000000000000000004',
  maya: '660000000000000000000005',
  sofia: '660000000000000000000006',
  david: '660000000000000000000007',
};

const eventIdMap = {
  greenDrive: '770000000000000000000001',
  techMentorship: '770000000000000000000002',
  foodBank: '770000000000000000000003',
  redCross: '770000000000000000000004',
  flashFlood: '770000000000000000000005',
  charityGala: '770000000000000000000006',
};

const mockUsers = [
  {
    _id: userIdMap.alex,
    name: 'Alex Mercer',
    email: 'alex.mercer@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science',
    usn: 'CS-2024-0042',
    hoursLogged: 15,
    points: 450,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    bio: 'Passionate about coding for good, green initiatives, and tutoring youth.',
    joinDate: new Date('2025-09-10'),
  },
  {
    _id: userIdMap.sarah,
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    password: 'password123',
    role: 'coordinator',
    department: 'Student Affairs',
    hoursLogged: 0,
    points: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    bio: 'Coordinator of Community Engagement and Social Outreach Programs.',
    joinDate: new Date('2024-01-15'),
  },
  {
    _id: userIdMap.arthur,
    name: 'Dean Arthur Harrison',
    email: 'arthur.harrison@university.edu',
    password: 'password123',
    role: 'admin',
    department: 'University Administration',
    hoursLogged: 0,
    points: 0,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    bio: 'Chief Administrator managing all campus volunteer activities and operations.',
    joinDate: new Date('2023-08-01'),
  },
  {
    _id: userIdMap.liam,
    name: 'Liam Vance',
    email: 'liam.vance@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Mechanical Engineering',
    usn: 'ME-2023-0112',
    hoursLogged: 32,
    points: 960,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    bio: 'Builder by day, volunteer coordinator helper by night.',
    joinDate: new Date('2024-09-01'),
  },
  {
    _id: userIdMap.maya,
    name: 'Maya Lin',
    email: 'maya.lin@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Environmental Science',
    usn: 'ES-2024-0015',
    hoursLogged: 28,
    points: 840,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    bio: 'Dedicated to climate action, forestation, and recycling programs.',
    joinDate: new Date('2025-02-14'),
  },
  {
    _id: userIdMap.sofia,
    name: 'Sofia Rodriguez',
    email: 'sofia.r@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Nursing & Health',
    usn: 'NH-2025-0089',
    hoursLogged: 22,
    points: 660,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    bio: 'Health awareness advocate and Red Cross partner.',
    joinDate: new Date('2025-03-20'),
  },
  {
    _id: userIdMap.david,
    name: 'David Kim',
    email: 'david.kim@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Business Administration',
    usn: 'BA-2024-0301',
    hoursLogged: 12,
    points: 360,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    bio: 'Organizer, fundraiser, and community bridge builder.',
    joinDate: new Date('2025-01-10'),
  },
];

const mockEvents = [
  {
    _id: eventIdMap.greenDrive,
    title: 'Campus Green Clean-up Drive',
    description: 'Join the university green club to plant saplings, clean up plastic trash, and establish new recycling bins around the central campus. Snacks and volunteer certificates provided.',
    date: new Date('2026-05-12'),
    time: '09:00 AM - 12:00 PM',
    location: 'Main Quadrangle, Campus Green',
    coordinatorId: userIdMap.sarah,
    coordinatorName: 'Dr. Sarah Jenkins',
    slots: 50,
    registeredCount: 42,
    hours: 3,
    category: 'environment',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: eventIdMap.techMentorship,
    title: 'Tech Mentorship for Local High School',
    description: 'Mentor local underrepresented high school students in basic web development (HTML, CSS, JS) and guide them through building their first personal website projects.',
    date: new Date('2026-06-15'),
    time: '02:00 PM - 05:00 PM',
    location: 'Computer Science Lab 3',
    coordinatorId: userIdMap.sarah,
    coordinatorName: 'Dr. Sarah Jenkins',
    slots: 15,
    registeredCount: 12,
    hours: 10,
    category: 'education',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: eventIdMap.foodBank,
    title: 'Community Food Bank Drive',
    description: 'Assist the municipal food bank in sorting donations, packing family food boxes, and coordinating loading docks for distributions to local families in need.',
    date: new Date('2026-07-04'),
    time: '10:00 AM - 02:00 PM',
    location: 'Community Center Warehouse',
    coordinatorId: userIdMap.sarah,
    coordinatorName: 'Dr. Sarah Jenkins',
    slots: 30,
    registeredCount: 18,
    hours: 4,
    category: 'community',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: eventIdMap.redCross,
    title: 'Red Cross Blood Donation Camp',
    description: 'Support the Red Cross blood donation camp on campus. Volunteers will assist with registration, distributing refreshments, guiding donors, and managing lines.',
    date: new Date('2026-07-10'),
    time: '08:00 AM - 04:00 PM',
    location: 'Student Union Ballroom',
    coordinatorId: userIdMap.sarah,
    coordinatorName: 'Dr. Sarah Jenkins',
    slots: 100,
    registeredCount: 74,
    hours: 2,
    category: 'health',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1536856492749-0e1d17a3eeec?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: eventIdMap.flashFlood,
    title: 'Flash Flood Disaster Response Planning',
    description: 'An interactive crisis response planning and simulation exercise in partnership with the local disaster management cell. Learn emergency first-response coordination.',
    date: new Date('2026-07-28'),
    time: '01:00 PM - 07:00 PM',
    location: 'Engineering Seminar Hall',
    coordinatorId: userIdMap.sarah,
    coordinatorName: 'Dr. Sarah Jenkins',
    slots: 25,
    registeredCount: 8,
    hours: 6,
    category: 'disaster-relief',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: eventIdMap.charityGala,
    title: 'Annual Charity Gala Organizing Team',
    description: 'Assist student administration and student union in organizing the annual charity gala event, setting up sound systems, tables, checking guest tickets, and raising donations.',
    date: new Date('2026-05-01'),
    time: '04:00 PM - 12:00 AM',
    location: 'Grand University Hall',
    coordinatorId: userIdMap.sarah,
    coordinatorName: 'Dr. Sarah Jenkins',
    slots: 20,
    registeredCount: 20,
    hours: 8,
    category: 'community',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
  },
];

const mockRegistrations = [
  // Alex Mercer (stu-01) registrations
  {
    studentId: userIdMap.alex,
    studentName: 'Alex Mercer',
    studentEmail: 'alex.mercer@university.edu',
    studentDepartment: 'Computer Science',
    eventId: eventIdMap.greenDrive,
    eventTitle: 'Campus Green Clean-up Drive',
    eventDate: new Date('2026-05-12'),
    status: 'approved',
    registeredAt: new Date('2026-05-05T10:30:00Z'),
    attended: true,
    hoursApproved: 3,
    feedback: 'Fantastic event! Very well organized and impactful.',
  },
  {
    studentId: userIdMap.alex,
    studentName: 'Alex Mercer',
    studentEmail: 'alex.mercer@university.edu',
    studentDepartment: 'Computer Science',
    eventId: eventIdMap.charityGala,
    eventTitle: 'Annual Charity Gala Organizing Team',
    eventDate: new Date('2026-05-01'),
    status: 'approved',
    registeredAt: new Date('2026-04-20T14:15:00Z'),
    attended: true,
    hoursApproved: 8,
    feedback: 'Extremely fun experience, loved working the registration booth!',
  },
  {
    studentId: userIdMap.alex,
    studentName: 'Alex Mercer',
    studentEmail: 'alex.mercer@university.edu',
    studentDepartment: 'Computer Science',
    eventId: eventIdMap.techMentorship,
    eventTitle: 'Tech Mentorship for Local High School',
    eventDate: new Date('2026-06-15'),
    status: 'approved',
    registeredAt: new Date('2026-06-01T09:00:00Z'),
    attended: true,
    hoursApproved: 4, // 4 hours logged so far
    feedback: 'Mentored 2 students on React, they were amazing!',
  },
  {
    studentId: userIdMap.alex,
    studentName: 'Alex Mercer',
    studentEmail: 'alex.mercer@university.edu',
    studentDepartment: 'Computer Science',
    eventId: eventIdMap.foodBank,
    eventTitle: 'Community Food Bank Drive',
    eventDate: new Date('2026-07-04'),
    status: 'pending',
    registeredAt: new Date('2026-06-20T11:45:00Z'),
    attended: false,
    hoursApproved: 0,
  },
  // Other students' registrations
  {
    studentId: userIdMap.liam,
    studentName: 'Liam Vance',
    studentEmail: 'liam.vance@university.edu',
    studentDepartment: 'Mechanical Engineering',
    eventId: eventIdMap.techMentorship,
    eventTitle: 'Tech Mentorship for Local High School',
    eventDate: new Date('2026-06-15'),
    status: 'approved',
    registeredAt: new Date('2026-06-02T10:15:00Z'),
    attended: true,
    hoursApproved: 10,
  },
  {
    studentId: userIdMap.maya,
    studentName: 'Maya Lin',
    studentEmail: 'maya.lin@university.edu',
    studentDepartment: 'Environmental Science',
    eventId: eventIdMap.foodBank,
    eventTitle: 'Community Food Bank Drive',
    eventDate: new Date('2026-07-04'),
    status: 'approved',
    registeredAt: new Date('2026-06-21T08:30:00Z'),
    attended: false,
    hoursApproved: 0,
  },
  {
    studentId: userIdMap.sofia,
    studentName: 'Sofia Rodriguez',
    studentEmail: 'sofia.r@university.edu',
    studentDepartment: 'Nursing & Health',
    eventId: eventIdMap.foodBank,
    eventTitle: 'Community Food Bank Drive',
    eventDate: new Date('2026-07-04'),
    status: 'approved',
    registeredAt: new Date('2026-06-21T15:20:00Z'),
    attended: false,
    hoursApproved: 0,
  },
];

const mockCertificates = [
  {
    studentId: userIdMap.alex,
    studentName: 'Alex Mercer',
    eventId: eventIdMap.greenDrive,
    eventTitle: 'Campus Green Clean-up Drive',
    issuedAt: new Date('2026-05-15'),
    issuedBy: 'Dr. Sarah Jenkins',
    certificateCode: 'CERT-VMS-EV770000000000000000000001-7481',
    certificateURL: '/uploads/certificates/cert-CERT-VMS-EV770000000000000000000001-7481.pdf',
  },
  {
    studentId: userIdMap.alex,
    studentName: 'Alex Mercer',
    eventId: eventIdMap.charityGala,
    eventTitle: 'Annual Charity Gala Organizing Team',
    issuedAt: new Date('2026-05-05'),
    issuedBy: 'Dr. Sarah Jenkins',
    certificateCode: 'CERT-VMS-EV770000000000000000000006-9125',
    certificateURL: '/uploads/certificates/cert-CERT-VMS-EV770000000000000000000006-9125.pdf',
  },
];

const mockConfig = {
  universityName: 'Apex State University',
  allowSelfRegistration: true,
  autoApproveHours: false,
  maxEventsPerStudent: 5,
  academicYear: '2025-2026',
  maintenanceMode: false,
};

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.error('Error: MONGODB_URI not defined.');
      process.exit(1);
    }

    await mongoose.connect(connStr);
    console.log('Connected to database to seed...');

    // Clear existing collections
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    await Certificate.deleteMany();
    await SystemConfig.deleteMany();
    console.log('Cleared existing collections.');

    // Seed config
    await SystemConfig.create(mockConfig);
    console.log('System configuration seeded.');

    // Seed users (pre-save hook will encrypt passwords)
    for (const u of mockUsers) {
      await User.create(u);
    }
    console.log(`Seeded ${mockUsers.length} users.`);

    // Seed events (and generate mock QR codes)
    const { generateEventQR } = require('../services/qrCodeService');
    for (const e of mockEvents) {
      const qrData = await generateEventQR(e._id);
      e.qrCode = qrData;
      await Event.create(e);
    }
    console.log(`Seeded ${mockEvents.length} events (and pre-generated QR codes).`);

    // Seed registrations
    await Registration.insertMany(mockRegistrations);
    console.log(`Seeded ${mockRegistrations.length} registrations.`);

    // Seed certificates
    await Certificate.insertMany(mockCertificates);
    console.log(`Seeded ${mockCertificates.length} certificates.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
