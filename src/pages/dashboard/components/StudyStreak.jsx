import React from 'react';
import Icon from '../../../components/AppIcon';

const StudyStreak = ({ currentStreak, longestStreak, weeklyGoal, weeklyProgress, studyDays }) => {
  const progressPercentage = (weeklyProgress / weeklyGoal) * 100;
  
  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    return '🌱';
  };

  const getDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    return days.map((day, index) => ({
      day,
      isToday: index === today,
      hasStudied: studyDays ? studyDays[index] : false,
      isPast: index < today
    }));
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="Flame" size={20} className="icon-contrast" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Study Streak</h3>
            <p className="text-sm text-text-secondary">Keep the momentum going!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-text-primary">
            {getStreakEmoji(currentStreak)} {currentStreak}
          </div>
          <div className="text-xs text-text-secondary">days</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-secondary">Weekly Goal</span>
          <span className="text-text-primary font-medium">
            {weeklyProgress}/{weeklyGoal} days
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="mb-4">
        <div className="text-sm text-text-secondary mb-2">This Week</div>
        <div className="grid grid-cols-7 gap-1">
          {getDaysOfWeek().map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-md flex items-center justify-center text-xs font-medium
                ${day.isToday 
                  ? 'bg-primary text-white' 
                  : day.hasStudied 
                    ? 'bg-success-50 text-success border border-success-200' 
                    : day.isPast 
                      ? 'bg-muted text-text-muted' 
                      : 'bg-muted-50 text-text-secondary'
                }
              `}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="font-semibold text-text-primary">{longestStreak}</div>
          <div className="text-text-secondary">Longest</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-text-primary">{weeklyProgress}</div>
          <div className="text-text-secondary">This Week</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-text-primary">{weeklyGoal}</div>
          <div className="text-text-secondary">Goal</div>
        </div>
      </div>
    </div>
  );
};

export default StudyStreak;