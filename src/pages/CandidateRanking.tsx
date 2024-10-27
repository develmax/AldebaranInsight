import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, Users } from 'lucide-react';
import { useVacancyStore } from '../stores/vacancyStore';
import { useCandidateStore } from '../stores/candidateStore';
import { rankCandidates } from '../services/candidateRanking';
import CandidateRankingList from '../components/candidates/CandidateRankingList';

const CandidateRanking = () => {
  const { vacancyId } = useParams<{ vacancyId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [rankings, setRankings] = useState<any[]>([]);

  const vacancy = useVacancyStore((state) =>
    state.vacancies.find((v) => v.id === vacancyId)
  );
  const candidates = useCandidateStore((state) =>
    state.candidates.filter((c) => c.vacancyId === vacancyId)
  );

  useEffect(() => {
    const loadRankings = async () => {
      if (!vacancy || candidates.length === 0) return;

      setIsLoading(true);
      try {
        const rankedCandidates = await rankCandidates(candidates, vacancy);
        setRankings(rankedCandidates);
      } catch (error) {
        console.error('Error ranking candidates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRankings();
  }, [vacancy, candidates]);

  if (!vacancy) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Vacancy not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Rankings</h1>
          <p className="text-gray-600 mt-1">{vacancy.title}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Brain className="h-5 w-5" />
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>{candidates.length} Candidates</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : rankings.length > 0 ? (
        <CandidateRankingList rankings={rankings} />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No candidates to rank</p>
        </div>
      )}
    </div>
  );
};

export default CandidateRanking;