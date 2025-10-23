import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";

const DistrictInfoPanel = ({ data, onCollapse }) => (
   <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
    <div className="mb-4 flex items-center gap-3">
      <Badge type="district" text="District" />
      <CollapseButton onClick={onCollapse} />
    </div>

    <h2 className="text-lg md:text-lg font-bold text-gray-800 dark:text-gray-100">
      {data.name}
    </h2>

    <div className="space-y-2">
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
  </div>
);

export default DistrictInfoPanel;