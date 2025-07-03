import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  onFlag,
  isFlagged = false,
  showFeedback = false,
  isReviewMode = false 
}) => {
  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = selectedAnswer === option.id;
        const isCorrect = showFeedback && option.isCorrect;
        const isIncorrect = showFeedback && isSelected && !option.isCorrect;
        
        return (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(option.id)}
            disabled={showFeedback && !isReviewMode}
            className={`
              w-full p-4 text-left rounded-lg border-2 transition-all duration-200
              ${isSelected 
                ? isCorrect 
                  ? 'border-success bg-success-50 text-success-600'
                  : isIncorrect
                    ? 'border-error bg-error-50 text-error-600' :'border-primary bg-primary-50 text-primary-600' :'border-border hover:border-primary hover:bg-primary-50'
              }
              ${showFeedback && isCorrect && !isSelected ? 'border-success bg-success-50' : ''}
              ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0
                ${isSelected 
                  ? isCorrect 
                    ? 'border-success bg-success text-white'
                    : isIncorrect
                      ? 'border-error bg-error text-white' :'border-primary bg-primary text-white' :'border-border'
                }
                ${showFeedback && isCorrect && !isSelected ? 'border-success bg-success text-white' : ''}
              `}>
                {isSelected && (
                  <Icon 
                    name={showFeedback ? (isCorrect ? "Check" : "X") : "Check"} 
                    size={12} 
                  />
                )}
                {showFeedback && isCorrect && !isSelected && (
                  <Icon name="Check" size={12} />
                )}
              </div>
              
              <div className="flex-1">
                <span className="text-sm font-medium text-text-secondary mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-base">{option.text}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderMultipleSelect = () => (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = selectedAnswer?.includes(option.id);
        const isCorrect = showFeedback && option.isCorrect;
        
        return (
          <button
            key={option.id}
            onClick={() => {
              const currentAnswers = selectedAnswer || [];
              const newAnswers = isSelected
                ? currentAnswers.filter(id => id !== option.id)
                : [...currentAnswers, option.id];
              onAnswerSelect(newAnswers);
            }}
            disabled={showFeedback && !isReviewMode}
            className={`
              w-full p-4 text-left rounded-lg border-2 transition-all duration-200
              ${isSelected 
                ? 'border-primary bg-primary-50 text-primary-600' :'border-border hover:border-primary hover:bg-primary-50'
              }
              ${showFeedback && isCorrect ? 'border-success bg-success-50' : ''}
              ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0
                ${isSelected ? 'border-primary bg-primary text-white' : 'border-border'}
                ${showFeedback && isCorrect ? 'border-success bg-success text-white' : ''}
              `}>
                {(isSelected || (showFeedback && isCorrect)) && (
                  <Icon name="Check" size={12} />
                )}
              </div>
              
              <div className="flex-1">
                <span className="text-sm font-medium text-text-secondary mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-base">{option.text}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderTextInput = () => (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Type your answer here..."
        value={selectedAnswer || ''}
        onChange={(e) => onAnswerSelect(e.target.value)}
        disabled={showFeedback && !isReviewMode}
        className="w-full text-base p-4"
      />
      
      {showFeedback && question.correctAnswer && (
        <div className="p-4 bg-success-50 border border-success rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-success-600 mb-1">Correct Answer:</p>
              <p className="text-sm text-success-600">{question.correctAnswer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'multiple-select':
        return renderMultipleSelect();
      case 'text-input':
        return renderTextInput();
      default:
        return renderMultipleChoice();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 lg:p-8">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium text-text-secondary">
              Question {question.number}
            </span>
            {question.points && (
              <span className="text-sm text-text-muted">
                ({question.points} {question.points === 1 ? 'point' : 'points'})
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-text-primary leading-relaxed">
            {question.text}
          </h2>
          
          {question.description && (
            <p className="text-text-secondary mt-2 leading-relaxed">
              {question.description}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          onClick={() => onFlag(question.id)}
          iconName={isFlagged ? "Flag" : "Flag"}
          iconSize={20}
          className={`ml-4 ${isFlagged ? 'text-warning' : 'text-text-muted hover:text-warning'}`}
        />
      </div>

      {/* Question Content */}
      <div className="mb-6">
        {renderQuestionType()}
      </div>

      {/* Feedback */}
      {showFeedback && question.explanation && (
        <div className="mt-6 p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary mb-1">Explanation:</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;