import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CandidateSearchFormProps {
  onSearch: (criteria: {
    skills: string[];
    minExperience?: number;
    location?: string;
    status?: string[];
  }) => void;
}

const CandidateSearchForm = ({ onSearch }: CandidateSearchFormProps) => {
  const [skills, setSkills] = useState<string[]>(['']);
  const [minExperience, setMinExperience] = useState<string>('');
  const [location, setLocation] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleAddSkill = () => {
    setSkills([...skills, '']);
  };

  const handleRemoveSkill = (index: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const handleSkillChange = (index: number, value: string) => {
    setSkills(skills.map((skill, i) => (i === index ? value : skill)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      skills: skills.filter(skill => skill.trim() !== ''),
      minExperience: minExperience ? parseInt(minExperience) : undefined,
      location: location || undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills
        </label>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter skill"
              />
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddSkill}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Experience (years)
          </label>
          <input
            type="number"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter location"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Candidate Status
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'new',
            'screening',
            'ai_interview',
            'hr_review',
            'team_interview',
            'offer_sent',
            'hired',
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setSelectedStatuses((prev) =>
                  prev.includes(status)
                    ? prev.filter((s) => s !== status)
                    : [...prev, status]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStatuses.includes(status)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Candidates
        </button>
      </div>
    </form>
  );
};

export default CandidateSearchForm;