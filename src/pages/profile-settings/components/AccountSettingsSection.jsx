import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';

const AccountSettingsSection = () => {
  const { user, actions } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Initialize account settings when user data loads
  useEffect(() => {
    if (user?.account) {
      // Account settings are already loaded in the context
    }
  }, [user]);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // In a real app, you would make an API call to change the password
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the account settings to reflect password change
      await actions.updateAccountSettings({
        passwordLastChanged: new Date().toISOString()
      });

      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      setErrors({ general: 'Failed to update password. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const handleTwoFactorToggle = async () => {
    try {
      await actions.updateAccountSettings({
        twoFactorAuth: !user.account?.twoFactorAuth
      });
      console.log('Two-factor authentication updated successfully');
    } catch (error) {
      console.error('Failed to update two-factor authentication:', error);
    }
  };

  const handleSessionTimeoutChange = async (timeout) => {
    try {
      await actions.updateAccountSettings({
        sessionTimeout: parseInt(timeout)
      });
      console.log('Session timeout updated successfully');
    } catch (error) {
      console.error('Failed to update session timeout:', error);
    }
  };

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Account Security</h2>
        <p className="text-sm lg:text-base text-text-secondary">Manage your account security settings and authentication</p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
          <p className="text-error text-sm">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Password Change Section */}
        <div className="border border-border-light rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-base lg:text-lg font-medium text-text-primary mb-1">Password</h3>
              <p className="text-text-secondary text-sm">
                Last changed {user.account?.passwordLastChanged ? 
                  new Date(user.account.passwordLastChanged).toLocaleDateString() : 
                  'Never'}
              </p>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
                iconName="Lock"
                className="mt-3 sm:mt-0 w-full sm:w-auto"
                size="sm"
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4 border-t border-border-light pt-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={errors.currentPassword ? 'border-error pr-12' : 'pr-12'}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    <Icon name={showPasswords.current ? "EyeOff" : "Eye"} size={16} />
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-error text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={errors.newPassword ? 'border-error pr-12' : 'pr-12'}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    <Icon name={showPasswords.new ? "EyeOff" : "Eye"} size={16} />
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-error text-sm mt-1">{errors.newPassword}</p>
                )}
                <p className="text-text-muted text-xs mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-error pr-12' : 'pr-12'}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    <Icon name={showPasswords.confirm ? "EyeOff" : "Eye"} size={16} />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="primary"
                  onClick={handlePasswordSubmit}
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isSaving}
                  iconName={isSaving ? "Loader" : "Save"}
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelPasswordChange}
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base lg:text-lg font-medium text-text-primary mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-text-secondary">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.account?.twoFactorAuth ?? false}
                onChange={handleTwoFactorToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Session Management */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4">Session Management</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Session Timeout (minutes)
              </label>
              <select
                value={user.account?.sessionTimeout || 30}
                onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={480}>8 hours</option>
              </select>
              <p className="text-sm text-text-muted mt-1">
                Automatically log out after this period of inactivity
              </p>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4">Recent Login Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Monitor" size={16} className="text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Current Session</p>
                  <p className="text-xs text-text-muted">Windows 10 • Chrome • {new Date().toLocaleString()}</p>
                </div>
              </div>
              <span className="text-xs text-success bg-success-50 px-2 py-1 rounded">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={16} className="text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Mobile Device</p>
                  <p className="text-xs text-text-muted">iOS • Safari • {new Date(Date.now() - 86400000).toLocaleString()}</p>
                </div>
              </div>
              <span className="text-xs text-text-muted">Yesterday</span>
            </div>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="border border-accent-200 rounded-lg p-4 bg-accent-50">
          <h3 className="text-base lg:text-lg font-medium text-accent-800 mb-4 flex items-center">
            <Icon name="Shield" size={18} className="mr-2" />
            Security Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent-800">Strong Password</p>
                <p className="text-xs text-accent-700">Your password meets security requirements</p>
              </div>
            </div>
            
            {!user.account?.twoFactorAuth && (
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent-800">Enable Two-Factor Authentication</p>
                  <p className="text-xs text-accent-700">Add an extra layer of security to your account</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSection;