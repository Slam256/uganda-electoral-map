import { useTheme } from '../context/useTheme';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '💻'; // system
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
      aria-label="Toggle theme"
    >
      <span className="text-xl">{getIcon()}</span>
    </button>
  );
}

export default ThemeToggle;