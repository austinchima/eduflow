import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIInsightsPanel = ({ insights }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'recommendation': return 'Lightbulb';
      case 'warning': return 'AlertTriangle';
      case 'achievement': return 'Trophy';
      case 'pattern': return 'TrendingUp';
      default: return 'Brain';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'recommendation': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'achievement': return 'text-success';
      case 'pattern': return 'text-accent';
      default: return 'text-text-secondary';
    }
  };

  const getInsightBg = (type) => {
    switch (type) {
      case 'recommendation': return 'bg-primary-50 border-primary-100';
      case 'warning': return 'bg-warning-50 border-warning-100';
      case 'achievement': return 'bg-success-50 border-success-100';
      case 'pattern': return 'bg-accent-50 border-accent-100';
      default: return 'bg-secondary-50 border-secondary-100';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 card-elevation">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Brain" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">AI Insights</h3>
        </div>
        <Button variant="ghost" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${getInsightBg(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <Icon 
                name={getInsightIcon(insight.type)} 
                size={20} 
                className={`mt-0.5 ${getInsightColor(insight.type)}`}
              />
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1">{insight.title}</h4>
                <p className="text-sm text-text-secondary mb-3">{insight.description}</p>
                
                {insight.action && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    iconName="ArrowRight"
                    iconSize={14}
                  >
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-text-muted text-center">
          Insights updated every 24 hours based on your study patterns
        </p>
      </div>
    </div>
  );
};

export default AIInsightsPanel;