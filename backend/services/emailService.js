const nodemailer = require('nodemailer');
const { getTransporter } = require('../config/mail');

/**
 * Helper to log and display Ethereal email preview link
 */
const logEmailPreview = (info) => {
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`----------------------------------------`);
    console.log(`✉️ Email Sent Successfully!`);
    console.log(`🔗 Preview Sent Email: ${previewUrl}`);
    console.log(`----------------------------------------`);
  }
};

/**
 * Send welcome email to a new user
 * @param {Object} user 
 */
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: '"Apex State VolaLink" <no-reply@university.edu>',
      to: user.email,
      subject: 'Welcome to VolaLink - Apex State Volunteer Network!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #1e3a8a; text-align: center;">Welcome to VolaLink!</h2>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin-bottom: 20px;" />
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for registering on VolaLink, the official Student Volunteer Management Registry at Apex State University.</p>
          <p>Your account is registered under the role: <span style="text-transform: uppercase; font-weight: bold; color: #1e3a8a;">${user.role}</span>.</p>
          <p>With VolaLink, you can:</p>
          <ul>
            ${
              user.role === 'student'
                ? `
              <li>Browse and register for community welfare events.</li>
              <li>Log volunteer service hours and accumulate reward points.</li>
              <li>Download officially signed, cryptographically numbered digital certificates.</li>
              `
                : `
              <li>Create and manage student volunteer events.</li>
              <li>Review and approve student registrations and hours.</li>
              <li>Issue digital certificates for community service.</li>
              `
            }
          </ul>
          <p>If you registered with our default presets, you can login anytime using your institutional email and the password <strong>password123</strong>.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Your Space</a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
            This email was automatically generated. Please do not reply directly.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logEmailPreview(info);
    return true;
  } catch (err) {
    console.error('Error sending welcome email:', err.message);
    return false;
  }
};

/**
 * Send registration confirmation email
 * @param {Object} user 
 * @param {Object} event 
 */
const sendRegistrationConfirmation = async (user, event) => {
  try {
    const transporter = await getTransporter();
    const eventDateStr = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: '"Apex State VolaLink" <no-reply@university.edu>',
      to: user.email,
      subject: `Registration Received: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #1e3a8a; text-align: center;">Registration Confirmation</h2>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin-bottom: 20px;" />
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We have successfully received your application to volunteer for the following event:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #1e293b;">${event.title}</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${eventDateStr}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${event.time}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Location:</strong> ${event.location}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Hours Credit:</strong> ${event.hours} Hours</p>
          </div>

          <p>Your registration status is currently <strong>PENDING</strong>. The event coordinator (<strong style="color: #1e293b;">${event.coordinatorName}</strong>) will review your application shortly.</p>
          <p>You will receive a notification as soon as your registration is approved.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/registered" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View My Applications</a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
            Apex State Student Volunteer Management.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logEmailPreview(info);
    return true;
  } catch (err) {
    console.error('Error sending registration email:', err.message);
    return false;
  }
};

/**
 * Send event reminder email
 * @param {Object} user 
 * @param {Object} event 
 */
const sendEventReminder = async (user, event) => {
  try {
    const transporter = await getTransporter();
    const eventDateStr = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: '"Apex State VolaLink" <no-reply@university.edu>',
      to: user.email,
      subject: `Reminder: Upcoming Volunteer Event - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #d97706; text-align: center;">Upcoming Event Reminder</h2>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin-bottom: 20px;" />
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>This is a reminder that you are scheduled to volunteer for the upcoming event:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #1e3a8a; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #1e293b;">${event.title}</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${eventDateStr}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${event.time}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Location:</strong> ${event.location}</p>
          </div>

          <p>Please arrive 10 minutes early. Once you are at the location, locate the event coordinator (<strong>${event.coordinatorName}</strong>) to scan the event check-in QR code and log your hours.</p>
          <p>If you can no longer attend, please cancel your registration in the portal so other volunteers can take the slot.</p>
          <p>Thank you for your service!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logEmailPreview(info);
    return true;
  } catch (err) {
    console.error('Error sending reminder email:', err.message);
    return false;
  }
};

/**
 * Send certificate notification email
 * @param {Object} user 
 * @param {Object} event 
 * @param {string} certificateCode 
 * @param {string} downloadUrl 
 */
const sendCertificateNotification = async (user, event, certificateCode, downloadUrl) => {
  try {
    const transporter = await getTransporter();
    const fullDownloadUrl = `${process.env.BASE_URL || 'http://localhost:5000'}${downloadUrl}`;

    const mailOptions = {
      from: '"Apex State VolaLink" <no-reply@university.edu>',
      to: user.email,
      subject: `Congratulations! Your Certificate is Ready - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #10b981; text-align: center;">Certificate Issued!</h2>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin-bottom: 20px;" />
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Congratulations! The coordinator has approved your volunteer service for the event <strong>"${event.title}"</strong>.</p>
          <p>Your digital certificate of appreciation has been generated and signed.</p>
          
          <div style="background-color: #f0fdf4; padding: 15px; border: 1px solid #bbf7d0; margin: 20px 0; border-radius: 6px; text-align: center;">
            <p style="margin: 5px 0; font-size: 14px; color: #166534;"><strong>Certificate Code:</strong> ${certificateCode}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #166534;"><strong>Hours Credited:</strong> ${event.hours} Hours</p>
          </div>

          <p>You can download the PDF certificate directly using the button below, or view it on your student profile page under the "Certificates" tab.</p>
          
          <div style="text-align: center; margin-top: 30px; margin-bottom: 25px;">
            <a href="${fullDownloadUrl}" download style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Download Certificate PDF</a>
          </div>
          
          <p>Thank you for your valuable contribution to the community!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logEmailPreview(info);
    return true;
  } catch (err) {
    console.error('Error sending certificate notification email:', err.message);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendRegistrationConfirmation,
  sendEventReminder,
  sendCertificateNotification,
};
