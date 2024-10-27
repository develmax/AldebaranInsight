import React from 'react';
import { Calendar, Clock, User, Video, Brain, Users, Trash2 } from 'lucide-react';
import { Interview, Candidate, Vacancy } from '../../types/recruitment';
import { format } from 'date-fns';
import { useInterviewStore } from '../../stores/interviewStore';

interface InterviewCardProps {
  interview: Interview;
  candidate?: Candidate;
  vacancy?: Vacancy;
  onJoin?: () => void;
}

const InterviewTypeIcon = ({ type }: { type: Interview['type'] }) => {
  switch (type) {
    case 'ai':
      return <Brain className="h-5 w-5 text-purple-600" />;
    case 'hr':
      return <User className="h-5 w-5 text-blue-600" />;
    case 'team':
      return <Users className="h-5 w-5 text-green-600" />;
  }
};

const InterviewCard = ({ interview, candidate, vacancy, onJoin }: InterviewCardProps) => {
  const deleteInterview = useInterviewStore((state) => state.deleteInterview);

  const typeStyles = {
    ai: 'bg-purple-50 text-purple-700',
    hr: 'bg-blue-50 text-blue-700',
    team: 'bg-green-50 text-green-700',
  };

  const typeLabels = {
    ai: 'AI Interview',
    hr: 'HR Interview',
    team: 'Team Interview',
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      deleteInterview(interview.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <InterviewTypeIcon type={interview.type} />
          <div className="space-y-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeStyles[interview.type]}`}>
              {typeLabels[interview.type]}
            </span>
            {candidate && (
              <p className="text-sm font-medium text-gray-900">
                {candidate.name}
              </p>
            )}
            {vacancy && (
              <p className="text-sm text-gray-600">
                {vacancy.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {interview.status === 'scheduled' && onJoin && (
            <button
              onClick={onJoin}
              className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              <Video className="h-4 w-4 mr-1" />
              Join
            </button>
          )}
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Interview"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {format(new Date(interview.date), 'MMMM d, yyyy')}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {format(new Date(interview.date), 'h:mm a')} ({interview.duration} minutes)
        </div>
      </div>

      {interview.status === 'completed' && interview.score !== undefined && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Score</span>
            <span className="text-sm font-semibold text-gray-900">{interview.score}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-100 h-2 rounded-full">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${interview.score}%` }}
            />
          </div>
        </div>
      )}

      {interview.notes && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">{interview.notes}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;