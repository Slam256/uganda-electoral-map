const HelpModal = ({ isOpen, onClose }) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome to the District Map!</h2>
                <p className="text-blue-100 text-sm">Interactive Uganda electoral boundaries & campaign tracking</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Start */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Quick Start Guide
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Explore Districts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click any district or subcounty to view population, voters, and administrative details</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">View Campaign Routes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click the "Campaign Routes" button at the top of the map to see candidate tour stops</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Filter Campaign Route by Candidate</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Select individual candidates to see their specific campaign trail</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Search Districts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use the search bar to quickly find districts by name</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Map Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex gap-2">
                <span className="text-xl">🗺️</span>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Layer Control</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Toggle districts/subcounties visibility</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Detailed Statistics</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Population & voter registration data</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Campaign Stops</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Numbered markers show tour sequence</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className="text-xl">🌓</span>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Dark Mode</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Toggle via button in top-right corner</p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Map Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 border-2 border-blue-500 bg-blue-100/50 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">District Boundary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 border-2 border-green-500 bg-green-100/50 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Subcounty Boundary</span>
              </div>
              {/* <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                  5
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Campaign Stop (number shows sequence)</span>
              </div> */}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <span>💡</span>
              Pro Tips
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Use mouse wheel to zoom in/out</li>
              <li>• Click and drag to pan around the map</li>
              <li>• Select one candidate at a time to avoid clutter</li>
              <li>• Click campaign stops to see visit dates and details</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-750">
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    localStorage.setItem('hideWelcomeModal', 'true');
                  } else {
                    localStorage.removeItem('hideWelcomeModal');
                  }
                }}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              Don't show this again
            </label>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Got it, let's explore! 🚀
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpModal;