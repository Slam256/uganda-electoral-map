import { useState } from 'react';
import MapComponent from './components/MapComponent'
import DistrictPanel from './components/DistrictPanel'
import ThemeToggle from './components/ThemeToggle';
import CandidateFilter from './components/CandidateFilter';
import { useCampaignRoutes } from './hooks/useCampaignRoutes';


const App = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const {
    routes,
    loading: routesLoading,
    toggleCandidateVisibility,
    showAll,
    hideAll
  } = useCampaignRoutes();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapComponent 
          onFeatureSelect={setSelectedFeature}
          routes={routes} />
      </div>

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

      {/* District panel - bottom left */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <DistrictPanel selectedFeature={selectedFeature} />
      </div>
    </div>
  )
}

export default App
