const ConstituencyListItem = ({ constituency, candidateCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
          {constituency.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'} competing
        </p>
      </div>
      <svg 
        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 ml-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export default ConstituencyListItem;