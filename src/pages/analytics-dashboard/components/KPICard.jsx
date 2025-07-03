import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary border-primary-100',
    success: 'bg-success-50 text-success border-success-100',
    warning: 'bg-warning-50 text-warning border-warning-100',
    accent: 'bg-accent-50 text-accent border-accent-100'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-text-muted';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 card-elevation">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>

      {trend && trendValue && (
        <div className="flex items-center mt-4 pt-4 border-t border-border">
          <Icon name={getTrendIcon()} size={16} className={getTrendColor()} />
          <span className={`text-sm font-medium ml-1 ${getTrendColor()}`}>
            {trendValue}
          </span>
          <span className="text-sm text-text-muted ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;