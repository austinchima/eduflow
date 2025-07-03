import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const StudyTimeChart = ({ weeklyData, courseDistribution }) => {
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-sm text-text-secondary">
            Study Time: {payload[0].value} hours
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{payload[0].name}</p>
          <p className="text-sm text-text-secondary">
            {payload[0].value} hours ({((payload[0].value / courseDistribution.reduce((sum, item) => sum + item.hours, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const averageHours = (totalHours / 7).toFixed(1);
  const totalHoursDisplay = totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1);

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Study Analytics</h3>
          <p className="text-sm text-text-secondary">Weekly overview and course distribution</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">{totalHoursDisplay}</div>
          <div className="text-xs text-text-muted">Total Hours</div>
        </div>
        <div className="text-center p-3 bg-accent-50 rounded-lg">
          <div className="text-2xl font-bold text-accent">{averageHours}</div>
          <div className="text-xs text-text-muted">Daily Average</div>
        </div>
        <div className="text-center p-3 bg-success-50 rounded-lg">
          <div className="text-2xl font-bold text-success">{courseDistribution.length}</div>
          <div className="text-xs text-text-muted">Active Courses</div>
        </div>
        <div className="text-center p-3 bg-warning-50 rounded-lg">
          <div className="text-2xl font-bold text-warning">85%</div>
          <div className="text-xs text-text-muted">Goal Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-4">Weekly Study Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="hours" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution Pie Chart */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-4">Course Time Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="hours"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-1 gap-2 mt-4">
            {courseDistribution.map((course, index) => (
              <div key={course.name} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-text-primary font-medium flex-1">{course.name}</span>
                <span className="text-text-muted">{course.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeChart;