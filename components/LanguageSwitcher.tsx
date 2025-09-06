
import React from 'react';
import { useTranslation } from './LanguageProvider';
import { LanguageIcon } from './icons/LanguageIcon';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'hi' | 'mr');
  };

  return (
    <div className="relative">
      <LanguageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400 pointer-events-none" />
      <select
        value={language}
        onChange={handleLanguageChange}
        title={t('language.change')}
        className="appearance-none w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-md py-2 pl-10 pr-4 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="mr">MR</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
