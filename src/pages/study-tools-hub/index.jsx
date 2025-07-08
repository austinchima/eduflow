import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import MobileNavigation from '../../components/ui/MobileNavigation';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ToolCard from './components/ToolCard';
import QuickCreateSection from './components/QuickCreateSection';
import FilterSection from './components/FilterSection';
import AIRecommendations from './components/AIRecommendations';
import ProgressOverview from './components/ProgressOverview';
import TabNavigation from './components/TabNavigation';
import Icon from '../../components/AppIcon';
import { useUser } from '../../context/UserContext';

const StudyToolsHub = () => {
  const navigate = useNavigate();
  const { academic, flashcards, quizzes, studyData, actions } = useUser();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dismissedRecommendations, setDismissedRecommendations] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Defensive defaults for user data arrays
  const courses = Array.isArray(academic?.courses) ? academic.courses : [];
  const decks = Array.isArray(flashcards?.decks) ? flashcards.decks : [];
  const cards = Array.isArray(flashcards?.cards) ? flashcards.cards : [];
  const availableQuizzes = Array.isArray(quizzes?.available) ? quizzes.available : [];

  // Combine flashcards and quizzes into study tools
  const studyTools = [
    ...decks.map(deck => ({
      id: `flashcard_${deck.id}`,
      type: 'flashcard',
      title: deck.name,
      description: deck.description || 'Flashcard deck',
      courseId: deck.courseId,
      course: deck.subject,
      difficulty: deck.difficulty || 'medium',
      status: deck.status || 'active',
      dueReviews: deck.reviewCards || 0,
      totalCards: deck.totalCards || 0,
      lastStudied: deck.lastStudied,
      createdAt: deck.createdAt
    })),
    ...availableQuizzes.map(quiz => ({
      id: `quiz_${quiz.id}`,
      type: 'quiz',
      title: quiz.title,
      description: quiz.description || 'Quiz',
      courseId: quiz.courseId,
      course: quiz.subject,
      difficulty: quiz.difficulty || 'medium',
      status: quiz.status || 'not-started',
      dueReviews: 0,
      totalQuestions: quiz.questions?.length || 0,
      completionRate: quiz.completionRate || 0,
      createdAt: quiz.createdAt
    }))
  ];

  // Get AI recommendations based on user data
  const aiRecommendations = actions.getRecommendations().map(rec => ({
    id: rec.id,
    type: rec.type,
    title: rec.title,
    description: rec.description,
    course: rec.subject,
    estimatedTime: rec.estimatedTime,
    priority: rec.priority,
    reason: rec.reason || 'Based on your study patterns'
  }));

  // Calculate progress data
  const progressData = {
    totalTools: studyTools.length,
    completedTools: studyTools.filter(tool => tool.status === 'completed').length,
    inProgressTools: studyTools.filter(tool => tool.status === 'in-progress').length,
    dueReviews: studyTools.filter(tool => tool.dueReviews > 0).reduce((sum, tool) => sum + (tool.dueReviews || 0), 0),
    weeklyProgress: {
      completed: studyData.activities.filter(activity =>
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      studyTime: '12.5 hours' // This would be calculated from actual study time tracking
    }
  };

  // Filter and search logic
  const filteredTools = studyTools.filter(tool => {
    const matchesTab = activeTab === 'all' || tool.type === activeTab;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = !selectedCourse || tool.courseId === selectedCourse;
    const matchesDifficulty = !selectedDifficulty || tool.difficulty === selectedDifficulty;
    const matchesStatus = !selectedStatus || tool.status === selectedStatus;

    return matchesTab && matchesSearch && matchesCourse && matchesDifficulty && matchesStatus;
  });

  const handleCreateTool = (toolType, data) => {
    switch (toolType) {
      case 'flashcard':
        actions.addFlashcardDeck({
          name: data.title,
          description: data.description,
          courseId: data.courseId,
          subject: data.subject
        });
        break;
      case 'quiz':
        actions.addQuiz({
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          questions: data.questions || []
        });
        break;
      default:
        console.log('Unknown tool type:', toolType);
    }
  };

  const handleToolClick = (tool) => {
    switch (tool.type) {
      case 'flashcard':
        navigate('/flashcard-study-session', {
          state: { deckId: tool.id.replace('flashcard_', '') }
        });
        break;
      case 'quiz':
        navigate('/quiz-interface', {
          state: { quizId: tool.id.replace('quiz_', '') }
        });
        break;
      default:
        console.log('Unknown tool type:', tool.type);
    }
  };

  const handleAcceptRecommendation = (recommendation) => {
    if (recommendation.type === 'quiz') {
      // Try to find the quiz tool by title or id
      const quizTool = studyTools.find(tool => tool.type === 'quiz' && tool.title === recommendation.title);
      if (quizTool) {
        navigate('/quiz-interface', { state: { quizId: quizTool.id.replace('quiz_', '') } });
        return;
      }
    } else if (recommendation.type === 'flashcard') {
      const deckTool = studyTools.find(tool => tool.type === 'flashcard' && tool.title === recommendation.title);
      if (deckTool) {
        navigate('/flashcard-study-session', { state: { deckId: deckTool.id.replace('flashcard_', '') } });
        return;
      }
    }
    // Mark as done (dismiss)
    setDismissedRecommendations(prev => [...prev, recommendation.id]);
  };

  // Defensive defaults
  const safeProgressData = progressData && typeof progressData === 'object' ? progressData : {
    totalTools: 0,
    completedTools: 0,
    inProgressTools: 0,
    dueReviews: 0,
    weeklyProgress: { completed: 0, studyTime: '0 hours' }
  };
  const tabCounts = {
    all: studyTools.length,
    quizzes: studyTools.filter(t => t.type === 'quiz').length,
    flashcards: studyTools.filter(t => t.type === 'flashcard').length,
    notes: studyTools.filter(t => t.type === 'note').length,
    sessions: studyTools.filter(t => t.type === 'session').length,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <MobileNavigation />
      <main className={`flex-1 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8 ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-60'}`}
        style={{ minHeight: '100vh' }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <Breadcrumb />

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Study Tools Hub
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Access all your study tools and create new learning resources
            </p>
          </div>

          {/* Progress Overview */}
          {safeProgressData && (
            <div className="mb-6 sm:mb-8">
              <ProgressOverview progressData={safeProgressData} />
            </div>
          )}

          {/* Quick Create Section */}
          <div className="mb-6 sm:mb-8">
            <QuickCreateSection
              courses={courses}
              onCreateTool={handleCreateTool}
            />
          </div>

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <AIRecommendations
                recommendations={aiRecommendations.filter(r => !dismissedRecommendations.includes(r.id))}
                onAcceptRecommendation={handleAcceptRecommendation}
              />
            </div>
          )}

          {/* Tab Navigation */}
          {tabCounts && (
            <div className="mb-4 sm:mb-6">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabCounts={tabCounts}
              />
            </div>
          )}

          {/* Filters */}
          <div className="mb-4 sm:mb-6">
            <FilterSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              courses={courses}
            />
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Icon name="BookOpen" size={24} className="sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                No study tools found
              </h3>
              <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6 px-4">
                {searchQuery || selectedCourse || selectedDifficulty || selectedStatus
                  ? 'Try adjusting your filters to see more tools.'
                  : 'Create your first study tool to get started.'
                }
              </p>
              {!searchQuery && !selectedCourse && !selectedDifficulty && !selectedStatus && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors text-on-colored text-sm sm:text-base"
                >
                  Create Your First Tool
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyToolsHub;