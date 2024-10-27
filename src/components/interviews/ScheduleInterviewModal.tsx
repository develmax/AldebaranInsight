import React, { useState } from 'react';
import { X, Calendar, Clock, Brain, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../../stores/interviewStore';
import { useCandidateStore } from '../../stores/candidateStore';
import { useVacancyStore } from '../../stores/vacancyStore';
import { format } from 'date-fns';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
}

const ScheduleInterviewModal = ({ isOpen, onClose, candidateId }: ScheduleInterviewModalProps) => {
  const addInterview = useInterviewStore((state) => state.addInterview);
  const candidates = useCandidateStore((state) => state.candidates);
  const vacancies = useVacancyStore((state) => state.vacancies);

  const [formData, setFormData] = useState({
    candidateId: candidateId || '',
    vacancyId: '',
    type: 'hr' as const,
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: 30,
    notes: '',
  });

  // Get selected candidate and vacancy
  const selectedCandidate = candidates.find(c => c.id === formData.candidateId);
  const selectedVacancy = vacancies.find(v => v.id === formData.vacancyId);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // If selecting a candidate, auto-select their vacancy if they have one
      if (name === 'candidateId') {
        const candidate = candidates.find(c => c.id === value);
        return {
          ...prev,
          [name]: value,
          vacancyId: candidate?.vacancyId || prev.vacancyId
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidateId || !formData.vacancyId) {
      alert('Please select both a candidate and a position');
      return;
    }

    // Create new interview
    addInterview({
      candidateId: formData.candidateId,
      vacancyId: formData.vacancyId,
      type: formData.type,
      date: formData.date,
      duration: Number(formData.duration),
      notes: formData.notes,
      status: 'scheduled',
    });

    // Update candidate status based on interview type
    const newStatus = formData.type === 'ai' ? 'ai_interview' : 'hr_review';
    useCandidateStore.getState().updateCandidate(formData.candidateId, {
      status: newStatus,
    });

    // Reset form and close modal
    setFormData({
      candidateId: '',
      vacancyId: '',
      type: 'hr',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration: 30,
      notes: '',
    });
    onClose();
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Brain className="h-5 w-5" />;
      case 'hr':
        return <Users className="h-5 w-5" />;
      case 'team':
        return <Users className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Schedule Interview</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Candidate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate *
              </label>
              <select
                name="candidateId"
                value={formData.candidateId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select candidate</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <select
                name="vacancyId"
                value={formData.vacancyId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select position</option>
                {vacancies.map((vacancy) => (
                  <option 
                    key={vacancy.id} 
                    value={vacancy.id}
                    disabled={selectedCandidate?.vacancyId && selectedCandidate.vacancyId !== vacancy.id}
                  >
                    {vacancy.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ai', 'hr', 'team'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${
                      formData.type === type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 text-gray-700 hover:border-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {getInterviewTypeIcon(type)}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional interview notes..."
              />
            </div>

            {/* Summary */}
            {selectedCandidate && selectedVacancy && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-600">
                  Scheduling {formData.type.toUpperCase()} interview with{' '}
                  <span className="font-medium">{selectedCandidate.name}</span> for{' '}
                  <span className="font-medium">{selectedVacancy.title}</span> position
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Schedule
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default ScheduleInterviewModal;