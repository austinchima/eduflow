import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickCreateSection = ({ courses, onCreateTool }) => {
  const quickActions = [
    {
      id: 'quiz',
      title: 'Create Quiz',
      description: 'Build custom quizzes for your courses',
      icon: 'HelpCircle',
      color: 'bg-primary text-primary-foreground',
      type: 'quiz'
    },
    {
      id: 'flashcards',
      title: 'Create Flashcards',
      description: 'Build flashcard sets for spaced repetition learning',
      icon: 'Layers',
      color: 'bg-accent text-accent-foreground',
      type: 'flashcard'
    },
    {
      id: 'notes',
      title: 'Study Notes',
      description: 'Create and organize your study notes',
      icon: 'FileText',
      color: 'bg-secondary text-secondary-foreground',
      type: 'notes'
    }
  ];

  const handleCreateTool = (action) => {
    if (onCreateTool) {
      onCreateTool(action.type, {
        title: `New ${action.title}`,
        description: `Custom ${action.title.toLowerCase()}`,
        courseId: courses.length > 0 ? courses[0].id : '',
        subject: courses.length > 0 ? courses[0].name : 'General'
      });
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <Icon name="Zap" size={16} className="sm:w-5 sm:h-5 icon-contrast" />
        <h2 className="text-base sm:text-lg font-semibold text-text-primary">Quick Create</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleCreateTool(action)}
            className="text-left p-3 sm:p-4 rounded-lg border border-border hover:border-primary transition-all duration-200 hover:shadow-sm group"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${action.color} icon-on-colored flex-shrink-0`}>
                <Icon name={action.icon} size={16} className="sm:w-5 sm:h-5 icon-on-colored" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                  {action.title}
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickCreateSection;