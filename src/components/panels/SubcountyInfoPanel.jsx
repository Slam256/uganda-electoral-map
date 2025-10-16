import { PanelContainer } from "../shared/PanelContainer";
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";

const SubcountyInfoPanel = ({ data, onCollapse }) => (
  <PanelContainer>
    <div className="mb-4 flex items-center gap-3">
      <Badge type="subcounty" text="Subcounty" />
      <CollapseButton onClick={onCollapse} />
    </div>

    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
      {data.name}
    </h2>

    {data.district_id && (
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        District Name: {data.district_name}
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
  </PanelContainer>
);

export default SubcountyInfoPanel;