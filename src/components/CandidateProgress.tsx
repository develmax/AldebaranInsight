import React from 'react';

const CandidateProgress = () => {
  const candidates = [
    {
      name: 'Sarah Chen',
      role: 'Senior Frontend Developer',
      progress: 85,
      stage: 'Final Interview',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      progress: 65,
      stage: 'AI Assessment',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Emily Watson',
      role: 'UX Designer',
      progress: 45,
      stage: 'Technical Interview',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  ];

  return (
    <div className="space-y-6">
      {candidates.map((candidate, index) => (
        <div key={index} className="flex items-center space-x-4">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900">{candidate.name}</h3>
              <span className="text-sm text-gray-500">{candidate.stage}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{candidate.role}</p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${candidate.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateProgress;