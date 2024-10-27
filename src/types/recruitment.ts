export type CandidateStatus = 
  | 'new'
  | 'screening'
  | 'ai_interview'
  | 'hr_review'
  | 'team_interview'
  | 'offer_sent'
  | 'hired'
  | 'rejected';

export type CandidateSource = 
  | 'internal'
  | 'linkedin'
  | 'github'
  | 'referral'
  | 'other';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  source: CandidateSource;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  status: CandidateStatus;
  vacancyId?: string;
  skills: string[];
  experience: number;
  aiScore?: number;
  aiNotes?: string;
  interviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  score: number;
  skillsMatch: {
    skill: string;
    score: number;
    notes: string;
  }[];
  experienceRelevance: number;
  cultureFit: number;
  recommendations: string[];
  redFlags?: string[];
  extractedInfo?: {
    personal: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
    professional: {
      yearsOfExperience?: number;
      skills?: string[];
      currentRole?: string;
      education?: string;
    };
  };
}