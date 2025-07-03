import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'quiz',
      title: 'Start Quiz',
      description: 'Test your knowledge',
      icon: 'HelpCircle',
      color: 'primary',
      path: '/quiz-interface'
    },
    {
      id: 'flashcards',
      title: 'Study Flashcards',
      description: 'Review key concepts',
      icon: 'Layers',
      color: 'accent',
      path: '/flashcard-study-session'
    },
    {
      id: 'study-tools',
      title: 'AI Study Tools',
      description: 'Get personalized help',
      icon: 'Brain',
      color: 'warning',
      path: '/study-tools-hub'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Track your progress',
      icon: 'BarChart3',
      color: 'secondary',
      path: '/analytics-dashboard'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary border-primary-100 hover:bg-primary-100',
      accent: 'bg-accent-50 text-accent border-accent-100 hover:bg-accent-100',
      warning: 'bg-warning-50 text-warning border-warning-100 hover:bg-warning-100',
      secondary: 'bg-secondary-50 text-secondary border-secondary-100 hover:bg-secondary-100'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={20} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left group ${getColorClasses(action.color)}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon 
                name={action.icon} 
                size={20} 
                color="currentColor"
              />
              <h4 className="font-semibold">{action.title}</h4>
            </div>
            <p className="text-sm opacity-80">{action.description}</p>
            <div className="flex items-center justify-end mt-3">
              <Icon 
                name="ArrowRight" 
                size={16} 
                color="currentColor"
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;