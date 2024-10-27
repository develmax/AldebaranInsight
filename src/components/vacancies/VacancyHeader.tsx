import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import AddVacancyModal from './AddVacancyModal';

interface VacancyHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: string;
}

const VacancyHeader = ({ searchQuery, onSearchChange, filterStatus }: VacancyHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Vacancies</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Vacancy
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vacancies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      <AddVacancyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default VacancyHeader;