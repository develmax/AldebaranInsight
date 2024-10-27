import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Candidate, CandidateStatus } from '../types/recruitment';

interface CandidateStore {
  candidates: Candidate[];
  searchQuery: string;
  filterStatus: CandidateStatus | 'all';
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: CandidateStatus | 'all') => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  resetStore: () => void;
}

const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    source: 'linkedin',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    githubUrl: 'https://github.com/sarahchen',
    status: 'team_interview',
    vacancyId: '1',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    experience: 6,
    aiScore: 92,
    aiNotes: JSON.stringify({
      score: 92,
      skillsMatch: [
        { skill: 'React', score: 95, notes: 'Extensive experience with React and its ecosystem' },
        { skill: 'TypeScript', score: 90, notes: 'Strong TypeScript knowledge' }
      ],
      experienceRelevance: 95,
      cultureFit: 88,
      recommendations: ['Strong technical background', 'Great communication skills'],
    }),
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@example.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    source: 'referral',
    linkedinUrl: 'https://linkedin.com/in/michaelr',
    status: 'screening',
    vacancyId: '2',
    skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis'],
    experience: 5,
    aiScore: 85,
    createdAt: '2024-03-14T10:30:00Z',
    updatedAt: '2024-03-14T10:30:00Z',
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.w@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles, CA',
    source: 'linkedin',
    linkedinUrl: 'https://linkedin.com/in/emilyw',
    status: 'hr_review',
    vacancyId: '3',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems'],
    experience: 4,
    aiScore: 88,
    createdAt: '2024-03-13T14:15:00Z',
    updatedAt: '2024-03-13T14:15:00Z',
  },
];

const useCandidateStore = create<CandidateStore>()(
  persist(
    (set) => ({
      candidates: initialCandidates,
      searchQuery: '',
      filterStatus: 'all',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      addCandidate: (candidate) => set((state) => {
        const now = new Date().toISOString();
        const newCandidate: Candidate = {
          ...candidate,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        return { candidates: [...state.candidates, newCandidate] };
      }),
      updateCandidate: (id, updates) => set((state) => ({
        candidates: state.candidates.map((candidate) =>
          candidate.id === id
            ? { ...candidate, ...updates, updatedAt: new Date().toISOString() }
            : candidate
        ),
      })),
      deleteCandidate: (id) => set((state) => ({
        candidates: state.candidates.filter((candidate) => candidate.id !== id),
      })),
      resetStore: () => set({ candidates: initialCandidates }),
    }),
    {
      name: 'candidate-storage',
    }
  )
);

export { useCandidateStore };