export const PanelContainer = ({ children, noPadding = false, scrollable = true, className = "" }) => (
  <div
    className={`w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${noPadding ? "p-0" : "p-4 md:p-6"
      } ${scrollable ? "overflow-y-auto" : ""} ${className}`}
  >
    {children}
  </div>
);