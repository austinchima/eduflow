import React, { useState } from 'react';
import Icon from './AppIcon';

// Example usage: <CourseOutline course={courseData} />
const CourseOutline = ({ course }) => {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  if (!course) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-[70vh] bg-white rounded-lg shadow border overflow-hidden">
      {/* Sidebar: Modules */}
      <aside className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r flex-shrink-0">
        <div className="p-4 font-bold text-lg text-gray-900 border-b">{course.title}</div>
        <div className="px-4 py-2 text-xs text-gray-500">{course.modules.length} modules · {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons</div>
        <ul className="divide-y">
          {course.modules.map((module, idx) => (
            <li
              key={module.id}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${activeModuleIdx === idx ? 'bg-primary-50 text-primary font-semibold' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveModuleIdx(idx)}
            >
              <span className="w-6 h-6 flex items-center justify-center mr-2 rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                {idx + 1}
              </span>
              <span className="truncate flex-1">{module.title}</span>
              <Icon name="ChevronRight" size={18} className="ml-2 text-gray-400" />
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content: Lessons */}
      <main className="flex-1 p-4 sm:p-8 overflow-x-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">{course.title}</h1>
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              Module {activeModuleIdx + 1}: {course.modules[activeModuleIdx].title}
            </h2>
            <ul className="divide-y rounded-lg border">
              {course.modules[activeModuleIdx].lessons.map((lesson, lIdx) => (
                <li key={lesson.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                      {lIdx + 1}
                    </span>
                    <span className="truncate text-gray-900 text-sm sm:text-base">{lesson.title}</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 font-medium hover:underline text-sm">
                    Start <Icon name="ArrowRight" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseOutline; 