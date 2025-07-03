import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';

const PrivacySection = () => {
  const { user, actions } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showAccountDeletion, setShowAccountDeletion] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    studyDataSharing: false,
    analyticsSharing: true,
    emailSharing: false,
    dataRetention: '1year',
    exportData: true
  });

  // Initialize privacy settings when user data loads
  useEffect(() => {
    if (user?.privacy) {
      setPrivacySettings({
        profileVisibility: user.privacy.profileVisibility || 'public',
        studyDataSharing: user.privacy.studyDataSharing ?? false,
        analyticsSharing: user.privacy.analyticsSharing ?? true,
        emailSharing: user.privacy.emailSharing ?? false,
        dataRetention: user.privacy.dataRetention || '1year',
        exportData: user.privacy.exportData ?? true
      });
    }
  }, [user]);

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    setHasChanges(true);
  };

  const handleSavePrivacySettings = async () => {
    setIsSaving(true);
    try {
      await actions.updatePrivacy(privacySettings);
      setHasChanges(false);
      console.log('Privacy settings updated successfully');
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    // Create a data export object
    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        major: user.major,
        graduationYear: user.graduationYear
      },
      academic: user.academic,
      studyData: user.studyData,
      flashcards: user.flashcards,
      quizzes: user.quizzes,
      preferences: user.preferences,
      notifications: user.notifications,
      privacy: user.privacy,
      accessibility: user.accessibility,
      account: user.account,
      exportDate: new Date().toISOString()
    };

    // Create and download the file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studyai-pro-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Data exported successfully');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Clear all user data
      localStorage.removeItem('studyAI_user');
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Privacy Settings</h2>
          <p className="text-sm lg:text-base text-text-secondary">Control your data privacy and sharing preferences</p>
        </div>
        {hasChanges && (
          <Button
            variant="primary"
            onClick={handleSavePrivacySettings}
            size="sm"
            iconName={isSaving ? "Loader" : "Save"}
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Privacy */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Eye" size={18} className="mr-2" />
            Profile Visibility
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Who can see your profile?
              </label>
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="public">Public - Anyone can see your profile</option>
                <option value="students">Students Only - Only other students can see your profile</option>
                <option value="connections">Connections - Only your study group members</option>
                <option value="private">Private - Only you can see your profile</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Share2" size={18} className="mr-2" />
            Data Sharing
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Share Study Data</p>
                <p className="text-sm text-text-secondary">Allow anonymized study data to improve AI recommendations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.studyDataSharing}
                  onChange={(e) => handlePrivacyChange('studyDataSharing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Share Analytics</p>
                <p className="text-sm text-text-secondary">Help improve EduFlow by sharing usage analytics</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.analyticsSharing}
                  onChange={(e) => handlePrivacyChange('analyticsSharing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Email Sharing</p>
                <p className="text-sm text-text-secondary">Allow your email to be shared with study partners</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.emailSharing}
                  onChange={(e) => handlePrivacyChange('emailSharing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Database" size={18} className="mr-2" />
            Data Retention
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                How long should we keep your data?
              </label>
              <select
                value={privacySettings.dataRetention}
                onChange={(e) => handlePrivacyChange('dataRetention', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="6months">6 months</option>
                <option value="1year">1 year</option>
                <option value="2years">2 years</option>
                <option value="5years">5 years</option>
                <option value="indefinite">Indefinitely</option>
              </select>
              <p className="text-sm text-text-muted mt-1">
                After this period, your data will be automatically deleted
              </p>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Download" size={18} className="mr-2" />
            Data Export
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Export Your Data</p>
                <p className="text-sm text-text-secondary">Download a copy of all your data in JSON format</p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                size="sm"
                iconName="Download"
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="border border-error-200 rounded-lg p-4 bg-error-50">
          <h3 className="text-base lg:text-lg font-medium text-error mb-4 flex items-center">
            <Icon name="Trash2" size={18} className="mr-2" />
            Account Deletion
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-error">Delete Account</p>
                <p className="text-sm text-error-600">Permanently delete your account and all associated data</p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                size="sm"
                iconName="Trash2"
              >
                Delete Account
              </Button>
            </div>
            <p className="text-xs text-error-600">
              Warning: This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;