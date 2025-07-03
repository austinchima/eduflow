import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import StudySessionControls from '../../components/ui/StudySessionControls';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MobileNavigation from '../../components/ui/MobileNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import section components
import ProfileInfoSection from './components/ProfileInfoSection';
import AccountSettingsSection from './components/AccountSettingsSection';
import StudyPreferencesSection from './components/StudyPreferencesSection';
import NotificationSection from './components/NotificationSection';
import PrivacySection from './components/PrivacySection';
import AccessibilitySection from './components/AccessibilitySection';
import AISystemStatus from './components/AISystemStatus';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      component: ProfileInfoSection
    },
    {
      id: 'account',
      label: 'Account',
      icon: 'Settings',
      component: AccountSettingsSection
    },
    {
      id: 'study',
      label: 'Study Preferences',
      icon: 'Brain',
      component: StudyPreferencesSection
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      component: NotificationSection
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: 'Shield',
      component: PrivacySection
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      icon: 'Eye',
      component: AccessibilitySection
    },
    {
      id: 'ai-status',
      label: 'AI System Status',
      icon: 'Activity',
      component: AISystemStatus
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // Changed from 768 to 1024 for better tablet support
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileMenu(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileInfoSection;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <StudySessionControls />
      <MobileNavigation />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} px-4 lg:px-8`}
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="p-4 lg:p-8">
            <Breadcrumb />
            
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Settings" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Profile Settings</h1>
                    <p className="text-sm lg:text-base text-text-secondary">Manage your account and personalize your EduFlow experience</p>
                  </div>
                </div>
                
                {/* Mobile Menu Toggle */}
                {isMobile && (
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    iconName={showMobileMenu ? "X" : "Menu"}
                    className="lg:hidden"
                  >
                    {showMobileMenu ? "Close" : "Menu"}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Navigation Tabs */}
              <div className={`${isMobile ? 'w-full' : 'w-64'} flex-shrink-0`}>
                {/* Mobile Tab Selector */}
                {isMobile && (
                  <div className="mb-4">
                    <div className="bg-surface rounded-lg border border-border p-2">
                      <nav className="flex overflow-x-auto space-x-1 pb-2">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                              whitespace-nowrap px-4 py-2 flex items-center space-x-2 rounded-md text-sm font-medium transition-colors flex-shrink-0
                              ${activeTab === tab.id 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                              }
                            `}
                          >
                            <Icon name={tab.icon} size={16} />
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}

                {/* Desktop Sidebar Navigation */}
                {!isMobile && (
                  <div className="bg-surface rounded-lg border border-border p-2">
                    <nav className="space-y-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`
                            w-full px-3 py-2.5 flex items-center space-x-3 rounded-md text-sm font-medium transition-colors
                            ${activeTab === tab.id 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                            }
                          `}
                        >
                          <Icon name={tab.icon} size={18} />
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Quick Actions - Desktop */}
                {!isMobile && (
                  <div className="mt-6 bg-surface rounded-lg border border-border p-4">
                    <h3 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Download"
                        onClick={() => setActiveTab('privacy')}
                      >
                        Export Data
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="RefreshCw"
                        onClick={() => window.location.reload()}
                      >
                        Reset All Settings
                      </Button>
                    </div>
                  </div>
                )}

                {/* Help Section - Desktop */}
                {!isMobile && (
                  <div className="mt-6 bg-accent-50 border border-accent-100 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="HelpCircle" size={20} className="text-accent-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-accent-800">Need Help?</h4>
                        <p className="text-xs text-accent-700 mt-1 mb-3">
                          Check our help center for detailed guides on personalizing your EduFlow experience.
                        </p>
                        <Button variant="outline" size="xs" iconName="ExternalLink">
                          Visit Help Center
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-surface rounded-lg border border-border">
                  <ActiveComponent />
                </div>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            {isMobile && (
              <div className="mt-6 bg-surface rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    onClick={() => setActiveTab('privacy')}
                    className="w-full"
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Reset Settings
                  </Button>
                </div>
                
                {/* Mobile Help Section */}
                <div className="mt-4 bg-accent-50 border border-accent-100 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="HelpCircle" size={18} className="text-accent-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-accent-800">Need Help?</h4>
                      <p className="text-xs text-accent-700 mt-1">
                        Visit our help center for guides and support.
                      </p>
                      <Button 
                        variant="outline" 
                        size="xs" 
                        iconName="ExternalLink"
                        className="mt-2"
                      >
                        Help Center
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-border">
              <div className="text-center text-sm text-text-muted">
                <p>EduFlow Settings - Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mt-1">© {new Date().getFullYear()} EduFlow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;