import { useNavigation } from '../../context/NavigationContext';

/**
 * NavigableLink - Makes administrative unit names clickable for navigation
 */
export const NavigableLink = ({ 
  level, 
  identifier, 
  children, 
  className = "", 
  metadata = {} 
}) => {
  const { navigateTo } = useNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigateTo(level, identifier, 'name', metadata);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                  hover:underline transition-colors cursor-pointer text-left ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * NavigableListItem - For lists of navigable items (constituencies, parishes, etc.)
 */
export const NavigableListItem = ({ 
  level, 
  item, 
  showCode = true,
  showVoters = false,
  index = null 
}) => {
  const { navigateTo } = useNavigation();

  const handleClick = () => {
    navigateTo(
      level, 
      item.name || item[`${level.slice(0, -1)}_name`], 
      'name',
      {
        id: item.id || item[`${level.slice(0, -1)}_id`],
        name: item.name || item[`${level.slice(0, -1)}_name`],
        code: item.code || item[`${level.slice(0, -1)}_code`]
      }
    );
  };

  return (
    <li 
      className="flex items-center justify-between py-2 px-3 rounded-lg 
                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 flex-1">
        {index !== null && (
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-6">
            {index}.
          </span>
        )}
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          {item.name || item[`${level.slice(0, -1)}_name`]}
        </span>
        {showCode && item.code && (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            ({item.code || item[`${level.slice(0, -1)}_code`]})
          </span>
        )}
      </div>
      
      {showVoters && item.voters && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {item.voters.toLocaleString()} voters
        </span>
      )}
      
      <svg className="w-4 h-4 ml-2 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </li>
  );
};

/**
 * NavigableGrid - For grid layouts of navigable items
 */
export const NavigableGrid = ({ level, items, columns = 2 }) => {
  const { navigateTo } = useNavigation();

  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {items.map((item) => (
        <button
          key={item.id || item.name}
          onClick={() => navigateTo(level, item.name, 'name', { 
            id: item.id,
            name: item.name,
            code: item.code 
          })}
          className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                     rounded-lg hover:border-blue-500 dark:hover:border-blue-400 
                     hover:shadow-md transition-all group"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {item.name}
          </p>
          {item.code && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {item.code}
            </p>
          )}
          {item.voters && (
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2">
              {item.voters.toLocaleString()} voters
            </p>
          )}
        </button>
      ))}
    </div>
  );
};

/**
 * DrillDownButton - Quick navigation button to go deeper
 */
export const DrillDownButton = ({ 
  toLevel, 
  count, 
  label,
  identifier,
  metadata = {}
}) => {
  const { navigateTo } = useNavigation();

  if (!count || count === 0) return null;

  const handleClick = () => {
    // This would typically open a list view or navigate to the first item
    navigateTo(toLevel, identifier, 'parent', metadata);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between p-3 
                 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
                 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {count}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Click to explore
          </p>
        </div>
      </div>
      
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
};
