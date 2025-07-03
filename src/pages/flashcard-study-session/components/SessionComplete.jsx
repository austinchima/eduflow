import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionComplete = ({ 
  sessionStats, 
  onRestart, 
  onReturnToDashboard,
  onReviewMissed 
}) => {
  const {
    totalCards,
    correctCount,
    sessionTime,
    accuracy,
    streak,
    difficultyBreakdown,
    averageResponseTime
  } = sessionStats;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Outstanding performance! 🌟", color: "text-success-600" };
    if (accuracy >= 75) return { message: "Great job! Keep it up! 👏", color: "text-accent-600" };
    if (accuracy >= 60) return { message: "Good effort! Room for improvement 💪", color: "text-primary-600" };
    return { message: "Keep practicing! You'll get there 📚", color: "text-warning-600" };
  };

  const performanceMessage = getPerformanceMessage();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={40} color="white" />
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Session Complete!
        </h2>
        <p className={`text-lg font-medium ${performanceMessage.color}`}>
          {performanceMessage.message}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <Icon name="Target" size={32} className="text-accent mx-auto mb-3" />
          <div className="text-3xl font-bold text-text-primary mb-1">
            {Math.round(accuracy)}%
          </div>
          <div className="text-text-secondary">Accuracy</div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <Icon name="Clock" size={32} className="text-primary mx-auto mb-3" />
          <div className="text-3xl font-bold text-text-primary mb-1">
            {formatTime(sessionTime)}
          </div>
          <div className="text-text-secondary">Total Time</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Session Details</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{totalCards}</div>
            <div className="text-sm text-text-secondary">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">{correctCount}</div>
            <div className="text-sm text-text-secondary">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">{streak}</div>
            <div className="text-sm text-text-secondary">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {averageResponseTime.toFixed(1)}s
            </div>
            <div className="text-sm text-text-secondary">Avg Response</div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Response Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(difficultyBreakdown).map(([difficulty, count]) => {
              const colors = {
                again: 'bg-error-100 text-error-700',
                hard: 'bg-warning-100 text-warning-700',
                good: 'bg-primary-100 text-primary-700',
                easy: 'bg-success-100 text-success-700'
              };
              
              const labels = {
                again: 'Again',
                hard: 'Hard',
                good: 'Good',
                easy: 'Easy'
              };

              const percentage = totalCards > 0 ? (count / totalCards) * 100 : 0;

              return (
                <div key={difficulty} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${colors[difficulty]}`}>
                      {labels[difficulty]}
                    </div>
                    <span className="text-sm text-text-secondary">{count} cards</span>
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={onRestart}
          iconName="RotateCcw"
          iconPosition="left"
          fullWidth
          className="py-3"
        >
          Study Again
        </Button>

        {difficultyBreakdown.again > 0 && (
          <Button
            variant="secondary"
            onClick={onReviewMissed}
            iconName="AlertCircle"
            iconPosition="left"
            fullWidth
            className="py-3"
          >
            Review Missed Cards ({difficultyBreakdown.again})
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onReturnToDashboard}
          iconName="Home"
          iconPosition="left"
          fullWidth
          className="py-3"
        >
          Return to Dashboard
        </Button>
      </div>

      {/* Next Study Recommendation */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-text-primary mb-1">Study Tip</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Based on your performance, we recommend reviewing these cards again in 2-3 days. 
              Spaced repetition helps strengthen long-term memory retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionComplete;