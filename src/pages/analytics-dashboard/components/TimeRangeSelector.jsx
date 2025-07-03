import React from 'react';
import Button from '../../../components/ui/Button';

const TimeRangeSelector = ({ selectedRange, onRangeChange, ranges }) => {
  return (
    <div className="flex items-center space-x-2 bg-secondary-50 p-1 rounded-lg">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className="px-4 py-2"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;