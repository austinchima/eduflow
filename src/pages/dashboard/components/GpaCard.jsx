import React from 'react';
import Icon from '../../../components/AppIcon';

const GpaCard = ({ currentGpa, targetGpa, semester }) => {
  const gpaPercentage = (currentGpa / 4.0) * 100;
  
  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return 'text-success';
    if (gpa >= 3.0) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="icon-contrast" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Current GPA</h3>
            <p className="text-sm text-text-secondary">{semester}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getGpaColor(currentGpa)}`}>
            {currentGpa.toFixed(2)}
          </div>
          <div className="text-sm text-text-muted">/ 4.00</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Progress to Target</span>
          <span className="text-sm font-medium text-text-primary">
            Target: {targetGpa.toFixed(2)}
          </span>
        </div>
        
        <div className="w-full bg-secondary-100 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(gpaPercentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-text-muted">
          <span>0.0</span>
          <span>4.0</span>
        </div>
      </div>
    </div>
  );
};

export default GpaCard;