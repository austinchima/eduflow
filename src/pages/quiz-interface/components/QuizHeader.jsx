import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizHeader = ({ 
  quizTitle, 
  currentQuestion, 
  totalQuestions, 
  timeRemaining, 
  onExit,
  showTimer = true 
}) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-error'; // 5 minutes
    if (timeRemaining <= 600) return 'text-warning'; // 10 minutes
    return 'text-text-secondary';
  };

  return (
    <div className="bg-surface border-b border-border px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Quiz Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={20} color="var(--color-primary)" />
            <h1 className="text-lg font-semibold text-text-primary hidden sm:block">
              {quizTitle}
            </h1>
          </div>
          
          {/* Question Counter */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-text-secondary">Question</span>
            <span className="font-semibold text-text-primary">
              {currentQuestion} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* Timer and Exit */}
        <div className="flex items-center space-x-4">
          {showTimer && timeRemaining > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className={getTimeColor()} />
              <span className={`text-sm font-medium ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={onExit}
            iconName="X"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;