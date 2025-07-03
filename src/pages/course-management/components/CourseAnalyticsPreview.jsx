import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const CourseAnalyticsPreview = ({ courses }) => {
  // Calculate analytics data
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const totalMaterials = courses.reduce((sum, course) => sum + course.materialCount, 0);
  const averageGrade = courses.length > 0 
    ? Math.round(courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length)
    : 0;

  // Study time distribution data (mock)
  const studyTimeData = [
    { name: 'Mon', hours: 3.5 },
    { name: 'Tue', hours: 2.8 },
    { name: 'Wed', hours: 4.2 },
    { name: 'Thu', hours: 3.1 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 5.2 },
    { name: 'Sun', hours: 4.8 }
  ];

  // Course progress distribution
  const progressData = [
    { name: 'Completed', value: completedCourses, color: '#10B981' },
    { name: 'In Progress', value: activeCourses, color: '#3B82F6' },
    { name: 'Not Started', value: Math.max(0, totalCourses - activeCourses - completedCourses), color: '#F59E0B' }
  ];

  const stats = [
    {
      label: 'Total Courses',
      value: totalCourses,
      icon: 'BookOpen',
      color: 'text-primary',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Active Courses',
      value: activeCourses,
      icon: 'Play',
      color: 'text-accent',
      bgColor: 'bg-accent-50'
    },
    {
      label: 'Average Grade',
      value: `${averageGrade}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success-50'
    },
    {
      label: 'Total Materials',
      value: totalMaterials,
      icon: 'FileText',
      color: 'text-warning',
      bgColor: 'bg-warning-50'
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Course Analytics Preview</h3>
        <Icon name="BarChart3" size={20} className="text-text-muted" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg border border-border">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon name={stat.icon} size={24} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Time Chart */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-4">Weekly Study Hours</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value} hours`, 'Study Time']}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Progress Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-4">Course Progress Distribution</h4>
          <div className="h-48 flex items-center justify-center">
            {totalCourses > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [`${value} courses`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-text-muted">
                <Icon name="PieChart" size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No course data available</p>
              </div>
            )}
          </div>
          
          {/* Legend */}
          {totalCourses > 0 && (
            <div className="flex justify-center space-x-4 mt-4">
              {progressData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-text-secondary">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">Quick Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-accent-50 rounded-lg">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <div>
              <p className="text-sm font-medium text-text-primary">Best Performance</p>
              <p className="text-xs text-text-secondary">
                {courses.length > 0 
                  ? `${courses.reduce((best, course) => course.currentGrade > best.currentGrade ? course : best, courses[0])?.name || 'N/A'}`
                  : 'No courses yet'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg">
            <Icon name="Clock" size={16} className="text-warning" />
            <div>
              <p className="text-sm font-medium text-text-primary">Study Streak</p>
              <p className="text-xs text-text-secondary">5 days this week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalyticsPreview;