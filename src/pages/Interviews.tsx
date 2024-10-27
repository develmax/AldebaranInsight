import React, { useState } from 'react';
import { Plus, Calendar, Search } from 'lucide-react';
import { useInterviewStore } from '../stores/interviewStore';
import InterviewList from '../components/interviews/InterviewList';
import ScheduleInterviewModal from '../components/interviews/ScheduleInterviewModal';

const Interviews = () => {
  const { searchQuery, setSearchQuery, filterType, setFilterType } = useInterviewStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Interviews</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule Interview
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="ai">AI Interview</option>
          <option value="hr">HR Interview</option>
          <option value="team">Team Interview</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <InterviewList type="upcoming" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Completed Interviews</h3>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <InterviewList type="completed" />
        </div>
      </div>

      <ScheduleInterviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Interviews;