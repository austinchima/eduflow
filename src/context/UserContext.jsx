import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.js';
import { dataService } from '../services/dataService.js';
import { getCurrentSemester } from '../utils/semesterUtils.js';

// Initial state for a new user
const initialState = {
  user: {
    id: null,
    name: '',
    email: '',
    username: '',
    generatedUsername: '',
    firstName: '',
    lastName: '',
    studyGoal: 5, // hours per day
    targetGpa: 3.8,
    theme: 'light',
    hasCompletedSetup: false,
    createdAt: null,
    preferences: {
      studyGoal: 5, // hours per day
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
      largeText: false,
      screenReader: false,
      reducedMotion: false
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
      semester: getCurrentSemester()
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
  SET_COURSES: 'SET_COURSES',
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
      console.log('Reducer: ADD_COURSE action received with payload:', action.payload);
      console.log('Reducer: Current courses:', state.academic.courses);
      
      // Check if course already exists to prevent duplicates
      const courseExists = state.academic.courses.some(course => course.id === action.payload.id);
      if (courseExists) {
        console.log('Course already exists in state, skipping add:', action.payload.id);
        return state; // Return current state unchanged
      }
      
      const newState = {
        ...state,
        academic: {
          ...state.academic,
          courses: [...state.academic.courses, action.payload]
        }
      };
      console.log('Reducer: New courses array:', newState.academic.courses);
      return newState;
    
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
    
    case ACTIONS.SET_COURSES:
      return {
        ...state,
        academic: {
          ...state.academic,
          courses: action.payload
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
function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from backend on mount
  useEffect(() => {
    const loadUserData = async () => {
      // Don't set loading to true immediately to prevent flashing
      // Only set loading if we actually need to fetch data
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          // Update user and set loading to false in one dispatch
          dispatch({ 
            type: ACTIONS.SET_USER, 
            payload: { ...user, isLoading: false }
          });
          // Load user's courses from backend (async, don't block UI)
          loadUserCourses(user.id).catch(error => {
            console.error('Error loading courses:', error);
          });
        } else {
          // No user found, set default state without loading
          dispatch({ 
            type: ACTIONS.SET_USER, 
            payload: { name: 'New Student', isLoading: false }
          });
        }
      } catch (error) {
        // Error occurred, set error state without loading
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'Failed to load user data'
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };
    loadUserData();
  }, []);

  // Load user courses from backend
  const loadUserCourses = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/courses/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const courses = await response.json();
        
        // Check for existing courses to prevent duplicates
        const existingCourseIds = state.academic.courses.map(c => c.id);
        
        // Add each course to the frontend state (only if not already present)
        for (const course of courses) {
          // Skip if course already exists in state
          if (existingCourseIds.includes(course._id)) {
            console.log('Course already exists in state, skipping:', course._id);
            continue;
          }
          
          const courseData = {
            id: course._id,
            name: course.name,
            instructor: course.instructor,
            credits: course.credits,
            semester: course.semester,
            description: course.description,
            currentGrade: course.grade || 0,
            materialCount: 0,
            progress: 0,
            status: course.isActive ? 'active' : 'archived',
            createdAt: course.createdAt,
            content: [],
            materials: []
          };
          
          // Load materials for this course
          try {
            const materialsResponse = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/materials?courseId=${course._id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (materialsResponse.ok) {
              const responseData = await materialsResponse.json();
              const materials = responseData.materials || responseData; // Handle both nested and direct response
              courseData.materials = materials;
              courseData.materialCount = materials.length;
            }
          } catch (error) {
            console.error('Error loading materials for course:', course._id, error);
          }
          
          dispatch({ type: ACTIONS.ADD_COURSE, payload: courseData });
        }
      }
    } catch (error) {
      console.error('Error loading user courses:', error);
    }
  };

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

  const updateProfile = async (profileData) => {
    try {
      const userId = state.user.id;
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error('User not authenticated');
      }

      // Update backend
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update frontend state
      dispatch({ type: ACTIONS.SET_USER, payload: {
        ...state.user,
        ...updatedUser,
        username: updatedUser.username,
        generatedUsername: updatedUser.generatedUsername,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        studyGoal: updatedUser.studyGoal,
        targetGpa: updatedUser.targetGpa,
        notifications: updatedUser.notifications,
        theme: updatedUser.theme,
        hasCompletedSetup: updatedUser.hasCompletedSetup
      }});
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
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

  const updateTheme = (theme) => {
    dispatch({ 
      type: ACTIONS.UPDATE_STUDY_PREFERENCES, 
      payload: { theme } 
    });
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

  const addCourse = async (course) => {
    try {
      console.log('Adding course:', course);
      const newCourse = {
        ...initialCourse,
        ...course,
        id: Date.now(),
        materials: [],
        content: [],
        createdAt: new Date().toISOString(),
      };
      
      console.log('Prepared course data:', newCourse);
      
      // Save to backend
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newCourse.name,
          instructor: newCourse.instructor,
          credits: newCourse.credits,
          semester: newCourse.semester,
          description: newCourse.description,
          color: newCourse.color,
          grade: newCourse.currentGrade,
          isActive: newCourse.status === 'active'
        })
      });
      
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error('Failed to save course to database');
      }
      
      const savedCourse = await response.json();
      console.log('Saved course from backend:', savedCourse);
      
      // Update frontend state with the saved course (using backend ID)
      dispatch({ type: ACTIONS.ADD_COURSE, payload: { ...newCourse, id: savedCourse._id } });
      console.log('Course added to frontend state');
    } catch (error) {
      console.error('Error saving course:', error);
      // Only add to frontend state as fallback if backend failed
      // Use a unique ID to avoid conflicts
      const fallbackCourse = {
        ...initialCourse,
        ...course,
        id: `temp_${Date.now()}`, // Use temp prefix to avoid conflicts
        materials: [],
        content: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: ACTIONS.ADD_COURSE, payload: fallbackCourse });
    }
  };

  const updateCourse = async (courseId, updates) => {
    try {
      // Update in backend
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update course in database');
      }
      
      // Update frontend state
      dispatch({ type: ACTIONS.UPDATE_COURSE, payload: { id: courseId, ...updates } });
    } catch (error) {
      console.error('Error updating course:', error);
      // Still update frontend state as fallback
      dispatch({ type: ACTIONS.UPDATE_COURSE, payload: { id: courseId, ...updates } });
    }
  };

  const removeCourse = async (courseId) => {
    try {
      // Delete from backend
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete course from database');
      }
      
      const result = await response.json();
      
      // Update frontend state
      dispatch({ type: ACTIONS.REMOVE_COURSE, payload: courseId });
      
      // Log deletion details for debugging
      if (result.details) {
        console.log('Course deletion details:', result.details);
      }
      
      return result; // Return the result for potential use by calling components
    } catch (error) {
      console.error('Error deleting course:', error);
      // Don't remove from frontend state if backend deletion failed
      throw error; // Re-throw the error so calling components can handle it
    }
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
    // TODO: Replace with real tracked data if available
    // For now, return zeros for all days if no data exists
    return days.map(day => ({
      period: day,
      hours: 0
    }));
  };

  const getCourseDistribution = () => {
    // TODO: Replace with real tracked data if available
    // For now, return zeros for all courses if no data exists
    return state.academic.courses.map(course => ({
      name: course.name,
      hours: 0
    }));
  };

  // Clean up duplicate courses (call this if needed)
  const cleanupDuplicateCourses = () => {
    const uniqueCourses = state.academic.courses.filter(
      (course, index, self) => 
        index === self.findIndex((c) => c.id === course.id)
    );
    
    if (uniqueCourses.length !== state.academic.courses.length) {
      console.log('Found duplicate courses, cleaning up...');
      // Replace the entire courses array with unique courses
      dispatch({ 
        type: ACTIONS.SET_COURSES, 
        payload: uniqueCourses 
      });
    }
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

  const logout = async () => {
    await authService.signOut();
    dispatch({ type: ACTIONS.SET_USER, payload: { name: 'New Student' } });
    localStorage.removeItem('studyAI_user');
  };

  const login = async (email, password) => {
    try {
      // Set loading state immediately to prevent flashing
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const data = await authService.signIn(email, password);
      
      // For login, fetch complete user data from server (which may have setup completed)
      let userData;
      try {
        userData = await authService.getCurrentUser();
      } catch (error) {
        console.error('getCurrentUser failed:', error);
        userData = null;
      }
      
      if (userData) {
        // Map backend fields to frontend structure
        const mappedUser = {
          id: userData._id || userData.id, // Handle both _id and id
          name: userData.name || userData.username || '',
          username: userData.username || '',
          generatedUsername: userData.generatedUsername || '',
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          createdAt: userData.createdAt || null,
          preferences: {
            ...state.user.preferences,
            studyGoal: userData.studyGoal || 5,
            notifications: userData.notifications !== false,
            theme: userData.theme || 'light',
            hasCompletedSetup: userData.hasCompletedSetup || false,
          }
        };
        
        // Update user and loading state in one dispatch to prevent flashing
        dispatch({ 
          type: ACTIONS.SET_USER, 
          payload: { ...mappedUser, isLoading: false }
        });
        
        // Load user's courses from backend (async, don't block UI)
        loadUserCourses(mappedUser.id).catch(error => {
          console.error('Error loading courses:', error);
        });
      } else {
        // Fallback to login response data
        dispatch({ 
          type: ACTIONS.SET_USER, 
          payload: { ...data.user, isLoading: false }
        });
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      // Reset loading state on error
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  const signup = async (email, password, userData = {}) => {
    const data = await authService.signUp(email, password, userData);
    // For signup, create a user object that goes directly to dashboard
    const newUser = {
      ...data.user,
      name: userData.name || 'New Student',
      username: data.user.username || '',
      generatedUsername: data.user.generatedUsername || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      createdAt: data.user.createdAt || new Date().toISOString(),
      preferences: {
        ...state.user.preferences,
        studyGoal: 5, // Default values
        notifications: true,
        theme: 'light',
        hasCompletedSetup: false, // Mark as new user who needs setup
      }
    };
    dispatch({ type: ACTIONS.SET_USER, payload: newUser });
    
    return data;
  };

  const deleteMaterial = async (materialId, courseId) => {
    try {
      // Delete from backend
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete material from database');
      }
      
      // Update frontend state by removing the material from the course
      const course = state.academic.courses.find(c => c.id === courseId);
      if (course) {
        const updatedMaterials = course.materials.filter(m => m.id !== materialId);
        dispatch({ 
          type: ACTIONS.UPDATE_COURSE, 
          payload: { 
            id: courseId, 
            materials: updatedMaterials,
            materialCount: updatedMaterials.length
          } 
        });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      // Still update frontend state as fallback
      const course = state.academic.courses.find(c => c.id === courseId);
      if (course) {
        const updatedMaterials = course.materials.filter(m => m.id !== materialId);
        dispatch({ 
          type: ACTIONS.UPDATE_COURSE, 
          payload: { 
            id: courseId, 
            materials: updatedMaterials,
            materialCount: updatedMaterials.length
          } 
        });
      }
    }
  };

  // Save personalization (profile and preferences) to backend and update context
  const savePersonalization = async (personalization) => {
    const userId = state.user.id;
    // Update profile with all personalization data
    await dataService.updateUserProfile(userId, {
      name: personalization.name,
      firstName: personalization.firstName || '',
      lastName: personalization.lastName || '',
      email: personalization.email,
      studyGoal: personalization.studyGoal,
      targetGpa: personalization.targetGpa || 3.8,
      notifications: personalization.notifications,
      theme: personalization.theme || 'light',
      hasCompletedSetup: true, // Mark setup as completed
    });
    // Update context
    dispatch({ type: ACTIONS.SET_USER, payload: {
      name: personalization.name,
      firstName: personalization.firstName || '',
      lastName: personalization.lastName || '',
      email: personalization.email,
      preferences: {
        ...state.user.preferences,
        studyGoal: personalization.studyGoal,
        notifications: personalization.notifications,
        theme: personalization.theme || 'light',
        hasCompletedSetup: true, // Mark setup as completed
      }
    }});
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
      updateTheme,
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
      cleanupDuplicateCourses,
      getRecommendations,
      logout,
      login,
      signup,
      loadUserCourses,
      deleteMaterial,
      savePersonalization
    }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { useUser, UserProvider };