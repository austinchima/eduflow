import React from 'react';

import Icon from '../../../components/AppIcon';

const DifficultyButtons = ({ onDifficultySelect, disabled = false }) => {
  const difficultyOptions = [
    {
      key: 'again',
      label: 'Again',
      description: 'Completely forgot',
      color: 'danger',
      icon: 'RotateCcw',
      shortcut: '1',
      bgColor: 'bg-error-50',
      textColor: 'text-error-600',
      borderColor: 'border-error-200'
    },
    {
      key: 'hard',
      label: 'Hard',
      description: 'Difficult to recall',
      color: 'warning',
      icon: 'AlertTriangle',
      shortcut: '2',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-600',
      borderColor: 'border-warning-200'
    },
    {
      key: 'good',
      label: 'Good',
      description: 'Recalled with effort',
      color: 'info',
      icon: 'ThumbsUp',
      shortcut: '3',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
      borderColor: 'border-primary-200'
    },
    {
      key: 'easy',
      label: 'Easy',
      description: 'Perfect recall',
      color: 'success',
      icon: 'CheckCircle',
      shortcut: '4',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600',
      borderColor: 'border-success-200'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          How well did you know this?
        </h3>
        <p className="text-text-secondary text-sm">
          Your response affects when you'll see this card again
        </p>
      </div>

      {/* Mobile Layout - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {difficultyOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onDifficultySelect(option.key)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg border-2 focus:outline-none transition-all duration-200 w-full group ${option.bgColor} ${option.textColor} ${option.borderColor} text-on-colored`}
          >
            <Icon name={option.icon} size={20} className="icon-on-colored mb-1" />
            <span className="font-semibold text-on-colored">{option.label}</span>
            <span className="text-xs text-on-colored opacity-80">{option.description}</span>
            <span className="text-xs text-on-colored opacity-60 mt-1">[{option.shortcut}]</span>
          </button>
        ))}
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:grid grid-cols-4 gap-4">
        {difficultyOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onDifficultySelect(option.key)}
            disabled={disabled}
            className={`
              relative p-6 rounded-lg border-2 transition-all duration-200
              ${option.bgColor} ${option.borderColor} ${option.textColor}
              hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            `}
          >
            <div className="flex flex-col items-center space-y-3">
              <Icon name={option.icon} size={32} />
              <div className="text-center">
                <div className="font-semibold text-base mb-1">{option.label}</div>
                <div className="text-sm opacity-80 leading-tight">
                  {option.description}
                </div>
              </div>
            </div>
            
            {/* Keyboard Shortcut */}
            <div className="absolute top-3 right-3 w-7 h-7 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-text-primary">{option.shortcut}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard Instructions */}
      <div className="mt-6 text-center">
        <p className="text-text-muted text-sm">
          Use keyboard shortcuts 1-4 or click the buttons above
        </p>
      </div>
    </div>
  );
};

export default DifficultyButtons;