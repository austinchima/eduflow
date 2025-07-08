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
import { useTheme } from '../../context/ThemeContext';

const AnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const { academic, studyData, actions } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark } = useTheme();

  const timeRanges = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'semester', label: 'Semester' }
  ];

  // Calculate KPI data from user data
  const weeklyStudyTime = actions.getWeeklyStudyTime();
  const totalWeeklyHours = weeklyStudyTime && weeklyStudyTime.length > 0
    ? weeklyStudyTime.reduce((sum, d) => sum + d.hours, 0)
    : 0;
  const quizAverage = academic.quizzes && academic.quizzes.length > 0
    ? (academic.quizzes.reduce((sum, q) => sum + q.score, 0) / academic.quizzes.length)
    : 0;
  const hasCourses = academic.courses && academic.courses.length > 0;

  const kpiData = [
    {
      title: 'Current GPA',
      value: Number(actions.calculateGPA() || 0).toFixed(1),
      subtitle: 'Out of 4.0',
      icon: 'GraduationCap',
      trend: 'up',
      trendValue: '+0.0',
      color: 'success'
    },
    {
      title: 'Study Hours This Week',
      value: totalWeeklyHours.toFixed(1),
      subtitle: 'Hours completed',
      icon: 'Clock',
      trend: 'up',
      trendValue: '+0.0h',
      color: 'primary'
    },
    {
      title: 'Course Completion',
      value: hasCourses ? `${Math.round(academic.courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(academic.courses.length, 1))}%` : '0%',
      subtitle: 'Average across all courses',
      icon: 'CheckCircle',
      trend: 'up',
      trendValue: '+0%',
      color: 'accent'
    },
    {
      title: 'Quiz Average',
      value: `${Math.round(quizAverage)}%`,
      subtitle: 'Last 10 quizzes',
      icon: 'Award',
      trend: 'down',
      trendValue: '0%',
      color: 'warning'
    }
  ];

  // Get study time data based on user data
  const studyTimeData = {
    week: weeklyStudyTime && weeklyStudyTime.length > 0 ? weeklyStudyTime : [
      { period: 'Mon', hours: 0 },
      { period: 'Tue', hours: 0 },
      { period: 'Wed', hours: 0 },
      { period: 'Thu', hours: 0 },
      { period: 'Fri', hours: 0 },
      { period: 'Sat', hours: 0 },
      { period: 'Sun', hours: 0 }
    ],
    month: (studyData.month && studyData.month.length > 0) ? studyData.month : [
      { period: 'Week 1', hours: 0 },
      { period: 'Week 2', hours: 0 },
      { period: 'Week 3', hours: 0 },
      { period: 'Week 4', hours: 0 }
    ],
    semester: (studyData.semester && studyData.semester.length > 0) ? studyData.semester : [
      { period: 'Jan 2024', hours: 0 },
      { period: 'Feb 2024', hours: 0 },
      { period: 'Mar 2024', hours: 0 },
      { period: 'Apr 2024', hours: 0 },
      { period: 'May 2024', hours: 0 }
    ]
  };

  // Get course performance data from user courses
  const coursePerformanceData = hasCourses
    ? academic.courses.map(course => ({
        course: course.name,
        score: course.currentGrade
      }))
    : [];

  // Learning pattern data (should come from analytics if available)
  const learningPatternData = (studyData.learningPatterns && studyData.learningPatterns.length > 0)
    ? studyData.learningPatterns
    : [
        { subject: 'Memory', value: 0 },
        { subject: 'Focus', value: 0 },
        { subject: 'Speed', value: 0 },
        { subject: 'Accuracy', value: 0 },
        { subject: 'Retention', value: 0 },
        { subject: 'Application', value: 0 }
      ];

  // Get AI insights based on user data (replace with dynamic if available)
  const aiInsights = (studyData.aiInsights && studyData.aiInsights.length > 0)
    ? studyData.aiInsights
    : [
        {
          type: 'info',
          title: 'No Insights Yet',
          description: 'AI insights will appear here once you start studying and analytics are available.',
          action: null
        }
      ];

  // Progress tracking data
  const progressGoals = [
    {
      title: 'Daily Study Goal',
      current: Number(studyData.todayHours || 0).toFixed(1),
      target: Number(academic.studyGoal || 5).toFixed(1),
      unit: 'hours',
      percentage: academic.studyGoal ? Math.round(((studyData.todayHours || 0) / (academic.studyGoal || 5)) * 100) : 0,
      startDate: 'Jan 1',
      deadline: 'Dec 31',
      streak: academic.studyStreak ? academic.studyStreak.current : 0,
      icon: 'Clock'
    },
    {
      title: 'GPA Target',
      current: Number(actions.calculateGPA() || 0).toFixed(1),
      target: Number((academic.gpa && academic.gpa.target) || 4).toFixed(1),
      unit: 'points',
      percentage: academic.gpa && academic.gpa.target ? Math.round((actions.calculateGPA() / academic.gpa.target) * 100) : 0,
      startDate: 'Sep 1',
      deadline: 'May 31',
      icon: 'TrendingUp'
    },
    {
      title: 'Course Completion',
      current: hasCourses ? Math.round(academic.courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(academic.courses.length, 1)) : 0,
      target: 95,
      unit: '%',
      percentage: hasCourses ? Math.round((academic.courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(academic.courses.length, 1)) / 95 * 100) : 0,
      startDate: 'Sep 1',
      deadline: 'Dec 15',
      icon: 'BookOpen'
    },
    {
      title: 'Quiz Performance',
      current: Math.round(quizAverage),
      target: 95,
      unit: '%',
      percentage: quizAverage ? Math.round((quizAverage / 95) * 100) : 0,
      startDate: 'Sep 1',
      deadline: 'Dec 15',
      streak: academic.studyStreak ? academic.studyStreak.current : 0,
      icon: 'Award'
    }
  ];

  // Course analytics data
  const courseAnalyticsData = hasCourses
    ? academic.courses.map(course => ({
        id: course.id,
        name: course.name,
        averageGrade: Math.round(course.currentGrade),
        studyHours: course.studyHours ? Number(course.studyHours).toFixed(1) : '0.0',
        completionRate: Math.round(course.progress),
        improvement: course.improvement ? Number(course.improvement).toFixed(1) : '0.0',
        recentActivities: (course.recentActivities || []).map(activity => ({
          ...activity,
          score: activity.score ? Math.round(activity.score) : 0
        })),
        recommendations: course.recommendations || [
          course.currentGrade < 80 ? `Focus more on ${course.name} - your weakest area` : `Excellent progress in ${course.name}!`,
          'Practice word problems to improve application skills',
          'Review key concepts before the midterm'
        ]
      }))
    : [{
        id: 'no-data',
        name: 'No Courses',
        averageGrade: 0,
        studyHours: '0.0',
        completionRate: 0,
        improvement: '0.0',
        recentActivities: [],
        recommendations: ['No course analytics available yet.']
      }];

  // Dynamic values for Study Analytics
  const weeklyStudyData = studyTimeData.week;
  const totalHours = weeklyStudyData.reduce((sum, d) => sum + d.hours, 0).toFixed(1);
  const dailyAverage = (totalHours / weeklyStudyData.length).toFixed(1);
  const activeCourses = academic.courses.length;
  const goalProgress = progressGoals[0]?.percentage || 0;

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

            {/* Study Analytics Section */}
            <div className="bg-surface rounded-lg border border-border p-6 card-elevation mb-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-50 text-primary rounded-lg mr-3">
                  <Icon name="BarChart2" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary dark:text-white mb-0.5">Study Analytics</h2>
                  <p className="text-sm text-text-secondary dark:text-white/80">{selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)} overview and course distribution</p>
                </div>
              </div>
              {Array.isArray(studyTimeData[selectedTimeRange]) && studyTimeData[selectedTimeRange].length > 0 && studyTimeData[selectedTimeRange].some(d => d.hours > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className={`rounded-lg p-6 text-center ${isDark ? 'bg-primary-900' : 'bg-primary-50'}`}> 
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-primary'}`}>{totalHours}</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-primary'}`}>Total Hours</div>
                  </div>
                  <div className={`rounded-lg p-6 text-center ${isDark ? 'bg-success-900' : 'bg-success-50'}`}> 
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-success'}`}>{dailyAverage}</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-success'}`}>Daily Average</div>
                  </div>
                  <div className={`rounded-lg p-6 text-center ${isDark ? 'bg-success-900' : 'bg-success-50'}`}> 
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-success'}`}>{activeCourses}</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-success'}`}>Active Courses</div>
                  </div>
                  <div className={`rounded-lg p-6 text-center ${isDark ? 'bg-warning-900' : 'bg-warning-50'}`}> 
                    <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-warning'}`}>{goalProgress}%</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-warning'}`}>Goal Progress</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-text-muted text-lg">
                  No study analytics data available.
                </div>
              )}
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