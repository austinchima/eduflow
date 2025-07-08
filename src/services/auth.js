const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const authService = {
  // Register user
  async signUp(email, password, userData = {}) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || ''
      })
    })
    if (!res.ok) throw new Error((await res.json()).message || 'Registration failed')
    const data = await res.json()
    localStorage.setItem('token', data.token)
    return data
  },

  // Login user
  async signIn(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed')
    const data = await res.json()
    localStorage.setItem('token', data.token)
    return data
  },

  // Logout (client-side only)
  async signOut() {
    localStorage.removeItem('token')
    return true
  },

  // Get current user
  async getCurrentUser() {
    const token = localStorage.getItem('token')
    if (!token) return null
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return null
    return res.json()
  }
}