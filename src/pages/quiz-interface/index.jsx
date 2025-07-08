import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { generateAIContent } from '../../services/aiService';
import { testConnection } from '../../utils/aiTest';
import QuizHeader from './components/QuizHeader';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import NavigationControls from './components/NavigationControls';
import QuizResults from './components/QuizResults';
import QuizReview from './components/QuizReview';

const QuizInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, quizzes, user } = useUser();
  
  // Get quiz data from location state or context
  const quizId = location.state?.quizId;
  const quizDataFromState = location.state?.quizData;
  const quizFromContext = quizId ? quizzes.available.find(q => String(q.id) === String(quizId)) : null;
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizState, setQuizState] = useState('loading'); // loading, active, completed, review
  const [results, setResults] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [error, setError] = useState(null);
  const [localQuizData, setLocalQuizData] = useState(quizFromContext || quizDataFromState);

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setQuizState('loading');
        // Always prefer context if quizId is present
        if (quizFromContext) {
          setLocalQuizData(quizFromContext);
          setTimeRemaining(quizFromContext.timeLimit || 1800);
          setQuizState('active');
          return;
        }
        // Fallback to navigation state
        if (quizDataFromState) {
          setLocalQuizData(quizDataFromState);
          setTimeRemaining(quizDataFromState.timeLimit || 1800);
          setQuizState('active');
          return;
        }
        // No quiz data found
        setError('Quiz data not found. Please access this quiz from the Study Tools Hub.');
        setQuizState('error');
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        setQuizState('error');
      }
    };
    loadQuiz();
  // eslint-disable-next-line
  }, [quizId, quizFromContext, quizDataFromState]);

  // Auto-save functionality
  useEffect(() => {
    if (quizState !== 'active') return;
    
    const saveProgress = () => {
      setAutoSaveStatus('saving');
      // TODO: Save progress to backend or localStorage
      setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 500);
    };

    const timer = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timer);
  }, [userAnswers, flaggedQuestions, quizState]);

  // Timer functionality
  useEffect(() => {
    if (quizState !== 'active' || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, timeRemaining]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (quizState !== 'active') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          handleSkip();
          break;
        case 'Enter':
          if (currentQuestion === (localQuizData?.questions?.length || 0)) {
            e.preventDefault();
            handleSubmitQuiz();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quizState, currentQuestion, localQuizData]);

  const handleAnswerSelect = (answer) => {
    if (!localQuizData?.questions) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [localQuizData.questions[currentQuestion - 1].id]: answer
    }));
  };

  const handleFlag = (questionId) => {
    setFlaggedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleNext = () => {
    if (!localQuizData?.questions) return;
    
    if (currentQuestion < localQuizData.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const calculateResults = useCallback(() => {
    if (!localQuizData?.questions) return null;
    
    let correctAnswers = 0;
    let totalScore = 0;
    let maxScore = 0;

    localQuizData.questions.forEach(question => {
      maxScore += question.points || 1;
      const userAnswer = userAnswers[question.id];
      
      if (!userAnswer) return;

      let isCorrect = false;
      
      if (question.type === 'multiple-choice') {
        const correctOption = question.options?.find(opt => opt.isCorrect);
        isCorrect = userAnswer === correctOption?.id;
      } else if (question.type === 'multiple-select') {
        const correctOptions = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id);
        const userOptions = Array.isArray(userAnswer) ? userAnswer : [];
        isCorrect = correctOptions.length === userOptions.length && 
                   correctOptions.every(id => userOptions.includes(id));
      } else if (question.type === 'text-input') {
        isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
      }

      if (isCorrect) {
        correctAnswers++;
        totalScore += question.points || 1;
      }
    });

    const accuracy = (correctAnswers / localQuizData.questions.length) * 100;
    const scorePercentage = (totalScore / maxScore) * 100;

    // Generate AI recommendations based on performance
    const recommendations = [];
    
    if (accuracy < 70) {
      recommendations.push({
        title: 'Review Fundamental Concepts',
        description: 'Focus on understanding basic concepts and principles covered in this quiz.'
      });
    }
    
    if (accuracy < 50) {
      recommendations.push({
        title: 'Practice More Problems',
        description: 'Solve additional practice problems to improve your understanding.'
      });
    }
    
    if (flaggedQuestions.length > 0) {
      recommendations.push({
        title: 'Review Flagged Questions',
        description: 'Pay special attention to the questions you flagged during the quiz.'
      });
    }

    return {
      score: totalScore,
      maxScore,
      totalQuestions: localQuizData.questions.length,
      correctAnswers,
      accuracy,
      scorePercentage,
      timeSpent: (localQuizData.timeLimit || 1800) - timeRemaining,
      recommendations
    };
  }, [userAnswers, flaggedQuestions, timeRemaining, localQuizData]);

  const handleSubmitQuiz = () => {
    const quizResults = calculateResults();
    if (!quizResults) return;
    
    setResults(quizResults);
    setQuizState('completed');
    
    // Save quiz results to context
    if (quizId) {
      actions.completeQuiz(quizId, quizResults);
    }
  };

  const handleReview = () => {
    setQuizState('review');
  };

  const handleRetake = () => {
    setCurrentQuestion(1);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setTimeRemaining(localQuizData?.timeLimit || 1800);
    setQuizState('active');
    setResults(null);
  };

  const handleExit = () => {
    navigate('/study-tools-hub');
  };

  const handleGenerateQuestions = async () => {
    try {
      setQuizState('loading');
      
      // Get course information for context
      const course = academic.courses.find(c => c.id === localQuizData.courseId);
      const subject = course?.name || localQuizData.title || 'General';
      const topic = localQuizData.description || subject;
      const difficulty = localQuizData.difficulty || 'medium';
      
      // Generate questions using AI service
      const prompt = `Generate 5 quiz questions for the subject "${subject}" on the topic "${topic}". 
      
Requirements:
- Difficulty level: ${difficulty}
- Mix of question types: multiple-choice, multiple-select, and text-input
- Each question should test understanding of key concepts
- Include explanations for correct answers
- Questions should be educational and relevant to the topic

Format the response as a JSON array with the following structure:
[
  {
    "id": "unique_id",
    "type": "multiple-choice|multiple-select|text-input",
    "text": "Question text",
    "points": 2,
    "options": [
      {"id": "a", "text": "Option text", "isCorrect": true/false}
    ],
    "correctAnswer": "text for text-input questions",
    "explanation": "Explanation of the correct answer"
  }
]

For multiple-choice questions, include 4 options with only one correct answer.
For multiple-select questions, include 4 options with 2-3 correct answers.
For text-input questions, provide a clear, specific answer.`;

      const aiResponse = await generateAIContent(prompt, user);
      
      // Try to extract JSON from the response
      let aiQuestions;
      try {
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          aiQuestions = JSON.parse(jsonMatch[0]);
        } else {
          aiQuestions = JSON.parse(aiResponse);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        throw new Error('Failed to parse AI-generated questions');
      }

      // Validate and clean up the questions
      const validatedQuestions = aiQuestions.map((question, index) => ({
        id: `ai_q${index + 1}`,
        type: question.type || 'multiple-choice',
        text: question.text || `Question ${index + 1}`,
        points: question.points || 2,
        options: question.options || [],
        correctAnswer: question.correctAnswer || '',
        explanation: question.explanation || 'No explanation provided.'
      }));
      
      // Update quiz data with AI-generated questions
      const updatedQuizData = {
        ...localQuizData,
        questions: validatedQuestions,
        timeLimit: localQuizData.timeLimit || 1800
      };
      
      // Update the quiz in context
      if (quizId) {
        actions.updateQuiz(quizId, { questions: validatedQuestions });
      }
      
      // Update local state
      setLocalQuizData(updatedQuizData);
      setTimeRemaining(updatedQuizData.timeLimit);
      setQuizState('active');
      
    } catch (error) {
      console.error('Failed to generate questions:', error);
      setError(`Failed to generate questions: ${error.message}`);
      setQuizState('error');
    }
  };

  const handleTestAIConnection = async () => {
    try {
      setQuizState('loading...');
      const isConnected = await testConnection();
      
      if (isConnected) {
        // If connection is successful, try to generate questions
        await handleGenerateQuestions();
      } else {
        setError('AI service connection failed. Please check your API key.');
        setQuizState('error');
      }
    } catch (error) {
      setError(`AI test failed: ${error.message}`);
      setQuizState('error');
    }
  };

  const getAnsweredQuestions = () => {
    return Object.keys(userAnswers).filter(questionId => {
      const answer = userAnswers[questionId];
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return answer !== null && answer !== undefined && answer !== '';
    });
  };

  // Loading state
  if (quizState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (quizState === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Quiz Error</h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={handleExit}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Study Tools
          </button>
        </div>
      </div>
    );
  }

  // No quiz data
  if (!localQuizData || !localQuizData.questions || localQuizData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Quiz Available</h3>
          <p className="text-text-secondary mb-6">
            This quiz doesn't have any questions yet. Questions will be generated by AI based on your course content.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleGenerateQuestions}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full"
            >
              Generate AI Questions
            </button>
            {import.meta.env.DEV && (
              <button
                onClick={handleTestAIConnection}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors w-full text-sm"
              >
                Test AI Connection (Dev)
              </button>
            )}
            <button
              onClick={handleExit}
              className="bg-muted text-text-primary px-6 py-2 rounded-lg hover:bg-muted-dark transition-colors w-full"
            >
              Back to Study Tools
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = localQuizData.questions[currentQuestion - 1];
  const hasCurrentAnswer = userAnswers[currentQuestionData?.id] !== undefined;
  const isLastQuestion = currentQuestion === localQuizData.questions.length;
  const answeredQuestions = getAnsweredQuestions();

  // Render quiz results
  if (quizState === 'completed') {
    return (
      <QuizResults
        results={results}
        onReview={handleReview}
        onRetake={handleRetake}
        onExit={handleExit}
      />
    );
  }

  // Render quiz review
  if (quizState === 'review') {
    return (
      <QuizReview
        questions={localQuizData.questions.map(q => ({
          ...q,
          flagged: flaggedQuestions.includes(q.id)
        }))}
        userAnswers={userAnswers}
        onExit={handleExit}
        onRetake={handleRetake}
        results={results}
      />
    );
  }

  // Render active quiz
  return (
    <div className="min-h-screen bg-background">
      {/* Quiz Header */}
      <QuizHeader
        quizTitle={localQuizData.title || 'Quiz'}
        currentQuestion={currentQuestion}
        totalQuestions={localQuizData.questions.length}
        timeRemaining={timeRemaining}
        onExit={handleExit}
        showTimer={true}
      />

      {/* Progress Bar */}
      <ProgressBar
        currentQuestion={currentQuestion}
        totalQuestions={localQuizData.questions.length}
        answeredQuestions={answeredQuestions}
        flaggedQuestions={flaggedQuestions}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl xl:max-w-7xl mx-auto">
          {/* Auto-save Status */}
          {autoSaveStatus === 'saving' && (
            <div className="mb-4 text-center">
              <span className="text-sm text-text-muted">Saving progress...</span>
            </div>
          )}

          {/* Question Card */}
          <QuestionCard
            question={{
              ...currentQuestionData,
              number: currentQuestion
            }}
            selectedAnswer={userAnswers[currentQuestionData.id]}
            onAnswerSelect={handleAnswerSelect}
            onFlag={handleFlag}
            isFlagged={flaggedQuestions.includes(currentQuestionData.id)}
            showFeedback={false}
            isReviewMode={false}
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <NavigationControls
        currentQuestion={currentQuestion}
        totalQuestions={localQuizData.questions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSkip={handleSkip}
        onSubmit={handleSubmitQuiz}
        hasAnswer={hasCurrentAnswer}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
};

export default QuizInterface;