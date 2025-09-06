export interface UserProfile {
  name: string;
  interests: string;
  skills: string[];
  education: string;
  location: string;
  language: string;
  time: string;
  budget: string;
}

export interface ParsedSection {
  title: string;
  content: string;
}

export interface FeedbackData {
  rating: number | null;
  comment: string;
}
