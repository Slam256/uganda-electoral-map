import React from 'react';
import { formatDateDisplay } from '../CandidateFilter.model';

/**
 * Filter Summary Component
 * Shows a summary of active filters in collapsed state
 */
const FilterSummary = ({ 
  selectedCandidate, 
  visibleCandidates, 
  hasDateFilter, 
  startDate, 
  endDate,
  onExpand 
}) => {
  return (
    <button
      onClick={onExpand}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <span className="font-medium text-gray-800 dark:text-gray-100">
        Campaign Routes
      </span>
      
      {/* Show active candidate filter */}
      {selectedCandidate && (
        <div className="flex items-center gap-1.5 ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: selectedCandidate.color }}
          ></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedCandidate.candidateShortCode}
          </span>
        </div>
      )}
      
      {/* Show count if multiple candidates are visible */}
      {visibleCandidates.length > 1 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          ({visibleCandidates.length} active)
        </span>
      )}
      
      {/* Show active date filter */}
      {hasDateFilter && (
        <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
          <svg className="w-3 h-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-blue-700 dark:text-blue-300">
            {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
          </span>
        </div>
      )}
    </button>
  );
};

export default FilterSummary;