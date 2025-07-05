import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickCreateSection = ({ onCreateQuiz, onCreateFlashcards, onCreateNotes }) => {
  const quickActions = [
    {
      id: 'quiz',
      title: 'Generate Quiz',
      description: 'Create AI-powered quizzes from your course materials',
      icon: 'HelpCircle',
      color: 'bg-primary text-primary-foreground',
      action: onCreateQuiz
    },
    {
      id: 'flashcards',
      title: 'Create Flashcards',
      description: 'Build flashcard sets for spaced repetition learning',
      icon: 'Layers',
      color: 'bg-accent text-accent-foreground',
      action: onCreateFlashcards
    },
    {
      id: 'notes',
      title: 'AI Study Notes',
      description: 'Generate comprehensive notes from uploaded materials',
      icon: 'FileText',
      color: 'bg-secondary text-secondary-foreground',
      action: onCreateNotes
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="icon-contrast" />
        <h2 className="text-lg font-semibold text-text-primary">Quick Create</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="text-left p-4 rounded-lg border border-border hover:border-primary transition-all duration-200 hover:shadow-sm group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} icon-on-colored`}>
                <Icon name={action.icon} size={20} className="icon-on-colored" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickCreateSection;