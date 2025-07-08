import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { uploadMaterial } from '../../../utils/materialUpload';
import { useUser } from '../../../context/UserContext';
import { toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

const MaterialUploadArea = ({ selectedCourse, onUploadComplete, fileInputRef, hidden, showUpload = true, courses: propCourses, uploadingCourseId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const inputRef = fileInputRef || useRef(null);
  const { user, actions, academic } = useUser();
  const courses = propCourses || academic?.courses || [];
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const acceptedFileTypes = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx'
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files, uploadingCourseId || selectedCourse?.id);
  };

  // Fetch all uploaded files for the user and course
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!selectedCourse?.id) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/materials?courseId=${selectedCourse.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log('Materials API response (fetch):', responseData);
          const materials = responseData.materials || responseData; // Handle both nested and direct response
          console.log('Extracted materials (fetch):', materials);
          console.log('Sample material object:', materials[0]);
          setUploadedFiles(materials);
          if (selectedCourse?.id && actions?.updateCourse) {
            actions.updateCourse(selectedCourse.id, { materialCount: materials.length });
          }
        }
      } catch (err) {
        console.error('Failed to fetch materials:', err);
      }
    };
    fetchUploadedFiles();
  }, [selectedCourse]);

  // Only initialize toast container once
  useEffect(() => {
    if (!document.getElementById('toast-container')) {
      const div = document.createElement('div');
      div.id = 'toast-container';
      document.body.appendChild(div);
    }
  }, []);

  // Handler for plus button: open file picker for a specific course
  const handlePlusClick = (courseId) => {
    inputRef.current.value = null; // Reset file input
    inputRef.current.click();
  };

  // Enhanced handleFiles with progress, now takes courseId
  const handleFiles = async (files, courseId) => {
    courseId = uploadingCourseId || courseId || selectedCourse?.id;
    if (!courseId) {
      alert('Please select a course before uploading files.');
      return;
    }
    const validFiles = files.filter(file => {
      const isValidType = Object.keys(acceptedFileTypes).includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    if (validFiles.length === 0) {
      toast.error('No valid files selected for upload.');
      return;
    }
    const uploadedMaterials = [];
    for (const file of validFiles) {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { fileName: file.name, progress: 0, status: 'uploading' }
      }));
      try {
        // Upload to backend
        const material = await uploadMaterial(file, courseId);
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress: 100, status: 'completed' }
        }));
        uploadedMaterials.push(material);
      } catch (err) {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], status: 'error' }
        }));
        toast.error(`Failed to upload ${file.name}.`);
        console.error('File upload failed:', err);
      }
    }
    // Refresh uploaded files list for the course
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/materials?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const responseData = await response.json();
        const materials = responseData.materials || responseData;
        // Update the course's materials in context
        actions.updateCourse(courseId, { materials, materialCount: materials.length });
      }
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
    setUploadProgress({});
    if (uploadedMaterials.length > 0) {
      const fileNames = uploadedMaterials.map(m => m.originalName || m.filename).join(', ');
      toast.success(`Uploaded ${uploadedMaterials.length} material${uploadedMaterials.length > 1 ? 's' : ''}: ${fileNames}`);
    }
    if (onUploadComplete && uploadedMaterials.length > 0) {
      const course = courses.find(c => c.id === courseId);
      onUploadComplete(course, uploadedMaterials);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('presentation')) return 'Presentation';
    return 'File';
  };

  const handleDeleteMaterial = async (materialId, courseId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await actions.deleteMaterial(materialId, courseId);
        // Remove from local state as well
        setUploadedFiles(prev => {
          const updated = prev.filter(file => file.id !== materialId);
          if (courseId && actions?.updateCourse) {
            actions.updateCourse(courseId, { materialCount: updated.length });
          }
          return updated;
        });
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleDownloadMaterial = async (materialId) => {
    setDownloadingId(materialId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/materials/download/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to get download link');
      const { material } = await response.json();
      window.open(material.signedUrl, '_blank');
    } catch (err) {
      toast.error('Failed to download file. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Handler for deleting a course
  const handleDeleteCourse = async (courseId) => {
    const course = courses.find(c => c.id === courseId);
    const courseName = course?.name || 'this course';
    
    if (window.confirm(`Are you sure you want to delete "${courseName}" and all its materials?\n\nThis will permanently delete:\n• The course and all its data\n• All uploaded materials and files\n• Generated course content and AI materials\n• Study progress and analytics data\n\n⚠️ This action cannot be undone. All data will be permanently deleted from both the database and cloud storage.`)) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete course');
        }
        
        const result = await response.json();
        actions.removeCourse(courseId);
        
        // Show detailed success message
        const details = result.details || {};
        const message = `Course "${courseName}" deleted successfully.`;
        const detailsMessage = details.gcsFilesDeleted > 0 
          ? ` Deleted ${details.materialsDeleted} materials and ${details.gcsFilesDeleted} files from cloud storage.`
          : ` Deleted ${details.materialsDeleted} materials.`;
        
        toast.success(message + detailsMessage);
      } catch (err) {
        console.error('Error deleting course:', err);
        toast.error(`Failed to delete course: ${err.message}`);
      }
    }
  };

  // Handler for expanding/collapsing a course card
  const toggleExpandCourse = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  return (
    <div className={hidden ? 'hidden' : 'bg-surface border border-border rounded-lg p-6'}>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Upload Course Materials</h3>
      {/* Thin course card list */}
      <div className="space-y-2">
        {courses.length === 0 && (
          <div className="text-center text-text-secondary text-sm">No courses found.</div>
        )}
        {courses.map(course => (
          <div
            key={course.id}
            className="flex items-center justify-between bg-white border border-border rounded-md px-4 py-2 shadow-sm hover:bg-secondary-50 cursor-pointer transition-all"
            onClick={() => toggleExpandCourse(course.id)}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-primary">{course.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-secondary">{course.materials?.length || 0} items</span>
              {/* Plus button for uploading files for this course */}
              <button
                className="text-primary hover:text-primary-dark p-1"
                title="Upload Files"
                onClick={e => { e.stopPropagation(); handlePlusClick(course.id); }}
              >
                <Icon name="Plus" size={16} />
              </button>
              {/* Show trash icon if user is owner */}
              {course.userId === user.id && (
                <button
                  className="text-error hover:text-error-dark p-1"
                  title="Delete Course"
                  onClick={e => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                >
                  <Icon name="Trash2" size={16} />
                </button>
              )}
              <button className="ml-2 text-text-secondary focus:outline-none" tabIndex={-1} aria-label="Expand">
                <Icon name={expandedCourseId === course.id ? 'ChevronUp' : 'ChevronDown'} size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Expanded material list for selected course */}
      {courses.map(course => (
        expandedCourseId === course.id && (
          <div key={`materials-${course.id}`} className="ml-4 mt-2 mb-4 border-l-2 border-primary-100 pl-4">
            {course.materials && course.materials.length > 0 ? (
              <div className="space-y-2">
                {course.materials.map(material => (
                  <div key={material.id} className="flex items-center justify-between bg-secondary-50 rounded px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Icon name={getFileIcon(material.mimetype || '')} size={16} className="text-primary" />
                      <span className="text-sm text-text-primary">{material.originalName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-xs text-primary underline"
                        onClick={e => { e.stopPropagation(); handleDownloadMaterial(material.id); }}
                      >
                        Download
                      </button>
                      <button
                        className="text-xs text-error hover:text-error-dark"
                        onClick={e => { e.stopPropagation(); handleDeleteMaterial(material.id, course.id); }}
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-text-secondary">No materials uploaded for this course.</div>
            )}
          </div>
        )
      ))}
      {/* File input is hidden, triggered by plus button for each course */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={Object.values(acceptedFileTypes).join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
      {/* Toast Container (for upload progress, etc.) remains as before */}
      <div id="toast-container" style={{ position: 'fixed', bottom: 24, left: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }} />
    </div>
  );
};

export default MaterialUploadArea;