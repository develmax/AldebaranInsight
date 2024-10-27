import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, AlertTriangle } from 'lucide-react';
import { CandidateScore } from '../../services/candidateRanking';
import { useCandidateStore } from '../../stores/candidateStore';

interface CandidateRankingListProps {
  rankings: CandidateScore[];
}

const CandidateRankingList = ({ rankings }: CandidateRankingListProps) => {
  const candidates = useCandidateStore((state) => state.candidates);

  return (
    <div className="space-y-4">
      {rankings.map((ranking, index) => {
        const candidate = candidates.find((c) => c.id === ranking.candidateId);
        if (!candidate) return null;

        return (
          <motion.div
            key={ranking.candidateId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50">
                  {index < 3 ? (
                    <Trophy className={`h-5 w-5 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      'text-amber-600'
                    }`} />
                  ) : (
                    <span className="text-gray-500 font-medium">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {candidate.experience} years • {candidate.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(ranking.totalScore * 100)}%
                </div>
                <p className="text-sm text-gray-500">Overall Match</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Skills</div>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-100 h-2 rounded-full">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${ranking.breakdown.skills * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {Math.round(ranking.breakdown.skills * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Experience</div>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-100 h-2 rounded-full">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${ranking.breakdown.experience * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {Math.round(ranking.breakdown.experience * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Interview</div>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-100 h-2 rounded-full">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${ranking.breakdown.interview * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {Math.round(ranking.breakdown.interview * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Culture Fit</div>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-100 h-2 rounded-full">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${ranking.breakdown.culture * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {Math.round(ranking.breakdown.culture * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-500" />
                  Key Strengths
                </h4>
                <ul className="mt-2 space-y-1">
                  {ranking.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
              {ranking.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Areas for Consideration
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {ranking.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        • {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CandidateRankingList;