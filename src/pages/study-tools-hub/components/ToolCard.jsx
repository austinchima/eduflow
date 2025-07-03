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
        return 'text-success bg-success-50';
      case 'in-progress':
        return 'text-warning bg-warning-50';
      case 'not-started':
        return 'text-text-muted bg-secondary-100';
      default:
        return 'text-text-muted bg-secondary-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-success bg-success-50';
      case 'medium':
        return 'text-warning bg-warning-50';
      case 'hard':
        return 'text-error bg-error-50';
      default:
        return 'text-text-muted bg-secondary-100';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name={getToolIcon(tool.type)} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">{tool.title}</h3>
            <p className="text-xs text-text-secondary">{tool.course}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => onShare(tool)}
            iconName="Share2"
            iconSize={16}
            className="p-1"
          />
          <Button
            variant="ghost"
            onClick={() => onEdit(tool)}
            iconName="Edit2"
            iconSize={16}
            className="p-1"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-sm text-text-secondary mb-2">{tool.description}</p>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs text-text-muted">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={12} />
            <span>{tool.createdDate}</span>
          </div>
          {tool.completionRate && (
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={12} />
              <span>{tool.completionRate}% complete</span>
            </div>
          )}
          {tool.score && (
            <div className="flex items-center space-x-1">
              <Icon name="Award" size={12} />
              <span>{tool.score}% score</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
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
            <Icon name="Clock" size={12} />
            <span>Due {tool.dueDate}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="primary"
          onClick={() => onStart(tool)}
          className="flex-1"
          iconName={tool.status === 'completed' ? 'RotateCcw' : 'Play'}
          iconSize={16}
        >
          {tool.status === 'completed' ? 'Review' : 'Start'}
        </Button>
        
        {tool.type === 'flashcard' && tool.dueReviews > 0 && (
          <div className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
            {tool.dueReviews} due
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;