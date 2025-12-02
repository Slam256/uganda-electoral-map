import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import CollapsedPanel from "./panels/CollapsedPanel";
import EmptyPanel from "./panels/EmptyPanel";
import CampaignStopPanel from "./panels/CampaignStopPanel";
import LoadingPanel from "./panels/LoadingPanel";
import ErrorPanel from "./panels/ErrorPanel";
import DistrictInfoPanel from "./panels/DistrictInfoPanel";
import SubcountyInfoPanel from "./panels/SubcountyInfoPanel";
import ParishInfoPanel from "./panels/ParishInfoPanel";
import ConstituencyInfoPanel from "./panels/ConstituencyInfoPanel";
import CountryInfoPanel from "./panels/CountryInfoPanel";

const DistrictPanel = ({ selectedFeature }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Only fetch admin data for geographic features, NOT for campaign stops
  const adminLevel = !selectedFeature ? 'country' : selectedFeature.layerType === 'campaign-stop' ? null : selectedFeature.layerType;

  const identifier = !selectedFeature 
    ? null 
    : selectedFeature.identifier;

  const { data: dbData, voterStats, loading, error } = useAdminData(
    adminLevel,
    identifier,
    selectedFeature?.identifierType || 'name'
  );

  // Handle collapsed state
  if (!isExpanded) {
    return (
      <CollapsedPanel 
        selectedFeature={selectedFeature}
        isCountryView={!selectedFeature}
        dbData={dbData}
        onExpand={() => setIsExpanded(true)}
      />
    );
  }

  // Handle campaign stop (no DB query needed)
  if (selectedFeature?.layerType === 'campaign-stop') {
    return (
      <CampaignStopPanel 
        feature={selectedFeature}
        onCollapse={() => setIsExpanded(false)}
      />
    );
  }

  // Handle loading state for admin data
  if (loading) {
    return <LoadingPanel onCollapse={() => setIsExpanded(false)} />;
  }

  // Handle error state
  if (error) {
    return <ErrorPanel error={error} onCollapse={() => setIsExpanded(false)} />;
  }

  // Handle no data
  if (!dbData) {
    return (
      <ErrorPanel 
        error="No information available for this feature" 
        onCollapse={() => setIsExpanded(false)} 
      />
    );
  }
  // Render based on layer type
  const renderPanel = () => {
    // Merge voter stats into the data object for panels
    const dataWithStats = {
      ...dbData,
      voterStats: voterStats
    };

    if (!selectedFeature) {
      return (
        <CountryInfoPanel 
          data={dataWithStats}
          onCollapse={() => setIsExpanded(false)}
        />
      );
    }

    switch (selectedFeature.layerType) {
      case 'districts':
        return (
          <DistrictInfoPanel 
            data={dataWithStats}
            onCollapse={() => setIsExpanded(false)}
          />
        );
      
      case 'subcounties':
        return (
          <SubcountyInfoPanel 
            data={dataWithStats}
            onCollapse={() => setIsExpanded(false)}
          />
        );
      
      case 'parishes':
        return (
          <ParishInfoPanel 
            data={dataWithStats}
            onCollapse={() => setIsExpanded(false)}
          />
        );
      
      case 'constituencies':
        return (
          <ConstituencyInfoPanel 
            data={dataWithStats}
            onCollapse={() => setIsExpanded(false)}
          />
        );
      
      default:
        return (
          <ErrorPanel 
            error={`Unknown layer type: ${selectedFeature.layerType}`}
            onCollapse={() => setIsExpanded(false)} 
          />
        );
    }
  };

  return renderPanel();
};

export default DistrictPanel;
