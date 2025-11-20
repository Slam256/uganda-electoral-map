import React from 'react';
import { formatDateDisplay } from '../CandidateFilter.model';

/**
 * Date Range Filter Component
 * Pure presentational component for date filtering UI
 */
const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  dateBounds, 
  hasDateFilter,
  onStartDateChange, 
  onEndDateChange, 
  onClearDates 
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Filter by Date Range
        </h4>
        {hasDateFilter && (
          <button
            onClick={onClearDates}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear dates
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={dateBounds.min}
            max={endDate || dateBounds.max}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
            To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || dateBounds.min}
            max={dateBounds.max}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      {hasDateFilter && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Showing stops from {formatDateDisplay(startDate || dateBounds.min)} to {formatDateDisplay(endDate || dateBounds.max)}
        </p>
      )}
    </div>
  );
};

export default DateRangeFilter;