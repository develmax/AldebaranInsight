import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumeAnalysisProps {
  analysis: {
    score: number;
    skillsMatch: Array<{
      skill: string;
      score: number;
      notes: string;
    }>;
    experienceRelevance: number;
    recommendations: string[];
    redFlags?: string[];
  };
  isLoading?: boolean;
}

const ResumeAnalysis = ({ analysis, isLoading }: ResumeAnalysisProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Resume Analysis</h3>
        </div>
        <div className="text-2xl font-bold text-indigo-600">{analysis.score}%</div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Skills Assessment</h4>
        <div className="space-y-3">
          {analysis.skillsMatch.map((skill, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                <span className="text-sm text-gray-500">{skill.score}%</span>
              </div>
              <div className="flex-1 bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
              {skill.notes && (
                <p className="text-sm text-gray-600 mt-1">{skill.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Experience Relevance</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-100 h-2 rounded-full">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${analysis.experienceRelevance}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {analysis.experienceRelevance}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Key Recommendations
          </h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {rec}
              </li>
            ))}
          </ul>
        </div>

        {analysis.redFlags && analysis.redFlags.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Areas of Concern
            </h4>
            <ul className="space-y-2">
              {analysis.redFlags.map((flag, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeAnalysis;