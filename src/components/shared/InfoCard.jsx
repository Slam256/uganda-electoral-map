export const InfoCard = ({ label, value, children, isLarge = false }) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    {children || (
      <p className={`font-semibold text-gray-900 dark:text-gray-100 ${
        isLarge ? 'text-xl font-bold' : 'text-lg'
      }`}>
        {value}
      </p>
    )}
  </div>
);