import { PartyBadge } from './PartyBadge';

export const CandidateCard = ({ candidate, showSymbol = true, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {candidate.full_name}
          </p>
          <div className="mt-0.5">
            <PartyBadge party={candidate.political_parties} size="sm" />
          </div>
        </div>
        {showSymbol && candidate.ballot_symbol && (
          <span className="ml-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded flex-shrink-0">
            {candidate.ballot_symbol}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {candidate.full_name}
          </h4>
          <PartyBadge party={candidate.political_parties} size="md" />
        </div>
        {showSymbol && candidate.ballot_symbol && (
          <div className="ml-3 text-center flex-shrink-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Symbol</p>
            <span className="text-sm px-3 py-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-500">
              {candidate.ballot_symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};