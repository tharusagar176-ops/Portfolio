import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Lock, Eye, EyeOff, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LoginMode = 'password' | 'otp' | 'forgot';

export function Login() {
  const navigate = useNavigate();
  const { login, loginWithOTP, sendOTP, resetPassword } = useAuth();
  
  // Password login state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP login state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // General state
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<LoginMode>('password');

  // Handle password login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(password);
      setIsLoading(false);
      if (success) {
        navigate('/admin');
      }
    }, 500);
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    if (!email) {
      return;
    }
    
    setOtpLoading(true);
    const result = await sendOTP(email);
    setOtpLoading(false);
    
    if (result.success) {
      setOtpSent(true);
    }
  };

  // Handle OTP login
  const handleOTPLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = loginWithOTP(email, otp);
      setIsLoading(false);
      if (success) {
        navigate('/admin');
      }
    }, 500);
  };

  // Handle send forgot password OTP
  const handleSendForgotOTP = async () => {
    if (!forgotEmail) {
      return;
    }
    
    setOtpLoading(true);
    const result = await sendOTP(forgotEmail);
    setOtpLoading(false);
    
    if (result.success) {
      setForgotOtpSent(true);
    }
  };

  // Handle reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    if (newPassword.length < 6) {
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const success = resetPassword(forgotEmail, forgotOtp, newPassword);
      setIsLoading(false);
      if (success) {
        // Reset form and switch to password login
        setForgotEmail('');
        setForgotOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setForgotOtpSent(false);
        setMode('password');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.5) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 backdrop-blur-sm relative z-10 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              {mode === 'forgot' ? 'Reset Password' : 'Admin Panel'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-400">
              {mode === 'forgot' ? 'Reset your admin password' : 'Portfolio Management System'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {mode === 'forgot' ? (
            // Forgot Password Form
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setMode('password');
                  setForgotOtpSent(false);
                }}
                className="mb-4 text-gray-600 dark:text-slate-400"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Button>

              {!forgotOtpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-600 dark:text-slate-500">
                      Enter your authorized email address
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSendForgotOTP}
                    disabled={otpLoading || !forgotEmail}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="forgot-otp" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      OTP Code
                    </Label>
                    <Input
                      id="forgot-otp"
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-600 dark:text-slate-500">
                      Check console for OTP (demo mode)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !forgotOtp || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </>
              )}
            </form>
          ) : (
            // Login Forms
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="otp">Gmail OTP</TabsTrigger>
              </TabsList>

              {/* Password Login */}
              <TabsContent value="password">
                <form onSubmit={handlePasswordLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !password}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </form>
              </TabsContent>

              {/* OTP Login */}
              <TabsContent value="otp">
                <form onSubmit={handleOTPLogin} className="space-y-6">
                  {!otpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                          required
                        />
                        <p className="text-xs text-gray-600 dark:text-slate-500">
                          Enter your authorized email to receive OTP
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpLoading || !email}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {otpLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Send OTP'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                          <KeyRound className="w-4 h-4" />
                          OTP Code
                        </Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                          maxLength={6}
                          required
                        />
                        <p className="text-xs text-gray-600 dark:text-slate-500">
                          OTP sent to your email. Check console (demo mode)
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Verify & Sign In'
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Change Email
                      </button>
                    </>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
