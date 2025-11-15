import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";
import { VoterStatisticsCard } from "../shared/VoterStatisticsCard";
import { NavigableListItem, DrillDownButton } from "../shared/NavigableLink";
import { useNavigation } from "../../context/NavigationContext";

const DistrictInfoPanel = ({ data, onCollapse }) => {
  const { navigateTo } = useNavigation();
  const voterStats = data?.voterStats || {};
  
  return (
    <PanelContainer>
      <div className="mb-4 flex items-center gap-3">
        <Badge type="district" text="District" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {data.name}
      </h2>

      {/* Region and Subregion info */}
      {(data.region || data.subregion) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {data.region && <span>{data.region}</span>}
          {data.region && data.subregion && <span> • </span>}
          {data.subregion && <span>{data.subregion}</span>}
        </p>
      )}

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-3">
          {data.district_code && (
            <InfoCard label="District Code" value={data.district_code} />
          )}
          {data.area_km2 && (
            <InfoCard label="Area" value={`${data.area_km2.toLocaleString()} km²`} />
          )}
        </div>

        {/* Population Data */}
        {data.population && (
          <InfoCard 
            label="Population (Census)" 
            value={data.population.toLocaleString()}
            isLarge={true}
          />
        )}

        {/* Voter Statistics Component */}
        {voterStats && Object.keys(voterStats).length > 0 && (
          <VoterStatisticsCard stats={voterStats} level="district" />
        )}

        {/* Quick Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {voterStats.constituency_count > 0 && (
            <DrillDownButton
              toLevel="constituencies"
              count={voterStats.constituency_count}
              label="Constituencies"
              identifier={data.id}
              metadata={{ districtName: data.name }}
            />
          )}
          
          {voterStats.subcounty_count > 0 && (
            <DrillDownButton
              toLevel="subcounties"
              count={voterStats.subcounty_count}
              label="Subcounties"
              identifier={data.id}
              metadata={{ districtName: data.name }}
            />
          )}
        </div>

        {/* Navigable Constituencies List */}
        {data.constituencies && data.constituencies.length > 0 && (
          <InfoCard label={`Constituencies (${data.constituencies.length})`}>
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {data.constituencies.map((constituency) => (
                  <NavigableListItem
                    key={constituency.id}
                    level="constituencies"
                    item={{
                      id: constituency.id,
                      name: constituency.name,
                      code: constituency.constituency_code
                    }}
                    showCode={true}
                  />
                ))}
              </ul>
            </div>
          </InfoCard>
        )}

        {/* Top Constituencies by Voters (navigable) */}
        {voterStats?.top_constituencies && voterStats.top_constituencies.length > 0 && (
          <InfoCard label="Top Constituencies by Voter Registration">
            <ul className="space-y-1">
              {voterStats.top_constituencies.map((const_data, index) => (
                <NavigableListItem
                  key={const_data.constituency_id}
                  level="constituencies"
                  item={{
                    id: const_data.constituency_id,
                    name: const_data.constituency_name,
                    code: const_data.constituency_code,
                    voters: const_data.voters
                  }}
                  index={index + 1}
                  showVoters={true}
                  showCode={false}
                />
              ))}
            </ul>
          </InfoCard>
        )}

        {/* Voter Density Metrics */}
        {voterStats?.voters_per_km2 && (
          <div className="grid grid-cols-2 gap-3">
            <InfoCard 
              label="Voter Density" 
              value={`${Math.round(voterStats.voters_per_km2)} per km²`} 
            />
            {voterStats?.polling_station_stats?.median_voters && (
              <InfoCard 
                label="Median Station Size" 
                value={`${Math.round(voterStats.polling_station_stats.median_voters)} voters`} 
              />
            )}
          </div>
        )}
      </div>
    </PanelContainer>
  );
};

export default DistrictInfoPanel;
