import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Icon from './AppIcon';

const UserSetup = ({ onComplete }) => {
  const { user, actions } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    studyGoal: user.preferences?.studyGoal || 5,
    targetGpa: 3.8,
    notifications: user.preferences?.notifications !== false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Save user data to backend and context
      await actions.savePersonalization({
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName,
        email: formData.email,
        studyGoal: formData.studyGoal,
        targetGpa: formData.targetGpa,
        notifications: formData.notifications,
        theme: 'light',
      });
      // Optionally update GPA target in context (if needed elsewhere)
      actions.updateGPA({ target: formData.targetGpa });
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0;
      case 2:
        return formData.studyGoal > 0 && formData.studyGoal <= 24;
      case 3:
        return formData.targetGpa >= 0 && formData.targetGpa <= 4.0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="User" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Welcome to EduFlow!
            </h2>
            <p className="text-text-secondary mb-8">
              Let's personalize your learning experience. First, tell us about yourself.
            </p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <Input
                label="Email (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Clock" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Set Your Study Goals
            </h2>
            <p className="text-text-secondary mb-8">
              How many hours would you like to study each day?
            </p>
            
            <div className="max-w-md mx-auto">
              <Input
                label="Daily Study Goal (hours)"
                type="number"
                min="1"
                max="24"
                value={formData.studyGoal}
                onChange={(e) => handleInputChange('studyGoal', parseInt(e.target.value) || 0)}
                placeholder="5"
                required
              />
              <p className="text-sm text-text-secondary mt-2">
                We'll help you track your progress and maintain consistency.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Target" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Set Your GPA Target
            </h2>
            <p className="text-text-secondary mb-8">
              What's your target GPA for this semester?
            </p>
            
            <div className="max-w-md mx-auto">
              <Input
                label="Target GPA"
                type="number"
                min="0"
                max="4.0"
                step="0.1"
                value={formData.targetGpa}
                onChange={(e) => handleInputChange('targetGpa', parseFloat(e.target.value) || 0)}
                placeholder="3.8"
                required
              />
              <p className="text-sm text-text-secondary mt-2">
                We'll track your progress and provide insights to help you reach your goal.
              </p>
              
              <div className="mt-6">
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) => handleInputChange('notifications', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">
                    Enable notifications for study reminders and progress updates
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg p-8 max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-secondary mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {step === 3 ? 'Get Started' : 'Next'}
          </Button>
        </div>

        {/* Note about editing preferences later */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary">
            💡 Don't worry! You can always edit these preferences later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSetup; 