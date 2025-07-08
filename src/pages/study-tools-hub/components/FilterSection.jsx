import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterSection = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCourse, 
  setSelectedCourse, 
  selectedDifficulty, 
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus,
  courses,
  onClearFilters 
}) => {
  const difficulties = [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const hasActiveFilters = selectedCourse || selectedDifficulty || selectedStatus || searchQuery;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('');
    setSelectedDifficulty('');
    setSelectedStatus('');
    if (onClearFilters) onClearFilters();
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-on-colored">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="sm:w-5 sm:h-5 text-text-secondary" />
          <h3 className="font-medium text-text-primary text-sm sm:text-base">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            iconName="X"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary p-1.5 sm:p-1"
          >
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
            Search Tools
          </label>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search by title or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 text-sm sm:text-base"
            />
            <Icon 
              name="Search" 
              size={14}
              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        {/* Course Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
            Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={`filter-${course.id}`} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;