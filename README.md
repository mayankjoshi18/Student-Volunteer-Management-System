# Apex State Student Volunteer Management System (VolaLink)

A comprehensive, full-stack platform designed to bridge the gap between students seeking to log social impacts and university coordinators organizing community events. VolaLink centralizes event registration, attendance tracking, hour logging, and certificate generation into a single, seamless digital registry.

---

## 🌟 Key Features

VolaLink is built around a secure **Role-Based Access Control (RBAC)** architecture, providing tailored experiences for three distinct user types:

### 🎓 For Students
*   **Event Discovery:** Browse and filter upcoming volunteer opportunities on campus.
*   **One-Click Registration:** Seamlessly register for events and manage RSVPs.
*   **Digital Attendance:** Check into events via dynamically generated QR codes.
*   **Hours Tracking:** Automatically log and visualize total volunteer hours over time.
*   **Verifiable Certificates:** Download digitally generated PDF certificates for completed events.

### 📅 For Event Coordinators
*   **Event Management:** Create, update, and manage volunteering events and capacities.
*   **Roster Control:** Oversee student registrations and manually approve/reject attendees.
*   **Attendance Verification:** Monitor check-ins and validate student participation.
*   **Automated Issuance:** Trigger the bulk generation of PDF certificates upon event completion.
*   **Reporting:** Export attendance sheets and event analytics.

### 🛡️ For Administrators
*   **System Overview:** High-level analytics dashboard tracking global volunteer hours and platform engagement.
*   **User Management:** Centralized control over all student and coordinator accounts.
*   **Platform Settings:** Toggle global settings (e.g., enable/disable self-registration).

---

## 🛠️ Technology Stack

This project is structured as a modern **Monorepo**, separating concerns cleanly between the client and server while maintaining a unified developer experience.

### Frontend (`/frontend`)
*   **Core:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS v4
*   **State Management:** React Context API + Custom Hooks
*   **Routing:** React Router DOM v7
*   **Data Fetching:** Axios
*   **UI/UX:** Framer Motion (animations), Lucide React (icons), Recharts (data visualization), React Hook Form (validation)

### Backend (`/backend`)
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB via Mongoose ODM
*   **Authentication:** Stateless JWT (JSON Web Tokens) with Bcrypt password hashing
*   **Security:** Helmet (HTTP headers), Express Rate Limit, CORS
*   **Utility Integrations:** 
    *   `nodemailer`: Automated transactional emails (registration, password resets).
    *   `pdfkit`: Dynamic, server-side PDF certificate generation.
    *   `qrcode`: Real-time QR code generation for event attendance.
    *   `multer`: Multipart/form-data handling for file uploads.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js (v18+ recommended)
*   A MongoDB Atlas Database Cluster (or local MongoDB instance)

### 1. Installation
Because the project operates as a monorepo, a root management script has been provided to install dependencies across the entire workspace.
From the root directory, run:
```bash
npm run install:all
```

### 2. Environment Configuration
You must provide the backend with your database credentials. 
1. Navigate to the backend directory: `cd backend`
2. Create a `.env` file: `touch .env`
3. Copy the variables from the example file and fill in your actual credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/student_volunteer
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Email Configurations (For Nodemailer)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password

FRONTEND_URL=http://localhost:3000
```
*(Note: Ensure your current IP address is whitelisted in your MongoDB Atlas Network Access settings!)*

### 3. Running the Application
Return to the **root directory** of the project. You can boot both the React frontend and the Express backend simultaneously using a single command:
```bash
npm run dev
```

The application will be available at:
*   **Frontend:** `http://localhost:3000`
*   **Backend API:** `http://localhost:5000/api`
