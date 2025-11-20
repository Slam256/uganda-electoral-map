import { useState, useEffect, useCallback, useRef } from 'react';
import { useCampaignRoutes } from './useCampaignRoutes';

/**
 * Custom hook for managing application-level state and operations
 */
export const useAppState = () => {
  // Feature selection state
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  // UI state
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Routes and filtering
  const [filteredRoutes, setFilteredRoutes] = useState(null);
  
  // Map reference
  const mapRef = useRef(null);

  // Campaign routes hook
  const {
    routes,
    loading: routesLoading,
    toggleCandidateVisibility,
    showAll,
    hideAll
  } = useCampaignRoutes();

  // Check if user has seen welcome modal
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hideWelcomeModal');
    if (!hasSeenModal) {
      setShowHelpModal(true);
    }
  }, []);

  // Handle filtered routes change
  const handleFilteredRoutesChange = useCallback((filtered, dateRange) => {
    if (dateRange && (dateRange.start || dateRange.end)) {
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(null);
    }
  }, []);

  // Determine which routes to display
  const displayRoutes = filteredRoutes || routes;

  // Toggle functions
  const toggleHelpModal = useCallback(() => {
    setShowHelpModal(prev => !prev);
  }, []);

  return {
    // State
    selectedFeature,
    showHelpModal,
    displayRoutes,
    routes,
    routesLoading,
    
    // Refs
    mapRef,
    
    // State setters
    setSelectedFeature,
    setShowHelpModal,
    
    // Operations
    handleFilteredRoutesChange,
    toggleCandidateVisibility,
    showAll,
    hideAll,
    toggleHelpModal
  };
};