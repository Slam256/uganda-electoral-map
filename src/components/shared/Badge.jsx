export const Badge = ({ type, text }) => {
  const styles = {
    district: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    subcounty: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    campaign: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[type]}`}>
      {text}
    </span>
  );
};