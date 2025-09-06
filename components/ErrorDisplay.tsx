
import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { useTranslation } from './LanguageProvider';

interface ErrorDisplayProps {
    error: string;
    onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onReset }) => {
    const { t } = useTranslation();
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-red-200 dark:border-red-800 animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">{t('error.title')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">{error}</p>
            <button
                onClick={onReset}
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200"
            >
                {t('error.startOver')}
            </button>
        </div>
    );
};

export default ErrorDisplay;
