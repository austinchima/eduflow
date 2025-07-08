import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { generateCourseContent } from '../../../services/aiService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ReactMarkdown from 'react-markdown';

// Custom Code Block Component with basic syntax highlighting
const CodeBlock = ({ children, className }) => {
  const language = className ? className.replace('language-', '') : '';
  
  // Basic syntax highlighting for common languages
  const highlightCode = (code, lang) => {
    if (!lang) return code;
    
    // Simple keyword highlighting for common programming languages
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await'],
      js: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await'],
      csharp: ['public', 'private', 'class', 'void', 'string', 'int', 'bool', 'var', 'if', 'else', 'for', 'while', 'return', 'using', 'namespace'],
      cs: ['public', 'private', 'class', 'void', 'string', 'int', 'bool', 'var', 'if', 'else', 'for', 'while', 'return', 'using', 'namespace'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'True', 'False', 'None'],
      py: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'True', 'False', 'None'],
      java: ['public', 'private', 'class', 'void', 'String', 'int', 'boolean', 'if', 'else', 'for', 'while', 'return', 'import'],
      html: ['<', '>', '</', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'class', 'id'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'width', 'height']
    };
    
    let highlightedCode = code;
    const langKeywords = keywords[lang.toLowerCase()] || [];
    
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedCode = highlightedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Highlight strings
    highlightedCode = highlightedCode.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    highlightedCode = highlightedCode.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
    
    // Highlight comments
    if (['javascript', 'js', 'csharp', 'cs', 'java'].includes(lang.toLowerCase())) {
      highlightedCode = highlightedCode.replace(/\/\/(.*)/g, '<span class="comment">//$1</span>');
    }
    if (['python', 'py'].includes(lang.toLowerCase())) {
      highlightedCode = highlightedCode.replace(/#(.*)/g, '<span class="comment">#$1</span>');
    }
    
    return highlightedCode;
  };
  
  const highlightedCode = highlightCode(children, language);
  
  return (
    <div className="code-block">
      {language && (
        <div className="code-language">
          {language}
        </div>
      )}
      <pre className="code-content">
        <code 
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className={`language-${language}`}
        />
      </pre>
    </div>
  );
};

const LessonContent = ({ lesson, isDone, onMarkDone }) => {
  if (!lesson) return <div className="text-gray-500">Select a lesson to view its content.</div>;
  
  return (
    <div className="space-y-6 lesson-content">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          {lesson.title}
          {isDone && <span className="ml-3 text-green-600" title="Completed"><Icon name="Check" size={22} /></span>}
        </h2>
      </div>
      
      {/* Summary */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-800 mb-2">What you'll learn:</h3>
        <div className="text-blue-700 prose prose-sm max-w-none">
          <ReactMarkdown>{lesson.summary}</ReactMarkdown>
        </div>
      </div>
      
      {/* Key Points */}
      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Icon name="Target" size={18} className="mr-2" />
            Key Points
          </h3>
          <ul className="space-y-2">
            {lesson.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <div className="text-gray-700 prose prose-sm max-w-none">
                  <ReactMarkdown>{point}</ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Example */}
      {lesson.example && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center">
            <Icon name="Lightbulb" size={18} className="mr-2" />
            Example
          </h3>
          <div className="text-green-700 prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock className={className} {...props}>
                      {children}
                    </CodeBlock>
                  ) : (
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {lesson.example}
            </ReactMarkdown>
          </div>
        </div>
      )}
      
      {/* Practice Task */}
      {lesson.task && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
            <Icon name="BookOpen" size={18} className="mr-2" />
            Practice Task
          </h3>
          <div className="text-purple-700 prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock className={className} {...props}>
                      {children}
                    </CodeBlock>
                  ) : (
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {lesson.task}
            </ReactMarkdown>
          </div>
        </div>
      )}
      
      {/* Mark as Done Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button 
          variant={isDone ? 'success' : 'primary'} 
          onClick={onMarkDone} 
          disabled={isDone}
          className="w-full sm:w-auto"
        >
          {isDone ? (
            <>
              <Icon name="Check" size={16} className="mr-2" />
              Completed
            </>
          ) : (
            <>
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Mark as Done
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const StudyCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { academic } = useUser();
  const course = academic.courses.find(c => String(c.id) === String(id));
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState('');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState({}); // { 'moduleIdx-lessonIdx': true }
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generationError, setGenerationError] = useState('');

  useEffect(() => {
    const initializeCourseContent = async () => {
      setModulesLoading(true);
      setModulesError('');
      setGenerationError('');
      
      try {
        const token = localStorage.getItem('token');
        
        // First, try to fetch existing modules
        const res = await fetch(`/api/courses/${id}/modules`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
        const data = await res.json();
          if (data.modules && data.modules.length > 0) {
            // Use existing modules
            setModules(data.modules);
        setExpandedModules({ 0: true });
        setSelectedModuleIdx(0);
        setSelectedLessonIdx(null);
            setModulesLoading(false);
            return;
          }
        }
        
        // If no existing modules, generate new content
        await generateCourseContentFromMaterials();
        
      } catch (err) {
        setModulesError(err.message);
        setModulesLoading(false);
      }
    };
    
    initializeCourseContent();
  }, [id]);

  const generateCourseContentFromMaterials = async () => {
    if (!course) return;
    
    setIsGeneratingContent(true);
    setGenerationError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch course materials
      const materialsRes = await fetch(`/api/materials?courseId=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let materials = [];
      if (materialsRes.ok) {
        const materialsData = await materialsRes.json();
        materials = materialsData.materials || [];
      }
      
      console.log('Fetched materials:', materials.length);
      
      // Generate content using AI
      const generateRes = await fetch('/api/ai/generate-course-content-from-materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course: {
            name: course.name,
            instructor: course.instructor,
            credits: course.credits,
            semester: course.semester,
            description: course.description
          },
          materials: materials
        })
      });
      
      if (!generateRes.ok) {
        const errorData = await generateRes.json();
        throw new Error(errorData.message || 'Failed to generate course content');
      }
      
      const generateData = await generateRes.json();
      const generatedModules = generateData.content;
      
      // Save the generated modules to the course
      const saveRes = await fetch(`/api/courses/${id}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ modules: generatedModules })
      });
      
      if (!saveRes.ok) {
        const saveErrorData = await saveRes.json();
        throw new Error(saveErrorData.message || 'Failed to save generated content');
      }
      
      // Set the modules in state
      setModules(generatedModules);
      setExpandedModules({ 0: true });
      setSelectedModuleIdx(0);
      setSelectedLessonIdx(null);
      
    } catch (err) {
      console.error('Error generating course content:', err);
      setGenerationError(err.message);
    } finally {
      setIsGeneratingContent(false);
      setModulesLoading(false);
    }
  };

  const handleModuleClick = idx => {
    setExpandedModules(expanded => ({ ...expanded, [idx]: !expanded[idx] }));
    setSelectedModuleIdx(idx);
    setSelectedLessonIdx(null);
  };

  const handleLessonClick = (moduleIdx, lessonIdx) => {
    setSelectedModuleIdx(moduleIdx);
    setSelectedLessonIdx(lessonIdx);
  };

  const handleMarkDone = () => {
    if (selectedModuleIdx !== null && selectedLessonIdx !== null) {
      setCompletedLessons(prev => ({
        ...prev,
        [`${selectedModuleIdx}-${selectedLessonIdx}`]: true
      }));
    }
  };

  // Navigation logic
  const goToPrevLesson = () => {
    if (selectedModuleIdx === null || selectedLessonIdx === null) return;
    if (selectedLessonIdx > 0) {
      setSelectedLessonIdx(selectedLessonIdx - 1);
    } else if (selectedModuleIdx > 0) {
      // Go to last lesson of previous module
      const prevModule = modules[selectedModuleIdx - 1];
      if (prevModule && prevModule.lessons && prevModule.lessons.length > 0) {
        setSelectedModuleIdx(selectedModuleIdx - 1);
        setSelectedLessonIdx(prevModule.lessons.length - 1);
        setExpandedModules(expanded => ({ ...expanded, [selectedModuleIdx - 1]: true }));
      }
    }
  };

  const goToNextLesson = () => {
    if (selectedModuleIdx === null || selectedLessonIdx === null) return;
    const currentModule = modules[selectedModuleIdx];
    if (currentModule && selectedLessonIdx < currentModule.lessons.length - 1) {
      setSelectedLessonIdx(selectedLessonIdx + 1);
    } else if (selectedModuleIdx < modules.length - 1) {
      // Go to first lesson of next module
      const nextModule = modules[selectedModuleIdx + 1];
      if (nextModule && nextModule.lessons && nextModule.lessons.length > 0) {
        setSelectedModuleIdx(selectedModuleIdx + 1);
        setSelectedLessonIdx(0);
        setExpandedModules(expanded => ({ ...expanded, [selectedModuleIdx + 1]: true }));
      }
    }
  };

  const selectedLesson =
    modules[selectedModuleIdx] &&
    modules[selectedModuleIdx].lessons &&
    selectedLessonIdx !== null
      ? modules[selectedModuleIdx].lessons[selectedLessonIdx]
      : null;

  const isFirstLesson =
    selectedModuleIdx === 0 && selectedLessonIdx === 0;
  const isLastLesson =
    selectedModuleIdx === modules.length - 1 &&
    selectedLessonIdx === modules[modules.length - 1]?.lessons.length - 1;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-error text-lg">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar/Outline */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{course.name}</h2>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            iconName="X"
            iconSize={16}
            className="p-1"
          />
        </div>
        
        {modulesLoading ? (
          <div className="space-y-4">
            <div className="text-gray-500">Loading course content...</div>
            {isGeneratingContent && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-primary">Generating content with AI...</span>
                </div>
                <p className="text-xs text-gray-500">
                  Analyzing your course materials and creating personalized lessons
                </p>
              </div>
            )}
          </div>
        ) : generationError ? (
          <div className="space-y-4">
            <div className="text-error text-sm">{generationError}</div>
            <Button
              variant="primary"
              onClick={generateCourseContentFromMaterials}
              disabled={isGeneratingContent}
              className="w-full"
            >
              {isGeneratingContent ? 'Generating...' : 'Retry Generation'}
            </Button>
          </div>
        ) : modulesError ? (
          <div className="text-error">{modulesError}</div>
        ) : modules.length === 0 ? (
          <div className="text-gray-500">No modules found for this course.</div>
        ) : (
          <ul className="space-y-2">
            {modules.map((mod, mIdx) => (
              <li key={mIdx}>
                <button
                  className={`flex items-center w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${expandedModules[mIdx] ? 'font-semibold' : ''}`}
                  onClick={() => handleModuleClick(mIdx)}
                >
                  <span className="mr-2">{expandedModules[mIdx] ? '▼' : '▶'}</span>
                  {mod.title}
                </button>
                {expandedModules[mIdx] && mod.lessons && mod.lessons.length > 0 && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {mod.lessons.map((lesson, lIdx) => (
                      <li key={lIdx}>
                        <button
                          className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 flex items-center justify-between ${selectedModuleIdx === mIdx && selectedLessonIdx === lIdx ? 'bg-blue-100 font-bold' : ''}`}
                          onClick={() => handleLessonClick(mIdx, lIdx)}
                        >
                          <span>{lesson.title}</span>
                          {completedLessons[`${mIdx}-${lIdx}`] && (
                            <span className="ml-2 text-green-600" title="Completed"><Icon name="Check" size={18} /></span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 lg:p-8">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 relative min-h-[400px]">
          {modulesLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {isGeneratingContent ? 'Generating Your Course Content' : 'Loading Course'}
                </h3>
                <p className="text-gray-600">
                  {isGeneratingContent 
                    ? 'AI is analyzing your materials and creating personalized lessons...'
                    : 'Preparing your study materials...'
                  }
                </p>
              </div>
            </div>
          ) : generationError ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Icon name="AlertCircle" size={48} className="text-error" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Generation Failed</h3>
                <p className="text-gray-600 mb-4">{generationError}</p>
                <Button
                  variant="primary"
                  onClick={generateCourseContentFromMaterials}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? 'Generating...' : 'Try Again'}
                </Button>
              </div>
            </div>
          ) : selectedLesson ? (
            <>
              <LessonContent 
                lesson={selectedLesson} 
                isDone={completedLessons[`${selectedModuleIdx}-${selectedLessonIdx}`]} 
                onMarkDone={handleMarkDone} 
              />
              <div className="flex justify-between mt-8">
                <Button 
                  variant="secondary" 
                  onClick={goToPrevLesson} 
                  disabled={isFirstLesson}
                >
                  ← Previous
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={goToNextLesson} 
                  disabled={isLastLesson}
                >
                  Next →
                </Button>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-lg flex flex-col items-center justify-center h-full">
              <Icon name="BookOpen" size={48} className="mb-4 text-gray-400" />
              <span>Select a lesson from the sidebar to begin studying.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyCoursePage; 