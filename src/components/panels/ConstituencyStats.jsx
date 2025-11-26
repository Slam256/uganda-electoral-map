import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useConstituencyStats } from '../../hooks/useConstituencyStats';

const ConstituencyStats = ({ districtId, onBack }) => {
  const { constituencies, loading, error } = useConstituencyStats(districtId);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <p className="text-gray-500">Loading constituencies...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <p className="text-red-500">Error: {error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>

      {/* Header with total */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 gap-2">
     
          <button onClick={onBack}  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Constituencies
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-12">
            Share of district's registered voters
          </span>
      </div>

      {/* Bar chart */}
      <div className="space-y-3">
        {constituencies
          .sort((a, b) => (b.total_voters_2024 || 0) - (a.total_voters_2024 || 0)) // Sort by size
          .map((c) => {
            const totalDistrictVoters = constituencies.reduce((sum, x) => sum + (x.total_voters_2024 || 0), 0);
            const percentage = totalDistrictVoters > 0
              ? ((c.total_voters_2024 || 0) / totalDistrictVoters) * 100
              : 0;

            return (
              <div key={c.constituency_id} className="space-y-1.5">
                {/* Name and stats */}
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {c.constituency_name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {c.total_voters_2024?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
                  />
                </div>

                {/* Secondary info */}
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  {/* <span>{c.constituency_code}</span> */}
                  <span>{c.polling_station_count} polling stations</span>
                </div>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
};

export default ConstituencyStats;