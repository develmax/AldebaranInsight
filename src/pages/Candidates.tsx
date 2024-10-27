import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useCandidateStore } from '../stores/candidateStore';
import CandidateList from '../components/candidates/CandidateList';
import AddCandidateModal from '../components/candidates/AddCandidateModal';

const Candidates = () => {
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus } = useCandidateStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Candidate
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="screening">Screening</option>
          <option value="ai_interview">AI Interview</option>
          <option value="hr_review">HR Review</option>
          <option value="team_interview">Team Interview</option>
          <option value="offer_sent">Offer Sent</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <CandidateList />
      
      <AddCandidateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Candidates;