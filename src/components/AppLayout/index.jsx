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
    <div
      className="absolute left-4 z-[1000] max-h-[75vh] sm:max-h-[80vh] overflow-y-auto"
      style={{
        bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom, 0px)))'
      }}
    >
      {children}
    </div>
  );
};

export default AppLayout;