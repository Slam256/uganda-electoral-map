import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";


const CampaignStopPanel = ({ feature, onCollapse }) => {
  const { 
    candidateName, 
    candidateColor, 
    partyName, 
    partyAbbreviation, 
    stopData, 
    stopIndex, 
    totalStops 
  } = feature;

  return (
    <PanelContainer>
      <div className="mb-2 flex items-center gap-3">
        <div 
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: candidateColor }}
        />
        <Badge type="campaign" text="Campaign Stop" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {candidateName}
      </h2>

      {partyName && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {partyName} {partyAbbreviation && `(${partyAbbreviation})`}
        </p>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Stop {stopIndex} of {totalStops} in campaign tour
      </p>

      <div className="space-y-4">
        <InfoCard label="District" value={stopData.districtName} />
        <InfoCard 
          label="Campaign Date" 
          value={new Date(stopData.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        />
      </div>
    </PanelContainer>
  );
};

export default CampaignStopPanel;