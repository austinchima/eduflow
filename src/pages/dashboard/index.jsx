import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import StudySessionControls from '../../components/ui/StudySessionControls';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MobileNavigation from '../../components/ui/MobileNavigation';
import GpaCard from './components/GpaCard';
import CourseGrid from './components/CourseGrid';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import StudyStreak from './components/StudyStreak';
import AiRecommendations from './components/AiRecommendations';
import StudyTimeChart from './components/StudyTimeChart';
import NavigationTiles from './components/NavigationTiles';
import { useUser } from '../../context/UserContext';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    user, 
    academic, 
    studyData, 
    actions,
    isLoading: userLoading 
  } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get dynamic data
  const currentGpa = actions.calculateGPA();
  const weeklyData = actions.getWeeklyStudyTime();
  const courseDistribution = actions.getCourseDistribution();
  const recommendations = actions.getRecommendations();

  // Determine if user is a first-time user (created within the last 24 hours)
  const isFirstTimeUser = () => {
    if (!user.createdAt) return false;
    
    try {
      const createdAt = new Date(user.createdAt);
      const now = new Date();
      
      // Check if the date is valid
      if (isNaN(createdAt.getTime())) return false;
      
      const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
      return hoursSinceCreation < 24;
    } catch (error) {
      console.error('Error parsing user creation date:', error);
      return false;
    }
  };

  const isNewUser = isFirstTimeUser();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <StudySessionControls />
      <MobileNavigation />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} px-4 lg:px-8`}
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="p-4 lg:p-8">
            <Breadcrumb />
            
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {isNewUser ? 'Welcome' : 'Welcome back'}, {user.firstName || user.name?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-text-secondary">
                {isNewUser 
                  ? "Welcome to EduFlow! Let's start your academic journey together."
                  : `Here's your academic overview for today, ${new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}`
                }
              </p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <GpaCard 
                currentGpa={currentGpa}
                targetGpa={academic.gpa.target}
                semester={academic.gpa.semester}
              />
              <StudyStreak 
                currentStreak={academic.studyStreak.current}
                longestStreak={academic.studyStreak.longest}
                weeklyGoal={academic.studyStreak.weeklyGoal}
                weeklyProgress={academic.studyStreak.weeklyProgress}
                studyDays={academic.studyStreak.studyDays}
              />
              <QuickActions />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 space-y-6">
                <CourseGrid courses={academic.courses} />
                <StudyTimeChart 
                  weeklyData={weeklyData}
                  courseDistribution={courseDistribution}
                />
                <NavigationTiles />
              </div>
              
              <div className="space-y-6">
                <ActivityFeed activities={studyData.activities} />
                <AiRecommendations recommendations={recommendations} />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center text-sm text-text-muted">
                <p>EduFlow - Empowering your academic journey with AI</p>
                <p className="mt-1">© {new Date().getFullYear()} EduFlow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;