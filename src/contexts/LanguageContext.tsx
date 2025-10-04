import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ml';

interface Translations {
  [key: string]: {
    en: string;
    ml: string;
  };
}

const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', ml: 'ഡാഷ്‌ബോർഡ്' },
  learn: { en: 'Learn', ml: 'പഠിക്കുക' },
  resources: { en: 'Resources', ml: 'വിഭവങ്ങൾ' },
  rewards: { en: 'Rewards', ml: 'പുരസ്കാരങ്ങൾ' },
  profile: { en: 'Profile', ml: 'പ്രൊഫൈൽ' },
  leaderboard: { en: 'Leaderboard', ml: 'ലീഡർബോർഡ്' },
  
  // Dashboard
  welcome: { en: 'Welcome', ml: 'സ്വാഗതം' },
  totalPoints: { en: 'Total Points', ml: 'ആകെ പോയിന്റുകൾ' },
  currentStreak: { en: 'Current Streak', ml: 'നിലവിലെ സ്ട്രീക്ക്' },
  badgesEarned: { en: 'Badges Earned', ml: 'നേടിയ ബാഡ്ജുകൾ' },
  modulesCompleted: { en: 'Modules Completed', ml: 'പൂർത്തിയാക്കിയ മൊഡ്യൂളുകൾ' },
  activeModules: { en: 'Active Modules', ml: 'സജീവ മൊഡ്യൂളുകൾ' },
  recentBadges: { en: 'Recent Badges', ml: 'സമീപകാല ബാഡ്ജുകൾ' },
  checkInDaily: { en: 'Check In Daily', ml: 'ദിവസവും ചെക്ക് ഇൻ ചെയ്യുക' },
  continueStreak: { en: 'Continue your learning streak', ml: 'നിങ്ങളുടെ പഠന സ്ട്രീക്ക് തുടരുക' },
  checkIn: { en: 'Check In', ml: 'ചെക്ക് ഇൻ' },
  alreadyCheckedIn: { en: 'Already Checked In Today!', ml: 'ഇന്ന് ചെക്ക് ഇൻ ചെയ്തു!' },
  
  // Learn
  learningModules: { en: 'Learning Modules', ml: 'പഠന മൊഡ്യൂളുകൾ' },
  searchModules: { en: 'Search modules...', ml: 'മൊഡ്യൂളുകൾ തിരയുക...' },
  beginner: { en: 'Beginner', ml: 'തുടക്കക്കാരൻ' },
  intermediate: { en: 'Intermediate', ml: 'ഇന്റർമീഡിയറ്റ്' },
  advanced: { en: 'Advanced', ml: 'അഡ്വാൻസ്ഡ്' },
  points: { en: 'Points', ml: 'പോയിന്റുകൾ' },
  topics: { en: 'topics', ml: 'വിഷയങ്ങൾ' },
  startModule: { en: 'Start Module', ml: 'മൊഡ്യൂൾ ആരംഭിക്കുക' },
  continueLearning: { en: 'Continue Learning', ml: 'പഠനം തുടരുക' },
  viewDetails: { en: 'View Details', ml: 'വിശദാംശങ്ങൾ കാണുക' },
  watchPreview: { en: 'Watch Preview', ml: 'പ്രിവ്യൂ കാണുക' },
  
  // Module Preview
  modulePreview: { en: 'Module Preview', ml: 'മൊഡ്യൂൾ പ്രിവ്യൂ' },
  whatYouLearn: { en: "What You'll Learn", ml: 'നിങ്ങൾ എന്ത് പഠിക്കും' },
  duration: { en: 'Duration', ml: 'സമയദൈർഘ്യം' },
  level: { en: 'Level', ml: 'ലെവൽ' },
  enrolled: { en: 'Enrolled', ml: 'എൻറോൾഡ്' },
  startLearning: { en: 'Start Learning', ml: 'പഠനം ആരംഭിക്കുക' },
  close: { en: 'Close', ml: 'അടയ്ക്കുക' },
  
  // Profile Setup
  completeProfile: { en: 'Complete Your Profile', ml: 'നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക' },
  chooseAvatar: { en: 'Choose Your Avatar', ml: 'നിങ്ങളുടെ അവതാർ തിരഞ്ഞെടുക്കുക' },
  fullName: { en: 'Full Name', ml: 'മുഴുവൻ പേര്' },
  district: { en: 'District', ml: 'ജില്ല' },
  panchayat: { en: 'Panchayat', ml: 'പഞ്ചായത്ത്' },
  primaryCrop: { en: 'Primary Crop', ml: 'പ്രധാന വിള' },
  completeSetup: { en: 'Complete Setup', ml: 'സജ്ജീകരണം പൂർത്തിയാക്കുക' },
  selectDistrict: { en: 'Select district', ml: 'ജില്ല തിരഞ്ഞെടുക്കുക' },
  selectPanchayat: { en: 'Select panchayat', ml: 'പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക' },
  selectCrop: { en: 'Select primary crop', ml: 'പ്രധാന വിള തിരഞ്ഞെടുക്കുക' },
  
  // Common
  success: { en: 'Success', ml: 'വിജയം' },
  error: { en: 'Error', ml: 'പിശക്' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
