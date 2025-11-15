import React from 'react';
import { useNavigation } from '../context/NavigationContext';

/**
 * Breadcrumb Navigation Component
 * Shows the current navigation path and allows clicking to navigate back
 */
export const Breadcrumb = () => {
  const { getBreadcrumbs, navigateTo, navigateBack, canGoBack } = useNavigation();
  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Back Button */}
      {canGoBack && (
        <button
          onClick={navigateBack}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Go back"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}

      {/* Breadcrumb Trail */}
      <nav className="flex items-center text-sm">
        <button
          onClick={() => navigateTo(null, null)} // Go to map root
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Uganda
        </button>

        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.level}-${crumb.identifier}`}>
            <svg className="w-4 h-4 mx-1 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            
            {crumb.isCurrent ? (
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {crumb.name}
              </span>
            ) : (
              <button
                onClick={() => navigateTo(crumb.level, crumb.identifier, 'name')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {crumb.name}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

/**
 * Compact Breadcrumb for mobile/small screens
 */
export const CompactBreadcrumb = () => {
  const { currentSelection, navigateBack, canGoBack } = useNavigation();

  if (!currentSelection) return null;

  const levelLabels = {
    districts: 'District',
    constituencies: 'Constituency',
    subcounties: 'Subcounty',
    parishes: 'Parish'
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {canGoBack && (
        <button
          onClick={navigateBack}
          className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Go back"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <div className="text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          {levelLabels[currentSelection.adminLevel] || 'Location'}:
        </span>
        <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
          {currentSelection.metadata?.name || currentSelection.identifier}
        </span>
      </div>
    </div>
  );
};
