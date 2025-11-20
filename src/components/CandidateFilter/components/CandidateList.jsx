import React from 'react';
import CandidateListItem from './CandidateListItem';

/**
 * Candidate List Component
 * Renders the list of candidates with selection options
 */
const CandidateList = ({ 
  candidates, 
  visibleCandidates,
  selectedCandidate,
  hasDateFilter,
  calculateStopsInRange,
  onSelectCandidate,
  onSelectAll 
}) => {
  // Calculate total stops in range for "Show All" option
  const totalStopsInRange = hasDateFilter 
    ? candidates.reduce((sum, c) => sum + calculateStopsInRange(c), 0)
    : 0;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Select Candidate
      </h4>
      
      {/* "Show All" Option */}
      <label
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
      >
        <input
          type="radio"
          name="candidate"
          checked={visibleCandidates.length === candidates.length}
          onChange={onSelectAll}
          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        
        <div className="flex items-center gap-2 flex-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-400 via-blue-400 to-green-400 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm"></div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Show All Routes
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Display all {candidates.length} candidates
              {hasDateFilter && (
                <span className="ml-1">
                  • {totalStopsInRange} stops in range
                </span>
              )}
            </p>
          </div>
        </div>
      </label>

      {/* Individual Candidates */}
      {candidates.map((candidate) => (
        <CandidateListItem
          key={candidate.candidateId}
          candidate={candidate}
          isSelected={selectedCandidate?.candidateId === candidate.candidateId}
          stopsInRange={calculateStopsInRange(candidate)}
          hasDateFilter={hasDateFilter}
          onSelect={onSelectCandidate}
        />
      ))}
    </div>
  );
};

export default CandidateList;