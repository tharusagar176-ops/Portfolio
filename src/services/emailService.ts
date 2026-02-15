// Email Service - Simulates sending OTP emails
// In production, this would connect to a backend API that sends real emails

interface EmailResponse {
  success: boolean;
  message: string;
  otp?: string; // Only for demo purposes
}

// Authorized email address for OTP (configured by admin)
const AUTHORIZED_EMAIL = 'suryadangoriya@gmail.com';

// Simulated email service
export class EmailService {
  private static otpStore: Map<string, { otp: string; expires: number }> = new Map();

  /**
   * Generate a 6-digit OTP
   */
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to email (simulated)
   * In production, this would call a backend API
   */
  static async sendOTP(email: string): Promise<EmailResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();
    const authorizedEmail = AUTHORIZED_EMAIL.toLowerCase();

    // Debug logging
    console.log('🔍 Email Validation:');
    console.log('Checking authorization...');
    console.log('Status:', normalizedEmail === authorizedEmail ? '✅ Authorized' : '❌ Not Authorized');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return {
        success: false,
        message: 'Invalid email format',
      };
    }

    // Check if email is authorized
    if (normalizedEmail !== authorizedEmail) {
      return {
        success: false,
        message: 'This email is not authorized for admin access',
      };
    }

    // Generate OTP
    const otp = this.generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP (in production, this would be stored in backend)
    this.otpStore.set(normalizedEmail, { otp, expires });

    // Simulate email sending
    console.log(`📧 OTP Email Sent`);
    console.log(`🔐 OTP Code: ${otp}`);
    console.log(`⏰ Expires in 5 minutes`);

    return {
      success: true,
      message: `OTP sent successfully`,
      otp, // Only for demo - remove in production
    };
  }

  /**
   * Verify OTP
   */
  static verifyOTP(email: string, otp: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const stored = this.otpStore.get(normalizedEmail);

    if (!stored) {
      return false;
    }

    // Check if OTP expired
    if (Date.now() > stored.expires) {
      this.otpStore.delete(normalizedEmail);
      return false;
    }

    // Verify OTP
    if (stored.otp === otp) {
      this.otpStore.delete(normalizedEmail);
      return true;
    }

    return false;
  }

  /**
   * Send password reset email (simulated)
   */
  static async sendPasswordResetEmail(email: string): Promise<EmailResponse> {
    return this.sendOTP(email);
  }

  /**
   * Clear expired OTPs
   */
  static clearExpiredOTPs(): void {
    const now = Date.now();
    for (const [email, data] of this.otpStore.entries()) {
      if (now > data.expires) {
        this.otpStore.delete(email);
      }
    }
  }
}

// Clear expired OTPs every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    EmailService.clearExpiredOTPs();
  }, 60000);
}
