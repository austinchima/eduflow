import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const StudySessionControls = ({ progress = 0, sessionTitle = '', onExit }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isStudySession = ['/quiz-interface', '/flashcard-study-session'].includes(location.pathname);

  if (!isStudySession) {
    return null;
  }

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate('/dashboard');
    }
  };

  const getSessionTitle = () => {
    if (sessionTitle) return sessionTitle;
    
    switch (location.pathname) {
      case '/quiz-interface':
        return 'Quiz Session';
      case '/flashcard-study-session':
        return 'Flashcard Study';
      default:
        return 'Study Session';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-150 lg:left-16">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Session Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={20} color="var(--color-primary)" />
            <h2 className="text-lg font-semibold text-text-primary">{getSessionTitle()}</h2>
          </div>
          
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-32 h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-smooth"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-sm text-text-secondary font-medium">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Mobile Progress */}
          {progress > 0 && (
            <div className="sm:hidden flex items-center space-x-2">
              <div className="w-16 h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-smooth"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary font-medium">
                {Math.round(progress)}%
              </span>
            </div>
          )}

          {/* Exit Button */}
          <Button
            variant="ghost"
            onClick={handleExit}
            iconName="X"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>
      </div>

      {/* Mobile Progress Bar (Full Width) */}
      {progress > 0 && (
        <div className="sm:hidden px-4 pb-2">
          <div className="w-full h-1 bg-secondary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 ease-smooth"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessionControls;