/**
 * Floating Candidate Filter Panel with Date Range Filtering
 * - Positioned at top-center of map
 * - Toggleable to avoid obstructing view
 * - Radio buttons for single candidate selection
 * - Date range filtering for campaign stops
 */

import { useState, useEffect } from 'react';

const CandidateFilter = ({ 
  routes, 
  onToggleCandidate, 
  onShowAll, 
  onHideAll,
  onDateRangeChange // New prop for handling date changes
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    if (onDateRangeChange) {
      const range = {
        start: startDate ? new Date(startDate + 'T00:00:00') : null,
        end: endDate ? new Date(endDate + 'T23:59:59') : null
      };
      onDateRangeChange(range);
    }
  }, [startDate, endDate, onDateRangeChange]);
  if (!routes || Object.keys(routes).length === 0) {
    return null;
  }

  const candidates = Object.values(routes);
  const visibleCandidates = candidates.filter(c => c.visible);
  const selectedCandidate = visibleCandidates.length === 1 ? visibleCandidates[0] : null;

  // Calculate min and max dates from all campaign stops
  const getDateBounds = () => {
    let minDate = null;
    let maxDate = null;
    
    candidates.forEach(candidate => {
      candidate.stops.forEach(stop => {
        const stopDate = new Date(stop.date);
        if (!minDate || stopDate < minDate) minDate = stopDate;
        if (!maxDate || stopDate > maxDate) maxDate = stopDate;
      });
    });
    
    return {
      min: minDate ? minDate.toISOString().split('T')[0] : '',
      max: maxDate ? maxDate.toISOString().split('T')[0] : ''
    };
  };

  const dateBounds = getDateBounds();

  // Handle date range changes

  // Count stops within date range for a candidate
  const getStopsInRange = (candidate) => {
    if (!startDate && !endDate) return candidate.stops.length;
    
    return candidate.stops.filter(stop => {
      const stopDate = new Date(stop.date);
      const afterStart = !startDate || stopDate >= new Date(startDate + 'T00:00:00');
      const beforeEnd = !endDate || stopDate <= new Date(endDate + 'T23:59:59');
      return afterStart && beforeEnd;
    }).length;
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle radio selection - show only one candidate
  const handleSelectCandidate = (candidateId) => {
    onHideAll();
    onToggleCandidate(candidateId);
  };

  // Handle "All" option
  const handleSelectAll = () => {
    onShowAll();
  };

  // Clear date filters
  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  // Check if date filter is active
  const hasDateFilter = startDate || endDate;

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
          
          {/* Show active filters in collapsed state */}
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
          <div className="overflow-y-auto p-4 space-y-4">
            
            {/* Date Range Filter Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Filter by Date Range
                </h4>
                {hasDateFilter && (
                  <button
                    onClick={handleClearDates}
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
                    onChange={(e) => setStartDate(e.target.value)}
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
                    onChange={(e) => setEndDate(e.target.value)}
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

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            
            {/* Candidate Selection Section */}
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
                  onChange={handleSelectAll}
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
                          • {candidates.reduce((sum, c) => sum + getStopsInRange(c), 0)} stops in range
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </label>

              {/* Individual Candidates */}
              {candidates.map((candidate) => {
                const isSelected = selectedCandidate?.candidateId === candidate.candidateId;
                const stopsInRange = getStopsInRange(candidate);
                const totalStops = candidate.stops.length;
                
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
                        {hasDateFilter ? (
                          <>
                            <span className={stopsInRange === 0 ? 'text-red-500 dark:text-red-400' : ''}>
                              {stopsInRange} of {totalStops} stops
                            </span>
                            {stopsInRange > 0 && ` in range`}
                          </>
                        ) : (
                          `${totalStops} stops`
                        )}
                        {` • ${candidate.candidateShortCode}`}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-750">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onHideAll();
                  handleClearDates();
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