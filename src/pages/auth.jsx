import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { useUser } from '../context/UserContext';

const AuthPage = () => {
  const { actions, user, isLoading } = useUser();
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
  const [debugInfo, setDebugInfo] = useState({});
  const [apiTestResult, setApiTestResult] = useState('');

  // Add debugging information
  useEffect(() => {
    const token = localStorage.getItem('token');
    setDebugInfo({
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      userState: {
        hasUser: !!user,
        userId: user?.id,
        userName: user?.name,
        isLoading
      }
    });
  }, [user, isLoading]);

  const testApiConnection = async () => {
    try {
      setApiTestResult('Testing...');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      console.log('Testing API connection to:', apiUrl);
      
      const response = await fetch(`${apiUrl}/test`);
      if (response.ok) {
        const data = await response.json();
        setApiTestResult(`✅ API is working: ${data.message}`);
        console.log('API test successful:', data);
      } else {
        setApiTestResult(`❌ API test failed: ${response.status} ${response.statusText}`);
        console.error('API test failed:', response.status, response.statusText);
      }
    } catch (error) {
      setApiTestResult(`❌ API connection error: ${error.message}`);
      console.error('API connection error:', error);
    }
  };

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
        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            <div className="mt-2">
              <Button
                variant="secondary"
                onClick={testApiConnection}
                className="text-xs"
              >
                Test API Connection
              </Button>
              {apiTestResult && (
                <div className="mt-2 text-xs">
                  <strong>API Test:</strong> {apiTestResult}
                </div>
              )}
            </div>
          </div>
        )}
        
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
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm bg-green-50 p-3 rounded">
              {success}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary hover:text-primary-dark text-sm"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 