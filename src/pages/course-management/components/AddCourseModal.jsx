import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddCourseModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    credits: '',
    semester: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const semesters = [
    'Fall 2024',
    'Spring 2024',
    'Summer 2024',
    'Fall 2023',
    'Spring 2023'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    
    if (!formData.credits || formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = 'Credits must be between 1 and 6';
    }
    
    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse = {
        id: Date.now(),
        ...formData,
        credits: parseInt(formData.credits),
        currentGrade: 0,
        materialCount: 0,
        progress: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      onSave(newCourse);
      handleClose();
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      instructor: '',
      credits: '',
      semester: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Add New Course</h2>
          <Button
            variant="ghost"
            onClick={handleClose}
            iconName="X"
            iconSize={20}
            className="p-2"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Course Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-error' : ''}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Instructor *
            </label>
            <Input
              type="text"
              placeholder="e.g., Dr. John Smith"
              value={formData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
              className={errors.instructor ? 'border-error' : ''}
            />
            {errors.instructor && (
              <p className="text-error text-sm mt-1">{errors.instructor}</p>
            )}
          </div>

          {/* Credits and Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Credits *
              </label>
              <Input
                type="number"
                placeholder="3"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', e.target.value)}
                className={errors.credits ? 'border-error' : ''}
              />
              {errors.credits && (
                <p className="text-error text-sm mt-1">{errors.credits}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.semester ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
              {errors.semester && (
                <p className="text-error text-sm mt-1">{errors.semester}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description of the course..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={isLoading}
              iconName="Plus"
              iconSize={16}
            >
              Add Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;