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

  // Show district view
  return (
    <PanelContainer>
      <div className="mb-4 flex items-center gap-3">
        <Badge type="district" text="District" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {data.name}
      </h2>

      {/* District Statistics */}
      <div className="space-y-4 mb-6">
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

      {/* DWMP Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            District Woman MP
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          All voters in {data.name} district elect 1 woman representative
        </p>
        <CandidatesList 
          candidates={dwmpCandidates} 
          category="DWMP"
          loading={dwmpLoading}
          compact={true}
        />
      </div>

      {/* Constituencies Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Constituency MPs
          </h3>
        </div>
        
        {constituenciesLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Loading constituencies...
          </p>
        ) : constituencies.length > 0 ? (
          <div className="space-y-2">
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
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No constituencies found
          </p>
        )}
      </div>
    </PanelContainer>
  );
};

export default EnhancedDistrictInfoPanel;