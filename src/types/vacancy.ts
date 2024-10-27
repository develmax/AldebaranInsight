export type VacancyStatus = 'active' | 'paused' | 'closed';

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  applicants: number;
  posted: string;
  status: VacancyStatus;
}