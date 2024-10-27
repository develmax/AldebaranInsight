import React from 'react';
import { 
  MapPin, 
  Mail, 
  Briefcase, 
  ArrowRight,
  Star,
  Clock,
  Tag,
  Calendar,
  Brain,
  Link as LinkIcon
} from 'lucide-react';
import { Candidate } from '../../types/recruitment';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { useVacancyStore } from '../../stores/vacancyStore';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const vacancy = useVacancyStore(
    state => state.vacancies.find(v => v.id === candidate.vacancyId)
  );

  const statusColors = {
    new: 'bg-blue-50 text-blue-700',
    screening: 'bg-yellow-50 text-yellow-700',
    ai_interview: 'bg-purple-50 text-purple-700',
    hr_review: 'bg-indigo-50 text-indigo-700',
    team_interview: 'bg-green-50 text-green-700',
    offer_sent: 'bg-orange-50 text-orange-700',
    hired: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-indigo-600">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            {vacancy && (
              <p className="text-sm text-gray-600 mt-1">
                Applying for {vacancy.title}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
                {formatStatus(candidate.status)}
              </span>
              {candidate.source && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  via {candidate.source}
                </span>
              )}
            </div>
          </div>
        </div>
        {candidate.aiScore && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold text-gray-700">{candidate.aiScore}%</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">AI Score</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${candidate.email}`} className="hover:text-indigo-600 truncate">
              {candidate.email}
            </a>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{candidate.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase className="h-4 w-4 mr-2" />
            {candidate.experience} years experience
          </div>
        </div>

        <div className="space-y-3">
          {candidate.linkedinUrl && (
            <div className="flex items-center text-gray-600">
              <LinkIcon className="h-4 w-4 mr-2" />
              <a 
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 truncate"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
          {candidate.githubUrl && (
            <div className="flex items-center text-gray-600">
              <LinkIcon className="h-4 w-4 mr-2" />
              <a 
                href={candidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 truncate"
              >
                GitHub Profile
              </a>
            </div>
          )}
          {candidate.interviewDate && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Next Interview: {format(new Date(candidate.interviewDate), 'MMM d, HH:mm')}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          Added {formatDistanceToNow(new Date(candidate.createdAt))} ago
        </div>
        <Link
          to={`/candidates/${candidate.id}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          View Profile
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;