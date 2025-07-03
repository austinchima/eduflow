const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api/auth'

export const authService = {
  // Register user
  async signUp(email, password, userData = {}) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        username: userData.username || userData.name || ''
      })
    })
    if (!res.ok) throw new Error((await res.json()).message || 'Registration failed')
    return res.json()
  },

  // Login user
  async signIn(email, password) {
    const res = await fetch(`${API_URL}/login`, {
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
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return null
    return res.json()
  }
}