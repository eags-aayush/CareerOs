
import React from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import ThemeToggleButton from './ThemeToggleButton';
import { useTranslation } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 no-print">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('header.title')}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">{t('header.subtitle')}</p>
            </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggleButton />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
