import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';

const StudyPreferencesSection = () => {
  const { user, actions } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    defaultQuizDifficulty: 'medium',
    flashcardReviewInterval: 'daily',
    aiRecommendationSensitivity: 'medium',
    studySessionDuration: '30',
    breakReminders: true,
    focusMode: false,
    studyGoalType: 'time',
    dailyStudyGoal: '120',
    defaultAiModel: ''
  });

  // Initialize preferences when user data loads
  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        defaultQuizDifficulty: user.preferences.defaultQuizDifficulty || 'medium',
        flashcardReviewInterval: user.preferences.flashcardReviewInterval || 'daily',
        aiRecommendationSensitivity: user.preferences.aiRecommendationSensitivity || 'medium',
        studySessionDuration: user.preferences.studySessionDuration?.toString() || '30',
        breakReminders: user.preferences.breakReminders ?? true,
        focusMode: user.preferences.focusMode ?? false,
        studyGoalType: user.preferences.studyGoalType || 'time',
        dailyStudyGoal: user.preferences.dailyStudyGoal?.toString() || '120',
        defaultAiModel: user.preferences.defaultAiModel || ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Use a static list of AI models
    setModelsLoading(true);
    setTimeout(() => {
      setModelList([
        { id: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free', name: 'DeepSeek R1 Distill Llama 70B (Free)' },
        { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B Instruct v0.2' },
        { id: 'meta-llama/Meta-Llama-3.1-70B', name: 'Llama 3.1 70B' },
        { id: 'meta-llama/Llama-2-13b-chat-hf', name: 'Llama 2 13B Chat' },
        { id: 'meta-llama/Llama-2-70b-chat-hf', name: 'Llama 2 70B Chat' },
        { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B Instruct' }
      ]);
      setModelsLoading(false);
    }, 300);
  }, []);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await actions.updateStudyPreferences({
        defaultQuizDifficulty: preferences.defaultQuizDifficulty,
        flashcardReviewInterval: preferences.flashcardReviewInterval,
        aiRecommendationSensitivity: preferences.aiRecommendationSensitivity,
        studySessionDuration: parseInt(preferences.studySessionDuration),
        breakReminders: preferences.breakReminders,
        focusMode: preferences.focusMode,
        studyGoalType: preferences.studyGoalType,
        dailyStudyGoal: parseInt(preferences.dailyStudyGoal),
        defaultAiModel: preferences.defaultAiModel
      });

      setHasChanges(false);
      console.log('Study preferences updated successfully');
    } catch (error) {
      console.error('Failed to update study preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    const defaultPreferences = {
      defaultQuizDifficulty: 'medium',
      flashcardReviewInterval: 'daily',
      aiRecommendationSensitivity: 'medium',
      studySessionDuration: '30',
      breakReminders: true,
      focusMode: false,
      studyGoalType: 'time',
      dailyStudyGoal: '120',
      defaultAiModel: ''
    };
    setPreferences(defaultPreferences);
    setHasChanges(true);
  };

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading study preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Study Preferences</h2>
          <p className="text-sm lg:text-base text-text-secondary">Customize your learning experience and study settings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            size="sm"
            iconName="RotateCcw"
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            Reset to Defaults
          </Button>
          {hasChanges && (
            <Button
              variant="primary"
              onClick={handleSavePreferences}
              size="sm"
              iconName={isSaving ? "Loader" : "Save"}
              className="w-full sm:w-auto"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Quiz Settings */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="HelpCircle" size={18} className="mr-2" />
            Quiz Settings
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Default Quiz Difficulty
              </label>
              <select
                value={preferences.defaultQuizDifficulty}
                onChange={(e) => handlePreferenceChange('defaultQuizDifficulty', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed Difficulty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Study Session Duration (minutes)
              </label>
              <Input
                type="number"
                value={preferences.studySessionDuration}
                onChange={(e) => handlePreferenceChange('studySessionDuration', e.target.value)}
                min="15"
                max="180"
                placeholder="30"
              />
            </div>
          </div>
        </div>

        {/* Flashcard Settings */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Layers" size={18} className="mr-2" />
            Flashcard Settings
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Review Interval
              </label>
              <select
                value={preferences.flashcardReviewInterval}
                onChange={(e) => handlePreferenceChange('flashcardReviewInterval', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="spaced">Spaced Repetition</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Brain" size={18} className="mr-2" />
            AI Recommendations
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Default AI Model
              </label>
              {modelsLoading ? (
                <div className="text-text-secondary text-sm">Loading models...</div>
              ) : (
                <select
                  value={preferences.defaultAiModel}
                  onChange={e => handlePreferenceChange('defaultAiModel', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
                >
                  <option value="">System Default (Recommended)</option>
                  {modelList.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              )}
              <p className="text-xs text-text-secondary mt-1">Choose your preferred AI model for content generation. System default is fastest and most reliable.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Recommendation Sensitivity
              </label>
              <select
                value={preferences.aiRecommendationSensitivity}
                onChange={(e) => handlePreferenceChange('aiRecommendationSensitivity', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="low">Low - Only critical recommendations</option>
                <option value="medium">Medium - Balanced recommendations</option>
                <option value="high">High - Frequent recommendations</option>
              </select>
              <p className="text-text-muted text-xs mt-1">
                Controls how often AI suggests study topics and improvements
              </p>
            </div>
          </div>
        </div>

        {/* Study Goals */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Target" size={18} className="mr-2" />
            Study Goals
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Goal Type
              </label>
              <select
                value={preferences.studyGoalType}
                onChange={(e) => handlePreferenceChange('studyGoalType', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="time">Time-based (minutes)</option>
                <option value="topics">Topic-based (topics covered)</option>
                <option value="points">Points-based (points earned)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Daily Study Goal ({preferences.studyGoalType === 'time' ? 'minutes' : preferences.studyGoalType === 'topics' ? 'topics' : 'points'})
              </label>
              <Input
                type="number"
                value={preferences.dailyStudyGoal}
                onChange={(e) => handlePreferenceChange('dailyStudyGoal', e.target.value)}
                min="1"
                placeholder={preferences.studyGoalType === 'time' ? '120' : preferences.studyGoalType === 'topics' ? '5' : '100'}
              />
            </div>
          </div>
        </div>

        {/* Study Features */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Zap" size={18} className="mr-2" />
            Study Features
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-text-primary">Break Reminders</label>
                <p className="text-xs text-text-muted mt-1">Get notified to take breaks during long study sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.breakReminders}
                  onChange={(e) => handlePreferenceChange('breakReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-text-primary">Focus Mode</label>
                <p className="text-xs text-text-muted mt-1">Block distracting notifications during study sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.focusMode}
                  onChange={(e) => handlePreferenceChange('focusMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPreferencesSection;