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
    <div className="bg-surface border border-border rounded-lg p-6 mb-6 text-on-colored">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Brain" size={20} color="var(--color-primary)" />
        <h2 className="text-lg font-semibold text-text-primary">AI Recommendations</h2>
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium text-on-colored bg-on-colored">
          Smart
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`border-l-4 rounded-lg p-4 ${getPriorityColor(recommendation.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm icon-on-colored">
                  <Icon 
                    name={getRecommendationIcon(recommendation.type)} 
                    size={16} 
                    color="currentColor" 
                    className="icon-on-colored" 
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary mb-1">
                    {recommendation.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-2">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-text-muted">
                    <div className="flex items-center space-x-1">
                      <Icon name="BookOpen" size={12} />
                      <span>{recommendation.course}</span>
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
                iconSize={16}
                className="ml-4"
              >
                Start
              </Button>
            </div>

            {recommendation.reason && (
              <div className="mt-3 pt-3 border-t border-white border-opacity-50">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={14} color="var(--color-text-muted)" />
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