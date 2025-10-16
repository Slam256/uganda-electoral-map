import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";

const DistrictInfoPanel = ({ data, onCollapse }) => (
  <PanelContainer>
    <div className="mb-4 flex items-center gap-3">
      <Badge type="district" text="District" />
      <CollapseButton onClick={onCollapse} />
    </div>

    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
      {data.name}
    </h2>

    <div className="space-y-4">
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
      {data.constituencies && data.constituencies.length > 0 && (
        <InfoCard label="Constituencies">
          <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
            {data.constituencies.map((constituency) => (
              <li key={constituency.id}>{constituency.name}</li>
            ))}
          </ul>
        </InfoCard>
      )}
    </div>
  </PanelContainer>
);

export default DistrictInfoPanel;