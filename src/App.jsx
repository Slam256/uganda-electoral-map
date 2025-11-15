import { useState, useEffect, useRef, useCallback } from 'react';
import MapComponent from './components/MapComponent'
import DistrictPanel from './components/DistrictPanel'
import ThemeToggle from './components/ThemeToggle';
import CandidateFilter from './components/CandidateFilter';
import HelpModal from './components/HelpModal';
import SearchComponent from './components/SearchComponent';
import { useCampaignRoutes } from './hooks/useCampaignRoutes';
import { NavigationProvider } from './context/NavigationProvider';
import { Breadcrumb } from './components/Breadcrumb';

const App = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showBreadcrumb, setShowBreadcrumb] = useState(true);
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

  /**
   * Handle navigation from panels to map features
   */
  const handleNavigate = useCallback((selection) => {
    if (!selection || !selection.layerType) {
      // Clear selection if navigating to root
      setSelectedFeature(null);
      return;
    }

    // Update the selected feature
    setSelectedFeature(selection);

    // If we have a map reference, try to zoom to the feature
    if (mapRef.current && mapRef.current.getMap) {
      const map = mapRef.current.getMap();
      
      // Try to find and select the feature on the map
      map.getLayers().forEach(layer => {
        if (layer.getLayers) {
          // It's a layer group
          layer.getLayers().forEach(subLayer => {
            if (subLayer.get('name') === selection.layerType) {
              const source = subLayer.getSource();
              if (source) {
                const features = source.getFeatures();
                const targetFeature = features.find(f => {
                  const props = f.getProperties();
                  // Match by name or ID
                  return props.NAME === selection.identifier ||
                         props.name === selection.identifier ||
                         props.SUBCOUNTY === selection.identifier ||
                         props.Subcounty === selection.identifier;
                });

                if (targetFeature) {
                  // Clear previous selections
                  features.forEach(f => f.set('selected', false));
                  
                  // Select the target feature
                  targetFeature.set('selected', true);
                  subLayer.changed();

                  // Zoom to feature
                  const geometry = targetFeature.getGeometry();
                  if (geometry) {
                    const extent = geometry.getExtent();
                    map.getView().fit(extent, {
                      duration: 1000,
                      padding: [100, 100, 100, 400]
                    });
                  }
                }
              }
            }
          });
        }
      });
    }
  }, []);

  return (
    <NavigationProvider onNavigate={handleNavigate}>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Full-screen map */}
        <div className="absolute inset-0">
          <MapComponent
            onFeatureSelect={setSelectedFeature}
            routes={routes}
            ref={mapRef} 
          />
        </div>

        {/* Breadcrumb Navigation - Top Left */}
        {showBreadcrumb && selectedFeature && (
          <div className="absolute top-4 left-4 z-[999] max-w-xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <Breadcrumb />
            </div>
          </div>
        )}

        {/* Theme toggle - top right */}
        <div className="absolute top-5 right-3 z-[1000]">
          <ThemeToggle />
        </div>

        {/* Candidate filter - top center */}
        {!routesLoading && (
          <CandidateFilter
            routes={routes}
            onToggleCandidate={toggleCandidateVisibility}
            onShowAll={showAll}
            onHideAll={hideAll}
          />
        )}

        {/* Search Component */}
        <SearchComponent 
          mapRef={mapRef} 
          onFeatureSelect={setSelectedFeature} 
        />

        {/* Help Button */}
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

        {/* Toggle Breadcrumb Button */}
        <div className="z-[1000] left-2 absolute top-24">
          <button
            onClick={() => setShowBreadcrumb(!showBreadcrumb)}
            className="p-1.5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded"
            aria-label="Toggle breadcrumb"
            title={showBreadcrumb ? "Hide breadcrumb" : "Show breadcrumb"}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showBreadcrumb ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              )}
            </svg>
          </button>
        </div>

        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        {/* District panel - bottom left */}
        <div className="absolute bottom-4 left-4 z-[1000] max-h-[80vh] overflow-y-auto">
          <DistrictPanel selectedFeature={selectedFeature} />
        </div>
      </div>
    </NavigationProvider>
  )
}

export default App;
