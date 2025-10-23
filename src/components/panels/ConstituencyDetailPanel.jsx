import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { PanelContainer } from "../shared/PanelContainer";
import { useMPCandidates } from '../../hooks/useMPCandidates';
import CandidatesList from '../shared/CandidatesList';

const ConstituencyDetailPanel = ({ constituency, districtName, onBack, onCollapse }) => {
  // Fetch DEMP candidates for this constituency
  const { 
    candidates: dempCandidates, 
    loading: dempLoading 
  } = useMPCandidates('constituency', constituency.id, 'DEMP');

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
      
      {/* HEADER SECTION - Fixed (35% of height) */}
      <div className="h-[35%] overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        
        {/* Back button and collapse */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {districtName}
          </button>
          <CollapseButton onClick={onCollapse} />
        </div>

        {/* Constituency header */}
        <div>
          <Badge type="subcounty" text="Constituency" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2 mb-1">
            {constituency.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            District: {districtName}
          </p>
        </div>
      </div>

      {/* CANDIDATES SECTION - Scrollable (65% of height) */}
      <div className="h-[65%] overflow-y-auto px-4 md:px-6 pt-4 pb-4">
        <CandidatesList 
          candidates={dempCandidates} 
          category="DEMP"
          loading={dempLoading}
          compact={true}
        />
      </div>
    </div>
  );
};

export default ConstituencyDetailPanel;