import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CourseFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedSemester, 
  onSemesterChange, 
  selectedStatus, 
  onStatusChange,
  sortBy,
  onSortChange,
  onClearFilters 
}) => {
  const semesters = [
    'All Semesters',
    'Fall 2024',
    'Spring 2024',
    'Summer 2024',
    'Fall 2023',
    'Spring 2023'
  ];

  const statuses = [
    { value: 'all', label: 'All Courses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Course Name' },
    { value: 'grade', label: 'Current Grade' },
    { value: 'progress', label: 'Progress' },
    { value: 'materials', label: 'Material Count' },
    { value: 'recent', label: 'Recently Added' }
  ];

  const hasActiveFilters = searchTerm || selectedSemester !== 'All Semesters' || selectedStatus !== 'all' || sortBy !== 'name';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filter & Search</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            iconName="X"
            iconSize={16}
            className="text-text-secondary hover:text-text-primary"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
          />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Semester Filter */}
        <div>
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
          >
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>Sort by {option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {searchTerm && (
            <div className="flex items-center space-x-1 bg-primary-50 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Search" size={12} />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:bg-primary-100 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {selectedSemester !== 'All Semesters' && (
            <div className="flex items-center space-x-1 bg-accent-50 text-accent px-3 py-1 rounded-full text-sm">
              <Icon name="Calendar" size={12} />
              <span>{selectedSemester}</span>
              <button
                onClick={() => onSemesterChange('All Semesters')}
                className="ml-1 hover:bg-accent-100 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {selectedStatus !== 'all' && (
            <div className="flex items-center space-x-1 bg-secondary-100 text-secondary px-3 py-1 rounded-full text-sm">
              <Icon name="Filter" size={12} />
              <span>{statuses.find(s => s.value === selectedStatus)?.label}</span>
              <button
                onClick={() => onStatusChange('all')}
                className="ml-1 hover:bg-secondary-200 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseFilters;