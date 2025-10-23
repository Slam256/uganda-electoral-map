import { PanelContainer } from "../shared/PanelContainer";
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";

const SubcountyInfoPanel = ({ data, onCollapse }) => (
  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
    
    {/* Header section - scrollable if needed */}
    <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-4">
      <div className="mb-4 flex items-center gap-3">
        <Badge type="subcounty" text="Subcounty" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {data.name}
      </h2>

      {data.district && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          District: {data.district.name}
        </p>
      )}

      <div className="space-y-4">
        {data.subcounty_code && (
          <InfoCard label="Subcounty Code" value={data.subcounty_code} />
        )}
        {data.registered_voters_2021 && (
          <InfoCard 
            label="Registered Voters" 
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
  </div>
);

export default SubcountyInfoPanel;