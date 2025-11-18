'use client';

import { X, MousePointer2, Signpost, CircleUserRound, CalendarRange, Search } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header with close button */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome to Canvas
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              An interactive map visualizing Uganda's electoral landscape for the 2026 general elections.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-4"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Feature cards */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          

          {/* Feature 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 pt-1">
              <MousePointer2 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Explore districts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click any district or subcounty to view population, voters, and constituency details
              </p>
            </div>
          </div>


          {/* Feature 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 pt-1">
              <Signpost className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                View Campaign Routes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click the "Campaign Routes" button at the top of the map to see candidate tour stops
              </p>
            </div>
          </div>


          {/* Feature 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 pt-1">
              <CircleUserRound className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Filter Campaign Route by Candidate
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Select individual candidates to see their specific campaign trail.
              </p>
            </div>
          </div>


          {/* Feature 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 pt-1">
              <CalendarRange className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Filter Campaign Stops by Date
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Select date ranges to see stops within specific timeframes
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 pt-1">
              <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Search Districts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use the search bar to quickly find districts by name
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              autoFocus={false}
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.setItem('hideWelcomeModal', 'true');
                } else {
                  localStorage.removeItem('hideWelcomeModal');
                }
              }}
              className="peer size-5 shrink-0 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-500 shadow-xs transition-all cursor-pointer accent-blue-600 dark:accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900 hover:border-gray-400 dark:hover:border-gray-500 checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-600 dark:checked:border-blue-600"
            />
            Don't show this again
          </label>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-sm flex-shrink-0"
          >
            Explore
          </button>
        </div>

      </div>
    </div>
  );
};

export default HelpModal;
