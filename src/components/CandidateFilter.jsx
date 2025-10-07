/**
 * Floating Candidate Filter Panel
 * - Positioned at top-center of map
 * - Toggleable to avoid obstructing view
 * - Radio buttons for single candidate selection
 */

import { useState } from 'react';

const CandidateFilter = ({ routes, onToggleCandidate, onShowAll, onHideAll }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!routes || Object.keys(routes).length === 0) {
    return null;
  }

  const candidates = Object.values(routes);
  const visibleCandidates = candidates.filter(c => c.visible);
  const selectedCandidate = visibleCandidates.length === 1 ? visibleCandidates[0] : null;

  // Handle radio selection - show only one candidate
  const handleSelectCandidate = (candidateId) => {
    // First hide all
    onHideAll();
    // Then show only the selected one
    onToggleCandidate(candidateId);
  };

  // Handle "All" option
  const handleSelectAll = () => {
    onShowAll();
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1001]">
      {/* Collapsed Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="font-medium text-gray-800 dark:text-gray-100">
            Campaign Routes
          </span>
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
          {visibleCandidates.length > 1 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({visibleCandidates.length} active)
            </span>
          )}
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 max-h-[70vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Campaign Routes
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-4 space-y-2">
            
            {/* "Show All" Option */}
            <label
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            >
              <input
                type="radio"
                name="candidate"
                checked={visibleCandidates.length === candidates.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-400 via-blue-400 to-green-400 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Show All Routes
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Display all {candidates.length} candidates
                  </p>
                </div>
              </div>
            </label>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Individual Candidates */}
            {candidates.map((candidate) => {
              const isSelected = selectedCandidate?.candidateId === candidate.candidateId;
              return (
                <label
                  key={candidate.candidateId}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-2 ${
                    isSelected 
                      ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="candidate"
                    checked={isSelected}
                    onChange={() => handleSelectCandidate(candidate.candidateId)}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />

                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm"
                    style={{ backgroundColor: candidate.color }}
                  ></div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {candidate.candidateName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {candidate.stops.length} stops • {candidate.candidateShortCode}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Footer with Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-750">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onHideAll();
                  setIsExpanded(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateFilter;
