import React from 'react';

const AISystemStatus = () => {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">System Status</h2>
          <p className="text-sm lg:text-base text-text-secondary">Monitor connection status</p>
        </div>
      </div>
      <div className="border border-border-light rounded-lg p-4">
        <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
          Connection Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium `}>
              {'Connected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISystemStatus;