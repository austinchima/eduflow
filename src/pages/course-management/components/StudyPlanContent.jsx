import React from 'react';

const StudyPlanContent = ({ plan }) => {
  if (!plan) return null;
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Course Description</h2>
        <div className="text-text-secondary mb-4">{plan.description}</div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Course Objectives</h2>
        <ul className="mb-4">
          {plan.objectives?.map((obj, idx) => (
            <li key={idx} className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" disabled />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Course Schedule</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border px-2 py-1">Week</th>
                <th className="border px-2 py-1">Topic</th>
                <th className="border px-2 py-1">Readings</th>
                <th className="border px-2 py-1">Assignments</th>
              </tr>
            </thead>
            <tbody>
              {plan.schedule?.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{row.week}</td>
                  <td className="border px-2 py-1">{row.topic}</td>
                  <td className="border px-2 py-1">{row.readings}</td>
                  <td className="border px-2 py-1">{row.assignments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StudyPlanContent; 