import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import MobileNavigation from '../../components/ui/MobileNavigation';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StudySessionControls from '../../components/ui/StudySessionControls';
import KPICard from './components/KPICard';
import StudyTimeChart from './components/StudyTimeChart';
import CoursePerformanceChart from './components/CoursePerformanceChart';
import LearningPatternChart from './components/LearningPatternChart';
import AIInsightsPanel from './components/AIInsightsPanel';
import ProgressTracker from './components/ProgressTracker';
import CourseAnalytics from './components/CourseAnalytics';
import TimeRangeSelector from './components/TimeRangeSelector';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useUser } from '../../context/UserContext';

const AnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const { academic, studyData, actions } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const timeRanges = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'semester', label: 'Semester' }
  ];

  // Calculate KPI data from user data
  const kpiData = [
    {
      title: 'Current GPA',
      value: actions.calculateGPA().toFixed(1),
      subtitle: 'Out of 4.0',
      icon: 'GraduationCap',
      trend: 'up',
      trendValue: '+0.2',
      color: 'success'
    },
    {
      title: 'Study Hours This Week',
      value: '28.5', // This would be calculated from actual study time tracking
      subtitle: 'Hours completed',
      icon: 'Clock',
      trend: 'up',
      trendValue: '+5.2h',
      color: 'primary'
    },
    {
      title: 'Course Completion',
      value: `${Math.round(academic.courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(academic.courses.length, 1))}%`,
      subtitle: 'Average across all courses',
      icon: 'CheckCircle',
      trend: 'up',
      trendValue: '+12%',
      color: 'accent'
    },
    {
      title: 'Quiz Average',
      value: '91%', // This would be calculated from actual quiz results
      subtitle: 'Last 10 quizzes',
      icon: 'Award',
      trend: 'down',
      trendValue: '-3%',
      color: 'warning'
    }
  ];

  // Get study time data based on user data
  const studyTimeData = {
    week: actions.getWeeklyStudyTime(),
    month: [
      { period: 'Week 1', hours: 22.5 },
      { period: 'Week 2', hours: 28.3 },
      { period: 'Week 3', hours: 31.2 },
      { period: 'Week 4', hours: 26.8 }
    ],
    semester: [
      { period: 'Jan 2024', hours: 95.2 },
      { period: 'Feb 2024', hours: 102.8 },
      { period: 'Mar 2024', hours: 88.5 },
      { period: 'Apr 2024', hours: 115.3 },
      { period: 'May 2024', hours: 78.9 }
    ]
  };

  // Get course performance data from user courses
  const coursePerformanceData = academic.courses.map(course => ({
    course: course.name,
    score: course.currentGrade
  }));

  // Learning pattern data (this would come from actual learning analytics)
  const learningPatternData = [
    { subject: 'Memory', value: 85 },
    { subject: 'Focus', value: 78 },
    { subject: 'Speed', value: 92 },
    { subject: 'Accuracy', value: 88 },
    { subject: 'Retention', value: 91 },
    { subject: 'Application', value: 83 }
  ];

  // Get AI insights based on user data
  const aiInsights = [
    {
      type: 'recommendation',
      title: 'Optimal Study Time Detected',
      description: 'Your performance peaks between 2-4 PM. Consider scheduling difficult subjects during this time.',
      action: 'Adjust Schedule'
    },
    {
      type: 'warning',
      title: 'Course Performance Alert',
      description: `Your ${academic.courses.find(c => c.currentGrade < 80)?.name || 'course'} scores need attention. Additional practice recommended.`,
      action: 'View Resources'
    },
    {
      type: 'achievement',
      title: 'Study Streak Milestone',
      description: `Congratulations! You've maintained a ${academic.studyStreak.current}-day consistent study streak.`,
      action: 'Share Achievement'
    },
    {
      type: 'pattern',
      title: 'Learning Style Insight',
      description: 'You retain information 23% better with visual aids. Try incorporating more diagrams and charts.',
      action: 'Explore Tools'
    }
  ];

  // Progress tracking data
  const progressGoals = [
    {
      title: 'Daily Study Goal',
      current: 4.2,
      target: 5.0,
      unit: 'hours',
      percentage: 84,
      startDate: 'Jan 1',
      deadline: 'Dec 31',
      streak: academic.studyStreak.current,
      icon: 'Clock'
    },
    {
      title: 'GPA Target',
      current: actions.calculateGPA(),
      target: academic.gpa.target,
      unit: 'points',
      percentage: Math.round((actions.calculateGPA() / academic.gpa.target) * 100),
      startDate: 'Sep 1',
      deadline: 'May 31',
      icon: 'TrendingUp'
    },
    {
      title: 'Course Completion',
      current: Math.round(academic.courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(academic.courses.length, 1)),
      target: 95,
      unit: '%',
      percentage: Math.round((academic.courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(academic.courses.length, 1)) / 95 * 100),
      startDate: 'Sep 1',
      deadline: 'Dec 15',
      icon: 'BookOpen'
    },
    {
      title: 'Quiz Performance',
      current: 91,
      target: 95,
      unit: '%',
      percentage: 96,
      startDate: 'Sep 1',
      deadline: 'Dec 15',
      streak: 8,
      icon: 'Award'
    }
  ];

  // Course analytics data
  const courseAnalyticsData = academic.courses.map(course => ({
    id: course.id,
    name: course.name,
    averageGrade: course.currentGrade,
    studyHours: Math.random() * 50 + 20, // This would come from actual study tracking
    completionRate: course.progress,
    improvement: Math.random() * 20 - 10, // This would be calculated from historical data
    recentActivities: [
      { title: `${course.name} Quiz`, date: '2 days ago', score: course.currentGrade + Math.random() * 10 - 5, icon: 'FileText' },
      { title: `${course.name} Assignment`, date: '5 days ago', score: course.currentGrade + Math.random() * 10 - 5, icon: 'Edit' },
      { title: `${course.name} Practice`, date: '1 week ago', score: course.currentGrade + Math.random() * 10 - 5, icon: 'BarChart' }
    ],
    recommendations: [
      course.currentGrade < 80 ? `Focus more on ${course.name} - your weakest area` : `Excellent progress in ${course.name}!`,
      'Practice word problems to improve application skills',
      'Review key concepts before the midterm'
    ]
  }));

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleExportData = () => {
    // Export functionality
    const exportData = {
      timeRange: selectedTimeRange,
      kpis: kpiData,
      studyTime: studyTimeData[selectedTimeRange],
      coursePerformance: coursePerformanceData,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <MobileNavigation />
        <StudySessionControls />
        
        <main className="lg:ml-60 min-h-screen">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading analytics data...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <MobileNavigation />
      <StudySessionControls />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} px-4 lg:px-8`}
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="p-6 lg:p-8">
            <Breadcrumb />
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics Dashboard</h1>
                <p className="text-text-secondary">
                  Comprehensive insights into your academic performance and learning patterns
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <TimeRangeSelector
                  selectedRange={selectedTimeRange}
                  onRangeChange={setSelectedTimeRange}
                  ranges={timeRanges}
                />
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  iconName="Download"
                  iconSize={16}
                >
                  Export
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {kpiData.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <StudyTimeChart 
                data={studyTimeData[selectedTimeRange]} 
                timeRange={selectedTimeRange}
              />
              <CoursePerformanceChart data={coursePerformanceData} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <LearningPatternChart data={learningPatternData} />
              <AIInsightsPanel insights={aiInsights} />
            </div>

            {/* Progress and Course Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <ProgressTracker goals={progressGoals} />
              <CourseAnalytics courses={courseAnalyticsData} />
            </div>

            {/* Footer Stats */}
            <div className="bg-surface rounded-lg border border-border p-6 card-elevation">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-50 text-primary rounded-lg mx-auto mb-2">
                    <Icon name="Calendar" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-text-primary">156</p>
                  <p className="text-sm text-text-secondary">Study Days</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center w-12 h-12 bg-accent-50 text-accent rounded-lg mx-auto mb-2">
                    <Icon name="BookOpen" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-text-primary">24</p>
                  <p className="text-sm text-text-secondary">Courses Completed</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center w-12 h-12 bg-success-50 text-success rounded-lg mx-auto mb-2">
                    <Icon name="Trophy" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-text-primary">89</p>
                  <p className="text-sm text-text-secondary">Achievements</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center w-12 h-12 bg-warning-50 text-warning rounded-lg mx-auto mb-2">
                    <Icon name="Zap" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-text-primary">342</p>
                  <p className="text-sm text-text-secondary">Study Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;