import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FlashcardDisplay = ({ 
  card, 
  onFlip, 
  onDifficultySelect, 
  isFlipped, 
  showAnswer,
  currentIndex,
  totalCards 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onFlip();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (showAnswer) {
      if (isLeftSwipe) {
        onDifficultySelect('hard');
      } else if (isRightSwipe) {
        onDifficultySelect('easy');
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (showAnswer) {
        switch (e.key) {
          case '1':
            onDifficultySelect('again');
            break;
          case '2':
            onDifficultySelect('hard');
            break;
          case '3':
            onDifficultySelect('good');
            break;
          case '4':
            onDifficultySelect('easy');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAnswer, onFlip, onDifficultySelect]);

  if (!card) {
    return (
      <div className="flex items-center justify-center h-96 bg-surface rounded-xl border border-border">
        <div className="text-center">
          <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary">No flashcard available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Counter */}
      <div className="flex justify-center mb-4">
        <div className="bg-secondary-100 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-text-secondary">
            {currentIndex + 1} of {totalCards}
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className={`
          relative h-96 cursor-pointer select-none
          transform transition-transform duration-300 ease-smooth
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}
        onClick={handleFlip}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`
          absolute inset-0 w-full h-full rounded-xl shadow-lg
          transform transition-transform duration-300 preserve-3d
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Front Side */}
          <div className={`
            absolute inset-0 w-full h-full bg-surface border border-border rounded-xl
            flex flex-col items-center justify-center p-8 backface-hidden
            ${isFlipped ? 'opacity-0' : 'opacity-100'}
          `}>
            <div className="text-center">
              {card.frontImage && (
                <div className="mb-6">
                  <img 
                    src={card.frontImage} 
                    alt="Flashcard front" 
                    className="max-w-full max-h-32 object-contain mx-auto rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-2xl lg:text-3xl font-semibold text-text-primary mb-4 leading-relaxed">
                {card.front}
              </h2>
              {card.frontHint && (
                <p className="text-text-secondary text-sm italic">
                  Hint: {card.frontHint}
                </p>
              )}
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2 text-text-muted">
                <Icon name="MousePointer" size={16} />
                <span className="text-sm">Tap to reveal answer</span>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className={`
            absolute inset-0 w-full h-full bg-accent-50 border border-accent-200 rounded-xl
            flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180
            ${isFlipped ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="text-center flex-1 flex flex-col justify-center">
              {card.backImage && (
                <div className="mb-6">
                  <img 
                    src={card.backImage} 
                    alt="Flashcard back" 
                    className="max-w-full max-h-32 object-contain mx-auto rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-2xl lg:text-3xl font-semibold text-text-primary mb-4 leading-relaxed">
                {card.back}
              </h2>
              {card.backExplanation && (
                <p className="text-text-secondary text-base leading-relaxed max-w-lg">
                  {card.backExplanation}
                </p>
              )}
            </div>

            {card.audioUrl && (
              <div className="mb-4">
                <Button
                  variant="ghost"
                  iconName="Volume2"
                  iconSize={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    const audio = new Audio(card.audioUrl);
                    audio.play();
                  }}
                  className="text-accent-600 hover:text-accent-700"
                >
                  Play Audio
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swipe Instructions */}
      {showAnswer && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-6 text-text-muted text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="ArrowLeft" size={16} />
              <span>Swipe left: Hard</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="ArrowRight" size={16} />
              <span>Swipe right: Easy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardDisplay;