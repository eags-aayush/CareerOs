
import React, { useState } from 'react';
import { UserProfile } from './types';
import { getCareerAdvice } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileForm from './components/ProfileForm';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { LanguageProvider, useTranslation } from './components/LanguageProvider';
import { ThemeProvider } from './components/ThemeProvider';
import ErrorDisplay from './components/ErrorDisplay';

const AppContent: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();

  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsLoading(true);
    setUserProfile(profile);
    setApiResponse(null);
    setError(null);
    try {
      const response = await getCareerAdvice(profile, language);
      if (!response) {
        throw new Error(t('app.errors.emptyResponse'));
      }
      setApiResponse(response);
    } catch (err: any) {
      console.error(err);
      let errorMessage = t('app.errors.unknown');
      if (err.message) {
          if (err.message.includes('API_KEY')) {
              errorMessage = t('app.errors.apiKey');
          } else if (err.message.includes('Failed to fetch')) {
              errorMessage = t('app.errors.network');
          } else {
              errorMessage = err.message;
          }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setUserProfile(null);
    setApiResponse(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {!apiResponse && !isLoading && !error && (
            <ProfileForm onSubmit={handleProfileSubmit} />
          )}

          {isLoading && (
            <Loader message={t('loader.message')} />
          )}

          {error && !isLoading && (
            <ErrorDisplay 
              error={error} 
              onReset={handleReset} 
            />
          )}

          {apiResponse && !isLoading && (
            <ResultsDisplay response={apiResponse} onReset={handleReset} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
