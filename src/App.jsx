import { useCallback } from 'react';
import { useAppState } from './hooks/useAppState';
import { handleFeatureSelection } from './services/mapOperations';

// Layout Components
import AppLayout, { MapContainer, BottomPanel } from './components/AppLayout';
import UIControls from './components/UIControls';

// Feature Components  
import MapComponent from './components/MapComponent';
import DistrictPanel from './components/DistrictPanel';
import CandidateFilter from './components/CandidateFilter';
import HelpModal from './components/HelpModal';
import SearchComponent from './components/SearchComponent';

/**
 * Main Application Component
 * Orchestrates the application by composing smaller, focused components
 */
const App = () => {
  // Use custom hook for all state management
  const {
    selectedFeature,
    showHelpModal,
    displayRoutes,
    routes,
    routesLoading,
    mapRef,
    setSelectedFeature,
    setShowHelpModal,
    handleFilteredRoutesChange,
    toggleCandidateVisibility,
    showAll,
    hideAll,
    toggleHelpModal
  } = useAppState();

  // Handle feature selection with map operations
  const handleFeatureSelect = useCallback((selection) => {
    handleFeatureSelection(mapRef, selection, setSelectedFeature);
  }, [mapRef, setSelectedFeature]);

  return (
    <AppLayout>
      {/* Map Layer */}
      <MapContainer>
        <MapComponent
          onFeatureSelect={handleFeatureSelect}
          routes={displayRoutes}
          ref={mapRef}
        />
      </MapContainer>

      {/* UI Controls */}
      <UIControls
        onHelpClick={toggleHelpModal}
      />

      {/* Campaign Filter */}
      {!routesLoading && (
        <CandidateFilter
          routes={routes}
          onToggleCandidate={toggleCandidateVisibility}
          onShowAll={showAll}
          onHideAll={hideAll}
          onFilteredRoutesChange={handleFilteredRoutesChange}
        />
      )}

      {/* Search Component */}
      <SearchComponent
        mapRef={mapRef}
        onFeatureSelect={handleFeatureSelect}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* District Information Panel */}
      <BottomPanel>
        <DistrictPanel selectedFeature={selectedFeature} />
      </BottomPanel>
    </AppLayout>
  );
};

export default App;
