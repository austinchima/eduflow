import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Academic overview and quick actions'
    },
    {
      label: 'Course Management',
      path: '/course-management',
      icon: 'BookOpen',
      description: 'Organize and manage your courses'
    },
    {
      label: 'Study Tools Hub',
      path: '/study-tools-hub',
      icon: 'Brain',
      description: 'AI-powered learning resources'
    },
    {
      label: 'Quiz Interface',
      path: '/quiz-interface',
      icon: 'HelpCircle',
      description: 'Interactive quiz sessions'
    },
    {
      label: 'Flashcard Study',
      path: '/flashcard-study-session',
      icon: 'Layers',
      description: 'Flashcard study sessions'
    },
    {
      label: 'Analytics',
      path: '/analytics-dashboard',
      icon: 'BarChart3',
      description: 'Performance insights and progress tracking'
    },
    {
      label: 'Profile Settings',
      path: '/profile-settings',
      icon: 'Settings',
      description: 'Manage your account and preferences'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!isMobile) {
    return null;
  }

  const isStudySession = ['/quiz-interface', '/flashcard-study-session'].includes(location.pathname);

  return (
    <>
      {/* Menu Button */}
      {!isStudySession && (
        <Button
          variant="ghost"
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-200 lg:hidden bg-surface shadow-md border border-border"
          iconName="Menu"
          iconSize={20}
        />
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-200 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-full max-w-sm bg-surface z-300 lg:hidden
          transform transition-transform duration-300 ease-smooth
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">EduFlow</h1>
              <p className="text-xs text-text-secondary">Mobile Menu</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            iconName="X"
            iconSize={20}
            className="text-text-secondary"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-start space-x-4 p-4 rounded-lg
                      transition-all duration-200 ease-smooth text-left
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                      }
                    `}
                  >
                    <Icon 
                      name={item.icon} 
                      size={24} 
                      color="currentColor"
                      className="mt-0.5 flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-base mb-1">{item.label}</div>
                      <div className={`text-sm ${isActive ? 'text-primary-foreground opacity-90' : 'text-text-muted'}`}>
                        {item.description}
                      </div>
                    </div>

                    {isActive && (
                      <Icon 
                        name="Check" 
                        size={20} 
                        color="currentColor"
                        className="flex-shrink-0"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 text-text-muted">
            <Icon name="User" size={20} />
            <div className="text-sm">
              <p className="font-medium">Student Portal</p>
              <p className="text-xs">Academic Year 2024</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;