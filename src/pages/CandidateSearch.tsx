import React, { useState } from 'react';
import { Search, Brain } from 'lucide-react';
import { useCandidateStore } from '../stores/candidateStore';
import { filterCandidates } from '../services/candidateSearch';
import CandidateSearchForm from '../components/search/CandidateSearchForm';
import CandidateSearchResults from '../components/search/CandidateSearchResults';

const CandidateSearch = () => {
  const [searchResults, setSearchResults] = useState<{
    candidates: ReturnType<typeof filterCandidates>;
    scores?: Record<string, number>;
  }>({ candidates: [] });

  const { candidates } = useCandidateStore();

  const handleSearch = (criteria: {
    skills: string[];
    minExperience?: number;
    location?: string;
    status?: string[];
  }) => {
    const filteredCandidates = filterCandidates(candidates, criteria);
    setSearchResults({ candidates: filteredCandidates });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Candidates</h1>
          <p className="text-gray-600 mt-1">
            Find the perfect candidates for your positions
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Brain className="h-5 w-5" />
          <span>AI-Powered Search</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <CandidateSearchForm onSearch={handleSearch} />
      </div>

      {searchResults.candidates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({searchResults.candidates.length})
          </h2>
          <CandidateSearchResults
            candidates={searchResults.candidates}
            searchScore={searchResults.scores}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;