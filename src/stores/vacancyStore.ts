import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vacancy, VacancyStatus } from '../types/vacancy';

interface VacancyStore {
  vacancies: Vacancy[];
  searchQuery: string;
  filterStatus: VacancyStatus | 'all';
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: VacancyStatus | 'all') => void;
  addVacancy: (vacancy: Omit<Vacancy, 'id' | 'applicants' | 'posted' | 'status'>) => void;
  updateVacancy: (id: string, updates: Partial<Vacancy>) => void;
  deleteVacancy: (id: string) => void;
  resetStore: () => void;
}

const initialVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'We are seeking an experienced Frontend Developer to join our team and help build innovative web applications.',
    requirements: [
      '5+ years React experience',
      'TypeScript expertise',
      'Strong UI/UX skills',
      'Experience with modern frontend tooling',
      'Excellent problem-solving abilities'
    ],
    applicants: 24,
    posted: '2 days ago',
    status: 'active',
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $160k',
    description: 'Looking for a strategic Product Manager to drive our product vision and roadmap.',
    requirements: [
      '4+ years PM experience',
      'Technical background',
      'Strong leadership skills',
      'Experience with agile methodologies',
      'Excellent communication skills'
    ],
    applicants: 18,
    posted: '1 week ago',
    status: 'active',
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$100k - $130k',
    description: 'Join our design team to create beautiful and intuitive user experiences.',
    requirements: [
      '3+ years UX design experience',
      'Strong portfolio',
      'User research skills',
      'Proficiency in Figma',
      'Experience with design systems'
    ],
    applicants: 32,
    posted: '3 days ago',
    status: 'active',
  },
];

const useVacancyStore = create<VacancyStore>()(
  persist(
    (set) => ({
      vacancies: initialVacancies,
      searchQuery: '',
      filterStatus: 'all',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      addVacancy: (vacancy) => set((state) => {
        const newVacancy: Vacancy = {
          ...vacancy,
          id: crypto.randomUUID(),
          applicants: 0,
          posted: 'Just now',
          status: 'active',
        };
        return { vacancies: [...state.vacancies, newVacancy] };
      }),
      updateVacancy: (id, updates) => set((state) => ({
        vacancies: state.vacancies.map((vacancy) =>
          vacancy.id === id ? { ...vacancy, ...updates } : vacancy
        ),
      })),
      deleteVacancy: (id) => set((state) => ({
        vacancies: state.vacancies.filter((vacancy) => vacancy.id !== id),
      })),
      resetStore: () => set({ vacancies: initialVacancies }),
    }),
    {
      name: 'vacancy-storage',
    }
  )
);

export { useVacancyStore };