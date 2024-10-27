import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Interview } from '../types/recruitment';
import { addDays, addHours } from 'date-fns';

interface InterviewStore {
  interviews: Interview[];
  searchQuery: string;
  filterType: 'all' | 'ai' | 'hr' | 'team';
  setSearchQuery: (query: string) => void;
  setFilterType: (type: 'all' | 'ai' | 'hr' | 'team') => void;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  resetStore: () => void;
}

const initialInterviews: Interview[] = [
  {
    id: '1',
    candidateId: '1',
    vacancyId: '1',
    type: 'team',
    status: 'scheduled',
    date: addDays(new Date(), 2).toISOString(),
    duration: 60,
    notes: 'Technical interview with the engineering team',
  },
  {
    id: '2',
    candidateId: '2',
    vacancyId: '2',
    type: 'ai',
    status: 'completed',
    date: addHours(new Date(), -48).toISOString(),
    duration: 30,
    notes: 'AI screening interview completed',
    aiSummary: 'Strong candidate with relevant experience',
    score: 85,
  },
  {
    id: '3',
    candidateId: '3',
    vacancyId: '3',
    type: 'hr',
    status: 'scheduled',
    date: addDays(new Date(), 1).toISOString(),
    duration: 45,
    notes: 'Initial HR screening interview',
  },
];

const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      interviews: initialInterviews,
      searchQuery: '',
      filterType: 'all',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      addInterview: (interview) => set((state) => ({
        interviews: [...state.interviews, { ...interview, id: crypto.randomUUID() }],
      })),
      updateInterview: (id, updates) => set((state) => ({
        interviews: state.interviews.map((interview) =>
          interview.id === id ? { ...interview, ...updates } : interview
        ),
      })),
      deleteInterview: (id) => set((state) => ({
        interviews: state.interviews.filter((interview) => interview.id !== id),
      })),
      resetStore: () => set({ interviews: initialInterviews }),
    }),
    {
      name: 'interview-storage',
    }
  )
);

export { useInterviewStore };