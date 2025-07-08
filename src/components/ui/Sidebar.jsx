import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { dataService } from '../../services/dataService';

const Sidebar = ({ isCollapsed: controlledCollapsed, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(controlledCollapsed ?? false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, actions } = useUser();

  // Check if user is authenticated
  const isAuthenticated = user && user.id && localStorage.getItem('token');

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'Home',
      tooltip: 'Overview and quick actions'
    },
    {
      label: 'Course Management',
      path: '/course-management',
      icon: 'BookOpen',
      tooltip: 'Manage your courses and materials'
    },
    {
      label: 'Study Tools Hub',
      path: '/study-tools-hub',
      icon: 'Brain',
      tooltip: 'AI-powered learning resources'
    },
    {
      label: 'Quiz Interface',
      path: '/quiz-interface',
      icon: 'HelpCircle',
      tooltip: 'Interactive quiz sessions'
    },
    {
      label: 'Flashcard Study',
      path: '/flashcard-study-session',
      icon: 'Layers',
      tooltip: 'Flashcard study sessions'
    },
    {
      label: 'Analytics',
      path: '/analytics-dashboard',
      icon: 'BarChart3',
      tooltip: 'Performance insights and progress tracking'
    },
    {
      label: 'Profile Settings',
      path: '/profile-settings',
      icon: 'Settings',
      tooltip: 'Manage your account and preferences'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        if (onCollapseChange) onCollapseChange(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCollapseChange]);

  useEffect(() => {
    const studyPaths = ['/quiz-interface', '/flashcard-study-session'];
    setIsStudyMode(studyPaths.includes(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (controlledCollapsed !== undefined) setIsCollapsed(controlledCollapsed);
  }, [controlledCollapsed]);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsCollapsed(true);
      if (onCollapseChange) onCollapseChange(true);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (onCollapseChange) onCollapseChange(next);
      return next;
    });
  };

  const handleThemeToggle = () => {
    // Simply toggle the theme without backend sync for now
    toggleTheme();
  };

  if (isStudyMode && isMobile) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-150 lg:hidden"
          onClick={() => {
            setIsCollapsed(true);
            if (onCollapseChange) onCollapseChange(true);
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-surface border-r border-border z-100
          transition-all duration-300 ease-smooth
          ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-60'}
          ${isMobile ? 'w-60' : ''}
          ${isStudyMode ? 'lg:w-16' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {(!isCollapsed || !isMobile) && !isStudyMode && (
            <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleSidebar} title="Toggle Sidebar">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              {!isCollapsed && !isStudyMode && (
                <div>
                  <h1 className="text-lg font-semibold text-text-primary">EduFlow</h1>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200 ease-smooth group relative
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                      }
                    `}
                    title={isCollapsed ? item.tooltip : ''}
                  >
                    <Icon 
                      name={item.icon} 
                      size={isCollapsed ? 28 : 20} 
                      className={isCollapsed ? 'mx-auto' : ''}
                      color={isActive ? 'currentColor' : 'currentColor'}
                    />
                    
                    {!isCollapsed && !isStudyMode && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {(isCollapsed || isStudyMode) && (
                      <div className="
                        absolute left-full ml-2 px-2 py-1 bg-text-primary text-white text-xs
                        rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none whitespace-nowrap z-200
                      ">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {/* Theme Toggle Button */}
          {isAuthenticated && (
            <div className="mb-4">
              <button
                onClick={handleThemeToggle}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 ease-smooth
                  text-text-secondary hover:text-text-primary hover:bg-secondary-50
                `}
                title={isCollapsed ? 'Toggle theme' : ''}
              >
                <Icon 
                  name={isDark ? 'Sun' : 'Moon'} 
                  size={isCollapsed ? 28 : 20} 
                  className={isCollapsed ? 'mx-auto' : ''}
                />
                {!isCollapsed && !isStudyMode && (
                  <span className="font-medium text-sm">
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* User Info */}
          {!isCollapsed && !isStudyMode && (
            <div className="flex items-center space-x-3 text-text-muted">
              <Icon name="User" size={16} />
              <div className="text-sm">
                <p className="font-medium">Student Portal</p>
                <p className="text-xs">Academic Year 2024</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {isMobile && isCollapsed && (
        <Button
          variant="primary"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-200 lg:hidden"
          iconName="Menu"
          iconSize={20}
        />
      )}
    </>
  );
};

export default Sidebar;