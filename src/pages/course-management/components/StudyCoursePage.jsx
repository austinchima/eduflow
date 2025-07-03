import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { generateCourseContent } from '../../../services/aiService';
import StudyCourseContent from './StudyCourseContent';
import jsPDF from 'jspdf';
import Icon from '../../../components/AppIcon';
import StudyPlanContent from './StudyPlanContent';

const StudyCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { academic, actions, user } = useUser();
  const course = academic.courses.find(c => String(c.id) === String(id));
  const [localCourse, setLocalCourse] = useState(course);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [studyPlan, setStudyPlan] = useState(null);

  useEffect(() => {
    if (!course) return;
    setLocalCourse(course);
    if (!course.materials || course.materials.length === 0) {
      setError('Please upload your course outline/content to generate a study plan.');
      setIsLoading(false);
      setStudyPlan(null);
      return;
    }
    setIsLoading(true);
    setError('');
    const outlineText = course.materials.map(m => m.text).join('\n');
    generateCourseContent(course.name, outlineText, 6, user)
      .then(plan => {
        setStudyPlan(plan);
        setError('');
      })
      .catch(err => setError(err.message || 'Failed to generate course plan.'))
      .finally(() => setIsLoading(false));
  }, [course]);

  const handleRegenerate = async () => {
    if (!course) return;
    setIsLoading(true);
    setError('');
    try {
      const content = await generateCourseContent(course.name, course.description || '', 6, user);
      actions.updateCourse(course.id, { content });
      setLocalCourse({ ...course, content });
    } catch (err) {
      setError(err.message || 'Failed to generate course content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportText = () => {
    if (!localCourse?.content) return;
    const text = localCourse.content.map(section => (
      `${section.title}\n\n${section.explanation}\n\nKey Points:\n- ${section.keyPoints.join('\n- ')}\n\n`
    )).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${localCourse.name.replace(/\s+/g, '_')}_content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!localCourse?.content) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(localCourse.name, 10, 15);
    let y = 25;
    localCourse.content.forEach((section, idx) => {
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
    doc.save(`${localCourse.name.replace(/\s+/g, '_')}_content.pdf`);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-error text-lg">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          <Icon name="X" size={20} />
        </button>
        <h1 className="text-2xl font-bold mb-2">{localCourse.name}</h1>
        <div className="text-text-secondary mb-6">{localCourse.description}</div>
        {error && <div className="text-error mb-4">{error}</div>}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <div className="text-text-secondary">Generating study plan with AI...</div>
          </div>
        )}
        {!isLoading && studyPlan && <StudyPlanContent plan={studyPlan} />}
      </div>
    </div>
  );
};

export default StudyCoursePage; 