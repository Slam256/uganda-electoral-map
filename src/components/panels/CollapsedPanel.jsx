const CollapsedPanel = ({ selectedFeature, dbData, onExpand }) => (
  <button
    onClick={onExpand}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center gap-2">
      <span className="text-lg">📍</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {selectedFeature ? dbData?.name || 'Loading...' : 'Click map to view info'}
      </span>
      <span className="text-gray-400">▶</span>
    </div>
  </button>
);

export default CollapsedPanel;