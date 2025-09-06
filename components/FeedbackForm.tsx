import React, { useState } from 'react';
import { FeedbackData } from '../types';
import { StarIcon } from './icons/StarIcon';
import { useTranslation } from './LanguageProvider';

interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackData) => void;
  onCancel: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
        <div className="text-center p-4">
            <p className="font-semibold text-lg text-green-600 dark:text-green-400">{t('results.feedback.thankYou')}</p>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('results.feedback.ratingLabel')}
        </label>
        <div className="mt-1 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(star)}
              className="p-1 text-slate-300 dark:text-slate-600 focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <StarIcon
                className={`h-7 w-7 transition-colors ${
                  (hoverRating || rating || 0) >= star
                    ? 'text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('results.feedback.commentLabel')}
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('results.feedback.commentPlaceholder')}
          className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {t('results.feedback.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          {t('results.feedback.submit')}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
