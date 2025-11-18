export const PanelContainer = ({ children, noPadding = false, className = "" }) => (
  <div
    className={`w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${
      noPadding ? "p-0" : "p-4 md:p-6"
    } overflow-y-auto ${className}`}
  >
    {children}
  </div>
);