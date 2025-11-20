/**
 * CandidateFilter Model
 * Pure functions for campaign filtering business logic
 */

/**
 * Calculate min and max dates from all campaign stops
 * @param {Object} routes - Routes object with candidates
 * @returns {Object} Object with min and max date strings
 */
export const getDateBounds = (routes) => {
  if (!routes || Object.keys(routes).length === 0) {
    return { min: '', max: '' };
  }

  let minDate = null;
  let maxDate = null;
  
  Object.values(routes).forEach(candidate => {
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

/**
 * Count stops within a date range for a candidate
 * @param {Object} candidate - Candidate object with stops
 * @param {Object} dateRange - Object with start and end dates
 * @returns {number} Number of stops in range
 */
export const getStopsInRange = (candidate, dateRange) => {
  if (!candidate || !candidate.stops) return 0;
  if (!dateRange.start && !dateRange.end) return candidate.stops.length;
  
  return candidate.stops.filter(stop => {
    const stopDate = new Date(stop.date);
    const afterStart = !dateRange.start || stopDate >= dateRange.start;
    const beforeEnd = !dateRange.end || stopDate <= dateRange.end;
    return afterStart && beforeEnd;
  }).length;
};

/**
 * Filter routes based on date range
 * @param {Object} routes - Original routes object
 * @param {Object} dateRange - Object with start and end dates
 * @returns {Object} Filtered routes object
 */
export const filterRoutesByDateRange = (routes, dateRange) => {
  if (!routes || (!dateRange.start && !dateRange.end)) {
    return routes;
  }

  const filteredRoutes = {};
  
  Object.entries(routes).forEach(([candidateId, candidate]) => {
    const filteredStops = candidate.stops.filter(stop => {
      const stopDate = new Date(stop.date);
      const afterStart = !dateRange.start || stopDate >= dateRange.start;
      const beforeEnd = !dateRange.end || stopDate <= dateRange.end;
      return afterStart && beforeEnd;
    });

    // Only include candidate if they have stops in the range
    if (filteredStops.length > 0 || !dateRange.start && !dateRange.end) {
      filteredRoutes[candidateId] = {
        ...candidate,
        stops: filteredStops,
        // Preserve original stops count for display
        totalStops: candidate.stops.length
      };
    }
  });

  return filteredRoutes;
};

/**
 * Get visible candidates from routes
 * @param {Object} routes - Routes object
 * @returns {Array} Array of visible candidates
 */
export const getVisibleCandidates = (routes) => {
  if (!routes) return [];
  return Object.values(routes).filter(c => c.visible);
};

/**
 * Get selected candidate if only one is visible
 * @param {Array} visibleCandidates - Array of visible candidates
 * @returns {Object|null} The selected candidate or null
 */
export const getSelectedCandidate = (visibleCandidates) => {
  return visibleCandidates.length === 1 ? visibleCandidates[0] : null;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Parse date range from input strings
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {Object} Object with Date objects for start and end
 */
export const parseDateRange = (startDate, endDate) => {
  return {
    start: startDate ? new Date(startDate + 'T00:00:00') : null,
    end: endDate ? new Date(endDate + 'T23:59:59') : null
  };
};
