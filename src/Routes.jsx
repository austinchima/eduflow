import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import ProtectedRoute from "/src/components/ProtectedRoute.jsx";
import UserSetup from "/src/components/UserSetup.jsx";
import AuthPage from "pages/auth";
import Dashboard from "pages/dashboard";
import StudyToolsHub from "pages/study-tools-hub";
import AnalyticsDashboard from "pages/analytics-dashboard";
import QuizInterface from "pages/quiz-interface";
import FlashcardStudySession from "pages/flashcard-study-session";
import CourseManagement from "pages/course-management";
import ProfileSettings from "pages/profile-settings";
import NotFound from "pages/NotFound";
import StudyCoursePage from "pages/course-management/components/StudyCoursePage";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Auth Route */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/study-tools-hub" element={<ProtectedRoute><StudyToolsHub /></ProtectedRoute>} />
        <Route path="/analytics-dashboard" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/setup" element={<UserSetup />} />
        <Route path="/quiz-interface" element={<ProtectedRoute><QuizInterface /></ProtectedRoute>} />
        <Route path="/flashcard-study-session" element={<ProtectedRoute><FlashcardStudySession /></ProtectedRoute>} />
        <Route path="/course-management/*" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
        <Route path="/course-management/study/:id" element={<ProtectedRoute><StudyCoursePage /></ProtectedRoute>} />
        <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;