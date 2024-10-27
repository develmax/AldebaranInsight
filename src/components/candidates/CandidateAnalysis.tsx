import React from 'react';
import { AIAnalysis } from '../../types/recruitment';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CandidateAnalysisProps {
  analysis: AIAnalysis;
}

const CandidateAnalysis = ({ analysis }: CandidateAnalysisProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 bg-gray-100 h-2 rounded-full">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${analysis.score}%` }}
            />
          </div>
          <span className="font-semibold text-lg">{analysis.score}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Skills Assessment</h4>
        <div className="grid gap-3">
          {analysis.skillsMatch.map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{skill.skill}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-100 h-2 rounded-full">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{skill.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Recommendations</h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {analysis.redFlags && analysis.redFlags.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Potential Concerns</h4>
          <ul className="space-y-2">
            {analysis.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CandidateAnalysis;