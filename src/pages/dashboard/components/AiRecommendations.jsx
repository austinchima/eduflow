import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AiRecommendations = ({ recommendations }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error-50 border-error-100';
      case 'medium': return 'text-warning bg-warning-50 border-warning-100';
      case 'low': return 'text-success bg-success-50 border-success-100';
      default: return 'text-text-muted bg-secondary-50 border-secondary-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const handleRecommendationClick = (recommendation) => {
    switch (recommendation.type) {
      case 'quiz': navigate('/quiz-interface');
        break;
      case 'flashcard': navigate('/flashcard-study-session');
        break;
      case 'study': navigate('/study-tools-hub');
        break;
      case 'course': navigate('/course-management');
        break;
      default:
        navigate('/study-tools-hub');
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
          <Icon name="Brain" size={20} color="var(--color-accent)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">AI Recommendations</h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(recommendation.priority)}`}>
                  <Icon 
                    name={getPriorityIcon(recommendation.priority)} 
                    size={16} 
                    color="currentColor"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-1">
                    {recommendation.title}
                  </h4>
                  <p className="text-sm text-text-secondary mb-2">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-text-muted">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{recommendation.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Target" size={12} />
                      <span>{recommendation.subject}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-text-muted">
                  <Icon name="TrendingUp" size={12} />
                  <span>+{recommendation.expectedImprovement}% improvement</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="ArrowRight"
                iconSize={14}
                onClick={() => handleRecommendationClick(recommendation)}
              >
                Start
              </Button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Brain" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
          <p className="text-text-muted mb-2">No recommendations yet</p>
          <p className="text-sm text-text-muted">
            Complete some activities to get personalized AI suggestions
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <Icon name="Sparkles" size={14} />
            <span>Powered by AI learning analytics</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiRecommendations;