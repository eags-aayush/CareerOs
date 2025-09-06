import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getSkillSuggestions } from '../services/geminiService';
import { UserIcon } from './icons/UserIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { SaveIcon } from './icons/SaveIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import SkillSuggestions from './SkillSuggestions';
import { useTranslation } from './LanguageProvider';
import SkillInput from './SkillInput';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

type FormErrors = Partial<Record<keyof Omit<UserProfile, 'skills'>, string>> & { skills?: string };

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    interests: '',
    skills: [],
    education: '',
    location: '',
    language: 'English',
    time: '5-10 hours/week',
    budget: 'Free resources only',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [notification, setNotification] = useState<string>('');
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleSave = () => {
    localStorage.setItem('careerOSProfile', JSON.stringify(formData));
    showNotification(t('profileForm.notifications.saved'));
  };

  const handleLoad = () => {
    const savedProfile = localStorage.getItem('careerOSProfile');
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
      showNotification(t('profileForm.notifications.loaded'));
    } else {
      showNotification(t('profileForm.notifications.noProfile'));
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };
  
  const handleSkillsChange = (newSkills: string[]) => {
    setFormData(prev => ({...prev, skills: newSkills}));
    if (newSkills.length > 0) {
      setErrors(prev => ({...prev, skills: undefined}));
    }
  };

  const handleSuggestSkills = async () => {
      if (!formData.interests) {
          showNotification(t('profileForm.notifications.interestsNeeded'));
          return;
      }
      setIsSuggestingSkills(true);
      setSuggestedSkills([]);
      try {
          const skills = await getSkillSuggestions(formData.interests);
          setSuggestedSkills(skills);
      } catch (error) {
          console.error(error);
          showNotification(t('profileForm.notifications.suggestionError'));
      } finally {
          setIsSuggestingSkills(false);
      }
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    if (currentStep === 1) {
        if (!formData.name.trim()) newErrors.name = t('profileForm.errors.nameRequired');
        if (!formData.interests.trim()) newErrors.interests = t('profileForm.errors.interestsRequired');
    } else if (currentStep === 2) {
        if (!formData.education.trim()) newErrors.education = t('profileForm.errors.educationRequired');
        if (formData.skills.length === 0) newErrors.skills = t('profileForm.errors.skillsRequired');
    } else if (currentStep === 3) {
        if (!formData.location.trim()) newErrors.location = t('profileForm.errors.locationRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const nextStep = () => {
    if (validateStep(step)) {
        setStep((prev) => prev + 1);
    }
  };
  
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(1) && validateStep(2) && validateStep(3)) {
        onSubmit(formData);
    } else {
        showNotification(t('profileForm.notifications.fillFields'));
    }
  };
  
  const InputError: React.FC<{ message?: string }> = ({ message }) => {
    return message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;
  }
  
  const renderStep = () => {
    const step1 = t('profileForm.step1');
    const step2 = t('profileForm.step2');
    const step3 = t('profileForm.step3');
    switch (step) {
      case 1:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
                <UserIcon className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-bold">{step1.title}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step1.nameLabel}</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={step1.namePlaceholder} required />
                <InputError message={errors.name} />
              </div>
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step1.interestsLabel}</label>
                <textarea name="interests" id="interests" value={formData.interests} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={step1.interestsPlaceholder} required></textarea>
                <InputError message={errors.interests} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
                <BriefcaseIcon className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-bold">{step2.title}</h2>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="education" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step2.educationLabel}</label>
                    <input type="text" name="education" id="education" value={formData.education} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={step2.educationPlaceholder} required />
                    <InputError message={errors.education} />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step2.skillsLabel}</label>
                    <SkillInput
                        skills={formData.skills}
                        setSkills={handleSkillsChange}
                        placeholder={step2.skillsPlaceholder}
                    />
                    <InputError message={errors.skills} />
                    <SkillSuggestions 
                        onSelectSkill={(skill) => handleSkillsChange([...formData.skills, skill])}
                        onSuggest={handleSuggestSkills}
                        isLoading={isSuggestingSkills}
                        suggestions={suggestedSkills}
                        interests={formData.interests}
                    />
                </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
                <LocationMarkerIcon className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-bold">{step3.title}</h2>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step3.locationLabel}</label>
                    <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={step3.locationPlaceholder} required />
                    <InputError message={errors.location} />
                </div>
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step3.languageLabel}</label>
                    <select name="language" id="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {step3.languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step3.timeLabel}</label>
                    <select name="time" id="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {step3.timeOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{step3.budgetLabel}</label>
                    <select name="budget" id="budget" value={formData.budget} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {step3.budgetOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const { buttons } = t('profileForm');
  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 relative">
        {notification && (
            <div role="status" aria-live="polite" className="absolute top-4 right-4 bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md shadow-lg animate-fade-in z-20">
                {notification}
            </div>
        )}
        <div className="flex justify-between items-start mb-6">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('profileForm.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{t('profileForm.subtitle')}</p>
            </div>
            <button
                type="button"
                onClick={handleLoad}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title={buttons.loadProfileTitle}
            >
                <ClipboardCheckIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{buttons.load}</span>
            </button>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-8">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="min-h-[300px]">
                {renderStep()}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {step > 1 ? (
                        <button type="button" onClick={prevStep} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-full sm:w-auto">
                        {buttons.back}
                        </button>
                    ) : (
                        <div className="w-full sm:w-auto"></div> // Placeholder to maintain layout
                    )}
                     <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 border border-transparent rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors w-full sm:w-auto"
                        title={buttons.saveProfileTitle}
                    >
                        <SaveIcon className="h-4 w-4" />
                        <span>{buttons.saveProgress}</span>
                    </button>
                </div>

                <div className="w-full sm:w-auto">
                    {step < 3 ? (
                        <button type="button" onClick={nextStep} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full">
                        {buttons.next}
                        </button>
                    ) : (
                        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-full">
                        {buttons.generate}
                        </button>
                    )}
                </div>
            </div>
      </form>
    </div>
  );
};

export default ProfileForm;