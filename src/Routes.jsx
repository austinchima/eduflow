import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import StudyToolsHub from "pages/study-tools-hub";
import AnalyticsDashboard from "pages/analytics-dashboard";
import QuizInterface from "pages/quiz-interface";
import FlashcardStudySession from "pages/flashcard-study-session";
import CourseManagement from "pages/course-management";
import ProfileSettings from "pages/profile-settings";
import NotFound from "pages/NotFound";
import StudyCoursePage from "pages/course-management/components/StudyCoursePage";
import AuthPage from "pages/auth";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study-tools-hub" element={<StudyToolsHub />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/quiz-interface" element={<QuizInterface />} />
        <Route path="/flashcard-study-session" element={<FlashcardStudySession />} />
        <Route path="/course-management/*" element={<CourseManagement />} />
        <Route path="/course-management/study/:id" element={<StudyCoursePage />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;