const QRCode = require('qrcode');

/**
 * Generate a QR code for an event check-in
 * @param {string} eventId 
 * @returns {Promise<string>} Base64 Data URL of the QR code image
 */
const generateEventQR = async (eventId) => {
  try {
    // Generate QR code representing the check-in data (the eventId itself or structured check-in data)
    const checkinData = JSON.stringify({
      eventId: eventId.toString(),
      type: 'vms-attendance-checkin',
    });
    
    const qrDataUrl = await QRCode.toDataURL(checkinData);
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR Code:', err.message);
    throw new Error('Failed to generate event QR Code.');
  }
};

module.exports = {
  generateEventQR,
};
