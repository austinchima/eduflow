import React from 'react';

const StudyCourseContent = ({ course, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
        <div className="text-text-secondary">Generating course content with AI...</div>
      </div>
    );
  }
  if (error) {
    return <div className="text-error">{error}</div>;
  }
  if (!course?.content || course.content.length === 0) {
    return <div className="text-text-secondary">No materials uploaded yet.</div>;
  }
  return (
    <div className="space-y-6">
      {course.content.map((section, idx) => (
        <div key={idx} className="border-b border-border pb-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{section.title}</h3>
          <div className="mb-2 text-text-secondary whitespace-pre-line">{section.explanation}</div>
          <ul className="list-disc pl-6 text-text-primary">
            {section.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StudyCourseContent; 