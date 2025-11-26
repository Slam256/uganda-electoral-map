import React from 'react';

/**
 * Panel Header Component
 * Header for the expanded filter panel
 */
const PanelHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-[12px]">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        Campaign Routes
      </h3>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        aria-label="Close filter panel"
      >
        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PanelHeader;