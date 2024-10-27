import React from 'react';
import { motion } from 'framer-motion';
import VacancyCard from './VacancyCard';
import { useVacancyStore } from '../../stores/vacancyStore';

const VacancyList = () => {
  const { vacancies, searchQuery, filterStatus } = useVacancyStore();

  const filteredVacancies = vacancies
    .filter((vacancy) => 
      filterStatus === 'all' ? true : vacancy.status === filterStatus
    )
    .filter((vacancy) =>
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVacancies.map((vacancy) => (
        <motion.div
          key={vacancy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <VacancyCard vacancy={vacancy} />
        </motion.div>
      ))}
      {filteredVacancies.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No vacancies found
        </div>
      )}
    </div>
  );
};

export default VacancyList;