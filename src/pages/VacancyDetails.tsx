import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Briefcase,
  DollarSign,
  CheckCircle,
  Brain,
  Star,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useVacancyStore } from '../stores/vacancyStore';
import { useCandidateStore } from '../stores/candidateStore';
import EditVacancyModal from '../components/vacancies/EditVacancyModal';
import { format } from 'date-fns';

const VacancyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates'>('overview');

  const vacancy = useVacancyStore((state) =>
    state.vacancies.find((v) => v.id === id)
  );

  const deleteVacancy = useVacancyStore((state) => state.deleteVacancy);

  const candidates = useCandidateStore((state) =>
    state.candidates.filter((c) => c.vacancyId === id)
  );

  if (!vacancy) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Vacancy Not Found</h2>
        <p className="text-gray-600 mb-4">The vacancy you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/vacancies')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Vacancies
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      deleteVacancy(vacancy.id);
      navigate('/vacancies');
    }
  };

  const statusColors = {
    active: 'bg-green-50 text-green-700',
    paused: 'bg-yellow-50 text-yellow-700',
    closed: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/vacancies')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Vacancies
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{vacancy.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[vacancy.status]}`}>
                {vacancy.status.charAt(0).toUpperCase() + vacancy.status.slice(1)}
              </span>
            </div>
            <p className="text-lg text-gray-600">{vacancy.department}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-3" />
              {vacancy.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 mr-3" />
              {vacancy.type}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-3" />
              {vacancy.salary}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-3" />
              {candidates.length} Candidates
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-3" />
              Posted {vacancy.posted}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'candidates'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Candidates ({candidates.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{vacancy.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {vacancy.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-indigo-600">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidate.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">
                              {candidate.experience} years experience
                            </span>
                            <span className="text-sm text-gray-600">
                              {candidate.location}
                            </span>
                          </div>
                          {candidate.aiScore && (
                            <div className="flex items-center gap-2 mt-2">
                              <Brain className="h-4 w-4 text-indigo-600" />
                              <span className="text-sm font-medium text-gray-700">
                                AI Score: {candidate.aiScore}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Applied {format(new Date(candidate.createdAt), 'MMM d, yyyy')}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[vacancy.status]
                      }`}>
                        {candidate.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No candidates have applied for this position yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EditVacancyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vacancy={vacancy}
      />
    </div>
  );
};

export default VacancyDetails;