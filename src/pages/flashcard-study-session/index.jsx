import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import StudySessionControls from '../../components/ui/StudySessionControls';
import MobileNavigation from '../../components/ui/MobileNavigation';
import FlashcardDisplay from './components/FlashcardDisplay';
import DifficultyButtons from './components/DifficultyButtons';
import SessionProgress from './components/SessionProgress';
import SessionComplete from './components/SessionComplete';
import SessionSettings from './components/SessionSettings';
import { useUser } from '../../context/UserContext';

const FlashcardStudySession = () => {
  const navigate = useNavigate();
  const { flashcards, actions } = useUser();
  
  // Session state
  const [sessionState, setSessionState] = useState('settings'); // 'settings', 'active', 'complete'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [responses, setResponses] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionSettings, setSessionSettings] = useState(null);
  const [sessionCards, setSessionCards] = useState([]);

  // Get available decks from user data
  const availableDecks = flashcards.decks.map(deck => ({
    ...deck,
    totalCards: flashcards.cards.filter(card => card.deckId === deck.id).length,
    newCards: flashcards.cards.filter(card => card.deckId === deck.id && !card.lastReviewed).length,
    reviewCards: flashcards.cards.filter(card => card.deckId === deck.id && card.lastReviewed).length
  }));

  const handleStartSession = (settings) => {
    setSessionSettings(settings);
    
    // Filter cards based on selected deck and settings
    let filteredCards = flashcards.cards.filter(card => card.deckId === settings.deckId);
    
    // Apply review mode filter
    if (settings.reviewMode === 'new') {
      filteredCards = filteredCards.filter(card => !card.lastReviewed);
    } else if (settings.reviewMode === 'difficult') {
      filteredCards = filteredCards.filter(card => card.difficulty === 'hard');
    }
    
    // Shuffle and limit cards
    const shuffledCards = [...filteredCards].sort(() => Math.random() - 0.5);
    const limitedCards = shuffledCards.slice(0, settings.cardLimit);
    
    setSessionCards(limitedCards);
    setSessionState('active');
    setSessionStartTime(Date.now());
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setResponses([]);
    setStreak(0);
    setBestStreak(0);
    setSessionTime(0);
  };

  // Card flip handler
  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowAnswer(true);
    }
  };

  // Difficulty selection handler
  const handleDifficultySelect = (difficulty) => {
    const currentCard = sessionCards[currentCardIndex];
    const response = {
      cardId: currentCard.id,
      difficulty: difficulty,
      timestamp: new Date(),
      correct: difficulty === 'easy' || difficulty === 'medium'
    };

    setResponses(prev => [...prev, response]);

    // Update card difficulty in user data
    actions.updateFlashcard(currentCard.id, { 
      difficulty,
      lastReviewed: new Date(),
      reviewCount: (currentCard.reviewCount || 0) + 1
    });

    // Update streak
    if (response.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
    } else {
      setStreak(0);
    }

    // Move to next card or end session
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    } else {
      // Session complete
      const endTime = Date.now();
      const totalTime = Math.round((endTime - sessionStartTime) / 1000);
      setSessionTime(totalTime);
      setSessionState('complete');

      // Add activity to user data
      actions.addActivity({
        type: 'flashcard',
        title: `Flashcard Session - ${sessionCards.length} cards`,
        description: `Completed ${sessionCards.length} flashcards in ${Math.round(totalTime / 60)} minutes`,
        score: Math.round((responses.filter(r => r.correct).length / sessionCards.length) * 100)
      });
    }
  };

  // Session timer
  useEffect(() => {
    let interval;
    if (sessionState === 'active' && sessionStartTime) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.round((currentTime - sessionStartTime) / 1000);
        setSessionTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState, sessionStartTime]);

  // Navigation handlers
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleStartNewSession = () => {
    setSessionState('settings');
    setSessionCards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setResponses([]);
    setStreak(0);
    setBestStreak(0);
    setSessionTime(0);
    setSessionStartTime(null);
  };

  const handleCreateNewDeck = () => {
    // Navigate to deck creation or show modal
    console.log('Create new deck');
  };

  if (sessionState === 'settings') {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <StudySessionControls />
        <MobileNavigation />
        
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8 lg:ml-60">
          <div className="w-full max-w-4xl xl:max-w-5xl mx-auto">
            <SessionSettings
              availableDecks={availableDecks}
              onStartSession={handleStartSession}
              onCreateNewDeck={handleCreateNewDeck}
              onBack={handleBackToDashboard}
            />
          </div>
        </main>
      </div>
    );
  }

  if (sessionState === 'complete') {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <StudySessionControls />
        <MobileNavigation />
        
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8 lg:ml-60">
          <div className="w-full max-w-4xl xl:max-w-5xl mx-auto">
            <SessionComplete
              sessionData={{
                totalCards: sessionCards.length,
                correctAnswers: responses.filter(r => r.correct).length,
                sessionTime,
                streak,
                bestStreak,
                responses
              }}
              onStartNewSession={handleStartNewSession}
              onBackToDashboard={handleBackToDashboard}
            />
          </div>
        </main>
      </div>
    );
  }

  if (sessionCards.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <StudySessionControls />
        <MobileNavigation />
        
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8 lg:ml-60">
          <div className="w-full max-w-4xl xl:max-w-5xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                No cards available for this session
              </h2>
              <p className="text-text-secondary mb-6">
                Try selecting a different deck or review mode.
              </p>
              <button
                onClick={() => setSessionState('settings')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Back to Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentCard = sessionCards[currentCardIndex];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <StudySessionControls />
      <MobileNavigation />
      
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8 lg:ml-60">
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto">
          {/* Session Progress */}
          <SessionProgress
            currentCard={currentCardIndex + 1}
            totalCards={sessionCards.length}
            sessionTime={sessionTime}
            streak={streak}
          />

          {/* Flashcard Display */}
          <div className="max-w-2xl mx-auto mb-8">
            <FlashcardDisplay
              card={currentCard}
              isFlipped={isFlipped}
              showAnswer={showAnswer}
              onFlip={handleFlip}
            />
          </div>

          {/* Difficulty Buttons */}
          {showAnswer && (
            <div className="max-w-md mx-auto">
              <DifficultyButtons onDifficultySelect={handleDifficultySelect} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleBackToDashboard}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Exit Session
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashcardStudySession;