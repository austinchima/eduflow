import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import QuestionCard from './QuestionCard';

const QuizReview = ({ 
  questions, 
  userAnswers, 
  onExit, 
  onRetake,
  results 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [filter, setFilter] = useState('all'); // all, correct, incorrect, flagged

  const currentQuestionData = questions[currentQuestion - 1];
  const userAnswer = userAnswers[currentQuestionData.id];

  const getQuestionStatus = (question) => {
    const answer = userAnswers[question.id];
    if (!answer) return 'unanswered';
    
    if (question.type === 'multiple-choice') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      return answer === correctOption?.id ? 'correct' : 'incorrect';
    }
    
    if (question.type === 'multiple-select') {
      const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
      const userOptions = Array.isArray(answer) ? answer : [];
      const isCorrect = correctOptions.length === userOptions.length && 
                       correctOptions.every(id => userOptions.includes(id));
      return isCorrect ? 'correct' : 'incorrect';
    }
    
    if (question.type === 'text-input') {
      return answer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim() 
        ? 'correct' : 'incorrect';
    }
    
    return 'unanswered';
  };

  const filteredQuestions = questions.filter(question => {
    const status = getQuestionStatus(question);
    switch (filter) {
      case 'correct':
        return status === 'correct';
      case 'incorrect':
        return status === 'incorrect' || status === 'unanswered';
      case 'flagged':
        return question.flagged;
      default:
        return true;
    }
  });

  const getFilterCount = (filterType) => {
    return questions.filter(question => {
      const status = getQuestionStatus(question);
      switch (filterType) {
        case 'correct':
          return status === 'correct';
        case 'incorrect':
          return status === 'incorrect' || status === 'unanswered';
        case 'flagged':
          return question.flagged;
        default:
          return true;
      }
    }).length;
  };

  const goToQuestion = (questionNumber) => {
    setCurrentQuestion(questionNumber);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon name="Eye" size={20} color="var(--color-primary)" />
            <h1 className="text-xl font-semibold text-text-primary">Quiz Review</h1>
            <div className="text-sm text-text-secondary">
              Question {currentQuestion} of {questions.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={onRetake}
              iconName="RotateCcw"
              iconSize={16}
              className="hidden sm:flex"
            >
              Retake
            </Button>
            
            <Button
              variant="ghost"
              onClick={onExit}
              iconName="X"
              iconSize={20}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Question Navigation Sidebar */}
        <div className="lg:w-80 bg-surface border-r border-border p-4 lg:p-6">
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: questions.length },
                { key: 'correct', label: 'Correct', count: getFilterCount('correct') },
                { key: 'incorrect', label: 'Incorrect', count: getFilterCount('incorrect') },
                { key: 'flagged', label: 'Flagged', count: getFilterCount('flagged') }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${filter === tab.key 
                      ? 'bg-primary text-primary-foreground text-on-colored' 
                      : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200 text-on-colored'
                    }
                  `}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
            {filteredQuestions.map((question, index) => {
              const status = getQuestionStatus(question);
              const questionNumber = questions.findIndex(q => q.id === question.id) + 1;
              const isActive = questionNumber === currentQuestion;
              
              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(questionNumber)}
                  className={`
                    w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 text-on-colored' 
                      : status === 'correct' ?'bg-success text-success-foreground hover:bg-success-600 text-on-colored'
                        : status === 'incorrect' ?'bg-error text-error-foreground hover:bg-error-600 text-on-colored' :'bg-secondary-200 text-text-secondary hover:bg-secondary-300 text-on-colored'
                    }
                    ${question.flagged ? 'ring-2 ring-warning ring-offset-1' : ''}
                  `}
                >
                  {questionNumber}
                </button>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <h3 className="font-medium text-text-primary mb-3">Review Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Score:</span>
                <span className="font-medium text-text-primary">{results.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Correct:</span>
                <span className="font-medium text-success">{getFilterCount('correct')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Incorrect:</span>
                <span className="font-medium text-error">{getFilterCount('incorrect')}</span>
              </div>
              {getFilterCount('flagged') > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Flagged:</span>
                  <span className="font-medium text-warning">{getFilterCount('flagged')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <QuestionCard
              question={{
                ...currentQuestionData,
                number: currentQuestion
              }}
              selectedAnswer={userAnswer}
              onAnswerSelect={() => {}} // Read-only in review mode
              onFlag={() => {}} // Read-only in review mode
              isFlagged={currentQuestionData.flagged}
              showFeedback={true}
              isReviewMode={true}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>

              <div className="text-sm text-text-secondary">
                Question {currentQuestion} of {questions.length}
              </div>

              <Button
                variant="outline"
                onClick={nextQuestion}
                disabled={currentQuestion === questions.length}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;