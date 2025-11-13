import { PanelContainer } from "../shared/PanelContainer";
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { VoterStatisticsCard, CompactVoterStats } from "../shared/VoterStatisticsCard";

const ConstituencyInfoPanel = ({ data, onCollapse }) => {
  const voterStats = data?.voterStats || {};
  
  return (
    <PanelContainer>
      <div className="mb-4 flex items-center gap-3">
        <Badge type="constituency" text="Constituency" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {data.name || voterStats.constituency_name}
      </h2>

      {/* District Info */}
      {(data.district || voterStats.district_name) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          District: <span className="font-medium">{data.district?.name || voterStats.district_name}</span>
          {(data.district?.district_code || voterStats.district_code) && (
            <span className="ml-2 text-xs font-mono">
              ({data.district?.district_code || voterStats.district_code})
            </span>
          )}
        </p>
      )}

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-3">
          {data.constituency_code && (
            <InfoCard label="Constituency Code" value={data.constituency_code} />
          )}
          {voterStats.subcounty_count && (
            <InfoCard label="Subcounties" value={voterStats.subcounty_count} />
          )}
        </div>

        {/* Compact Voter Stats */}
        {voterStats.total_voters_2024 && (
          <CompactVoterStats 
            totalVoters={voterStats.total_voters_2024}
            pollingStations={voterStats.polling_station_count}
          />
        )}

        {/* Detailed Voter Statistics */}
        {voterStats && Object.keys(voterStats).length > 0 && (
          <VoterStatisticsCard stats={voterStats} level="constituency" />
        )}

        {/* Administrative Units */}
        {(voterStats.parish_count || voterStats.subcounty_count) && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Administrative Coverage
            </h3>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              {voterStats.subcounty_count && (
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {voterStats.subcounty_count}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Subcounties</p>
                </div>
              )}
              
              {voterStats.parish_count && (
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {voterStats.parish_count}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Parishes</p>
                </div>
              )}
              
              {voterStats.polling_station_count && (
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {voterStats.polling_station_count}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Stations</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Subcounties by Voter Count */}
        {voterStats.top_subcounties && voterStats.top_subcounties.length > 0 && (
          <InfoCard label="Top Subcounties by Voter Registration">
            <div className="space-y-2">
              {voterStats.top_subcounties.map((subcounty, index) => (
                <div 
                  key={subcounty.subcounty_id}
                  className="flex items-center justify-between py-2 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {subcounty.subcounty_name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {subcounty.voters?.toLocaleString() || '0'} voters
                  </span>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Polling Station Distribution */}
        {voterStats.median_voters_station && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-3">
              Polling Station Analysis
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Median Size</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(voterStats.median_voters_station).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Average Size</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.avg_voters_per_station?.toLocaleString() || '0'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Smallest</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.min_voters_station?.toLocaleString() || '0'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Largest</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.max_voters_station?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PanelContainer>
  );
};

export default ConstituencyInfoPanel;
