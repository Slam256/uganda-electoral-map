import { PanelContainer } from "../shared/PanelContainer";
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { VoterStatisticsCard } from "../shared/VoterStatisticsCard";
import { CompactVoterStats } from "../shared/CompactVoterStats";

const SubcountyInfoPanel = ({ data, onCollapse }) => {
  const voterStats = data?.voterStats || {};

  return (
    <PanelContainer>
      <div className="mb-4 flex items-center gap-3">
        <Badge type="subcounty" text="Subcounty" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {data.name}
      </h2>

      {/* Parent District Info */}
      {data.district && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          District: <span className="font-medium">{data.district.name}</span>
          {data.district.district_code && (
            <span className="ml-2 text-xs font-mono">({data.district.district_code})</span>
          )}
        </p>
      )}

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-3">
          {data.subcounty_code && (
            <InfoCard label="Subcounty Code" value={data.subcounty_code} />
          )}
          {voterStats.parish_count && (
            <InfoCard label="Parishes" value={voterStats.parish_count} />
          )}
        </div>

        {/* Compact Voter Stats for quick overview */}
        {voterStats.total_voters_2024 && (
          <CompactVoterStats
            totalVoters={voterStats.total_voters_2024}
            pollingStations={voterStats.polling_station_count}
            growthRate={voterStats.voter_growth_percentage}
          />
        )}

        {/* Population Data */}
        {data.population && (
          <InfoCard
            label="Population (Census)"
            value={data.population.toLocaleString()}
            isLarge={true}
          />
        )}

        {/* Detailed Voter Statistics */}
        {voterStats && Object.keys(voterStats).length > 0 && (
          <VoterStatisticsCard stats={voterStats} level="subcounty" />
        )}

        {/* Top Parishes by Voter Count */}
        {voterStats.top_parishes && voterStats.top_parishes.length > 0 && (
          <InfoCard label="Top Parishes by Voter Registration">
            <div className="space-y-2">
              {voterStats.top_parishes.map((parish, index) => (
                <div
                  key={parish.parish_id}
                  className="flex items-center justify-between py-2 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {parish.parish_name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {parish.voters ? parish.voters.toLocaleString() : '0'} voters
                  </span>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Voter Registration Rate */}
        {voterStats.voter_registration_rate && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  Voter Registration Rate
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Percentage of population registered to vote
                </p>
              </div>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {voterStats.voter_registration_rate}%
              </div>
            </div>
          </div>
        )}

        {/* Statistics Summary */}
        {voterStats.polling_station_count > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label="Avg Voters/Station"
              value={voterStats.avg_voters_per_station?.toLocaleString() || '0'}
            />
            <InfoCard
              label="Total Stations"
              value={voterStats.polling_station_count?.toLocaleString() || '0'}
            />
          </div>
        )}
      </div>
    </PanelContainer>
  );
};

export default SubcountyInfoPanel;