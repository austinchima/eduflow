import React from 'react';
import Button from '../../../components/ui/Button';

const NavigationControls = ({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSkip,
  onSubmit,
  hasAnswer = false,
  isLastQuestion = false,
  disabled = false 
}) => {
  const isFirstQuestion = currentQuestion === 1;

  return (
    <div className="bg-surface border-t border-border px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <div className="flex-1">
          {!isFirstQuestion && (
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={disabled}
              iconName="ChevronLeft"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
          )}
        </div>

        {/* Center Actions */}
        <div className="flex items-center space-x-3 mx-4">
          {!isLastQuestion && (
            <Button
              variant="ghost"
              onClick={onSkip}
              disabled={disabled}
              className="text-text-secondary hover:text-text-primary"
            >
              Skip
            </Button>
          )}
        </div>

        {/* Next/Submit Button */}
        <div className="flex-1 flex justify-end">
          {isLastQuestion ? (
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={disabled}
              iconName="Check"
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant={hasAnswer ? "primary" : "outline"}
              onClick={onNext}
              disabled={disabled}
              iconName="ChevronRight"
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="hidden lg:flex items-center justify-center mt-3 text-xs text-text-muted space-x-4">
        <span>← Previous</span>
        <span>→ Next</span>
        <span>Space Skip</span>
        {isLastQuestion && <span>Enter Submit</span>}
      </div>
    </div>
  );
};

export default NavigationControls;