import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CourseGrid = ({ courses }) => {
  const navigate = useNavigate();

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={20} color="var(--color-accent)" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Active Courses</h3>
        </div>
        <Button
          variant="ghost"
          iconName="Plus"
          iconSize={16}
          onClick={() => navigate('/course-management')}
        >
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => {
          const daysLeft = getDaysUntilDeadline(course.nextDeadline);
          
          return (
            <div
              key={course.id}
              className="p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/course-management')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-1">{course.name}</h4>
                  <p className="text-sm text-text-secondary">{course.code}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {course.progress}%
                  </div>
                  <div className="text-xs text-text-muted">Complete</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={14} color="var(--color-text-muted)" />
                  <span className="text-text-muted">{course.nextAssignment}</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  daysLeft <= 3 ? 'text-error' : daysLeft <= 7 ? 'text-warning' : 'text-text-muted'
                }`}>
                  <Icon name="Clock" size={14} />
                  <span className="text-xs">
                    {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-8">
          <Icon name="BookOpen" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
          <p className="text-text-muted mb-4">No courses added yet</p>
          <Button
            variant="primary"
            iconName="Plus"
            onClick={() => navigate('/course-management')}
          >
            Add Your First Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;