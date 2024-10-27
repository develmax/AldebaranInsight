import React from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialProfileAnalysisProps {
  linkedinData?: string;
  githubData?: string;
  isLoading?: boolean;
}

const SocialProfileAnalysis = ({ linkedinData, githubData, isLoading }: SocialProfileAnalysisProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {githubData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Github className="h-6 w-6 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">GitHub Analysis</h3>
          </div>

          <div className="space-y-4">
            {JSON.parse(githubData).repositories.map((repo: any, index: number) => (
              <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{repo.name}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(repo.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {repo.description && (
                  <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">
                    {repo.language || 'No language specified'}
                  </span>
                  <span className="text-sm text-gray-500">⭐ {repo.stars}</span>
                  <span className="text-sm text-gray-500">🔄 {repo.forks}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {linkedinData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
            <h3 className="text-lg font-semibold text-gray-900">LinkedIn Analysis</h3>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600">{linkedinData}</p>
          </div>
        </motion.div>
      )}

      {!githubData && !linkedinData && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <ExternalLink className="h-8 w-8 mb-2" />
          <p>No social profiles available for analysis</p>
        </div>
      )}
    </div>
  );
};

export default SocialProfileAnalysis;