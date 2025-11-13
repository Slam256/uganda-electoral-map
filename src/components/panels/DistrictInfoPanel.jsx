import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";
import { VoterStatisticsCard } from "../shared/VoterStatisticsCard";

const DistrictInfoPanel = ({ data, onCollapse }) => {
  // Extract voter statistics if available
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

        {/* Legacy 2021 Data (if no voter stats available) */}
        {!voterStats?.total_voters_2024 && data.registered_voters_2021 && (
          <InfoCard 
            label="Registered Voters (2021)" 
            value={data.registered_voters_2021.toLocaleString()}
            isLarge={true}
          />
        )}

        {/* Constituencies List */}
        {data.constituencies && data.constituencies.length > 0 && (
          <InfoCard label={`Constituencies (${data.constituencies.length})`}>
            <div className="max-h-48 overflow-y-auto">
              <ul className="space-y-2">
                {data.constituencies.map((constituency) => (
                  <li 
                    key={constituency.id} 
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-900 dark:text-gray-100">
                      {constituency.name}
                    </span>
                    {constituency.constituency_code && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {constituency.constituency_code}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </InfoCard>
        )}

        {/* Top Constituencies by Voters (from voter stats) */}
        {voterStats?.top_constituencies && voterStats.top_constituencies.length > 0 && (
          <InfoCard label="Top Constituencies by Voter Registration">
            <div className="space-y-2">
              {voterStats.top_constituencies.map((const_data, index) => (
                <div 
                  key={const_data.constituency_id}
                  className="flex items-center justify-between py-2 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {const_data.constituency_name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {const_data.voters.toLocaleString()} voters
                  </span>
                </div>
              ))}
            </div>
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