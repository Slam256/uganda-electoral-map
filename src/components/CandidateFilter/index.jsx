import { useEffect } from 'react';
import { useCampaignFilter } from './CandidateFilter.hooks';
import FilterSummary from './components/FilterSummary';
import PanelHeader from './components/PanelHeader';
import DateRangeFilter from './components/DateRangeFilter';
import CandidateList from './components/CandidateList';
import PanelActions from './components/PanelActions';

/**
 * Main Candidate Filter Component
 * Container component that orchestrates the filter functionality
 */
const CandidateFilter = ({ 
  routes, 
  onToggleCandidate, 
  onShowAll, 
  onHideAll,
  onFilteredRoutesChange
}) => {
  const {
    isExpanded,
    startDate,
    endDate,
    dateRange,
    hasDateFilter,
    
    // Computed data
    dateBounds,
    filteredRoutes,
    candidates,
    visibleCandidates,
    selectedCandidate,
    
    // Operations
    setStartDate,
    setEndDate,
    calculateStopsInRange,
    handleSelectCandidate,
    handleSelectAll,
    handleClearDates,
    handleClearAll,
    toggleExpanded,
    closePanel
  } = useCampaignFilter(routes, {
    onToggleCandidate,
    onShowAll,
    onHideAll
  });

  // Pass filtered routes back to parent whenever they change
  useEffect(() => {
    if (onFilteredRoutesChange) {
      onFilteredRoutesChange(filteredRoutes, dateRange);
    }
  }, [filteredRoutes, dateRange, onFilteredRoutesChange]);

  // Don't render if no routes
  if (!routes || Object.keys(routes).length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1001]">
      {/* Collapsed State */}
      {!isExpanded && (
        <FilterSummary
          selectedCandidate={selectedCandidate}
          visibleCandidates={visibleCandidates}
          hasDateFilter={hasDateFilter}
          startDate={startDate}
          endDate={endDate}
          onExpand={toggleExpanded}
        />
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 max-h-[70vh] flex flex-col">
          
          <PanelHeader onClose={closePanel} />

          {/* Content */}
          <div className="overflow-y-auto p-4 space-y-4">
            
            {/* Date Range Filter */}
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              dateBounds={dateBounds}
              hasDateFilter={hasDateFilter}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClearDates={handleClearDates}
            />

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700">

            </div>
  
            {/* Candidate List */}
            <CandidateList
              candidates={candidates}
              visibleCandidates={visibleCandidates}
              selectedCandidate={selectedCandidate}
              hasDateFilter={hasDateFilter}
              calculateStopsInRange={calculateStopsInRange}
              onSelectCandidate={handleSelectCandidate}
              onSelectAll={handleSelectAll}
            />
          </div>

          {/* Footer Actions */}
          <PanelActions
            onClearAll={handleClearAll}
            onClose={closePanel}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateFilter;