import { ChevronDown } from "lucide-react";
import Avatar from "../shared/Avatar";
import { getCandidatePhoto } from "../../utils/candidatePhotos";

const CollapsedPanel = ({ selectedFeature, dbData, onExpand }) => {
  // Handle campaign stops with special UI
  if (selectedFeature?.layerType === 'campaign-stop') {
    const {
      candidateName,
      candidateShortCode,
      candidateColor,
      stopIndex,
      totalStops,
      stopData
    } = selectedFeature;

    return (
      <button
        onClick={onExpand}
        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          {/* Avatar with party color dot */}
          <Avatar
            src={getCandidatePhoto(candidateName)}
            alt={candidateName}
            fallbackColor={candidateColor}
            statusColor={candidateColor}
            size="md"
          />
          
          {/* Candidate Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {candidateName}
              {candidateShortCode && (
                <span className="font-normal text-gray-600 dark:text-gray-400 ml-1">
                  ({candidateShortCode})
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {stopIndex} of {totalStops} stops in range
            </div>
            {stopData?.districtName && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {stopData.districtName}
              </div>
            )}
          </div>
          
          {/* Chevron Down Icon */}
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </button>
    );
  }

  // Default collapsed state for other feature types
  const getDisplayText = () => {
    if (!selectedFeature) {
      return 'Click map to view info';
    }
    
    return dbData?.name || 'Loading...';
  };

  const getIcon = () => {
    if (!selectedFeature) return '📍';
    if (selectedFeature.layerType === 'districts') return '📍';
    if (selectedFeature.layerType === 'subcounties') return '📍';
    return '📍';
  };

  return (
    <button
      onClick={onExpand}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{getIcon()}</span>
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
          {getDisplayText()}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
};

export default CollapsedPanel;