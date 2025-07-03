import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionProgress = ({ 
  currentCard, 
  totalCards, 
  correctCount, 
  sessionTime, 
  streak,
  estimatedTimeRemaining 
}) => {
  const progressPercentage = totalCards > 0 ? (currentCard / totalCards) * 100 : 0;
  const accuracyPercentage = currentCard > 0 ? (correctCount / currentCard) * 100 : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-primary">
            Progress
          </span>
          <span className="text-sm text-text-secondary">
            {currentCard} / {totalCards} cards
          </span>
        </div>
        <div className="w-full h-3 bg-secondary-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-accent-600 transition-all duration-500 ease-smooth"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Session Time */}
        <div className="bg-surface border border-border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Clock" size={16} className="text-primary mr-1" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Time
            </span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {formatTime(sessionTime)}
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-surface border border-border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Target" size={16} className="text-accent mr-1" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Accuracy
            </span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {Math.round(accuracyPercentage)}%
          </div>
        </div>

        {/* Streak */}
        <div className="bg-surface border border-border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Flame" size={16} className="text-warning-500 mr-1" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Streak
            </span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {streak}
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-surface border border-border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Timer" size={16} className="text-secondary mr-1" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              ETA
            </span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {formatTime(estimatedTimeRemaining)}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {streak >= 5 && (
        <div className="mt-4 bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Trophy" size={20} className="text-accent" />
            <span className="text-sm font-medium text-accent-700">
              Great streak! You're on fire! 🔥
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionProgress;