const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'
import { authService } from './auth.js'

export const dataService = {
  // Initialize user data from backend
  async initializeUserData() {
    try {
      // Get user profile
      const user = await this.getUserProfile()
      
      // Get user preferences
      const preferences = await this.getUserPreferences(user.id)
      
      // Get courses
      const courses = await this.getUserCourses(user.id)
      
      // Get flashcard decks with flashcards
      const flashcardDecks = await this.getFlashcardDecks(user.id)
      
      // Get quizzes
      const quizzes = await this.getUserQuizzes(user.id)
      
      // Get recent study sessions
      const studySessions = await this.getRecentStudySessions(user.id)
      
      // Get recent study activities
      const studyActivities = await this.getRecentStudyActivities(user.id)
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
          dailyStudyTarget: user.daily_study_target,
          targetGpa: user.target_gpa
        },
        preferences: preferences || {
          theme: 'light',
          notificationsEnabled: true,
          emailNotifications: true,
          studyReminders: true,
          accessibilitySettings: {}
        },
        academic: {
          courses: courses.map(course => ({
            id: course.id,
            name: course.name,
            instructor: course.instructor,
            credits: course.credits,
            semester: course.semester,
            description: course.description,
            color: course.color,
            grade: course.grade,
            isActive: course.is_active
          })),
          gpa: this.calculateGPA(courses),
          studyStreak: this.calculateStudyStreak(studyActivities)
        },
        studyData: {
          activities: studyActivities.map(activity => ({
            id: activity.id,
            type: activity.activity_type,
            toolId: activity.tool_id,
            toolType: activity.tool_type,
            duration: activity.duration,
            score: activity.score,
            difficulty: activity.difficulty,
            createdAt: activity.created_at
          })),
          recommendations: this.generateRecommendations(studyActivities, courses)
        },
        flashcards: {
          decks: flashcardDecks.map(deck => ({
            id: deck.id,
            name: deck.name,
            description: deck.description,
            color: deck.color,
            courseId: deck.course_id,
            isPublic: deck.is_public,
            cards: deck.flashcards.map(card => ({
              id: card.id,
              frontContent: card.front_content,
              backContent: card.back_content,
              difficulty: card.difficulty,
              lastReviewed: card.last_reviewed,
              nextReview: card.next_review,
              reviewCount: card.review_count,
              correctCount: card.correct_count,
              incorrectCount: card.incorrect_count
            }))
          }))
        },
        quizzes: {
          available: quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions,
            timeLimit: quiz.time_limit,
            passingScore: quiz.passing_score,
            status: quiz.status,
            courseId: quiz.course_id,
            isPublic: quiz.is_public
          })),
          completed: [] // Will be populated from quiz_attempts table
        }
      }
    } catch (error) {
      console.error('Error initializing user data:', error)
      throw error
    }
  },

  // Fetch user profile from backend
  async getUserProfile() {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to fetch user profile')
    return res.json()
  },

  // Fetch user preferences from backend
  async getUserPreferences(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/preferences`)
    if (!res.ok) throw new Error('Failed to fetch user preferences')
    return res.json()
  },

  // Fetch user courses from backend
  async getUserCourses(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/courses`)
    if (!res.ok) throw new Error('Failed to fetch user courses')
    return res.json()
  },

  // Fetch flashcard decks from backend
  async getFlashcardDecks(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/flashcard-decks`)
    if (!res.ok) throw new Error('Failed to fetch flashcard decks')
    return res.json()
  },

  // Fetch user quizzes from backend
  async getUserQuizzes(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/quizzes`)
    if (!res.ok) throw new Error('Failed to fetch user quizzes')
    return res.json()
  },

  // Fetch recent study sessions from backend
  async getRecentStudySessions(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/study-sessions?limit=10`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    if (!res.ok) throw new Error('Failed to fetch study sessions')
    return res.json()
  },

  // Fetch recent study activities from backend
  async getRecentStudyActivities(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/study-activities?limit=50`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    if (!res.ok) throw new Error('Failed to fetch study activities')
    return res.json()
  },

  // Save user data to backend
  async saveUserData(userId, data) {
    try {
      // Update user profile
      await this.updateUserProfile(userId, {
        name: data.user.name,
        daily_study_target: data.user.dailyStudyTarget,
        target_gpa: data.user.targetGpa
      })

      // Update user preferences
      await this.upsertUserPreferences({
        user_id: userId,
        theme: data.preferences.theme,
        notifications_enabled: data.preferences.notificationsEnabled,
        email_notifications: data.preferences.emailNotifications,
        study_reminders: data.preferences.studyReminders,
        accessibility_settings: data.preferences.accessibilitySettings
      })

      return true
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    }
  },

  // Update user profile on backend
  async updateUserProfile(userId, profile) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profile)
    })
    if (!res.ok) throw new Error('Failed to update user profile')
    return res.json()
  },

  // Upsert user preferences on backend
  async upsertUserPreferences(preferences) {
    const res = await fetch(`${API_URL}/users/${preferences.user_id}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(preferences)
    })
    if (!res.ok) throw new Error('Failed to upsert user preferences')
    return res.json()
  },

  // Save course to backend
  async saveCourse(userId, course) {
    try {
      if (course.id) {
        // Update existing course
        return await this.updateCourse(course.id, {
          name: course.name,
          instructor: course.instructor,
          credits: course.credits,
          semester: course.semester,
          description: course.description,
          color: course.color,
          grade: course.grade,
          is_active: course.isActive
        })
      } else {
        // Create new course
        return await this.createCourse({
          user_id: userId,
          name: course.name,
          instructor: course.instructor,
          credits: course.credits,
          semester: course.semester,
          description: course.description,
          color: course.color,
          grade: course.grade,
          is_active: course.isActive
        })
      }
    } catch (error) {
      console.error('Error saving course:', error)
      throw error
    }
  },

  // Update course on backend
  async updateCourse(courseId, course) {
    const res = await fetch(`${API_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(course)
    })
    if (!res.ok) throw new Error('Failed to update course')
    return res.json()
  },

  // Create course on backend
  async createCourse(course) {
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(course)
    })
    if (!res.ok) throw new Error('Failed to create course')
    return res.json()
  },

  // Delete course from backend
  async deleteCourse(courseId) {
    try {
      return await this.removeCourse(courseId)
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    }
  },

  // Remove course from backend
  async removeCourse(courseId) {
    const res = await fetch(`${API_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!res.ok) throw new Error('Failed to delete course')
    return res.json()
  },

  // Save flashcard deck to backend
  async saveFlashcardDeck(userId, deck) {
    try {
      if (deck.id) {
        // Update existing deck
        const res = await fetch(`${API_URL}/flashcard-decks/${deck.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: deck.name,
            description: deck.description,
            color: deck.color,
            course_id: deck.courseId,
            is_public: deck.isPublic
          })
        })
        
        if (!res.ok) throw new Error('Failed to update flashcard deck')
        return res.json()
      } else {
        // Create new deck
        return await this.createFlashcardDeck({
          user_id: userId,
          name: deck.name,
          description: deck.description,
          color: deck.color,
          course_id: deck.courseId,
          is_public: deck.isPublic
        })
      }
    } catch (error) {
      console.error('Error saving flashcard deck:', error)
      throw error
    }
  },

  // Create flashcard deck on backend
  async createFlashcardDeck(deck) {
    const res = await fetch(`${API_URL}/flashcard-decks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(deck)
    })
    if (!res.ok) throw new Error('Failed to create flashcard deck')
    return res.json()
  },

  // Save flashcard to backend
  async saveFlashcard(deckId, card) {
    try {
      if (card.id) {
        // Update existing card
        const res = await fetch(`${API_URL}/flashcards/${card.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            front_content: card.frontContent,
            back_content: card.backContent,
            difficulty: card.difficulty,
            last_reviewed: card.lastReviewed,
            next_review: card.nextReview,
            review_count: card.reviewCount,
            correct_count: card.correctCount,
            incorrect_count: card.incorrectCount
          })
        })
        
        if (!res.ok) throw new Error('Failed to update flashcard')
        return res.json()
      } else {
        // Create new card
        return await this.createFlashcard({
          deck_id: deckId,
          front_content: card.frontContent,
          back_content: card.backContent,
          difficulty: card.difficulty,
          last_reviewed: card.lastReviewed,
          next_review: card.nextReview,
          review_count: card.reviewCount,
          correct_count: card.correctCount,
          incorrect_count: card.incorrectCount
        })
      }
    } catch (error) {
      console.error('Error saving flashcard:', error)
      throw error
    }
  },

  // Create flashcard on backend
  async createFlashcard(card) {
    const res = await fetch(`${API_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(card)
    })
    if (!res.ok) throw new Error('Failed to create flashcard')
    return res.json()
  },

  // Save quiz to backend
  async saveQuiz(userId, quiz) {
    try {
      if (quiz.id) {
        // Update existing quiz
        const res = await fetch(`${API_URL}/quizzes/${quiz.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions,
            time_limit: quiz.timeLimit,
            passing_score: quiz.passingScore,
            status: quiz.status,
            course_id: quiz.courseId,
            is_public: quiz.isPublic
          })
        })
        
        if (!res.ok) throw new Error('Failed to update quiz')
        return res.json()
      } else {
        // Create new quiz
        return await this.createQuiz({
          user_id: userId,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          time_limit: quiz.timeLimit,
          passing_score: quiz.passingScore,
          status: quiz.status,
          course_id: quiz.courseId,
          is_public: quiz.isPublic
        })
      }
    } catch (error) {
      console.error('Error saving quiz:', error)
      throw error
    }
  },

  // Create quiz on backend
  async createQuiz(quiz) {
    const res = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(quiz)
    })
    if (!res.ok) throw new Error('Failed to create quiz')
    return res.json()
  },

  // Save study session to backend
  async saveStudySession(userId, session) {
    try {
      return await this.createStudySession({
        user_id: userId,
        session_type: session.sessionType,
        tool_id: session.toolId,
        tool_type: session.toolType,
        status: session.status,
        start_time: session.startTime,
        end_time: session.endTime,
        duration: session.duration,
        cards_reviewed: session.cardsReviewed,
        correct_answers: session.correctAnswers,
        incorrect_answers: session.incorrectAnswers
      })
    } catch (error) {
      console.error('Error saving study session:', error)
      throw error
    }
  },

  // Create study session on backend
  async createStudySession(session) {
    const res = await fetch(`${API_URL}/study-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(session)
    })
    if (!res.ok) throw new Error('Failed to create study session')
    return res.json()
  },

  // Save study activity to backend
  async saveStudyActivity(userId, activity) {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/study-activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: userId,
          activity_type: activity.type,
          tool_id: activity.toolId,
          tool_type: activity.toolType,
          duration: activity.duration,
          score: activity.score,
          difficulty: activity.difficulty
        })
      })
      
      if (!res.ok) throw new Error('Failed to save study activity')
      return res.json()
    } catch (error) {
      console.error('Error saving study activity:', error)
      throw error
    }
  },

  // Helper methods
  calculateGPA(courses) {
    const activeCourses = courses.filter(course => course.is_active && course.grade)
    if (activeCourses.length === 0) return 0
    
    const totalPoints = activeCourses.reduce((sum, course) => sum + (course.grade * course.credits), 0)
    const totalCredits = activeCourses.reduce((sum, course) => sum + course.credits, 0)
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  },

  calculateStudyStreak(activities) {
    if (!activities || activities.length === 0) return 0
    
    const today = new Date()
    let streak = 0
    let currentDate = new Date(today)
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const hasActivity = activities.some(activity => 
        activity.created_at.startsWith(dateStr)
      )
      
      if (hasActivity) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  },

  generateRecommendations(activities, courses) {
    // Simple recommendation logic - can be enhanced with AI
    const recommendations = []
    
    // Recommend courses with low activity
    const courseActivity = {}
    activities.forEach(activity => {
      if (activity.tool_type === 'course') {
        courseActivity[activity.tool_id] = (courseActivity[activity.tool_id] || 0) + 1
      }
    })
    
    courses.forEach(course => {
      if (!courseActivity[course.id] || courseActivity[course.id] < 3) {
        recommendations.push({
          type: 'course_study',
          title: `Study ${course.name}`,
          description: `You haven't studied this course recently`,
          courseId: course.id,
          priority: 'medium'
        })
      }
    })
    
    return recommendations
  }
}