import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const NavigationTiles = () => {
  const navigate = useNavigate();

  const navigationTiles = [
    {
      id: 'course-materials',
      title: 'Course Materials',
      description: 'Access and organize your study materials',
      icon: 'BookOpen',
      color: 'primary',
      path: '/course-management',
      stats: '12 Courses'
    },
    {
      id: 'study-tools',
      title: 'Study Tools',
      description: 'AI-powered learning assistance',
      icon: 'Brain',
      color: 'accent',
      path: '/study-tools-hub',
      stats: 'AI Powered'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Track your learning progress',
      icon: 'BarChart3',
      color: 'warning',
      path: '/analytics-dashboard',
      stats: '85% Progress'
    },
    {
      id: 'calendar',
      title: 'Study Calendar',
      description: 'Plan and schedule your study sessions',
      icon: 'Calendar',
      color: 'secondary',
      path: '/dashboard',
      stats: '5 Sessions'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary',
        border: 'border-primary-100',
        hover: 'hover:bg-primary-100'
      },
      accent: {
        bg: 'bg-accent-50',
        text: 'text-accent',
        border: 'border-accent-100',
        hover: 'hover:bg-accent-100'
      },
      warning: {
        bg: 'bg-warning-50',
        text: 'text-warning',
        border: 'border-warning-100',
        hover: 'hover:bg-warning-100'
      },
      secondary: {
        bg: 'bg-secondary-50',
        text: 'text-secondary',
        border: 'border-secondary-100',
        hover: 'hover:bg-secondary-100'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon name="Grid3X3" size={20} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Quick Navigation</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {navigationTiles.map((tile) => {
          const colors = getColorClasses(tile.color);
          
          return (
            <button
              key={tile.id}
              onClick={() => navigate(tile.path)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${colors.bg} ${colors.border} ${colors.hover}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
                  <Icon 
                    name={tile.icon} 
                    size={24} 
                    color="currentColor"
                  />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {tile.stats}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className={`font-semibold text-lg ${colors.text}`}>
                  {tile.title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {tile.description}
                </p>
              </div>

              <div className="flex items-center justify-end mt-4">
                <Icon 
                  name="ArrowRight" 
                  size={20} 
                  color="currentColor"
                  className={`${colors.text} group-hover:translate-x-1 transition-transform duration-200`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationTiles;