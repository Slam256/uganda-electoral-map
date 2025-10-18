const CollapsedPanel = ({ selectedFeature, dbData, onExpand }) => {
  // Determine what text to show based on the feature type
  const getDisplayText = () => {
    if (!selectedFeature) {
      return 'Click map to view info';
    }
    
    // Handle campaign stops specially
    if (selectedFeature.layerType === 'campaign-stop') {
      return `${selectedFeature.candidateName} - ${selectedFeature.stopData?.districtName || 'Campaign Stop'}`;
    }
    
    return dbData?.name || 'Loading...';
  };

  const getIcon = () => {
    if (!selectedFeature) return '📍';
    if (selectedFeature.layerType === 'campaign-stop') return '🎯';
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
        
        {/* Show candidate color dot for campaign stops */}
        {selectedFeature?.layerType === 'campaign-stop' && (
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: selectedFeature.candidateColor }}
          />
        )}
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
          {getDisplayText()}
        </span>
        <span className="text-gray-400">▶</span>
      </div>
    </button>
  );
};

export default CollapsedPanel;