import { TranslationKeys } from './en';

const translations: TranslationKeys = {
  header: {
    title: 'करियरOS',
    subtitle: 'आपका व्यक्तिगत AI करियर सलाहकार',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} करियरOS। AI द्वारा संचालित, आपके भविष्य के लिए डिज़ाइन किया गया।`,
  },
  theme: {
    switchToDark: 'डार्क मोड पर स्विच करें',
    switchToSystem: 'सिस्टम वरीयता पर स्विच करें',
    switchToLight: 'लाइट मोड पर स्विच करें',
  },
  language: {
    change: 'भाषा बदलें',
  },
  loader: {
    message: 'आपकी प्रोफ़ाइल का विश्लेषण किया जा रहा है और आपका व्यक्तिगत करियर रोडमैप तैयार किया जा रहा है...',
    waitMessage: 'इसमें थोड़ा समय लग सकता है। अच्छी चीजों का इंतजार करना पड़ता है!',
  },
  error: {
    title: 'ओह! कुछ गलत हो गया।',
    startOver: 'फिर से शुरू करें',
  },
  app: {
    errors: {
        emptyResponse: "AI से कोई प्रतिक्रिया नहीं मिली। मॉडल अनुपलब्ध हो सकता है या समस्याओं का सामना कर रहा है।",
        unknown: 'आपकी करियर सलाह प्राप्त करते समय एक अज्ञात त्रुटि हुई। कृपया कंसोल देखें और पुनः प्रयास करें।',
        apiKey: 'API कुंजी गायब या अमान्य है। कृपया सुनिश्चित करें कि यह सही ढंग से कॉन्फ़िगर की गई है।',
        network: 'एक नेटवर्क त्रुटि हुई। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
    }
  },
  profileForm: {
    title: 'अपना भविष्य तय करें',
    subtitle: 'अपना व्यक्तिगत AI-संचालित करियर रोडमैप प्राप्त करने के लिए कुछ सवालों के जवाब दें।',
    buttons: {
        load: 'लोड करें',
        loadProfileTitle: 'सहेजी गई प्रोफ़ाइल लोड करें',
        back: 'वापस',
        saveProgress: 'प्रगति सहेजें',
        saveProfileTitle: 'प्रोफ़ाइल सहेजें',
        next: 'अगला',
        generate: 'मेरा रोडमैप बनाएं',
    },
    notifications: {
        saved: 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!',
        loaded: 'सहेजी गई प्रोफ़ाइल लोड हो गई!',
        noProfile: 'कोई सहेजी गई प्रोफ़ाइल नहीं मिली।',
        fillFields: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
        interestsNeeded: 'सुझाव प्राप्त करने के लिए कृपया पहले अपनी रुचियाँ दर्ज करें।',
        suggestionError: 'AI कौशल सुझाव प्राप्त करने में विफल।',
    },
    errors: {
        nameRequired: "नाम आवश्यक है।",
        interestsRequired: "रुचियाँ आवश्यक हैं।",
        educationRequired: "शिक्षा का विवरण आवश्यक है।",
        skillsRequired: "कृपया कम से कम एक कौशल जोड़ें।",
        locationRequired: "स्थान आवश्यक है।",
    },
    step1: {
        title: 'आपके बारे में',
        nameLabel: "आपका नाम क्या है?",
        namePlaceholder: "उदा., अनन्या शर्मा",
        interestsLabel: 'आपकी रुचियाँ और जुनून क्या हैं?',
        interestsPlaceholder: 'उदा., कोडिंग, वीडियो गेम, स्थायी तकनीक, रचनात्मक लेखन',
    },
    step2: {
        title: 'कौशल और शिक्षा',
        educationLabel: "आपकी वर्तमान शिक्षा का स्तर और अध्ययन का क्षेत्र क्या है?",
        educationPlaceholder: 'उदा., कंप्यूटर विज्ञान में बी.टेक द्वितीय वर्ष',
        skillsLabel: 'आपके पास वर्तमान में कौन से कौशल हैं? (Enter दबाकर जोड़ें)',
        skillsPlaceholder: 'उदा., पायथन, संचार...',
    },
    step3: {
        title: 'आपकी बाधाएं',
        locationLabel: 'आप भारत में कहाँ रहते हैं?',
        locationPlaceholder: 'उदा., पुणे, महाराष्ट्र',
        languageLabel: 'रिपोर्ट और संसाधनों के लिए पसंदीदा भाषा?',
        languageOptions: [
          { value: 'English', label: 'English (अंग्रेज़ी)' },
          { value: 'Hindi', label: 'Hindi (हिन्दी)' },
          { value: 'Marathi', label: 'Marathi (मराठी)' },
        ],
        timeLabel: 'आप प्रति सप्ताह सीखने के लिए कितना समय दे सकते हैं?',
        timeOptions: ['1-5 घंटे/सप्ताह', '5-10 घंटे/सप्ताह', '10-20 घंटे/सप्ताह', '20+ घंटे/सप्ताह (पूर्णकालिक)'],
        budgetLabel: 'पाठ्यक्रमों और प्रमाणपत्रों के लिए आपका बजट क्या है?',
        budgetOptions: ['केवल मुफ्त संसाधन', '₹1,000/माह तक', '₹5,000/माह तक', 'लचीला बजट'],
    }
  },
  skills: {
    title: 'AI कौशल सुझाव',
    suggestButton: 'AI से सुझाव लें',
    loading: 'सुझाव दे रहा है...',
    generating: 'आपकी रुचियों के आधार पर कौशल विचार उत्पन्न किए जा रहे हैं...',
    prompt: "अपनी रुचियों के आधार पर विचार प्राप्त करने के लिए 'AI से सुझाव लें' पर क्लिक करें।",
  },
  results: {
    title: 'आपका व्यक्तिगत करियर रोडमैप',
    subtitle: "यह आपकी प्रोफ़ाइल पर आधारित AI-संचालित सलाह है। इसे अपनी सफलता के लिए एक मार्गदर्शक के रूप में उपयोग करें!",
    toggleSection: 'अनुभाग दृश्यता टॉगल करें',
    skillTagHave: '(आपके पास यह है!)',
    skillTagLearn: '(सीखना है)',
    searchPlaceholder: 'अपनी रिपोर्ट खोजें...',
    videoResource: 'वीडियो संसाधन',
    progressTitle: 'आपकी रोडमैप प्रगति',
    progressSubtitle: 'आइटम पूरे होने पर उन्हें चेक करें।',
    buttons: {
        startNew: 'एक नई योजना शुरू करें',
        print: 'रोडमैप प्रिंट करें',
        exportPdf: 'PDF निर्यात करें',
        exportingPdf: 'निर्यात हो रहा है...',
        giveFeedback: 'इस योजना पर प्रतिक्रिया दें',
        clearProgress: 'प्रगति साफ़ करें',
    },
    feedback: {
        title: 'आपकी रिपोर्ट पर प्रतिक्रिया',
        subtitle: 'आपकी प्रतिक्रिया हमें AI को बेहतर बनाने में मदद करती है।',
        ratingLabel: 'यह करियर रिपोर्ट कितनी सहायक थी?',
        commentLabel: 'कोई अतिरिक्त टिप्पणी या सुझाव?',
        commentPlaceholder: 'आपको क्या पसंद आया? क्या बेहतर हो सकता है?',
        submit: 'प्रतिक्रिया भेजें',
        cancel: 'रद्द करें',
        thankYou: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
    },
    errors: {
        pdfError: 'क्षमा करें, PDF बनाने में कोई त्रुटि हुई। कृपया पुनः प्रयास करें।',
    }
  }
};

export default translations;