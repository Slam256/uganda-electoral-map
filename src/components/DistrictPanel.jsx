import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

const DistrictPanel = ({ selectedFeature }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: dbData } = useAdminData(
    selectedFeature?.layerType,
    selectedFeature?.identifier,
    selectedFeature?.identifierType || 'name'
  );

  // Collapsed state - small tab
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
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
  }

  // Expanded state - no selection
  if (!selectedFeature) {
    return (
      <div className="w-[400px] max-h-[80vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Feature Information
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Collapse panel"
          >
            ◀
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 italic">
          Click on a district or subcounty to view its details
        </p>
      </div>
    );
  }

  const { layerType } = selectedFeature;

  // Loading state
  if (!dbData) {
    return (
      <div className="w-[400px] max-h-[80vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Loading...
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Collapse panel"
          >
            ◀
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 italic">
          Fetching data from the database...
        </p>
      </div>
    );
  }

  // Render district information
  if (layerType === 'districts') {
    return (
      <div className="w-[400px] max-h-[80vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            District
          </span>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Collapse panel"
          >
            ◀
          </button>
        </div>

        {/* District Name from DB */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {dbData.name}
        </h2>

        <div className="space-y-4">
          {/* District Code */}
          {dbData.district_code && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                District Code
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {dbData.district_code}
              </p>
            </div>
          )}

          {/* Registered Voters */}
          {dbData.registered_voters_2021 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Registered Voters (2021)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dbData.registered_voters_2021.toLocaleString()}
              </p>
            </div>
          )}

          {/* Population */}
          {dbData.population && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Population
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dbData.population.toLocaleString()}
              </p>
            </div>
          )}

          {/* Constituencies */}
          {dbData.constituencies && dbData.constituencies.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Constituencies
              </p>
              <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
                {dbData.constituencies.map((constituency) => (
                  <li key={constituency.id}>{constituency.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render subcounty information
  if (layerType === 'subcounties') {
    return (
      <div className="w-[400px] max-h-[80vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Subcounty
          </span>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Collapse panel"
          >
            ◀
          </button>
        </div>

        {/* Subcounty Name from DB */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {dbData.name}
        </h2>

        {/* District (if available) */}
        {dbData.district && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            District: {dbData.district.name}
          </p>
        )}

        <div className="space-y-4">
          {/* County */}
          {dbData.county && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                County
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {dbData.county.name}
              </p>
            </div>
          )}

          {/* Population */}
          {dbData.population && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Population
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dbData.population.toLocaleString()}
              </p>
            </div>
          )}
        </div>

      </div>
    );
  }


  return null;
};

export default DistrictPanel;