import React, { useState, useEffect } from 'react';
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

  // Defensive defaults for user data arrays
  const courses = Array.isArray(academic?.courses) ? academic.courses : [];
  const decks = Array.isArray(flashcards?.decks) ? flashcards.decks : [];
  const cards = Array.isArray(flashcards?.cards) ? flashcards.cards : [];
  const availableQuizzes = Array.isArray(quizzes?.available) ? quizzes.available : [];


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

  // If no courses, show a friendly message
  // if (courses.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-background flex flex-col items-center justify-center">
  //       <Icon name="BookOpen" size={48} className="mb-4 text-muted-foreground" />
  //       <h2 className="text-2xl font-bold mb-2">No Courses Found</h2>
  //       <p className="text-text-secondary mb-6">Get started by adding your first course to unlock study tools and AI-powered learning.</p>
  //       <a href="/course-management">
  //         <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
  //           Go to Course Management
  //         </button>
  //       </a>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <MobileNavigation />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} px-4 lg:px-8`}
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Study Tools Hub
            </h1>
            <p className="text-text-secondary">
              Access all your study tools and create new learning resources
            </p>
          </div>

          {/* Progress Overview */}
          {safeProgressData && (
            <div className="mb-8">
              <ProgressOverview progressData={safeProgressData} />
            </div>
          )}

          {/* Quick Create Section */}
          <div className="mb-8">
            <QuickCreateSection
              courses={courses}
              onCreateTool={handleCreateTool}
            />
          </div>

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <div className="mb-8">
              <AIRecommendations recommendations={aiRecommendations} />
            </div>
          )}

          {/* Tab Navigation */}
          {tabCounts && (
            <div className="mb-6">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabCounts={tabCounts}
              />
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Icon name="BookOpen" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No study tools found
              </h3>
              <p className="text-text-secondary mb-6">
                {searchQuery || selectedCourse || selectedDifficulty || selectedStatus
                  ? 'Try adjusting your filters to see more tools.'
                  : 'Create your first study tool to get started.'
                }
              </p>
              {!searchQuery && !selectedCourse && !selectedDifficulty && !selectedStatus && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
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