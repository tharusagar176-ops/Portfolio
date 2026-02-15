import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

export function ChangePassword() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    if (newPassword.length < 6) {
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const result = changePassword(currentPassword, newPassword);
      setIsLoading(false);
      
      if (result) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    }, 500);
  };

  const isFormValid = 
    currentPassword && 
    newPassword && 
    confirmPassword && 
    newPassword === confirmPassword && 
    newPassword.length >= 6;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Change Password
        </h2>
        <p className="text-gray-600 dark:text-slate-400">
          Update your admin panel password
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Security Settings</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">
                  Change your admin password
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Password Changed Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    Your admin password has been updated.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
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
                  {newPassword && newPassword.length < 6 && (
                    <p className="text-xs text-red-500">Password must be at least 6 characters</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm New Password
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

                {/* Password Requirements */}
                <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-slate-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`} />
                      At least 6 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${newPassword && confirmPassword && newPassword === confirmPassword ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`} />
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30">
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
              Security Tips:
            </h4>
            <ul className="text-xs text-indigo-700 dark:text-indigo-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                <span>Use a strong, unique password for your admin panel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                <span>Don't share your password with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                <span>Change your password regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                <span>Use Gmail OTP login for additional security</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
