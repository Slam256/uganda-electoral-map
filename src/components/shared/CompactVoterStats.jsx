// A more compact version for smaller panels
export const CompactVoterStats = ({ totalVoters, pollingStations, growthRate }) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div className="flex-1">
        <p className="text-xs text-gray-600 dark:text-gray-400">Voters</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {formatNumber(totalVoters)}
        </p>
      </div>
      
      {pollingStations && (
        <div className="flex-1 border-l border-gray-300 dark:border-gray-600 pl-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Stations</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatNumber(pollingStations)}
          </p>
        </div>
      )}
      
      {growthRate !== null && growthRate !== undefined && (
        <div className="flex-1 border-l border-gray-300 dark:border-gray-600 pl-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Growth</p>
          <p className={`text-lg font-bold ${
            growthRate > 0 ? 'text-green-600 dark:text-green-400' : 
            growthRate < 0 ? 'text-red-600 dark:text-red-400' : 
            'text-gray-600 dark:text-gray-400'
          }`}>
            {growthRate > 0 ? '+' : ''}{growthRate}%
          </p>
        </div>
      )}
    </div>
  );
};