export const VoterStatisticsCard = ({ stats, level = "district" }) => {
  if (!stats) return null;

  const formatNumber = (num) => {
    if (!num && num !== 0) return '-';
    return num.toLocaleString();
  };

  // Accept multiple possible field names (some panels use older keys)
  const growthValue = stats.voter_growth_percentage ?? stats.growth_rate ?? stats.growthRate ?? null;
  const totalRegisteredValue = stats.total_voters_2024 ?? stats.total_voters ?? stats.total_registered ?? stats.registered ?? null;
  const pollingStationsValue = stats.polling_station_count ?? stats.polling_stations ?? stats.pollingStations ?? null;

  const formatGrowthRate = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const formatted = `${value > 0 ? '+' : ''}${value}%`;
    const colorClass = value > 0 ? 'bg-green-500 text-white' : value < 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800';
    return (
      <span className={`inline-block rounded-full text-xs font-semibold px-3 py-1 align-middle ${colorClass}`}>
        {formatted}
      </span>
    );
  };

  return (
    <div className="space-y-2">
      {/* Voter growth analysis row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-base font-semibold text-gray-900 dark:text-white leading-tight">
            Voter growth analysis
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Growth rate</div>
        </div>
        {formatGrowthRate(growthValue)}
      </div>

      {/* Data rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Total registered</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{formatNumber(totalRegisteredValue)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Polling stations</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{formatNumber(pollingStationsValue)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Average voters per station</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{formatNumber(stats.avg_voters_per_station)}</span>
        </div>
      </div>
    </div>
  );
};