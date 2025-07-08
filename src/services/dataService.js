const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'
import { authService } from './auth.js'

export const dataService = {
  // Check username availability
  async checkUsernameAvailability(username) {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/check-username/${username}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to check username availability')
    return res.json()
  },

  // Update user profile
  async updateUserProfile(userId, profile) {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    })
    if (!res.ok) throw new Error('Failed to update user profile')
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

      return { success: true }
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    }
  },

  // Fetch all courses for the authenticated user
  async getUserCourses() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/courses/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }
}