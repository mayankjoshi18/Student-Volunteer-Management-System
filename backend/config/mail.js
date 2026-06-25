const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST || 'smtp.ethereal.email';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // If no user or pass is provided, create a test account on ethereal.email dynamically
  if (!user || !pass) {
    try {
      console.log('Generating dynamic Ethereal Mail credentials for testing...');
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log(`Ethereal SMTP test account created!`);
      console.log(`Username: ${testAccount.user}`);
      console.log(`Password: ${testAccount.pass}`);
      return transporter;
    } catch (err) {
      console.error('Failed to create Ethereal Mail test account:', err.message);
      // Create a dummy stream transport fallback so application doesn't crash on email calls
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
      return transporter;
    }
  }

  // Use configured SMTP credentials
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

module.exports = { getTransporter };
