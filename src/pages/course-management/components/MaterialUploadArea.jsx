import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { uploadMaterial } from '../../../utils/materialUpload';
import { useUser } from '../../../context/UserContext';

const MaterialUploadArea = ({ selectedCourse, onUploadComplete, fileInputRef, hidden }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const inputRef = fileInputRef || useRef(null);
  const { user } = useUser();

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
    console.log('Files selected:', files);
    handleFiles(files);
  };

  // Fetch all uploaded files for the user and course
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!selectedCourse?.id) return;
    };
    fetchUploadedFiles();
  }, [selectedCourse]);

  // Enhanced handleFiles with progress
  const handleFiles = async (files) => {
    const validFiles = files.filter(file => {
      const isValidType = Object.keys(acceptedFileTypes).includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    if (validFiles.length === 0) {
      console.warn('No valid files selected for upload.');
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
        const material = await uploadMaterial(file, user.id, selectedCourse.id);
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
        console.error('File upload failed:', err);
      }
    }
    setUploadedFiles(prev => [...uploadedMaterials, ...prev]);
    setUploadProgress({});
    if (onUploadComplete && uploadedMaterials.length > 0) {
      onUploadComplete(selectedCourse, uploadedMaterials);
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

  return (
    <div className={hidden ? 'hidden' : 'bg-surface border border-border rounded-lg p-6'}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Upload Course Materials</h3>
        {selectedCourse && (
          <span className="text-sm text-text-secondary bg-secondary-50 px-3 py-1 rounded-full">
            {selectedCourse.name}
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-secondary-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon 
          name="Upload" 
          size={48} 
          className={`mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-text-muted'}`} 
        />
        <h4 className="text-lg font-medium text-text-primary mb-2">
          Drop files here or click to upload
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          Supports PDF, DOC, DOCX, TXT, JPG, PNG, PPT, PPTX (Max 10MB each)
        </p>
        
        <Button
          variant="primary"
          onClick={() => inputRef.current?.click()}
          iconName="Plus"
          iconSize={16}
        >
          Select Files
        </Button>
        
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={Object.values(acceptedFileTypes).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-text-primary">Uploading Files</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={getFileIcon('')} size={16} className="text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary truncate">
                    {progress.fileName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {progress.status === 'uploading' && (
                    <span className="text-xs text-text-secondary">{progress.progress}%</span>
                  )}
                  {progress.status === 'processing' && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Brain" size={14} className="text-primary animate-pulse" />
                      <span className="text-xs text-primary">AI Processing...</span>
                    </div>
                  )}
                  {progress.status === 'completed' && (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  )}
                  {progress.status === 'error' && (
                    <Icon name="XCircle" size={16} className="text-error" />
                  )}
                </div>
              </div>
              
              {progress.status === 'uploading' && (
                <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              )}
              
              {progress.status === 'processing' && (
                <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-text-primary mb-3">All Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name={getFileIcon(file.type || file.file_url)} size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{file.name || file.file_url.split('/').pop()}</p>
                    <p className="text-xs text-text-secondary">{file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : ''}</p>
                  </div>
                </div>
                <a
                  href={`https://${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/sign/course-materials/${file.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialUploadArea;