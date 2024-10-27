import React from 'react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../../stores/interviewStore';
import { useCandidateStore } from '../../stores/candidateStore';
import { useVacancyStore } from '../../stores/vacancyStore';
import InterviewCard from './InterviewCard';

interface InterviewListProps {
  type: 'upcoming' | 'completed' | 'all';
  candidateId?: string;
}

const InterviewList = ({ type, candidateId }: InterviewListProps) => {
  const { interviews } = useInterviewStore();
  const candidates = useCandidateStore(state => state.candidates);
  const vacancies = useVacancyStore(state => state.vacancies);

  const filteredInterviews = interviews
    .filter((interview) => 
      candidateId ? interview.candidateId === candidateId : true
    )
    .filter((interview) => {
      if (type === 'all') return true;
      return type === 'upcoming' 
        ? interview.status === 'scheduled'
        : interview.status === 'completed';
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(interview => ({
      ...interview,
      candidate: candidates.find(c => c.id === interview.candidateId),
      vacancy: vacancies.find(v => v.id === interview.vacancyId),
    }));

  return (
    <div className="space-y-4">
      {filteredInterviews.map((interview, index) => (
        <motion.div
          key={interview.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InterviewCard 
            interview={interview}
            candidate={interview.candidate}
            vacancy={interview.vacancy}
            onJoin={interview.status === 'scheduled' ? () => {} : undefined}
          />
        </motion.div>
      ))}
      {filteredInterviews.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No {type} interviews found
        </p>
      )}
    </div>
  );
};

export default InterviewList;