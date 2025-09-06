
import React from 'react';
import { useTranslation } from './LanguageProvider';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 no-print">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
