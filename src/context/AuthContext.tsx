import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { EmailService } from '@/services/emailService';

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (password: string) => boolean;
  loginWithOTP: (email: string, otp: string) => boolean;
  sendOTP: (email: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const AUTH_STORAGE_KEY = 'portfolio_admin_auth';
const PASSWORD_STORAGE_KEY = 'portfolio_admin_password';
const EMAIL_STORAGE_KEY = 'portfolio_admin_email';

// Default admin credentials
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_EMAIL = 'suryadangoriya@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(EMAIL_STORAGE_KEY) || DEFAULT_EMAIL;
    }
    return DEFAULT_EMAIL;
  });

  // Get stored password or use default
  const getStoredPassword = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;
    }
    return DEFAULT_PASSWORD;
  };

  // Regular password login
  const login = (password: string): boolean => {
    const storedPassword = getStoredPassword();
    if (password === storedPassword) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      toast.success('Welcome to Admin Panel');
      return true;
    }
    toast.error('Invalid password');
    return false;
  };

  // Send OTP to email
  const sendOTP = async (email: string) => {
    try {
      const result = await EmailService.sendOTP(email);
      if (result.success) {
        toast.success(result.message);
        // Show OTP in toast for demo purposes
        if (result.otp) {
          setTimeout(() => {
            toast.info(`Demo OTP: ${result.otp}`, {
              duration: 10000,
              description: 'Check console for OTP (demo mode)',
            });
          }, 500);
        }
      } else {
        toast.error(result.message);
      }
      return result;
    } catch (error) {
      toast.error('Failed to send OTP');
      return { success: false, message: 'Failed to send OTP' };
    }
  };

  // Login with OTP
  const loginWithOTP = (email: string, otp: string): boolean => {
    const isValid = EmailService.verifyOTP(email, otp);
    if (isValid) {
      setIsAuthenticated(true);
      setAdminEmail(email);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
      toast.success('Logged in successfully with OTP');
      return true;
    }
    toast.error('Invalid or expired OTP');
    return false;
  };

  // Reset password with OTP
  const resetPassword = (email: string, otp: string, newPassword: string): boolean => {
    const isValid = EmailService.verifyOTP(email, otp);
    if (isValid) {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
      setAdminEmail(email);
      toast.success('Password reset successfully');
      return true;
    }
    toast.error('Invalid or expired OTP');
    return false;
  };

  // Change password (requires current password)
  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    const storedPassword = getStoredPassword();
    if (currentPassword === storedPassword) {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
      toast.success('Password changed successfully');
      return true;
    }
    toast.error('Current password is incorrect');
    return false;
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        adminEmail,
        login, 
        loginWithOTP,
        sendOTP,
        resetPassword,
        changePassword,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
