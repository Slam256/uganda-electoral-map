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
    <div className="absolute bottom-4 left-4 z-[1000] max-h-[80vh] overflow-y-auto">
      {children}
    </div>
  );
};

export default AppLayout;