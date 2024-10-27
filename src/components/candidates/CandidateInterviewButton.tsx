import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import AIInterviewModal from '../interviews/AIInterviewModal';

interface CandidateInterviewButtonProps {
  candidateId: string;
}

const CandidateInterviewButton = ({ candidateId }: CandidateInterviewButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Brain className="h-5 w-5 mr-2" />
        Start AI Interview
      </button>

      <AIInterviewModal
        candidateId={candidateId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CandidateInterviewButton;