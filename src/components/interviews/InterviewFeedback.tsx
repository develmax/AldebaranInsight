import React from 'react';
import { Star, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface InterviewFeedbackProps {
  feedback: {
    score: number;
    technicalSkills: number;
    communication: number;
    problemSolving: number;
    cultureFit: number;
    strengths: string[];
    improvements: string[];
    recommendation: 'proceed' | 'review' | 'reject';
    notes?: string;
  };
}

const InterviewFeedback = ({ feedback }: InterviewFeedbackProps) => {
  const getRecommendationStyle = () => {
    switch (feedback.recommendation) {
      case 'proceed':
        return 'bg-green-50 text-green-700';
      case 'review':
        return 'bg-yellow-50 text-yellow-700';
      case 'reject':
        return 'bg-red-50 text-red-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Interview Feedback</h3>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-xl font-bold text-gray-900">{feedback.score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Technical Assessment</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Technical Skills</span>
                <span className="text-sm font-medium text-gray-900">
                  {feedback.technicalSkills}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${feedback.technicalSkills}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Problem Solving</span>
                <span className="text-sm font-medium text-gray-900">
                  {feedback.problemSolving}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${feedback.problemSolving}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Communication</span>
                <span className="text-sm font-medium text-gray-900">
                  {feedback.communication}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${feedback.communication}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Culture Fit</span>
                <span className="text-sm font-medium text-gray-900">
                  {feedback.cultureFit}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${feedback.cultureFit}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Key Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {feedback.notes && (
        <div className="pt-6 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            Additional Notes
          </h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{feedback.notes}</p>
        </div>
      )}

      <div className="pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Recommendation</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationStyle()}`}>
            {feedback.recommendation.charAt(0).toUpperCase() + feedback.recommendation.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewFeedback;