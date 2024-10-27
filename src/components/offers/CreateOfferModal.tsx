import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOfferStore } from '../../stores/offerStore';
import { useCandidateStore } from '../../stores/candidateStore';
import { useVacancyStore } from '../../stores/vacancyStore';
import { format, addDays } from 'date-fns';

interface CreateOfferModalProps {
  candidateId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CreateOfferModal = ({ candidateId, isOpen, onClose }: CreateOfferModalProps) => {
  const addOffer = useOfferStore((state) => state.addOffer);
  const candidate = useCandidateStore((state) => 
    state.candidates.find((c) => c.id === candidateId)
  );
  const vacancy = useVacancyStore((state) =>
    state.vacancies.find((v) => v.id === candidate?.vacancyId)
  );

  const [formData, setFormData] = useState({
    salary: vacancy?.salary || '',
    startDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    benefits: [''],
    expiresAt: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => (i === index ? value : benefit)),
    }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ''],
    }));
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      setFormData((prev) => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidate || !vacancy) return;

    // Filter out empty benefits
    const cleanedBenefits = formData.benefits.filter(benefit => benefit.trim() !== '');
    
    // Create new offer
    addOffer({
      candidateId,
      vacancyId: vacancy.id,
      status: 'draft',
      salary: formData.salary,
      startDate: formData.startDate,
      benefits: cleanedBenefits,
      expiresAt: formData.expiresAt,
    });

    // Update candidate status
    useCandidateStore.getState().updateCandidate(candidateId, {
      status: 'offer_sent',
    });

    // Reset form and close modal
    setFormData({
      salary: vacancy.salary,
      startDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      benefits: [''],
      expiresAt: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Create Offer</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $120,000/year"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Expiration Date
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Benefits
                    </label>
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Add Benefit
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter benefit"
                          required
                        />
                        {formData.benefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBenefit(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

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
                    Create Offer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateOfferModal;