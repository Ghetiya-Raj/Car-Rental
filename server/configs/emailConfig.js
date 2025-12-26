import axios from 'axios';

// Brevo (Sendinblue) settings from env
const BREVO_API_URL = process.env.BREVO_API_URL || 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Function to send OTP via Brevo
export const sendOtpEmail = async (email, otp, isPasswordReset = false) => {
  try {
    const subject = isPasswordReset ? 'Password Reset OT' : 'Email Verification OTP';
    const text = isPasswordReset
      ? `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`
      : `Your OTP for email verification is: ${otp}. This OTP will expire in 5 minutes.`;

    // Brevo expects an array `to` and sender object. Adjust sender email/name if you want.
    const payload = {
      sender: { email: process.env.EMAIL_USER || 'no-reply@yourdomain.com', name: 'Car Rental' },
      to: [{ email }],
      subject,
      textContent: text,
      htmlContent: `<p>${text}</p>`
    };

    const resp = await axios.post(BREVO_API_URL, payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return { success: true, messageId: resp.data.messageId || resp.data['messageId'] || null };
  } catch (error) {
    console.error('Error sending via Brevo:', error.response?.data || error.message);
    return { success: false, error: (error.response?.data?.message || error.message) };
  }
};

// Function to generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default { sendOtpEmail, generateOTP };