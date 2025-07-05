import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, tabCounts }) => {
  const tabs = [
    {
      id: 'all',
      label: 'All Tools',
      icon: 'Grid3x3',
      count: tabCounts.all
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: 'HelpCircle',
      count: tabCounts.quizzes
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: 'Layers',
      count: tabCounts.flashcards
    },
    {
      id: 'notes',
      label: 'AI Notes',
      icon: 'FileText',
      count: tabCounts.notes
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: 'Clock',
      count: tabCounts.sessions
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-1 mb-6">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm text-on-colored'
                : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }
            `}
          >
            <Icon 
              name={tab.icon} 
              size={16} 
              color="currentColor"
            />
            <span className="font-medium text-sm">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${activeTab === tab.id
                  ? 'bg-primary-foreground bg-opacity-20 text-primary-foreground text-on-colored'
                  : 'bg-secondary-100 text-text-muted text-on-colored'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;