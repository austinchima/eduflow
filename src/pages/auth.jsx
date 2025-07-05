import React, { useState } from 'react';
import { authService } from '../services/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { useUser } from '../context/UserContext';

const AuthPage = () => {
  const { actions } = useUser();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
        await actions.login(form.email, form.password);
        setSuccess('Logged in successfully!');
      } else {
        // Combine first and last name for the username
        const fullName = `${form.firstName} ${form.lastName}`.trim();
        await actions.signup(form.email, form.password, { 
          firstName: form.firstName,
          lastName: form.lastName,
          name: fullName
        });
        setSuccess('Account created successfully!');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background p-4 auth-transition ${loading ? 'loading' : ''}`}>
      <div className="bg-surface border border-border rounded-lg p-8 max-w-md w-full shadow-lg loading-transition">
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
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  required
                  disabled={loading}
                />
                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
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
              setForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
              });
            }}
            disabled={loading}
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