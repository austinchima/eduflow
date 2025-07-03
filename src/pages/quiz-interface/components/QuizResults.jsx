import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizResults = ({ 
  results, 
  onReview, 
  onRetake, 
  onExit,
  showRecommendations = true 
}) => {
  const {
    score,
    totalQuestions,
    correctAnswers,
    timeSpent,
    accuracy,
    recommendations = []
  } = results;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getScoreColor = () => {
    if (accuracy >= 80) return 'text-success';
    if (accuracy >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = () => {
    if (accuracy >= 80) return 'bg-success-50 border-success';
    if (accuracy >= 60) return 'bg-warning-50 border-warning';
    return 'bg-error-50 border-error';
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Excellent work! You've mastered this topic.";
    if (accuracy >= 80) return "Great job! You have a solid understanding.";
    if (accuracy >= 70) return "Good effort! A bit more practice will help.";
    if (accuracy >= 60) return "Not bad! Focus on the areas you missed.";
    return "Keep practicing! Review the material and try again.";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Trophy" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Quiz Complete!</h1>
          <p className="text-text-secondary">{getPerformanceMessage()}</p>
        </div>

        {/* Score Card */}
        <div className={`rounded-lg border-2 p-6 mb-6 ${getScoreBgColor()}`}>
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
              {Math.round(accuracy)}%
            </div>
            <div className="text-lg text-text-secondary mb-4">
              {correctAnswers} out of {totalQuestions} correct
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{score}</div>
                <div className="text-sm text-text-secondary">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{formatTime(timeSpent)}</div>
                <div className="text-sm text-text-secondary">Time Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(timeSpent / totalQuestions)}s
                </div>
                <div className="text-sm text-text-secondary">Avg per Question</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Brain" size={20} color="var(--color-primary)" />
              <h3 className="text-lg font-semibold text-text-primary">AI Study Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg">
                  <Icon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">{recommendation.title}</h4>
                    <p className="text-sm text-text-secondary">{recommendation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={onReview}
            iconName="Eye"
            iconPosition="left"
            className="w-full"
          >
            Review Answers
          </Button>
          
          <Button
            variant="secondary"
            onClick={onRetake}
            iconName="RotateCcw"
            iconPosition="left"
            className="w-full"
          >
            Retake Quiz
          </Button>
          
          <Button
            variant="primary"
            onClick={onExit}
            iconName="Home"
            iconPosition="left"
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 text-center text-sm text-text-muted">
          <p>Quiz completed on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;