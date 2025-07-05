import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CourseAnalytics = ({ courses }) => {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || null);

  const selectedCourseData = courses.find(course => course.id === selectedCourse);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-success bg-success-50';
    if (grade >= 80) return 'text-accent bg-accent-50';
    if (grade >= 70) return 'text-warning bg-warning-50';
    return 'text-error bg-error-50';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 card-elevation">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Course Analytics</h3>
          <p className="text-sm text-text-secondary">Detailed performance by subject</p>
        </div>
        <Button variant="outline" iconName="Download" iconSize={16}>
          Export
        </Button>
      </div>

      {/* Course Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              key={`analytics-${course.id}`}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCourse === course.id
                  ? 'bg-primary text-primary-foreground text-on-colored'
                  : 'bg-secondary-50 text-text-secondary hover:bg-secondary-100 text-on-colored'
              }`}
            >
              {course.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCourseData && (
        <div className="space-y-6">
          {/* Course Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${getGradeColor(selectedCourseData.averageGrade)}`}>
                <span className="font-bold text-lg">{selectedCourseData.averageGrade}%</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Average Grade</p>
            </div>
            
            <div className="text-center p-4 bg-secondary-500 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground rounded-lg mb-2">
                <Icon name="Clock" size={20} className="icon-on-colored" />
              </div>
              <p className="font-bold text-lg text-text-primary">{selectedCourseData.studyHours}h</p>
              <p className="text-sm font-medium text-text-secondary">Study Hours</p>
            </div>
            
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-50 text-primary rounded-lg mb-2">
                <Icon name="CheckCircle" size={20} className="icon-on-colored" />
              </div>
              <p className="font-bold text-lg text-text-primary">{selectedCourseData.completionRate}%</p>
              <p className="text-sm font-medium text-text-secondary">Completion</p>
            </div>
            
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-warning-50 text-warning rounded-lg mb-2">
                <Icon name="TrendingUp" size={20} className="icon-on-colored" />
              </div>
              <p className="font-bold text-lg text-text-primary">+{selectedCourseData.improvement}%</p>
              <p className="text-sm font-medium text-text-secondary">Improvement</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h4 className="font-medium text-text-primary mb-4">Recent Activities</h4>
            <div className="space-y-3">
              {selectedCourseData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <Icon name={activity.icon} size={16} className="text-text-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{activity.title}</p>
                    <p className="text-xs text-text-muted">{activity.date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(activity.score)}`}>
                    {activity.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Recommendations */}
          <div>
            <h4 className="font-medium text-text-primary mb-4">Study Recommendations</h4>
            <div className="space-y-2">
              {selectedCourseData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-primary-50 border border-primary-100 rounded-lg">
                  <Icon name="Lightbulb" size={16} className="icon-on-colored mt-0.5" />
                  <p className="text-sm text-text-primary">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAnalytics;