import React, { useState } from 'react';
import { MapPin, Users, Clock, MoreVertical, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Vacancy } from '../../types/vacancy';
import { useVacancyStore } from '../../stores/vacancyStore';
import EditVacancyModal from './EditVacancyModal';

interface VacancyCardProps {
  vacancy: Vacancy;
}

const StatusBadge = ({ status }: { status: Vacancy['status'] }) => {
  const styles = {
    active: 'bg-green-50 text-green-700',
    paused: 'bg-yellow-50 text-yellow-700',
    closed: 'bg-gray-50 text-gray-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const deleteVacancy = useVacancyStore((state) => state.deleteVacancy);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      deleteVacancy(vacancy.id);
    }
    setShowMenu(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vacancy.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{vacancy.department}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Vacancy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Vacancy
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {vacancy.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            {vacancy.applicants} applicants
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            Posted {vacancy.posted}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{vacancy.description}</p>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{vacancy.salary}</span>
            <span className="text-sm text-gray-500">• {vacancy.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={vacancy.status} />
            <Link
              to={`/vacancies/${vacancy.id}`}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      <EditVacancyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vacancy={vacancy}
      />
    </>
  );
};

export default VacancyCard;