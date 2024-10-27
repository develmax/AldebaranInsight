import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Star } from 'lucide-react';
import { Candidate } from '../../types/recruitment';
import { Link } from 'react-router-dom';

interface CandidateSearchResultsProps {
  candidates: Candidate[];
  searchScore?: Record<string, number>;
}

const CandidateSearchResults = ({ candidates, searchScore }: CandidateSearchResultsProps) => {
  return (
    <div className="space-y-4">
      {candidates.map((candidate, index) => (
        <motion.div
          key={candidate.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {candidate.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {candidate.experience} years
                </div>
                {searchScore?.[candidate.id] && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {searchScore[candidate.id]}% match
                  </div>
                )}
              </div>
            </div>
            <Link
              to={`/candidates/${candidate.id}`}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View Profile
            </Link>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
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

          {candidate.aiScore && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  AI Assessment Score
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {candidate.aiScore}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${candidate.aiScore}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {candidates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Search className="h-12 w-12 mb-4" />
          <p>No candidates found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default CandidateSearchResults;