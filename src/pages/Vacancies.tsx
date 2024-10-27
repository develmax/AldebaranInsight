import React from 'react';
import VacancyList from '../components/vacancies/VacancyList';
import VacancyHeader from '../components/vacancies/VacancyHeader';
import { useVacancyStore } from '../stores/vacancyStore';

const Vacancies = () => {
  const { searchQuery, setSearchQuery, filterStatus } = useVacancyStore();

  return (
    <div className="space-y-6">
      <VacancyHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        filterStatus={filterStatus}
      />
      <VacancyList />
    </div>
  );
};

export default Vacancies;