import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz': return 'HelpCircle';
      case 'study': return 'Brain';
      case 'flashcard': return 'Layers';
      case 'note': return 'FileText';
      case 'achievement': return 'Award';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'quiz': return 'text-primary';
      case 'study': return 'text-accent';
      case 'flashcard': return 'text-warning';
      case 'note': return 'text-secondary';
      case 'achievement': return 'text-success';
      default: return 'text-text-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
          <Icon name="Activity" size={20} color="var(--color-secondary)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-opacity-10 ${getActivityColor(activity.type)} bg-current`}>
              <Icon 
                name={getActivityIcon(activity.type)} 
                size={16} 
                color={`var(--color-${activity.type === 'quiz' ? 'primary' : activity.type === 'study' ? 'accent' : activity.type === 'flashcard' ? 'warning' : activity.type === 'achievement' ? 'success' : 'secondary'})`}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary font-medium mb-1">
                {activity.title}
              </p>
              <p className="text-xs text-text-secondary mb-2">
                {activity.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {formatTimeAgo(activity.timestamp)}
                </span>
                {activity.score && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    activity.score >= 80 ? 'bg-success-50 text-success' :
                    activity.score >= 60 ? 'bg-warning-50 text-warning': 'bg-error-50 text-error'
                  }`}>
                    {activity.score}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
          <p className="text-text-muted">No recent activity</p>
          <p className="text-sm text-text-muted mt-2">Start studying to see your progress here</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;