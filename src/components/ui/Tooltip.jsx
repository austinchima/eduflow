import React, { useState } from 'react';

const Tooltip = ({ text, position = 'top', children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-50 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg transition-opacity duration-150
            ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
            ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
            ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
            ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
          `}
          role="tooltip"
        >
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip; 