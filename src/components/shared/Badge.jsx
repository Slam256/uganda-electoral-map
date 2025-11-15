export const Badge = ({ type, text }) => {
  const styles = {
    district: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    subcounty: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    parish: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    constituency: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    campaign: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    county: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[type] || styles.district}`}>
      {text}
    </span>
  );
};