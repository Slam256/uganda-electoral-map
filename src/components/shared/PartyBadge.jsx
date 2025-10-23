export const PartyBadge = ({ party, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // Default color for independents or missing party
  const color = party?.color || '#808080';
  const name = party?.name || 'Independent';
  const abbreviation = party?.abbreviation || 'IND';

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`${sizeClasses[size]} rounded-full flex-shrink-0`}
        style={{ backgroundColor: color }}
        title={name}
      />
      <span className={`${textSizeClasses[size]} text-gray-700 dark:text-gray-300`}>
        {abbreviation === 'INDEPENDENT' ? name : abbreviation}
      </span>
    </div>
  );
};