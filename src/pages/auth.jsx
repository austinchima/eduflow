import React, { useState } from 'react';
import { authService } from '../services/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await authService.signIn(form.email, form.password);
        setSuccess('Logged in! Redirecting...');
        // Optionally redirect or reload
        setTimeout(() => window.location.reload(), 1000);
      } else {
        await authService.signUp(form.email, form.password, { name: form.name });
        setSuccess('Account created! Please check your email to confirm.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface border border-border rounded-lg p-8 max-w-md w-full shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Icon name="User" size={40} className="text-primary mb-2" />
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {mode === 'login' ? 'Sign In to EduFlow' : 'Create Your EduFlow Account'}
          </h2>
          <p className="text-text-secondary text-sm">
            {mode === 'login' ? 'Welcome back! Please log in.' : 'Sign up to get started.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (mode === 'login' ? 'Signing In...' : 'Signing Up...') : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-primary hover:underline text-sm"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setSuccess('');
            }}
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 