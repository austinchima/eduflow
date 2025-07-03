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
import jsPDF from 'jspdf';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StudyCoursePage from './components/StudyCoursePage';

const CourseManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourseForUpload, setSelectedCourseForUpload] = useState(null);
  const [showUploadArea, setShowUploadArea] = useState(false);
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
  const [quickUploadCourseId, setQuickUploadCourseId] = useState('');

  const { academic, actions, user } = useUser();
  const { courses } = academic;
  const navigate = useNavigate();

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

  const handleAddCourse = (newCourse) => {
    actions.addCourse(newCourse);
  };

  const handleEditCourse = (course) => {
    setSelectedCourseForEdit(course);
    setIsEditModalOpen(true);
  };

  const handleUploadMaterials = (course) => {
    setSelectedCourseForUpload(course);
    setShowUploadArea(true);
  };

  const handleArchiveCourse = (course) => {
    if (window.confirm('Are you sure you want to archive this course?')) {
      actions.updateCourse(course.id, { status: 'archived' });
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
    if (window.confirm('Are you sure you want to delete this course?')) {
      actions.removeCourse(courseId);
    }
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

  const handleMaterialUpload = (course, materials) => {
    if (!course || !materials || materials.length === 0) {
      console.warn('No course or materials provided for upload:', { course, materials });
      return;
    }
    const updatedMaterials = Array.isArray(course.materials) ? [...course.materials, ...materials] : [...materials];
    console.log('Uploading materials to course:', course.name, materials);
    actions.updateCourse(course.id, {
      materialCount: updatedMaterials.length,
      materials: updatedMaterials
    });
    setShowUploadArea(false);
    setSelectedCourseForUpload(null);
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
    const text = course.content.map(section => (
      `${section.title}\n\n${section.explanation}\n\nKey Points:\n- ${section.keyPoints.join('\n- ')}\n\n`
    )).join('\n');
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
        doc.text(`- ${point}`, 14, y);
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

  return (
    <Routes>
      <Route path="/course/:id/study" element={<StudyCoursePage />} />
      <Route path="*" element={
        <div className="min-h-screen bg-background flex">
          <Sidebar isCollapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
          <MobileNavigation />
          <StudySessionControls />
          <main
            className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} px-4 lg:px-8`}
            style={{ minHeight: '100vh' }}
          >
            <div className="max-w-7xl mx-auto">
              <Breadcrumb />
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">Course Management</h1>
                  <p className="text-text-secondary">
                    Organize your academic coursework and upload materials for AI-powered learning
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
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
              <CourseFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
                semesters={getUniqueSemesters()}
              />

              {/* Upload Area */}
              {showUploadArea && (
                <div className="mb-6">
                  <MaterialUploadArea
                    course={selectedCourseForUpload}
                    onUpload={handleMaterialUpload}
                    onClose={() => {
                      setShowUploadArea(false);
                      setSelectedCourseForUpload(null);
                    }}
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUploadArea(false);
                        setSelectedCourseForUpload(null);
                      }}
                      iconName="X"
                      iconSize={16}
                    >
                      Close Upload
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick Upload Button and Area */}
              {!showUploadArea && (
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <select
                    className="border rounded px-3 py-2 text-sm"
                    value={quickUploadCourseId}
                    onChange={e => setQuickUploadCourseId(e.target.value)}
                  >
                    <option value="">Select Course for Upload</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (quickUploadCourseId) {
                        const course = courses.find(c => String(c.id) === String(quickUploadCourseId));
                        setSelectedCourseForUpload(course);
                        setShowUploadArea(true);
                      }
                    }}
                    iconName="Upload"
                    iconSize={16}
                    className="w-full sm:w-auto"
                    disabled={!quickUploadCourseId}
                  >
                    Quick Upload Materials
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Courses Section */}
                <div className="xl:col-span-2">
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">
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
                      ${viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 gap-6' :'space-y-4'
                      }
                    `}>
                      {filteredAndSortedCourses.map(course => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onEdit={handleEditCourse}
                          onUpload={handleUploadMaterials}
                          onArchive={handleArchiveCourse}
                          onViewMaterials={handleViewMaterials}
                          onStudy={handleStudyCourse}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-surface border border-border rounded-lg">
                      <Icon name="BookOpen" size={48} className="mx-auto text-text-muted mb-4" />
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        {courses.length === 0 ? 'No courses yet' : 'No courses match your filters'}
                      </h3>
                      <p className="text-text-secondary mb-6">
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsMaterialsModalOpen(false)}
                >
                  <Icon name="X" size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Course Content for {selectedCourseForMaterials?.name}</h2>
                {/* Uploaded Materials List */}
                {Array.isArray(selectedCourseForMaterials?.materials) && selectedCourseForMaterials.materials.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Uploaded Materials</h3>
                    <ul className="space-y-2">
                      {selectedCourseForMaterials.materials.map((mat, idx) => (
                        <li key={mat.id || idx} className="border rounded p-3 bg-secondary-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold">{mat.name}</span>
                              <span className="ml-2 text-xs text-text-secondary">({mat.type})</span>
                            </div>
                            <span className="text-xs text-text-muted">{mat.uploadedAt ? new Date(mat.uploadedAt).toLocaleString() : ''}</span>
                          </div>
                          {mat.text && (
                            <details className="mt-2">
                              <summary className="text-xs text-primary cursor-pointer">View Extracted Text</summary>
                              <pre className="bg-white border rounded p-2 mt-1 text-xs max-h-40 overflow-auto whitespace-pre-wrap">{mat.text}</pre>
                            </details>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mb-6 text-text-secondary">No materials uploaded yet.</div>
                )}
                {/* Existing controls and content */}
                <div className="flex gap-2 mb-4">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark text-sm"
                    onClick={() => handleRegenerateContent(selectedCourseForMaterials)}
                    disabled={isContentLoading}
                  >
                    {isContentLoading ? 'Regenerating...' : 'Regenerate Content'}
                  </button>
                  <button
                    className="bg-secondary-100 text-text-primary px-4 py-2 rounded hover:bg-secondary-200 text-sm"
                    onClick={() => handleExportContent(selectedCourseForMaterials)}
                  >
                    Export as Text
                  </button>
                  <button
                    className="bg-secondary-100 text-text-primary px-4 py-2 rounded hover:bg-secondary-200 text-sm"
                    onClick={() => handleExportPDF(selectedCourseForMaterials)}
                  >
                    Export as PDF
                  </button>
                </div>
                <StudyCourseContent
                  course={selectedCourseForMaterials}
                  isLoading={isContentLoading}
                  error={contentError}
                />
              </div>
            </div>
          )}
        </div>
      } />
    </Routes>
  );
};

export default CourseManagement;