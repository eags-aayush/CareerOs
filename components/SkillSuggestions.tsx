
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { useTranslation } from './LanguageProvider';

interface SkillSuggestionsProps {
    onSelectSkill: (skill: string) => void;
    onSuggest: () => void;
    isLoading: boolean;
    suggestions: string[];
    interests: string;
}

const SkillSuggestions: React.FC<SkillSuggestionsProps> = ({ onSelectSkill, onSuggest, isLoading, suggestions, interests }) => {
    const { t } = useTranslation();
    return (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-indigo-500" />
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {t('skills.title')}
                    </h4>
                </div>
                <button
                    type="button"
                    onClick={onSuggest}
                    disabled={isLoading || !interests}
                    className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? t('skills.loading') : t('skills.suggestButton')}
                </button>
            </div>
            {isLoading && (
                 <div className="text-center py-2 text-sm text-slate-500 dark:text-slate-400">{t('skills.generating')}</div>
            )}
            {!isLoading && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {suggestions.map(skill => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => onSelectSkill(skill)}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors"
                        >
                           + {skill}
                        </button>
                    ))}
                </div>
            )}
             {!isLoading && suggestions.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('skills.prompt')}</p>
             )}
        </div>
    );
};

export default SkillSuggestions;
