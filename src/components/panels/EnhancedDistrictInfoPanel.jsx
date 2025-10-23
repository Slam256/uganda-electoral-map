import { useState } from 'react';
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";
import { useMPCandidates } from '../../hooks/useMPCandidates';
import { useConstituencies } from '../../hooks/useConstituencies';
import CandidatesList from '../shared/CandidatesList';
import ConstituencyListItem from '../shared/ConstituencyListItem';
import ConstituencyDetailPanel from './ConstituencyDetailPanel';

const EnhancedDistrictInfoPanel = ({ data, onCollapse }) => {
  const [viewMode, setViewMode] = useState('district'); // 'district' or 'constituency'
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  // Fetch DWMP candidates for this district
  const { 
    candidates: dwmpCandidates, 
    loading: dwmpLoading 
  } = useMPCandidates('district', data.id, 'DWMP');

  // Fetch constituencies for this district
  const { 
    constituencies, 
    loading: constituenciesLoading 
  } = useConstituencies(data.id);

  const handleConstituencyClick = (constituency) => {
    setSelectedConstituency(constituency);
    setViewMode('constituency');
  };

  const handleBack = () => {
    setViewMode('district');
    setSelectedConstituency(null);
  };

  // Show constituency detail view
  if (viewMode === 'constituency' && selectedConstituency) {
    return (
      <ConstituencyDetailPanel
        constituency={selectedConstituency}
        districtName={data.name}
        onBack={handleBack}
        onCollapse={onCollapse}
      />
    );
  }

  // Show district view with fixed height layout
  return (
    <div className="w-full max-h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
      
      {/* HEADER SECTION - Fixed at top (35% of height) */}
      <div className="h-[35%] overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        
        {/* Badge and Collapse Button */}
        <div className="mb-4 flex items-center justify-between gap-5">
          <Badge type="district" text="District" />
          <CollapseButton onClick={onCollapse} />
        </div>

        {/* District Name */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {data.name}
        </h2>

        {/* District Statistics */}
        <div className="space-y-3">
          {data.district_code && (
            <InfoCard label="District Code" value={data.district_code} />
          )}
          {data.registered_voters_2021 && (
            <InfoCard 
              label="Registered Voters (2021)" 
              value={data.registered_voters_2021.toLocaleString()}
              isLarge={true}
            />
          )}
          {data.population && (
            <InfoCard 
              label="Population" 
              value={data.population.toLocaleString()}
              isLarge={true}
            />
          )}
        </div>
      </div>

      {/* CONSTITUENCIES SECTION - Scrollable (65% of height) */}
      <div className="h-[65%] flex flex-col overflow-hidden">
        
        {/* DWMP Section - Fixed within scrollable area */}
        <div className="px-4 md:px-6 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
              District Woman MP
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            All voters in {data.name} elect 1 woman MP
          </p>
          <CandidatesList 
            candidates={dwmpCandidates} 
            category="DWMP"
            loading={dwmpLoading}
            compact={true}
          />
        </div>

        {/* Constituencies List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
              Constituency MPs
            </h3>
            {constituencies.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {constituencies.length}
              </span>
            )}
          </div>
          
          {constituenciesLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic py-4">
              Loading constituencies...
            </p>
          ) : constituencies.length > 0 ? (
            <div className="space-y-2 pb-4">
              {constituencies.map((constituency) => (
                <ConstituencyListItem
                  key={constituency.id}
                  constituency={constituency}
                  candidateCount={constituency.candidateCount}
                  onClick={() => handleConstituencyClick(constituency)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic py-4">
              No constituencies found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDistrictInfoPanel;