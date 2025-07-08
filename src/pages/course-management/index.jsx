import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import MobileNavigation from '../../components/ui/MobileNavigation';
import StudySessionControls from '../../components/ui/StudySessionControls';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CourseCard from './components/CourseCard';
import AddCourseModal from './components/AddCourseModal';
import MaterialUploadArea from './components/MaterialUploadArea';
import CourseFilters from './components/CourseFilters';
import CourseAnalyticsPreview from './components/CourseAnalyticsPreview';
import { useUser } from '../../context/UserContext';
import { generateCourseContent } from '../../services/aiService';
import StudyCourseContent from './components/StudyCourseContent';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StudyCoursePage from './components/StudyCoursePage';
import { toast } from 'react-hot-toast';

const CourseManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [selectedCourseForMaterials, setSelectedCourseForMaterials] = useState(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [courseToArchive, setCourseToArchive] = useState(null);

  const { academic, actions, user } = useUser();
  const { courses } = academic;
  const navigate = useNavigate();

  // Debug: Check for duplicate course IDs
  useEffect(() => {
    const allCourseIds = courses.map(c => c.id);
    const duplicateIds = allCourseIds.filter((id, idx) => allCourseIds.indexOf(id) !== idx);
    if (duplicateIds.length > 0) {
      console.warn('Duplicate course IDs found in courses:', duplicateIds);
      console.warn('Total courses:', courses.length, 'Unique courses:', new Set(allCourseIds).size);
      // Auto-cleanup duplicates
      actions.cleanupDuplicateCourses();
    }
  }, [courses, actions]);

  // Filter and sort courses
  const filteredAndSortedCourses = React.useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = selectedSemester === 'All Semesters' || course.semester === selectedSemester;
      const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
      
      return matchesSearch && matchesSemester && matchesStatus;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'grade':
          return b.currentGrade - a.currentGrade;
        case 'progress':
          return b.progress - a.progress;
        case 'materials':
          return b.materialCount - a.materialCount;
        case 'recent':
          return b.id - a.id; // Assuming higher ID means more recent
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedSemester, selectedStatus, sortBy]);

  const handleAddCourse = async (newCourse) => {
    console.log('CourseManagement: handleAddCourse called with:', newCourse);
    try {
      console.log('CourseManagement: Calling actions.addCourse');
      await actions.addCourse(newCourse);
      console.log('CourseManagement: actions.addCourse completed');
      // Course will be automatically added to the state by the action
    } catch (error) {
      console.error('Error adding course:', error);
      // You could add a toast notification here
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourseForEdit(course);
    setIsEditModalOpen(true);
  };

  const handleArchiveCourse = (course, newStatus) => {
    if (newStatus === 'active') {
      actions.updateCourse(course.id, { status: 'active' });
    } else {
      setCourseToArchive(course);
      setIsArchiveModalOpen(true);
    }
  };

  const handleViewMaterials = (course) => {
    setSelectedCourseForMaterials(course);
    setIsMaterialsModalOpen(true);
  };

  const handleStudyCourse = (course) => {
    navigate(`/course-management/study/${course.id}`);
  };

  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        // The removeCourse action will handle the API call and state update
        await actions.removeCourse(courseToDelete);
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error('Error deleting course:', error);
        // The error will be handled by the UserContext
      }
    }
  };

  const cancelDeleteCourse = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleUpdateCourseGrade = (courseId, newGrade) => {
    actions.updateCourse(courseId, { currentGrade: newGrade });
  };

  const handleUpdateCourseProgress = (courseId, newProgress) => {
    actions.updateCourse(courseId, { progress: newProgress });
  };

  const handleUpdateCourseStatus = (courseId, newStatus) => {
    actions.updateCourse(courseId, { status: newStatus });
  };

  const getUniqueSemesters = () => {
    const semesters = courses.map(course => course.semester);
    return ['All Semesters', ...Array.from(new Set(semesters))];
  };

  const handleRegenerateContent = async (course) => {
    setIsContentLoading(true);
    setContentError('');
    try {
      const content = await generateCourseContent(course.name, course.description || '', 6, user);
      actions.updateCourse(course.id, { content });
      setSelectedCourseForMaterials({ ...course, content });
    } catch (err) {
      setContentError(err.message || 'Failed to generate course content.');
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleExportContent = (course) => {
    if (!course?.content) return;
    const text = course.content.map(section => {
      const keyPointsText = section.keyPoints.map(point => 
        typeof point === 'object' && point.point ? point.point : point
      ).join('\n- ');
      return `${section.title}\n\n${section.explanation}\n\nKey Points:\n- ${keyPointsText}\n\n`;
    }).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.name.replace(/\s+/g, '_')}_content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = (course) => {
    if (!course?.content) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(course.name, 10, 15);
    let y = 25;
    course.content.forEach((section, idx) => {
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${section.title}`, 10, y);
      y += 8;
      doc.setFontSize(11);
      const explanationLines = doc.splitTextToSize(section.explanation, 180);
      doc.text(explanationLines, 10, y);
      y += explanationLines.length * 6 + 2;
      doc.setFontSize(12);
      doc.text('Key Points:', 10, y);
      y += 7;
      section.keyPoints.forEach(point => {
        doc.setFontSize(11);
        const pointText = typeof point === 'object' && point.point ? point.point : point;
        doc.text(`- ${pointText}`, 14, y);
        y += 6;
      });
      y += 4;
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });
    doc.save(`${course.name.replace(/\s+/g, '_')}_content.pdf`);
  };

  const confirmArchiveCourse = () => {
    if (courseToArchive) {
      actions.updateCourse(courseToArchive.id, { status: 'archived' });
      setIsArchiveModalOpen(false);
      setCourseToArchive(null);
    }
  };

  const cancelArchiveCourse = () => {
    setIsArchiveModalOpen(false);
    setCourseToArchive(null);
  };

  const handleUploadMaterials = (course, materials) => {
    // Update the course's material count or refresh materials as needed
    actions.refreshCourseMaterials(course.id);
    toast.success(`Materials added to ${course.name}!`);
  };

  return (
    <Routes>
      <Route path="/course/:id/study" element={<StudyCoursePage />} />
      <Route path="*" element={
        <div className="min-h-screen bg-background flex">
          <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
          <MobileNavigation />
          <StudySessionControls />
          <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 lg:px-8">
            <div className="w-full max-w-7xl xl:max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
              <Breadcrumb />
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-3">Course Management</h1>
                  <p className="text-text-secondary text-lg">
                    Organize your academic coursework and upload materials for AI-powered learning
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-6 sm:mt-0">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-secondary-50 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      iconName="Grid3X3"
                      iconSize={16}
                      className="px-3 py-2"
                    />
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      iconName="List"
                      iconSize={16}
                      className="px-3 py-2"
                    />
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    iconName="Plus"
                    iconSize={16}
                  >
                    Add Course
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-8">
                <CourseFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedSemester={selectedSemester}
                  setSelectedSemester={setSelectedSemester}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  semesters={getUniqueSemesters()}
                />
              </div>
              
              {/* Always-visible course material card list */}
              <div className="mb-10">
                <MaterialUploadArea courses={filteredAndSortedCourses} />
              </div>
              
              {/* Courses Grid/List and Analytics Sidebar */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Courses Section */}
                <div className="xl:col-span-2">
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-text-primary">
                      Your Courses ({filteredAndSortedCourses.length})
                    </h2>
                    
                    {filteredAndSortedCourses.length === 0 && courses.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSemester('All Semesters');
                          setSelectedStatus('all');
                          setSortBy('name');
                        }}
                        iconName="RefreshCw"
                        iconSize={16}
                        className="text-text-secondary"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>

                  {/* Courses Grid/List */}
                  {filteredAndSortedCourses.length > 0 ? (
                    <div className={`
                      ${viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-8' 
                        : 'space-y-6'
                      }
                    `}>
                      {filteredAndSortedCourses.map(course => (
                        <CourseCard
                          key={`card-${course.id}`}
                          course={course}
                          viewMode={viewMode}
                          onEdit={handleEditCourse}
                          onArchive={handleArchiveCourse}
                          onViewMaterials={handleViewMaterials}
                          onStudy={handleStudyCourse}
                          onDelete={handleDeleteCourse}
                          onUpload={handleUploadMaterials}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-surface border border-border rounded-xl">
                      <Icon name="BookOpen" size={64} className="mx-auto text-text-muted mb-6" />
                      <h3 className="text-xl font-medium text-text-primary mb-3">
                        {courses.length === 0 ? 'No courses yet' : 'No courses match your filters'}
                      </h3>
                      <p className="text-text-secondary mb-8 text-lg">
                        {courses.length === 0 
                          ? 'Get started by adding your first course to begin organizing your academic materials.' :'Try adjusting your search terms or filters to find the courses you\'re looking for.'
                        }
                      </p>
                      {courses.length === 0 ? (
                        <Button
                          variant="primary"
                          onClick={() => setIsAddModalOpen(true)}
                          iconName="Plus"
                          iconSize={16}
                        >
                          Add Your First Course
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedSemester('All Semesters');
                            setSelectedStatus('all');
                            setSortBy('name');
                          }}
                          iconName="RefreshCw"
                          iconSize={16}
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Analytics Sidebar */}
                <div className="xl:col-span-1">
                  <CourseAnalyticsPreview courses={courses} />
                </div>
              </div>
            </div>
          </main>

          {/* Add Course Modal */}
          <AddCourseModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddCourse}
            course={selectedCourseForEdit}
          />

          {/* Materials Modal (for viewing course materials) */}
          {isMaterialsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200 p-4">
              <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">Course Materials</h2>
                  <Button variant="ghost" onClick={() => setIsMaterialsModalOpen(false)} iconName="X" iconSize={20} className="p-2" />
                </div>
                <MaterialUploadArea selectedCourse={selectedCourseForMaterials} hidden={false} showUpload={false} />
              </div>
            </div>
          )}

          {isEditModalOpen && (
            <AddCourseModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updatedCourse) => {
                actions.updateCourse(selectedCourseForEdit.id, updatedCourse);
                setIsEditModalOpen(false);
              }}
              initialValues={selectedCourseForEdit}
              isEdit
            />
          )}

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200 p-4">
              <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-center mb-4">
                  <Icon name="AlertTriangle" size={24} className="text-error mr-3" />
                  <h2 className="text-lg font-semibold text-text-primary">Confirm Course Deletion</h2>
                </div>
                <div className="mb-6">
                  <p className="text-text-secondary mb-3">
                    Are you sure you want to delete this course? This action will permanently remove:
                  </p>
                  <ul className="text-sm text-text-secondary space-y-1 mb-4">
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="text-error mr-2" />
                      The course and all its data
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="text-error mr-2" />
                      All uploaded materials and files
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="text-error mr-2" />
                      Generated course content and AI materials
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="text-error mr-2" />
                      Study progress and analytics data
                    </li>
                  </ul>
                  <p className="text-xs text-text-muted font-medium">
                    ⚠️ This action cannot be undone. All data will be permanently deleted from both the database and cloud storage.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={cancelDeleteCourse}>Cancel</Button>
                  <Button variant="error" onClick={confirmDeleteCourse}>Delete Course</Button>
                </div>
              </div>
            </div>
          )}

          {isArchiveModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200 p-4">
              <div className="bg-surface rounded-lg shadow-xl w-full max-w-sm p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Confirm Archive</h2>
                <p className="mb-6 text-text-secondary">Are you sure you want to archive this course? You can restore it later from the archived courses list.</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={cancelArchiveCourse}>Cancel</Button>
                  <Button variant="warning" onClick={confirmArchiveCourse}>Archive</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      } />
    </Routes>
  );
};

export default CourseManagement;