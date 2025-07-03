import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';

const ProfileInfoSection = () => {
  const { user, actions } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempData, setTempData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    major: '',
    graduationYear: '',
    timezone: 'UTC-5',
    language: 'en',
    profilePhoto: null
  });
  const [errors, setErrors] = useState({});

  // Initialize temp data when user data loads
  useEffect(() => {
    if (user) {
      setTempData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        studentId: user.studentId || '',
        major: user.major || '',
        graduationYear: user.graduationYear || '',
        timezone: user.timezone || 'UTC-5',
        language: user.language || 'en',
        profilePhoto: user.avatar || null
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!tempData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!tempData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!tempData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!tempData.major?.trim()) {
      newErrors.major = 'Major is required';
    }
    
    if (!tempData.graduationYear?.trim()) {
      newErrors.graduationYear = 'Graduation year is required';
    } else if (!/^\d{4}$/.test(tempData.graduationYear)) {
      newErrors.graduationYear = 'Please enter a valid 4-digit year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Update user profile data
      await actions.updateProfile({
        firstName: tempData.firstName.trim(),
        lastName: tempData.lastName.trim(),
        email: tempData.email.trim(),
        studentId: tempData.studentId.trim(),
        major: tempData.major.trim(),
        graduationYear: tempData.graduationYear.trim(),
        timezone: tempData.timezone,
        language: tempData.language,
        avatar: tempData.profilePhoto,
        name: `${tempData.firstName.trim()} ${tempData.lastName.trim()}`.trim()
      });

      setIsEditing(false);
      setErrors({});
      
      // Show success feedback (you could add a toast notification here)
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      studentId: user.studentId || '',
      major: user.major || '',
      graduationYear: user.graduationYear || '',
      timezone: user.timezone || 'UTC-5',
      language: user.language || 'en',
      profilePhoto: user.avatar || null
    });
    setIsEditing(false);
    setErrors({});
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePhoto: 'File size must be less than 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Please select an image file' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setTempData(prev => ({ ...prev, profilePhoto: e.target?.result }));
        setErrors(prev => ({ ...prev, profilePhoto: '' }));
      };
      reader.readAsDataURL(file);
    }
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
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Profile Information</h2>
          <p className="text-sm lg:text-base text-text-secondary">Manage your personal information and academic details</p>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            iconName="Edit2"
            className="w-full sm:w-auto"
          >
            Edit Profile
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
              className="w-full sm:w-auto"
              disabled={isSaving}
              iconName={isSaving ? "Loader" : "Save"}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
          <p className="text-error text-sm">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-secondary-100 flex items-center justify-center overflow-hidden">
                {tempData.profilePhoto ? (
                  <img
                    src={tempData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={32} color="#64748B" />
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 bg-primary text-white rounded-full p-1.5 lg:p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                  <Icon name="Camera" size={14} className="lg:w-4 lg:h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.profilePhoto && (
              <p className="text-error text-sm mt-2 text-center sm:text-left">{errors.profilePhoto}</p>
            )}
          </div>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                First Name *
              </label>
              {isEditing ? (
                <div>
                  <Input
                    type="text"
                    value={tempData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-error' : ''}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-error text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.firstName || 'Not set'}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Last Name *
              </label>
              {isEditing ? (
                <div>
                  <Input
                    type="text"
                    value={tempData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-error' : ''}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-error text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.lastName || 'Not set'}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address *
              </label>
              {isEditing ? (
                <div>
                  <Input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-error' : ''}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-error text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.email || 'Not set'}
                </p>
              )}
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Student ID
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  value={tempData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  placeholder="Enter student ID"
                />
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.studentId || 'Not set'}
                </p>
              )}
            </div>

            {/* Major */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Major *
              </label>
              {isEditing ? (
                <div>
                  <Input
                    type="text"
                    value={tempData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    className={errors.major ? 'border-error' : ''}
                    placeholder="Enter your major"
                  />
                  {errors.major && (
                    <p className="text-error text-sm mt-1">{errors.major}</p>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.major || 'Not set'}
                </p>
              )}
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Graduation Year *
              </label>
              {isEditing ? (
                <div>
                  <Input
                    type="text"
                    value={tempData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className={errors.graduationYear ? 'border-error' : ''}
                    placeholder="Enter graduation year"
                  />
                  {errors.graduationYear && (
                    <p className="text-error text-sm mt-1">{errors.graduationYear}</p>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.graduationYear || 'Not set'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Time Zone
              </label>
              {isEditing ? (
                <select 
                  value={tempData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                >
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC+0">UTC</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                  <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
                  <option value="UTC+8">China Standard Time (UTC+8)</option>
                  <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                </select>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.timezone || 'UTC-5'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Language
              </label>
              {isEditing ? (
                <select 
                  value={tempData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="hi">Hindi</option>
                </select>
              ) : (
                <p className="text-text-secondary bg-secondary-50 px-3 py-2 rounded-md">
                  {user.language === 'en' ? 'English' : 
                   user.language === 'es' ? 'Spanish' :
                   user.language === 'fr' ? 'French' :
                   user.language === 'de' ? 'German' :
                   user.language === 'zh' ? 'Chinese' :
                   user.language === 'ja' ? 'Japanese' :
                   user.language === 'ko' ? 'Korean' :
                   user.language === 'hi' ? 'Hindi' : 'English'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;