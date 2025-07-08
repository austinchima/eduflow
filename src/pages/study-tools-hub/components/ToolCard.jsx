import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ToolCard = ({ tool, onStart, onEdit, onShare }) => {
  const getToolIcon = (type) => {
    switch (type) {
      case 'quiz':
        return 'HelpCircle';
      case 'flashcard':
        return 'Layers';
      case 'notes':
        return 'FileText';
      case 'session':
        return 'Clock';
      default:
        return 'BookOpen';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success-50 text-on-colored';
      case 'in-progress':
        return 'text-warning bg-warning-50 text-on-colored';
      case 'not-started':
        return 'text-text-muted bg-secondary-100 text-on-colored';
      default:
        return 'text-text-muted bg-secondary-100 text-on-colored';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-success bg-success-50 text-on-colored';
      case 'medium':
        return 'text-warning bg-warning-50 text-on-colored';
      case 'hard':
        return 'text-error bg-error-50 text-on-colored';
      default:
        return 'text-text-muted bg-secondary-100 text-on-colored';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={getToolIcon(tool.type)} size={16} className="sm:w-5 sm:h-5 icon-contrast" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-text-primary text-sm sm:text-base truncate">{tool.title}</h3>
            <p className="text-xs text-text-secondary truncate">{tool.course}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => onShare(tool)}
            iconName="Share2"
            iconSize={14}
            className="p-1.5 sm:p-1"
          />
          <Button
            variant="ghost"
            onClick={() => onEdit(tool)}
            iconName="Edit2"
            iconSize={14}
            className="p-1.5 sm:p-1"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-text-secondary mb-2 line-clamp-2">{tool.description}</p>
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-text-muted">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={12} className="icon-contrast" />
            <span>{tool.createdDate}</span>
          </div>
          {tool.completionRate && (
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={12} className="icon-contrast" />
              <span>{tool.completionRate}% complete</span>
            </div>
          )}
          {tool.score && (
            <div className="flex items-center space-x-1">
              <Icon name="Award" size={12} className="icon-contrast" />
              <span>{tool.score}% score</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tool.status)}`}>
            {tool.status.replace('-', ' ')}
          </span>
          {tool.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tool.difficulty)}`}>
              {tool.difficulty}
            </span>
          )}
        </div>
        
        {tool.dueDate && (
          <div className="flex items-center space-x-1 text-xs text-text-muted">
            <Icon name="Clock" size={12} className="icon-contrast" />
            <span>Due {tool.dueDate}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="primary"
          onClick={() => onStart(tool)}
          className="flex-1 text-sm sm:text-base py-2 sm:py-2.5"
          iconName={tool.status === 'completed' ? 'RotateCcw' : 'Play'}
          iconSize={16}
        >
          {tool.status === 'completed' ? 'Review' : 'Start'}
        </Button>
        
        {tool.type === 'flashcard' && tool.dueReviews > 0 && (
          <div className="bg-accent text-accent-foreground px-2 py-2 sm:py-1 rounded text-xs font-medium whitespace-nowrap">
            {tool.dueReviews} due
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;