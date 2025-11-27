/**
 * App Layout Component
 * Defines the main layout structure of the application
 */
const AppLayout = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {children}
    </div>
  );
};

/**
 * Map Container Component
 * Wrapper for the map to maintain consistent positioning
 */
export const MapContainer = ({ children }) => {
  return (
    <div className="absolute inset-0">
      {children}
    </div>
  );
};

/**
 * Bottom Panel Container
 * Wrapper for the district info panel
 */
export const BottomPanel = ({ children }) => {
  return (
    <div className="absolute bottom-13 sm:bottom-4 left-4 right-4 sm:right-auto z-[1000] max-h-[70vh] sm:max-h-[80vh] pb-8 sm:pb-0 sm:w-[400px]" style={{ bottom: 'calc(3.25rem + env(safe-area-inset-bottom))' }}>
      {children}
    </div>
  );
};

export default AppLayout;