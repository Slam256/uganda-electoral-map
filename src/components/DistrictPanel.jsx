import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import CollapsedPanel from "./panels/CollapsedPanel";
import EmptyPanel from "./panels/EmptyPanel";
import CampaignStopPanel from "./panels/CampaignStopPanel";
import LoadingPanel from "./panels/LoadingPanel";
import ErrorPanel from "./panels/ErrorPanel";
import DistrictInfoPanel from "./panels/DistrictInfoPanel";
import SubcountyInfoPanel from "./panels/SubcountyInfoPanel";

const DistrictPanel = ({ selectedFeature }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Only fetch admin data for districts/subcounties, NOT for campaign stops
  const shouldFetchAdminData = 
    selectedFeature?.layerType && 
    selectedFeature.layerType !== 'campaign-stop';

  const { data: dbData, loading, error } = useAdminData(
    shouldFetchAdminData ? selectedFeature?.layerType : null,
    shouldFetchAdminData ? selectedFeature?.identifier : null,
    selectedFeature?.identifierType || 'name'
  );

  // Handle collapsed state
  if (!isExpanded) {
    return (
      <CollapsedPanel 
        selectedFeature={selectedFeature}
        dbData={dbData}
        onExpand={() => setIsExpanded(true)}
      />
    );
  }

  // Handle no selection
  if (!selectedFeature) {
    return <EmptyPanel onCollapse={() => setIsExpanded(false)} />;
  }

  // Handle campaign stop (no DB query needed)
  if (selectedFeature.layerType === 'campaign-stop') {
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
    switch (selectedFeature.layerType) {
      case 'districts':
        return (
          <DistrictInfoPanel 
            data={dbData}
            onCollapse={() => setIsExpanded(false)}
          />
        );
      case 'subcounties':
        return (
          <SubcountyInfoPanel 
            data={dbData}
            onCollapse={() => setIsExpanded(false)}
          />
        );
      default:
        return null;
    }
  };

  return renderPanel();
};

export default DistrictPanel;
