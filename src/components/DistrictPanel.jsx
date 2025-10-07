import { useAdminData } from "../hooks/useAdminData";

const DistrictPanel = ({ selectedFeature }) => {

  // Only fetch admin data for districts/subcounties, NOT for campaign stops
  const shouldFetchAdminData = selectedFeature?.layerType && 
                                selectedFeature.layerType !== 'campaign-stop';

  const { data: dbData, loading, error } = useAdminData(
    shouldFetchAdminData ? selectedFeature.layerType : null,
    shouldFetchAdminData ? selectedFeature.identifier : null,
    selectedFeature?.identifierType || 'name'
  );

  if (!selectedFeature) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Feature Information
        </h2>
        <p className="text-gray-500 dark:text-gray-400 italic">
          Click on a district, subcounty, or campaign stop to view details
        </p>
      </div>
    );
  }

  const { layerType } = selectedFeature;

  // Render campaign stop information (no DB query needed)
  if (layerType === 'campaign-stop') {
    const { candidateName, candidateColor, partyName, partyAbbreviation, stopData, stopIndex, totalStops } = selectedFeature;
    
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 overflow-y-auto">
        <div className="mb-4 flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: candidateColor }}
          ></div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Campaign Stop
          </span>
        </div>

        {/* Candidate Name */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {candidateName}
        </h2>

        {/* Party Name (if available) */}
        {partyName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {partyName} {partyAbbreviation && `(${partyAbbreviation})`}
          </p>
        )}

        {/* Stop Progress */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Stop {stopIndex} of {totalStops} in campaign tour
        </p>

        <div className="space-y-4">
          {/* District */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              District
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {stopData.districtName}
            </p>
          </div>

          {/* Campaign Date */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Campaign Date
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {new Date(stopData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading/error states for admin data
  if (loading) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Loading...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 italic">
          Fetching data from the database...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
          Error
        </h2>
        <p className="text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (!dbData) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          No Data
        </h2>
        <p className="text-gray-500 dark:text-gray-400 italic">
          No information available for this feature.
        </p>
      </div>
    );
  }

  // Render district information
  if (layerType === 'districts') {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 overflow-y-auto">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            District
          </span>
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
        </div>
      </div>
    );
  }

  // Render subcounty information
  if (layerType === 'subcounties') {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 overflow-y-auto">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Subcounty
          </span>
        </div>

        {/* Subcounty Name from DB */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {dbData.name}
        </h2>

        {/* District (if available) */}
        {dbData.district_id && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            District ID: {dbData.district_id}
          </p>
        )}

        <div className="space-y-4">
          {/* Subcounty Code */}
          {dbData.subcounty_code && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Subcounty Code
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {dbData.subcounty_code}
              </p>
            </div>
          )}

          {/* Registered Voters */}
          {dbData.registered_voters_2021 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Registered Voters
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
        </div>
      </div>
    );
  }

  return null;
};

export default DistrictPanel;
