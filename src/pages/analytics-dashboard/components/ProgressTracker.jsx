import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = ({ goals }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 70) return 'bg-accent';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const getProgressBg = (percentage) => {
    if (percentage >= 90) return 'bg-success-100';
    if (percentage >= 70) return 'bg-accent-100';
    if (percentage >= 50) return 'bg-warning-100';
    return 'bg-error-100';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 card-elevation">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Goal Progress</h3>
          <p className="text-sm text-text-secondary">Track your academic milestones</p>
        </div>
        <Icon name="Target" size={20} className="text-primary" />
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name={goal.icon} size={16} className="text-text-secondary" />
                <span className="font-medium text-text-primary">{goal.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-primary">
                  {goal.current}/{goal.target}
                </span>
                <span className="text-xs text-text-muted">{goal.unit}</span>
              </div>
            </div>
            
            <div className="relative">
              <div className={`w-full h-2 rounded-full ${getProgressBg(goal.percentage)}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(goal.percentage)}`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-muted">{goal.startDate}</span>
                <span className="text-xs font-medium text-text-primary">
                  {Math.round(goal.percentage)}%
                </span>
                <span className="text-xs text-text-muted">{goal.deadline}</span>
              </div>
            </div>

            {goal.streak && (
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Flame" size={14} className="text-warning" />
                <span className="text-text-secondary">
                  {goal.streak} day streak
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Overall Progress</span>
          <span className="font-medium text-text-primary">
            {Math.round(goals.reduce((acc, goal) => acc + goal.percentage, 0) / goals.length)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;