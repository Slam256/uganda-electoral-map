export const VoterStatisticsCard = ({ stats, level = 'district' }) => {
  if (!stats) return null;

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

   const formatPercentage = (value, isGrowth = false) => {
    if (value === null || value === undefined) return 'N/A';
    
    const formatted = `${value > 0 ? '+' : ''}${value}%`;
    
    if (isGrowth) {
      const colorClass = value > 0 
        ? 'text-green-600 dark:text-green-400' 
        : value < 0 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-gray-600 dark:text-gray-400';
      
      return <span className={colorClass}>{formatted}</span>;
    }
    
    return formatted;
  };

  return (
    <div className="space-y-4">
      {/* 2024 Voter Registration */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wide">
          2024 Voter Registration
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Registered</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatNumber(stats.total_voters_2024 || stats.total_voters)}
            </p>
          </div>
          
          {stats.polling_station_count && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Polling Stations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(stats.polling_station_count)}
              </p>
            </div>
          )}
        </div>

        {stats.avg_voters_per_station && (
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Average voters per station: <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNumber(stats.avg_voters_per_station)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Year-over-Year Comparison */}
      {(stats.voter_growth_percentage !== null || stats.district_voters_2021) && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Voter Growth Analysis
          </h3>

          <div className="space-y-2">
            {stats.district_voters_2021 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">2021 Registered</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatNumber(stats.district_voters_2021)}
                </span>
              </div>
            )}
            
            {stats.voter_growth_percentage !== null && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</span>
                <span className="text-sm font-bold">
                  {formatPercentage(stats.voter_growth_percentage, true)}
                </span>
              </div>
            )}

            {stats.voter_registration_rate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Registration Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.voter_registration_rate}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Administrative Units Count */}
      {level === 'district' && (stats.constituency_count || stats.subcounty_count || stats.parish_count) && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Administrative Units
          </h3>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            {stats.constituency_count && (
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.constituency_count}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Constituencies</p>
              </div>
            )}
            
            {stats.subcounty_count && (
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.subcounty_count}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Subcounties</p>
              </div>
            )}
            
            {stats.parish_count && (
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.parish_count}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Parishes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Areas by Voters */}
      {(stats.top_parishes || stats.top_subcounties || stats.top_constituencies) && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Top Areas by Voter Count
          </h3>
          
          <div className="space-y-2">
            {(stats.top_parishes || stats.top_subcounties || stats.top_constituencies || [])
              .slice(0, 5)
              .map((area, index) => (
                <div key={area.parish_id || area.subcounty_id || area.constituency_id} 
                     className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {index + 1}. {area.parish_name || area.subcounty_name || area.constituency_name}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatNumber(area.voters)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};