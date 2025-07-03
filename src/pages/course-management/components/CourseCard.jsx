import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import MaterialUploadArea from './MaterialUploadArea';

const CourseCard = ({ course, onEdit, onUpload, onArchive, onViewMaterials, onStudy }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 80) return 'text-accent';
    if (grade >= 70) return 'text-warning';
    return 'text-error';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-accent';
    if (progress >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 relative">
      {/* Course Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-1">{course.name}</h3>
          <p className="text-sm text-text-secondary">{course.instructor}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xs text-text-muted">{course.credits} Credits</span>
            <span className="text-xs text-text-muted">{course.semester}</span>
          </div>
        </div>
        
        {/* Menu Button */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowMenu(!showMenu)}
            iconName="MoreVertical"
            iconSize={16}
            className="p-2"
          />
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-surface border border-border rounded-lg shadow-lg z-10 min-w-40">
              <button
                onClick={() => {
                  onEdit(course);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-t-lg"
              >
                <Icon name="Edit" size={16} />
                <span>Edit Course</span>
              </button>
              <button
                onClick={() => {
                  onUpload(course);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50"
              >
                <Icon name="Upload" size={16} />
                <span>Upload Materials</span>
              </button>
              <button
                onClick={() => {
                  onViewMaterials(course);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50"
              >
                <Icon name="FileText" size={16} />
                <span>View Materials</span>
              </button>
              <button
                onClick={() => {
                  onArchive(course);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-error-50 rounded-b-lg"
              >
                <Icon name="Archive" size={16} />
                <span>Archive Course</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <div className={`text-2xl font-bold ${getGradeColor(course.currentGrade)}`}>
            {course.currentGrade}%
          </div>
          <div className="text-xs text-text-muted">Current Grade</div>
        </div>
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <div className="text-2xl font-bold text-text-primary">{course.materialCount}</div>
          <div className="text-xs text-text-muted">Materials</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Course Progress</span>
          <span className="text-sm font-medium text-text-primary">{course.progress}%</span>
        </div>
        <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor(course.progress)} transition-all duration-300`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button
          variant="primary"
          onClick={() => (onStudy ? onStudy(course) : onViewMaterials(course))}
          iconName="BookOpen"
          iconSize={16}
          className="flex-1 text-sm"
        >
          Study
        </Button>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          iconName="Plus"
          iconSize={16}
          className="px-3"
        />
      </div>

      <MaterialUploadArea
        selectedCourse={course}
        onUploadComplete={(materials) => onUpload(course, materials)}
        fileInputRef={fileInputRef}
        hidden
      />

      {/* Status Indicator */}
      <div className="absolute top-4 right-12">
        <div className={`w-3 h-3 rounded-full ${course.status === 'active' ? 'bg-success' : course.status === 'completed' ? 'bg-accent' : 'bg-warning'}`} />
      </div>
    </div>
  );
};

export default CourseCard;