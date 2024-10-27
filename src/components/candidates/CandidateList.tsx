import React from 'react';
import { motion } from 'framer-motion';
import CandidateCard from './CandidateCard';
import { useCandidateStore } from '../../stores/candidateStore';

const CandidateList = () => {
  const { candidates, searchQuery, filterStatus } = useCandidateStore();

  const filteredCandidates = candidates
    .filter((candidate) =>
      filterStatus === 'all' ? true : candidate.status === filterStatus
    )
    .filter((candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCandidates.map((candidate) => (
        <motion.div
          key={candidate.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CandidateCard candidate={candidate} />
        </motion.div>
      ))}
      {filteredCandidates.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No candidates found
        </div>
      )}
    </div>
  );
};

export default CandidateList;