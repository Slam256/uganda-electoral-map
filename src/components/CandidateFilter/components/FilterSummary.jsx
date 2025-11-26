import React from 'react';
import { Map } from 'lucide-react';
import Avatar from '../../shared/Avatar';
import { getCandidatePhoto } from '../../../utils/candidatePhotos';
import { formatDateDisplay } from '../CandidateFilter.model';

/**
 * Filter Summary Component
 * Shows a summary of active filters in collapsed state
 */
const FilterSummary = ({
  selectedCandidate,
  visibleCandidates,
  hasDateFilter,
  startDate,
  endDate,
  onExpand
}) => {
  return (
    <button
      onClick={onExpand}
      className={`bg-white dark:bg-gray-800 rounded-[32px] shadow-lg ${selectedCandidate ? 'pl-[10px] pr-2' : 'p-2'} py-2 flex items-center gap-0 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 ${hasDateFilter ? 'min-w-[300px]' : ''}`}
    >
      {!selectedCandidate && <Map className="w-5 h-5 text-gray-600 dark:text-gray-300" />}

      {selectedCandidate && (
        <Avatar
          src={getCandidatePhoto(selectedCandidate.candidateName)}
          alt={selectedCandidate.candidateName}
          fallbackColor={selectedCandidate.color}
          statusColor={selectedCandidate.color}
          size="sm"
        />
      )}

      <span className="font-medium text-gray-800 dark:text-gray-100">
        Campaign Routes
      </span>

      {/* Show count if multiple candidates are visible */}
      {visibleCandidates.length > 1 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          ({visibleCandidates.length} active)
        </span>
      )}

      {/* Show active date filter */}
      {hasDateFilter && (
        <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-[12px]">
          <svg className="w-3 h-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-blue-700 dark:text-blue-300">
            {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
          </span>
        </div>
      )}
    </button >
  );
};

export default FilterSummary;