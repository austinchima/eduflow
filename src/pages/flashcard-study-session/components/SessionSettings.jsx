import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SessionSettings = ({ onStartSession, availableDecks }) => {
  const [selectedDeck, setSelectedDeck] = useState(availableDecks[0]?.id || '');
  const [cardLimit, setCardLimit] = useState(20);
  const [reviewMode, setReviewMode] = useState('mixed');
  const [timeLimit, setTimeLimit] = useState(0); // 0 means no limit
  const [showTimer, setShowTimer] = useState(true);

  const reviewModes = [
    { value: 'mixed', label: 'Mixed Review', description: 'All cards in random order' },
    { value: 'new', label: 'New Cards Only', description: 'Cards you haven\'t studied yet' },
    { value: 'review', label: 'Review Only', description: 'Cards due for review' },
    { value: 'difficult', label: 'Difficult Cards', description: 'Cards marked as hard or again' }
  ];

  const timeLimitOptions = [
    { value: 0, label: 'No Time Limit' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 1800, label: '30 minutes' }
  ];

  const handleStartSession = () => {
    const settings = {
      deckId: selectedDeck,
      cardLimit,
      reviewMode,
      timeLimit,
      showTimer
    };
    onStartSession(settings);
  };

  const selectedDeckData = availableDecks.find(deck => deck.id === selectedDeck);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Settings" size={32} color="white" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Configure Study Session
        </h2>
        <p className="text-text-secondary">
          Customize your flashcard study session settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Deck Selection */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="BookOpen" size={20} className="mr-2" />
            Select Deck
          </h3>
          
          <div className="space-y-3">
            {availableDecks.map((deck) => (
              <label
                key={deck.id}
                className={`
                  flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedDeck === deck.id 
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-secondary-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="deck"
                  value={deck.id}
                  checked={selectedDeck === deck.id}
                  onChange={(e) => setSelectedDeck(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-text-primary">{deck.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>{deck.totalCards} cards</span>
                      <span>{deck.newCards} new</span>
                      <span>{deck.reviewCards} review</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{deck.description}</p>
                </div>
                {selectedDeck === deck.id && (
                  <Icon name="CheckCircle" size={20} className="text-primary ml-3" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Sliders" size={20} className="mr-2" />
            Session Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card Limit */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Number of Cards
              </label>
              <Input
                type="number"
                value={cardLimit}
                onChange={(e) => setCardLimit(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={selectedDeckData?.totalCards || 100}
                className="w-full"
              />
              <p className="text-xs text-text-secondary mt-1">
                Max: {selectedDeckData?.totalCards || 0} cards available
              </p>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Time Limit
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {timeLimitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Review Mode */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Filter" size={20} className="mr-2" />
            Review Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviewModes.map((mode) => (
              <label
                key={mode.value}
                className={`
                  flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${reviewMode === mode.value 
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-secondary-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="reviewMode"
                  value={mode.value}
                  checked={reviewMode === mode.value}
                  onChange={(e) => setReviewMode(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">{mode.label}</div>
                  <div className="text-sm text-text-secondary mt-1">{mode.description}</div>
                </div>
                {reviewMode === mode.value && (
                  <Icon name="CheckCircle" size={20} className="text-primary ml-2 mt-0.5" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="MoreHorizontal" size={20} className="mr-2" />
            Additional Options
          </h3>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <div className="font-medium text-text-primary">Show Timer</div>
                <div className="text-sm text-text-secondary">Display elapsed time during session</div>
              </div>
            </label>
          </div>
        </div>

        {/* Start Button */}
        <Button
          variant="primary"
          onClick={handleStartSession}
          iconName="Play"
          iconPosition="left"
          fullWidth
          className="py-4 text-lg font-semibold"
          disabled={!selectedDeck}
        >
          Start Study Session
        </Button>

        {/* Session Preview */}
        {selectedDeckData && (
          <div className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-text-primary mb-1">Session Preview</h4>
                <p className="text-sm text-text-secondary">
                  You'll study {Math.min(cardLimit, selectedDeckData.totalCards)} cards from "{selectedDeckData.name}" 
                  {timeLimit > 0 && ` with a ${timeLimitOptions.find(opt => opt.value === timeLimit)?.label.toLowerCase()} time limit`}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSettings;