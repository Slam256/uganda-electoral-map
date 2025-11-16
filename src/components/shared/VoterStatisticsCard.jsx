export const VoterStatisticsCard = ({ stats }) => {
  if (!stats) return null;

  const formatNumber = (num) => {
    if (!num && num !== 0) return '-';
    return num.toLocaleString();
  };

  const formatGrowthRate = (value) => {
    if (value === null || value === undefined) return null;
    const formatted = `${value > 0 ? '+' : ''}${value}%`;
    return (
      <span className="inline-block rounded-full bg-green-500/90 text-white text-xs font-semibold px-3 py-1 align-middle">
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
        {formatGrowthRate(stats.growth_rate)}
      </div>

      {/* Data rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Total registered</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{formatNumber(stats.total_registered)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Polling stations</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{formatNumber(stats.polling_stations)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Average voters per station</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{formatNumber(stats.avg_voters_per_station)}</span>
        </div>
      </div>
    </div>
  );
};