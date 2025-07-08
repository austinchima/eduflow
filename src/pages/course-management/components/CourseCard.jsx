import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MaterialUploadArea from './MaterialUploadArea';
import { getSemesterDisplayName, getSemesterColorClass } from '../../../utils/semesterUtils';
import Tooltip from '../../../components/ui/Tooltip';

// Helper function to generate course image based on course name
const getCourseImage = (courseName) => {
  const courseNameLower = courseName.toLowerCase();
  
  // Define course categories and their corresponding images
  const courseCategories = {
    'computer science': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    'programming': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    'coding': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    'software': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    'math': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'calculus': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'algebra': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'physics': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'chemistry': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop',
    'biology': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f7?w=400&h=300&fit=crop',
    'history': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'english': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    'literature': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    'writing': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    'economics': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    'business': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    'finance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    'psychology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'philosophy': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=400&h=300&fit=crop',
    'music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    'engineering': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    'architecture': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    'medicine': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    'nursing': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    'law': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
    'teaching': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop'
  };

  // Check if course name contains any of the category keywords
  for (const [category, imageUrl] of Object.entries(courseCategories)) {
    if (courseNameLower.includes(category)) {
      return imageUrl;
    }
  }

  // Default image for courses that don't match any category
  return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop';
};

const CourseCard = ({ course, viewMode = 'grid', onEdit, onUpload, onArchive, onViewMaterials, onStudy, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadingCourseId, setUploadingCourseId] = useState(null);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-success text-on-colored';
    if (grade >= 80) return 'text-accent text-on-colored';
    if (grade >= 70) return 'text-warning text-on-colored';
    return 'text-error text-on-colored';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success text-on-colored';
    if (progress >= 60) return 'bg-accent text-on-colored';
    if (progress >= 40) return 'bg-warning text-on-colored';
    return 'bg-error text-on-colored';
  };

  const courseImage = getCourseImage(course.name);
  const isListView = viewMode === 'list';

  const renderDropdownMenu = () => (
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
                  onArchive(course, course.status === 'archived' ? 'active' : 'archived');
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50"
              >
                <Icon name="Archive" size={16} />
                <span>{course.status === 'archived' ? 'Unarchive Course' : 'Archive Course'}</span>
              </button>
              <button
                onClick={() => {
                  onDelete(course.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-error-50 rounded-b-lg"
              >
                <Icon name="Trash2" size={16} />
                <span>Delete Course</span>
              </button>
            </div>
  );

  return (
    <div className={`bg-surface border border-border rounded-lg hover:shadow-lg transition-all duration-300 relative ${
      isListView ? 'p-4' : 'p-6'
    }`}>
      {isListView ? (
        // List View Layout
        <div className="flex items-start space-x-4">
          {/* Course Image */}
          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
            <img
              src={courseImage}
              alt={`${course.name} course`}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          
          {/* Course Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1">
                  {course.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {course.instructor}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-text-muted">{course.credits} Credits</span>
                  <span className={`text-xs ${getSemesterColorClass(course.semester)}`}>
                    {getSemesterDisplayName(course.semester)}
                  </span>
                </div>
              </div>
              
              {/* Menu Button */}
              <div className="relative ml-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowMenu(!showMenu)}
                  iconName="MoreVertical"
                  iconSize={16}
                  className="p-2"
                />
                {showMenu && renderDropdownMenu()}
              </div>
            </div>
            
            {/* Course Stats and Progress */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-2 bg-secondary-50 rounded-lg">
                <div className={`font-bold ${getGradeColor(course.currentGrade)} text-lg sm:text-xl`}>
                  {course.currentGrade}%
                </div>
                <div className="text-xs text-text-muted">Current Grade</div>
              </div>
              <div className="text-center p-2 bg-secondary-50 rounded-lg">
                <div className="font-bold text-text-primary text-lg sm:text-xl">
                  {course.materialCount}
                </div>
                <div className="text-xs text-text-muted">Materials</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-text-secondary">Course Progress</span>
                <span className="text-xs sm:text-sm font-medium text-text-primary">{course.progress}%</span>
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
                iconSize={14}
                className="text-sm flex-1 sm:flex-none sm:px-4"
              >
                Study
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadingCourseId(course.id);
                  fileInputRef.current?.click();
                }}
                iconName="Plus"
                iconSize={14}
                className="px-2 sm:px-3"
                aria-label="Add Materials"
              />
              <Tooltip text="Add Materials" position="top" />
            </div>
          </div>
        </div>
      ) : (
        // Grid View Layout
        <div>
          {/* Course Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Course Image */}
              <div className="w-full h-32 sm:h-40 mb-4">
                <img
                  src={courseImage}
                  alt={`${course.name} course`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-1">{course.name}</h3>
              <p className="text-sm text-text-secondary">{course.instructor}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-text-muted">{course.credits} Credits</span>
                <span className={`text-xs ${getSemesterColorClass(course.semester)}`}>
                  {getSemesterDisplayName(course.semester)}
                </span>
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
              {showMenu && renderDropdownMenu()}
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
              onClick={() => {
                setUploadingCourseId(course.id);
                fileInputRef.current?.click();
              }}
          iconName="Plus"
          iconSize={16}
          className="px-3"
        />
      </div>
        </div>
      )}

      <MaterialUploadArea
        selectedCourse={course}
        onUploadComplete={(materials) => {
          if (onUpload) onUpload(course, materials);
        }}
        fileInputRef={fileInputRef}
        hidden
        uploadingCourseId={uploadingCourseId}
      />

      {/* Status Indicator */}
      <div className="absolute top-4 right-12">
        <div className={`w-3 h-3 rounded-full ${course.status === 'active' ? 'bg-success' : course.status === 'completed' ? 'bg-accent' : 'bg-warning'}`} />
      </div>
    </div>
  );
};

export default CourseCard;