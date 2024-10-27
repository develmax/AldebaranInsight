import React from 'react';
import { Brain, MessageSquare, Clock, Calendar } from 'lucide-react';
import { Interview } from '../../types/recruitment';
import { format } from 'date-fns';

interface InterviewSummaryProps {
  interview: Interview;
}

const InterviewSummary = ({ interview }: InterviewSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interview Summary</h3>
            <p className="text-sm text-gray-500">AI-Generated Overview</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(interview.date), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {interview.duration} minutes
          </div>
        </div>
      </div>

      {interview.aiSummary && (
        <div className="prose prose-sm max-w-none">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
            <p className="text-gray-600 whitespace-pre-line">{interview.aiSummary}</p>
          </div>
        </div>
      )}

      {interview.score !== undefined && (
        <div className="pt-6 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Score</span>
            <span className="text-lg font-semibold text-indigo-600">{interview.score}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${interview.score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSummary;