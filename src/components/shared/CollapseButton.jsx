export const CollapseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1"
    aria-label="Collapse panel"
  >
    ◀
  </button>
);