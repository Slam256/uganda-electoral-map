import React from 'react';
import Avatar from '../../shared/Avatar';
import { getCandidatePhoto } from '../../../utils/candidatePhotos';

/**
 * Individual Candidate List Item
 * Pure presentational component for a single candidate
 */
const CandidateListItem = ({ 
  candidate, 
  isSelected, 
  stopsInRange, 
  hasDateFilter,
  onSelect 
}) => {
  const totalStops = candidate.stops.length;
  
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-2 ${
        isSelected 
          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-transparent'
      }`}
    >
      <input
        type="radio"
        name="candidate"
        checked={isSelected}
        onChange={() => onSelect(candidate.candidateId)}
        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />

      <Avatar
        src={getCandidatePhoto(candidate.candidateName)}
        alt={candidate.candidateName}
        fallbackColor={candidate.color}
        statusColor={candidate.color}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {candidate.candidateName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {hasDateFilter ? (
            <>
              <span className={stopsInRange === 0 ? 'text-red-500 dark:text-red-400' : ''}>
                {stopsInRange} of {totalStops} stops
              </span>
              {stopsInRange > 0 && ` in range`}
            </>
          ) : (
            `${totalStops} stops`
          )}
          {` • ${candidate.candidateShortCode}`}
        </p>
      </div>
    </label>
  );
};

export default CandidateListItem;
