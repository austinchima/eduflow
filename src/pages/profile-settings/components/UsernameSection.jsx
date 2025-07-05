import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';
import { dataService } from '../../../services/dataService';
import { toast } from 'react-toastify';

const UsernameSection = () => {
  const { user, actions } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // Initialize temp username when user data loads
  useEffect(() => {
    if (user) {
      setTempUsername(user.username || '');
    }
  }, [user]);

  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
      return 'Username must be less than 20 characters long';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  };

  const checkUsernameAvailability = async (username) => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    const error = validateUsername(username);
    if (error) {
      setErrors({ username: error });
      setUsernameAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const result = await dataService.checkUsernameAvailability(username);
      setUsernameAvailable(result.available);
      if (result.available) {
        setErrors({});
      } else {
        setErrors({ username: 'Username is already taken' });
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setErrors({ username: 'Error checking username availability' });
      setUsernameAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (value) => {
    setTempUsername(value);
    setErrors({});
    setUsernameAvailable(null);
    
    // Debounce the username check
    clearTimeout(window.usernameCheckTimeout);
    window.usernameCheckTimeout = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);
  };

  const handleSave = async () => {
    const error = validateUsername(tempUsername);
    if (error) {
      setErrors({ username: error });
      return;
    }

    if (!usernameAvailable) {
      setErrors({ username: 'Please choose a different username' });
      return;
    }

    setIsSaving(true);
    try {
      await actions.updateProfile({
        username: tempUsername.trim()
      });

      setIsEditing(false);
      setErrors({});
      setUsernameAvailable(null);
      toast.success('Username updated successfully!');
    } catch (error) {
      console.error('Failed to update username:', error);
      setErrors({ username: 'Failed to update username. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempUsername(user.username || '');
    setIsEditing(false);
    setErrors({});
    setUsernameAvailable(null);
  };

  const getUsernameStatus = () => {
    if (isChecking) {
      return { icon: 'Loader2', text: 'Checking availability...', color: 'text-text-muted' };
    }
    if (usernameAvailable === true) {
      return { icon: 'CheckCircle', text: 'Username available', color: 'text-success' };
    }
    if (usernameAvailable === false) {
      return { icon: 'XCircle', text: 'Username taken', color: 'text-error' };
    }
    return null;
  };

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Username Settings</h2>
          <p className="text-sm lg:text-base text-text-secondary">Manage your unique username for identification</p>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            iconName="Edit2"
            className="w-full sm:w-auto"
          >
            Edit Username
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleCancel}
              size="sm"
              className="w-full sm:w-auto"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              size="sm"
              loading={isSaving}
              disabled={!usernameAvailable || isChecking}
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Current Username Display */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Current Username
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-text-primary">
                    {user.username || 'Not set'}
                  </div>
                  {user.generatedUsername && user.username === user.generatedUsername && (
                    <div className="text-sm text-text-muted mt-1">
                      Auto-generated username
                    </div>
                  )}
                </div>
                {user.generatedUsername && (
                  <div className="text-sm text-text-muted">
                    Generated: {user.generatedUsername}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  New Username
                </label>
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="Enter new username"
                    error={errors.username}
                    className="w-full"
                  />
                  {getUsernameStatus() && (
                    <div className={`flex items-center space-x-2 text-sm ${getUsernameStatus().color}`}>
                      <Icon 
                        name={getUsernameStatus().icon} 
                        size={16} 
                        className={isChecking ? 'animate-spin' : ''}
                      />
                      <span>{getUsernameStatus().text}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Username Guidelines */}
        <div className="bg-accent-50 border border-accent-100 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-accent-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-accent-800 mb-2">Username Guidelines</h3>
              <ul className="text-sm text-accent-700 space-y-1">
                <li>• Must be 3-20 characters long</li>
                <li>• Can contain letters, numbers, and underscores</li>
                <li>• Must be unique across all users</li>
                <li>• Cannot be changed frequently (for security)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsernameSection; 