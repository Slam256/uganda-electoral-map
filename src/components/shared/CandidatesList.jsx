import { CandidateCard } from './CandidateCard';

const CandidatesList = ({ candidates, category, compact = true, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading candidates...</p>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No candidates nominated yet
        </p>
      </div>
    );
  }

  const categoryLabel = category === 'DWMP' ? 'Nominated District Woman MP' : 'Nominated Member of Parliament';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {categoryLabel}
        </h3>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
          {candidates.length} {candidates.length === 1 ? 'candidate' : 'candidates'}
        </span>
      </div>
      <div className="space-y-1">
        {candidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate}
            compact={compact}
            showSymbol={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CandidatesList;