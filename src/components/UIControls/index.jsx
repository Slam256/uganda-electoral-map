import ThemeToggle from '../ThemeToggle';

/**
 * UI Controls Container
 * Groups all UI control buttons together
 */
const UIControls = ({ onHelpClick }) => {
  return (
    <>
      {/* Theme toggle - top right */}
      <div className="absolute top-5 right-3 z-[1000]">
        <ThemeToggle />
      </div>

      {/* Help Button - top left */}
      <div className="z-[1000] left-2 absolute top-14">
        <button
          onClick={onHelpClick}
          className="p-1.5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded"
          aria-label="Help"
          title="Help"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default UIControls;