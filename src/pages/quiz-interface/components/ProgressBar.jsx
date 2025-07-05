import React from 'react';

const ProgressBar = ({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions = [],
  flaggedQuestions = [] 
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  const answeredProgress = (answeredQuestions.length / totalQuestions) * 100;

  return (
    <div className="bg-surface border-b border-border px-4 py-3 lg:px-6">
      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-secondary-100 rounded-full overflow-hidden mb-3 text-on-colored">
        {/* Answered Progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-300 ease-smooth text-on-colored"
          style={{ width: `${answeredProgress}%` }}
        />
        
        {/* Current Progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-smooth text-on-colored"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-text-secondary">
            Progress: <span className="font-medium text-text-primary">{Math.round(progress)}%</span>
          </span>
          
          <span className="text-text-secondary">
            Answered: <span className="font-medium text-accent">{answeredQuestions.length}</span>
          </span>
          
          {flaggedQuestions.length > 0 && (
            <span className="text-text-secondary">
              Flagged: <span className="font-medium text-warning">{flaggedQuestions.length}</span>
            </span>
          )}
        </div>

        <div className="text-text-secondary">
          <span className="font-medium text-text-primary">{currentQuestion}</span> / {totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;