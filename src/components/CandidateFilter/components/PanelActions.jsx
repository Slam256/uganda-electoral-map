import React from 'react';

/**
 * Panel Actions Component
 * Footer actions for the filter panel
 */
const PanelActions = ({ onClearAll, onClose }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-750">
      <div className="flex gap-2">
        <button
          onClick={onClearAll}
          className="flex-1 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default PanelActions;