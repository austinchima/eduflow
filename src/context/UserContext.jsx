import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.js';

// Initial state for a new user
const initialState = {
  user: {
    id: null,
    name: '',
    email: '',
    avatar: null,
    firstName: '',
    lastName: '',
    studentId: '',
    major: '',
    graduationYear: '',
    timezone: 'UTC-5',
    language: 'en',
    preferences: {
      studyGoal: 5, // hours per day
      notifications: true,
      theme: 'system',
      defaultQuizDifficulty: 'medium',
      flashcardReviewInterval: 'daily',
      aiRecommendationSensitivity: 'medium',
      studySessionDuration: 30,
      breakReminders: true,
      focusMode: false,
      studyGoalType: 'time',
      dailyStudyGoal: 120
    },
    notifications: {
      email: true,
      push: true,
      studyReminders: true,
      breakReminders: true,
      achievementAlerts: true,
      weeklyReports: true,
      courseUpdates: true,
      quizReminders: true
    },
    privacy: {
      profileVisibility: 'public',
      studyDataSharing: false,
      analyticsSharing: true,
      emailSharing: false,
      dataRetention: '1year',
      exportData: true
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reducedMotion: false,
      keyboardNavigation: true,
      colorBlindSupport: false
    },
    account: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginHistory: [],
      securityQuestions: [],
      passwordLastChanged: null
    }
  },
  academic: {
    gpa: {
      current: 0,
      target: 3.8,
      semester: 'Fall 2024'
    },
    courses: [],
    studyStreak: {
      current: 0,
      longest: 0,
      weeklyGoal: 5,
      weeklyProgress: 0,
      studyDays: [false, false, false, false, false, false, false]
    }
  },
  studyData: {
    activities: [],
    recommendations: [],
    weeklyStudyTime: [],
    courseDistribution: []
  },
  flashcards: {
    decks: [],
    cards: []
  },
  quizzes: {
    available: [],
    completed: [],
    results: []
  },
  isLoading: true,
  error: null
};

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  UPDATE_GPA: 'UPDATE_GPA',
  ADD_COURSE: 'ADD_COURSE',
  UPDATE_COURSE: 'UPDATE_COURSE',
  REMOVE_COURSE: 'REMOVE_COURSE',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  UPDATE_STREAK: 'UPDATE_STREAK',
  ADD_FLASHCARD_DECK: 'ADD_FLASHCARD_DECK',
  ADD_FLASHCARD: 'ADD_FLASHCARD',
  UPDATE_FLASHCARD: 'UPDATE_FLASHCARD',
  ADD_QUIZ: 'ADD_QUIZ',
  UPDATE_QUIZ: 'UPDATE_QUIZ',
  COMPLETE_QUIZ: 'COMPLETE_QUIZ',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_DATA: 'RESET_DATA',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_STUDY_PREFERENCES: 'UPDATE_STUDY_PREFERENCES',
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
  UPDATE_PRIVACY: 'UPDATE_PRIVACY',
  UPDATE_ACCESSIBILITY: 'UPDATE_ACCESSIBILITY',
  UPDATE_ACCOUNT_SETTINGS: 'UPDATE_ACCOUNT_SETTINGS'
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isLoading: false
      };
    
    case ACTIONS.UPDATE_GPA:
      return {
        ...state,
        academic: {
          ...state.academic,
          gpa: { ...state.academic.gpa, ...action.payload }
        }
      };
    
    case ACTIONS.ADD_COURSE:
      return {
        ...state,
        academic: {
          ...state.academic,
          courses: [...state.academic.courses, action.payload]
        }
      };
    
    case ACTIONS.UPDATE_COURSE:
      return {
        ...state,
        academic: {
          ...state.academic,
          courses: state.academic.courses.map(course =>
            course.id === action.payload.id ? { ...course, ...action.payload } : course
          )
        }
      };
    
    case ACTIONS.REMOVE_COURSE:
      return {
        ...state,
        academic: {
          ...state.academic,
          courses: state.academic.courses.filter(course => course.id !== action.payload)
        }
      };
    
    case ACTIONS.ADD_ACTIVITY:
      return {
        ...state,
        studyData: {
          ...state.studyData,
          activities: [action.payload, ...state.studyData.activities]
        }
      };
    
    case ACTIONS.UPDATE_STREAK:
      return {
        ...state,
        academic: {
          ...state.academic,
          studyStreak: { ...state.academic.studyStreak, ...action.payload }
        }
      };
    
    case ACTIONS.ADD_FLASHCARD_DECK:
      return {
        ...state,
        flashcards: {
          ...state.flashcards,
          decks: [...state.flashcards.decks, action.payload]
        }
      };
    
    case ACTIONS.ADD_FLASHCARD:
      return {
        ...state,
        flashcards: {
          ...state.flashcards,
          cards: [...state.flashcards.cards, action.payload]
        }
      };
    
    case ACTIONS.UPDATE_FLASHCARD:
      return {
        ...state,
        flashcards: {
          ...state.flashcards,
          cards: state.flashcards.cards.map(card =>
            card.id === action.payload.id ? { ...card, ...action.payload } : card
          )
        }
      };
    
    case ACTIONS.ADD_QUIZ:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          available: [...state.quizzes.available, action.payload]
        }
      };
    
    case ACTIONS.UPDATE_QUIZ:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          available: state.quizzes.available.map(quiz =>
            quiz.id === action.payload.id ? { ...quiz, ...action.payload } : quiz
          )
        }
      };
    
    case ACTIONS.COMPLETE_QUIZ:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          completed: [...state.quizzes.completed, action.payload],
          results: [...state.quizzes.results, action.payload]
        }
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    
    case ACTIONS.UPDATE_STUDY_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload
          }
        }
      };
    
    case ACTIONS.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: {
            ...state.user.notifications,
            ...action.payload
          }
        }
      };
    
    case ACTIONS.UPDATE_PRIVACY:
      return {
        ...state,
        user: {
          ...state.user,
          privacy: {
            ...state.user.privacy,
            ...action.payload
          }
        }
      };
    
    case ACTIONS.UPDATE_ACCESSIBILITY:
      return {
        ...state,
        user: {
          ...state.user,
          accessibility: {
            ...state.user.accessibility,
            ...action.payload
          }
        }
      };
    
    case ACTIONS.UPDATE_ACCOUNT_SETTINGS:
      return {
        ...state,
        user: {
          ...state.user,
          account: {
            ...state.user.account,
            ...action.payload
          }
        }
      };
    
    case ACTIONS.RESET_DATA:
      return initialState;
    
    default:
      return state;
  }
}

// Create context
const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from backend on mount
  useEffect(() => {
    const loadUserData = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({ type: ACTIONS.SET_USER, payload: user });
        } else {
          dispatch({ type: ACTIONS.SET_USER, payload: { name: 'New Student' } });
        }
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load user data' });
      }
    };
    loadUserData();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (state.user.id) {
      localStorage.setItem('studyAI_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  // Helper functions
  const updateUser = (userData) => {
    dispatch({ type: ACTIONS.SET_USER, payload: userData });
  };

  const updateProfile = (profileData) => {
    dispatch({ type: ACTIONS.UPDATE_PROFILE, payload: profileData });
  };

  const updateStudyPreferences = (preferences) => {
    dispatch({ type: ACTIONS.UPDATE_STUDY_PREFERENCES, payload: preferences });
  };

  const updateNotifications = (notifications) => {
    dispatch({ type: ACTIONS.UPDATE_NOTIFICATIONS, payload: notifications });
  };

  const updatePrivacy = (privacy) => {
    dispatch({ type: ACTIONS.UPDATE_PRIVACY, payload: privacy });
  };

  const updateAccessibility = (accessibility) => {
    dispatch({ type: ACTIONS.UPDATE_ACCESSIBILITY, payload: accessibility });
  };

  const updateAccountSettings = (account) => {
    dispatch({ type: ACTIONS.UPDATE_ACCOUNT_SETTINGS, payload: account });
  };

  const updateGPA = (gpaData) => {
    dispatch({ type: ACTIONS.UPDATE_GPA, payload: gpaData });
  };

  const initialCourse = {
    id: Date.now(),
    name: '',
    instructor: '',
    credits: 0,
    semester: '',
    description: '',
    currentGrade: 0,
    materialCount: 0,
    progress: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    content: [], // AI-generated content
    materials: [] // Uploaded materials
  };

  const addCourse = (course) => {
    const newCourse = {
      ...initialCourse,
      ...course,
      id: Date.now(),
      materials: [],
      content: [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.ADD_COURSE, payload: newCourse });
  };

  const updateCourse = (courseId, updates) => {
    dispatch({ type: ACTIONS.UPDATE_COURSE, payload: { id: courseId, ...updates } });
  };

  const removeCourse = (courseId) => {
    dispatch({ type: ACTIONS.REMOVE_COURSE, payload: courseId });
  };

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date(),
      ...activity
    };
    dispatch({ type: ACTIONS.ADD_ACTIVITY, payload: newActivity });
  };

  const updateStudyStreak = (updates) => {
    dispatch({ type: ACTIONS.UPDATE_STREAK, payload: updates });
  };

  const addFlashcardDeck = (deck) => {
    const newDeck = {
      id: `deck_${Date.now()}`,
      totalCards: 0,
      newCards: 0,
      reviewCards: 0,
      createdAt: new Date().toISOString(),
      ...deck
    };
    dispatch({ type: ACTIONS.ADD_FLASHCARD_DECK, payload: newDeck });
  };

  const addFlashcard = (card) => {
    const newCard = {
      id: Date.now(),
      difficulty: 'medium',
      lastReviewed: null,
      reviewCount: 0,
      ...card
    };
    dispatch({ type: ACTIONS.ADD_FLASHCARD, payload: newCard });
  };

  const updateFlashcard = (cardId, updates) => {
    dispatch({ 
      type: ACTIONS.UPDATE_FLASHCARD, 
      payload: { id: cardId, ...updates } 
    });
  };

  const addQuiz = (quiz) => {
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      status: 'not-started',
      completionRate: 0,
      score: null,
      createdAt: new Date().toISOString(),
      ...quiz
    };
    dispatch({ type: ACTIONS.ADD_QUIZ, payload: newQuiz });
  };

  const updateQuiz = (quizId, updates) => {
    dispatch({ type: ACTIONS.UPDATE_QUIZ, payload: { id: quizId, ...updates } });
  };

  const completeQuiz = (quizId, results) => {
    const completedQuiz = {
      id: quizId,
      completedAt: new Date().toISOString(),
      ...results
    };
    dispatch({ type: ACTIONS.COMPLETE_QUIZ, payload: completedQuiz });
  };

  const calculateGPA = () => {
    const courses = state.academic.courses.filter(course => course.currentGrade > 0);
    if (courses.length === 0) return 0;
    
    const totalPoints = courses.reduce((sum, course) => sum + course.currentGrade, 0);
    return Math.round((totalPoints / courses.length) * 100) / 100;
  };

  const getWeeklyStudyTime = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      hours: Math.random() * 6 + 1 // This would come from actual study tracking
    }));
  };

  const getCourseDistribution = () => {
    return state.academic.courses.map(course => ({
      name: course.name,
      hours: Math.random() * 10 + 2 // This would come from actual study tracking
    }));
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    // GPA-based recommendations
    const currentGPA = calculateGPA();
    if (currentGPA < 3.0) {
      recommendations.push({
        id: Date.now(),
        type: 'study',
        title: 'Focus on Core Concepts',
        description: 'Your GPA suggests reviewing fundamental concepts in your courses',
        priority: 'high',
        estimatedTime: '30 min',
        subject: 'General',
        expectedImprovement: 15
      });
    }

    // Course-based recommendations
    const lowGradeCourses = state.academic.courses.filter(course => course.currentGrade < 80);
    lowGradeCourses.forEach(course => {
      recommendations.push({
        id: Date.now() + Math.random(),
        type: 'quiz',
        title: `Review ${course.name}`,
        description: `Your performance in ${course.name} suggests additional practice`,
        priority: 'medium',
        estimatedTime: '20 min',
        subject: course.name,
        expectedImprovement: 10
      });
    });

    return recommendations.slice(0, 3);
  };

  const value = {
    ...state,
    actions: {
      updateUser,
      updateProfile,
      updateStudyPreferences,
      updateNotifications,
      updatePrivacy,
      updateAccessibility,
      updateAccountSettings,
      updateGPA,
      addCourse,
      updateCourse,
      removeCourse,
      addActivity,
      updateStudyStreak,
      addFlashcardDeck,
      addFlashcard,
      updateFlashcard,
      addQuiz,
      updateQuiz,
      completeQuiz,
      calculateGPA,
      getWeeklyStudyTime,
      getCourseDistribution,
      getRecommendations
    }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}