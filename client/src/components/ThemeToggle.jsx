import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../services/theme';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-full text-ink hover:bg-soft border border-hairline transition-all duration-150 flex items-center justify-center focus-visible:outline-offset-2 ${className}`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform duration-200" />
      ) : (
        <Moon size={18} className="text-ink hover:-rotate-12 transition-transform duration-200" />
      )}
    </button>
  );
}

