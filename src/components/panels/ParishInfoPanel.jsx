import { useState } from 'react';
import { PanelContainer } from "../shared/PanelContainer";
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { InfoCard } from "../shared/InfoCard";
import { CompactVoterStats } from "../shared/CompactVoterStats";

const ParishInfoPanel = ({ data, onCollapse }) => {
  const [showAllStations, setShowAllStations] = useState(false);
  const voterStats = data?.voterStats || {};
  
  // Parse polling stations from JSONB array
  const pollingStations = voterStats.polling_stations_detail || [];
  const displayLimit = 5;
  const hasMoreStations = pollingStations.length > displayLimit;
  
  const stationsToShow = showAllStations 
    ? pollingStations 
    : pollingStations.slice(0, displayLimit);

  return (
    <PanelContainer>
      <div className="mb-4 flex items-center gap-3">
        <Badge type="parish" text="Parish" />
        <CollapseButton onClick={onCollapse} />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {data.name || voterStats.parish_name}
      </h2>

      {/* Parent Info - All Navigable */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
        {voterStats.subcounty_name && (
          <p>
            Subcounty: {' '}
          </p>
        )}
        
        {voterStats.constituency_name && (
          <p>
            Constituency: {' '}
          </p>
        )}
        
        {voterStats.district_name && (
          <p>
            District: {' '}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Parish Code */}
        {(data.parish_code || voterStats.parish_code) && (
          <InfoCard 
            label="Parish Code" 
            value={data.parish_code || voterStats.parish_code} 
          />
        )}

        {/* Voter Statistics Summary */}
        {voterStats.total_voters && (
          <CompactVoterStats 
            totalVoters={voterStats.total_voters}
            pollingStations={voterStats.polling_station_count}
          />
        )}

        {/* Station Distribution Statistics */}
        {voterStats.polling_station_count > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Polling Station Distribution
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.avg_voters_per_station?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
              </div>
              
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.max_voters_station?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Largest</p>
              </div>
              
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.min_voters_station?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Smallest</p>
              </div>
              
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {voterStats.polling_station_count}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Stations</p>
              </div>
            </div>
          </div>
        )}

        {/* Polling Stations List (Not navigable - terminal level) */}
        {pollingStations.length > 0 && (
          <InfoCard label={`Polling Stations (${pollingStations.length})`}>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stationsToShow.map((station, index) => (
                <div 
                  key={station.id || index}
                  className="flex items-center justify-between py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {station.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Code: {station.code}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {station.voters?.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">voters</p>
                  </div>
                  
                  {/* Visual indicator for station size */}
                  <div className="ml-3">
                    <div className={`w-2 h-8 rounded-full ${
                      station.voters > voterStats.avg_voters_per_station 
                        ? 'bg-green-500' 
                        : station.voters < voterStats.avg_voters_per_station * 0.5 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-400'
                    }`} title={
                      station.voters > voterStats.avg_voters_per_station 
                        ? 'Above average' 
                        : station.voters < voterStats.avg_voters_per_station * 0.5 
                          ? 'Below average' 
                          : 'Average'
                    }></div>
                  </div>
                </div>
              ))}
              
              {/* Show More/Less Button */}
              {hasMoreStations && (
                <button
                  onClick={() => setShowAllStations(!showAllStations)}
                  className="w-full mt-3 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                >
                  {showAllStations 
                    ? '↑ Show Less' 
                    : `↓ Show ${pollingStations.length - displayLimit} More Stations`}
                </button>
              )}
            </div>
          </InfoCard>
        )}

        {/* Summary Card */}
        {voterStats.total_voters && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Total Registered Voters
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Across all {voterStats.polling_station_count} polling stations
                </p>
              </div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {voterStats.total_voters.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </PanelContainer>
  );
};

export default ParishInfoPanel;
