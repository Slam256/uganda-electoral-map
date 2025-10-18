import { useState, useEffect, useRef, useCallback } from 'react';
import MapComponent from './components/MapComponent'
import DistrictPanel from './components/DistrictPanel'
import ThemeToggle from './components/ThemeToggle';
import CandidateFilter from './components/CandidateFilter';
import HelpModal from './components/HelpModal';
import SearchComponent from './components/SearchComponent';
import { useCampaignRoutes } from './hooks/useCampaignRoutes';


const App = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const mapRef = useRef(null);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hideWelcomeModal');
    if (!hasSeenModal) {
      setShowHelpModal(true);
    }
  }, []);

  const {
    routes,
    loading: routesLoading,
    toggleCandidateVisibility,
    showAll,
    hideAll
  } = useCampaignRoutes();

  // Handle date range changes from the CandidateFilter
 const handleDateRangeChange = useCallback((newDateRange) => {
  setDateRange(newDateRange);
}, []);

  // Filter routes based on date range
  const getFilteredRoutes = () => {
    if (!dateRange.start && !dateRange.end) {
      // No date filter, return original routes
      return routes;
    }

    // Create a new routes object with filtered stops
    const filteredRoutes = {};
    
    Object.entries(routes).forEach(([candidateId, candidateData]) => {
      const filteredStops = candidateData.stops.filter(stop => {
        const stopDate = new Date(stop.date);
        
        // Check if stop is within date range
        const afterStart = !dateRange.start || stopDate >= dateRange.start;
        const beforeEnd = !dateRange.end || stopDate <= dateRange.end;
        
        return afterStart && beforeEnd;
      });

      // Include candidate even if they have 0 stops in range
      // This allows the UI to show "0 stops in range" feedback
      filteredRoutes[candidateId] = {
        ...candidateData,
        stops: filteredStops,
        // Keep original stops count for reference
        totalStops: candidateData.stops.length
      };
    });

    return filteredRoutes;
  };

  const filteredRoutes = getFilteredRoutes();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapComponent
          onFeatureSelect={setSelectedFeature}
          routes={filteredRoutes}  // Pass filtered routes to map
          ref={mapRef} />
      </div>

      {/* Theme toggle - top right */}
      <div className="absolute top-5 right-3 z-[1000]">
        <ThemeToggle />
      </div>
      
      {/* Candidate filter - top center */}
      {!routesLoading && (
        <CandidateFilter
          routes={routes}  // Pass original routes for UI display
          onToggleCandidate={toggleCandidateVisibility}
          onShowAll={showAll}
          onHideAll={hideAll}
          onDateRangeChange={handleDateRangeChange}  // Pass the handler
        />
      )}
      
      {/* Search component */}
      <SearchComponent 
        mapRef={mapRef} 
        onFeatureSelect={setSelectedFeature} 
      />
      
      {/* Help button - top left */}
      <div className="z-[1000] left-2 absolute top-14">
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-1.5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded"
          aria-label="Help"
          title="Help"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Help modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* District panel - bottom left */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <DistrictPanel selectedFeature={selectedFeature} />
      </div>
    </div>
  )
}

export default App;