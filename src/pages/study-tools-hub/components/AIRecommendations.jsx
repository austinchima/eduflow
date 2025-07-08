import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIRecommendations = ({ recommendations, onAcceptRecommendation }) => {
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'quiz':
        return 'HelpCircle';
      case 'flashcard':
        return 'Layers';
      case 'notes':
        return 'FileText';
      case 'review':
        return 'RotateCcw';
      default:
        return 'Lightbulb';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error bg-error-50';
      case 'medium':
        return 'border-l-warning bg-warning-50';
      case 'low':
        return 'border-l-accent bg-accent-50';
      default:
        return 'border-l-secondary bg-secondary-50';
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-on-colored">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <Icon name="Brain" size={16} className="sm:w-5 sm:h-5 text-primary" />
        <h2 className="text-base sm:text-lg font-semibold text-text-primary">AI Recommendations</h2>
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium text-on-colored bg-on-colored">
          Smart
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`border-l-4 rounded-lg p-3 sm:p-4 ${getPriorityColor(recommendation.priority)}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm icon-on-colored flex-shrink-0">
                  <Icon 
                    name={getRecommendationIcon(recommendation.type)} 
                    size={12}
                    className="sm:w-4 sm:h-4 icon-on-colored"
                    color="currentColor" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary mb-1 text-sm sm:text-base truncate">
                    {recommendation.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mb-2 line-clamp-2">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-text-muted">
                    <div className="flex items-center space-x-1">
                      <Icon name="BookOpen" size={12} />
                      <span className="truncate">{recommendation.course}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{recommendation.estimatedTime}</span>
                    </div>
                    {recommendation.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={12} />
                        <span>Due {recommendation.dueDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => onAcceptRecommendation(recommendation)}
                iconName="ArrowRight"
                iconSize={14}
                className="sm:ml-4 text-sm sm:text-base py-2 sm:py-2.5"
              >
                Start
              </Button>
            </div>

            {recommendation.reason && (
              <div className="mt-3 pt-3 border-t border-white border-opacity-50">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={12} className="sm:w-4 sm:h-4 text-text-muted flex-shrink-0" />
                  <p className="text-xs text-text-muted">
                    <strong>Why this helps:</strong> {recommendation.reason}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;