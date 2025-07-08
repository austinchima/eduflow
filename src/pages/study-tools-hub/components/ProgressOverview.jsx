import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ progressData }) => {
  const stats = [
    {
      label: 'Total Tools',
      value: progressData.totalTools,
      icon: 'BookOpen',
      color: 'text-primary bg-primary-50 text-on-colored'
    },
    {
      label: 'Completed',
      value: progressData.completedTools,
      icon: 'CheckCircle',
      color: 'text-success bg-success-50 text-on-colored'
    },
    {
      label: 'In Progress',
      value: progressData.inProgressTools,
      icon: 'Clock',
      color: 'text-warning bg-warning-50 text-on-colored'
    },
    {
      label: 'Due Reviews',
      value: progressData.dueReviews,
      icon: 'RotateCcw',
      color: 'text-accent bg-accent-50 text-on-colored'
    }
  ];

  const completionRate = progressData.totalTools > 0 
    ? Math.round((progressData.completedTools / progressData.totalTools) * 100)
    : 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="sm:w-5 sm:h-5 icon-contrast" />
          <h2 className="text-base sm:text-lg font-semibold text-text-primary">Progress Overview</h2>
        </div>
        
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-bold text-text-primary">{completionRate}%</div>
          <div className="text-xs text-text-secondary">Overall Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-smooth"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
              <Icon name={stat.icon} size={16} className="sm:w-5 sm:h-5" color="currentColor" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Progress */}
      {progressData.weeklyProgress && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <h3 className="font-medium text-text-primary mb-3 text-sm sm:text-base">This Week</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={14} className="sm:w-4 sm:h-4" color="var(--color-success)" />
              <span className="text-xs sm:text-sm text-text-secondary">
                {progressData.weeklyProgress.completed} tools completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="sm:w-4 sm:h-4" color="var(--color-warning)" />
              <span className="text-xs sm:text-sm text-text-secondary">
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