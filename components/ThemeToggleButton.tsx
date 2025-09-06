
import React from 'react';
import { useTheme } from './ThemeProvider';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ComputerDesktopIcon } from './icons/ComputerDesktopIcon';
import { useTranslation } from './LanguageProvider';

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };
  
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-6 w-6" />;
      case 'dark':
        return <MoonIcon className="h-6 w-6" />;
      case 'system':
        return <ComputerDesktopIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };
  
  const getTitle = () => {
    switch (theme) {
        case 'light': return t('theme.switchToDark');
        case 'dark': return t('theme.switchToSystem');
        case 'system': return t('theme.switchToLight');
    }
  }

  return (
    <button
      onClick={toggleTheme}
      title={getTitle()}
      className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-colors"
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggleButton;
