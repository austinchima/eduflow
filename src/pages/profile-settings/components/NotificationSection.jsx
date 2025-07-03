import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';

const NotificationSection = () => {
  const { user, actions } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    studyReminders: true,
    breakReminders: true,
    achievementAlerts: true,
    weeklyReports: true,
    courseUpdates: true,
    quizReminders: true
  });

  // Initialize notifications when user data loads
  useEffect(() => {
    if (user?.notifications) {
      setNotifications({
        email: user.notifications.email ?? true,
        push: user.notifications.push ?? true,
        studyReminders: user.notifications.studyReminders ?? true,
        breakReminders: user.notifications.breakReminders ?? true,
        achievementAlerts: user.notifications.achievementAlerts ?? true,
        weeklyReports: user.notifications.weeklyReports ?? true,
        courseUpdates: user.notifications.courseUpdates ?? true,
        quizReminders: user.notifications.quizReminders ?? true
      });
    }
  }, [user]);

  const handleNotificationChange = (setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
    setHasChanges(true);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await actions.updateNotifications(notifications);
      setHasChanges(false);
      console.log('Notification preferences updated successfully');
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisableAll = () => {
    const disabledNotifications = Object.keys(notifications).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    
    setNotifications(disabledNotifications);
    setHasChanges(true);
  };

  const handleEnableAll = () => {
    const enabledNotifications = Object.keys(notifications).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setNotifications(enabledNotifications);
    setHasChanges(true);
  };

  const NotificationToggle = ({ setting, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={notifications[setting]}
          onChange={(e) => handleNotificationChange(setting, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading notification preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Notification Preferences</h2>
          <p className="text-sm lg:text-base text-text-secondary">Control how and when you receive notifications</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleDisableAll}
            size="sm"
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            Disable All
          </Button>
          <Button
            variant="outline"
            onClick={handleEnableAll}
            size="sm"
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            Enable All
          </Button>
          {hasChanges && (
            <Button
              variant="primary"
              onClick={handleSaveNotifications}
              size="sm"
              iconName={isSaving ? "Loader" : "Save"}
              className="w-full sm:w-auto"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="border border-border-light rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base lg:text-lg font-medium text-text-primary flex items-center">
              <Icon name="Mail" size={18} className="mr-2" />
              Email Notifications
            </h3>
          </div>
          
          <div className="space-y-1 divide-y divide-border-light">
            <NotificationToggle
              setting="email"
              label="Email Notifications"
              description="Receive notifications via email"
            />
            <NotificationToggle
              setting="weeklyReports"
              label="Weekly Progress Reports"
              description="Receive weekly summaries of your learning progress"
            />
            <NotificationToggle
              setting="courseUpdates"
              label="Course Updates"
              description="Get notified about updates to your enrolled courses"
            />
          </div>
        </div>

        {/* Push Notifications */}
        <div className="border border-border-light rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base lg:text-lg font-medium text-text-primary flex items-center">
              <Icon name="Bell" size={18} className="mr-2" />
              Push Notifications
            </h3>
          </div>
          
          <div className="space-y-1 divide-y divide-border-light">
            <NotificationToggle
              setting="push"
              label="Push Notifications"
              description="Receive notifications on your device"
            />
            <NotificationToggle
              setting="studyReminders"
              label="Study Reminders"
              description="Get reminded about your scheduled study sessions"
            />
            <NotificationToggle
              setting="breakReminders"
              label="Break Reminders"
              description="Get notified to take breaks during long study sessions"
            />
            <NotificationToggle
              setting="quizReminders"
              label="Quiz Reminders"
              description="Get reminded about upcoming quizzes and deadlines"
            />
          </div>
        </div>

        {/* Achievement Notifications */}
        <div className="border border-border-light rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base lg:text-lg font-medium text-text-primary flex items-center">
              <Icon name="Trophy" size={18} className="mr-2" />
              Achievement Notifications
            </h3>
          </div>
          
          <div className="space-y-1 divide-y divide-border-light">
            <NotificationToggle
              setting="achievementAlerts"
              label="Achievement Alerts"
              description="Celebrate your learning milestones and achievements"
            />
          </div>
        </div>

        {/* Notification Schedule */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Clock" size={18} className="mr-2" />
            Notification Schedule
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Quiet Hours Start
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary">
                <option value="22:00">10:00 PM</option>
                <option value="23:00">11:00 PM</option>
                <option value="00:00">12:00 AM</option>
                <option value="01:00">1:00 AM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Quiet Hours End
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary">
                <option value="07:00">7:00 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
              </select>
            </div>
          </div>
          
          <p className="text-sm text-text-muted mt-2">
            During quiet hours, only critical notifications will be sent
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;