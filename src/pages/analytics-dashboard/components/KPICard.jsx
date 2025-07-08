import React from 'react';
import Icon from '../../../components/AppIcon';
import { useTheme } from '../../../context/ThemeContext';

const KPICard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const { isDark } = useTheme();
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
          <p className="text-sm font-medium text-text-secondary dark:text-white mb-1">{title}</p>
          <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-text-primary'}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-text-muted dark:text-white/80">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]} icon-on-colored`}>
          <Icon name={icon} size={24} className="icon-on-colored" />
        </div>
      </div>

      {trend && trendValue && (
        <div className="flex items-center mt-4 pt-4 border-t border-border">
          <Icon name={getTrendIcon()} size={16} className={`icon-on-colored ${getTrendColor()} ${isDark ? 'text-white' : ''}`} />
          <span className={`text-sm font-medium ml-1 text-on-colored ${getTrendColor()} ${isDark ? 'text-white' : ''}`}>
            {trendValue}
          </span>
          <span className="text-sm text-text-muted dark:text-white/80 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;