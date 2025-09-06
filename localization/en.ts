const translations = {
  header: {
    title: 'CareerOS',
    subtitle: 'Your Personal AI Career Advisor',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} CareerOS. Powered by AI, designed for your future.`,
  },
  theme: {
    switchToDark: 'Switch to Dark Mode',
    switchToSystem: 'Switch to System Preference',
    switchToLight: 'Switch to Light Mode',
  },
  language: {
    change: 'Change Language',
  },
  loader: {
    message: 'Analyzing your profile and crafting your personalized career roadmap...',
    waitMessage: 'This may take a moment. Good things are worth the wait!',
  },
  error: {
    title: 'Oops! Something went wrong.',
    startOver: 'Start Over',
  },
  app: {
    errors: {
        emptyResponse: "Received an empty response from the AI. The model may be unavailable or experiencing issues.",
        unknown: 'An unknown error occurred while fetching your career advice. Please check the console for details and try again.',
        apiKey: 'The API key is missing or invalid. Please ensure it is configured correctly.',
        network: 'A network error occurred. Please check your internet connection and try again.',
    }
  },
  profileForm: {
    title: 'Chart Your Future',
    subtitle: 'Answer a few questions to get your personalized AI-powered career roadmap.',
    buttons: {
        load: 'Load',
        loadProfileTitle: 'Load Saved Profile',
        back: 'Back',
        saveProgress: 'Save Progress',
        saveProfileTitle: 'Save Profile',
        next: 'Next',
        generate: 'Generate My Roadmap',
    },
    notifications: {
        saved: 'Profile saved successfully!',
        loaded: 'Saved profile loaded!',
        noProfile: 'No saved profile found.',
        fillFields: 'Please fill out all required fields.',
        interestsNeeded: 'Please enter your interests first to get suggestions.',
        suggestionError: 'Failed to get AI skill suggestions.',
    },
    errors: {
        nameRequired: "Name is required.",
        interestsRequired: "Interests are required.",
        educationRequired: "Education details are required.",
        skillsRequired: "Please add at least one skill.",
        locationRequired: "Location is required.",
    },
    step1: {
        title: 'About You',
        nameLabel: "What's your name?",
        namePlaceholder: "e.g., Ananya Sharma",
        interestsLabel: 'What are your interests & passions?',
        interestsPlaceholder: 'e.g., Coding, video games, sustainable technology, creative writing',
    },
    step2: {
        title: 'Skills & Education',
        educationLabel: "What's your current education level & field of study?",
        educationPlaceholder: 'e.g., 2nd year B.Tech in Computer Science',
        skillsLabel: 'What skills do you currently have? (Add by pressing Enter)',
        skillsPlaceholder: 'e.g., Python, Communication...',
    },
    step3: {
        title: 'Your Constraints',
        locationLabel: 'Where are you based in India?',
        locationPlaceholder: 'e.g., Pune, Maharashtra',
        languageLabel: 'Preferred language for report & resources?',
        languageOptions: [
          { value: 'English', label: 'English' },
          { value: 'Hindi', label: 'Hindi (हिन्दी)' },
          { value: 'Marathi', label: 'Marathi (मराठी)' },
        ],
        timeLabel: 'How much time can you dedicate to learning per week?',
        timeOptions: ['1-5 hours/week', '5-10 hours/week', '10-20 hours/week', '20+ hours/week (Full-time)'],
        budgetLabel: 'What is your budget for courses and certifications?',
        budgetOptions: ['Free resources only', 'Up to ₹1,000/month', 'Up to ₹5,000/month', 'Flexible budget'],
    }
  },
  skills: {
    title: 'AI Skill Suggestions',
    suggestButton: 'Suggest with AI',
    loading: 'Suggesting...',
    generating: 'Generating skill ideas based on your interests...',
    prompt: "Click 'Suggest with AI' to get ideas based on your interests.",
  },
  results: {
    title: 'Your Personalized Career Roadmap',
    subtitle: "Here's the AI-powered advice based on your profile. Use this as your guide to success!",
    toggleSection: 'Toggle section visibility',
    skillTagHave: '(You have this!)',
    skillTagLearn: '(To learn)',
    searchPlaceholder: 'Search your report...',
    videoResource: 'Video Resource',
    progressTitle: 'Your Roadmap Progress',
    progressSubtitle: 'Check off items as you complete them.',
    buttons: {
        startNew: 'Start a New Plan',
        print: 'Print Roadmap',
        exportPdf: 'Export PDF',
        exportingPdf: 'Exporting...',
        giveFeedback: 'Give Feedback on this Plan',
        clearProgress: 'Clear Progress',
    },
    feedback: {
        title: 'Feedback on Your Report',
        subtitle: 'Your feedback helps us improve the AI.',
        ratingLabel: 'How helpful was this career report?',
        commentLabel: 'Any additional comments or suggestions?',
        commentPlaceholder: 'What did you like? What could be better?',
        submit: 'Submit Feedback',
        cancel: 'Cancel',
        thankYou: 'Thank you for your feedback!',
    },
    errors: {
        pdfError: 'Sorry, there was an error generating the PDF. Please try again.',
    }
  }
};

export type TranslationKeys = typeof translations;
export default translations;