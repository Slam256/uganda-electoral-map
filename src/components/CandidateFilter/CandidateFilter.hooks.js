import { useState, useMemo, useCallback } from 'react';
import {
  getDateBounds,
  getStopsInRange,
  filterRoutesByDateRange,
  getVisibleCandidates,
  getSelectedCandidate,
  parseDateRange
} from './CandidateFilter.model';

/**
 * Custom hook for managing campaign filter state and operations
 * @param {Object} routes - Original routes data
 * @param {Function} onToggleCandidate - Callback for toggling candidate visibility
 * @param {Function} onShowAll - Callback for showing all candidates
 * @param {Function} onHideAll - Callback for hiding all candidates
 * @returns {Object} Filter state and operations
 */
export const useCampaignFilter = (routes, { 
  onToggleCandidate, 
  onShowAll, 
  onHideAll 
}) => {
  // UI State
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Computed values using memoization for performance
  const dateBounds = useMemo(() => getDateBounds(routes), [routes]);
  
  const dateRange = useMemo(() => 
    parseDateRange(startDate, endDate), 
    [startDate, endDate]
  );

  const filteredRoutes = useMemo(() => 
    filterRoutesByDateRange(routes, dateRange),
    [routes, dateRange]
  );

  const candidates = useMemo(() => 
    Object.values(routes || {}),
    [routes]
  );

  const visibleCandidates = useMemo(() => 
    getVisibleCandidates(routes),
    [routes]
  );

  const selectedCandidate = useMemo(() => 
    getSelectedCandidate(visibleCandidates),
    [visibleCandidates]
  );

  const hasDateFilter = Boolean(startDate || endDate);

  // Calculate stops in range for a specific candidate
  const calculateStopsInRange = useCallback((candidate) => {
    return getStopsInRange(candidate, dateRange);
  }, [dateRange]);

  // Handle candidate selection
  const handleSelectCandidate = useCallback((candidateId) => {
    onHideAll();
    onToggleCandidate(candidateId);
  }, [onHideAll, onToggleCandidate]);

  // Handle show all
  const handleSelectAll = useCallback(() => {
    onShowAll();
  }, [onShowAll]);

  // Clear date filters
  const handleClearDates = useCallback(() => {
    setStartDate('');
    setEndDate('');
  }, []);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    onHideAll();
    handleClearDates();
    setIsExpanded(false);
  }, [onHideAll, handleClearDates]);

  // Toggle panel expansion
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Close panel
  const closePanel = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return {
    // State
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
    closePanel,
    setIsExpanded
  };
};