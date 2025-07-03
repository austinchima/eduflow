import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ progressData }) => {
  const stats = [
    {
      label: 'Total Tools',
      value: progressData.totalTools,
      icon: 'BookOpen',
      color: 'text-primary bg-primary-50'
    },
    {
      label: 'Completed',
      value: progressData.completedTools,
      icon: 'CheckCircle',
      color: 'text-success bg-success-50'
    },
    {
      label: 'In Progress',
      value: progressData.inProgressTools,
      icon: 'Clock',
      color: 'text-warning bg-warning-50'
    },
    {
      label: 'Due Reviews',
      value: progressData.dueReviews,
      icon: 'RotateCcw',
      color: 'text-accent bg-accent-50'
    }
  ];

  const completionRate = progressData.totalTools > 0 
    ? Math.round((progressData.completedTools / progressData.totalTools) * 100)
    : 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <h2 className="text-lg font-semibold text-text-primary">Progress Overview</h2>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-text-primary">{completionRate}%</div>
          <div className="text-xs text-text-secondary">Overall Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-smooth"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
              <Icon name={stat.icon} size={20} color="currentColor" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Progress */}
      {progressData.weeklyProgress && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium text-text-primary mb-3">This Week</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} color="var(--color-success)" />
              <span className="text-sm text-text-secondary">
                {progressData.weeklyProgress.completed} tools completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} color="var(--color-warning)" />
              <span className="text-sm text-text-secondary">
                {progressData.weeklyProgress.studyTime} study time
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressOverview;