import React, { useState, useEffect } from 'react';
import { X, Brain, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVacancyStore } from '../../stores/vacancyStore';
import { useCandidateStore } from '../../stores/candidateStore';
import { analyzeResumeFile } from '../../services/resumeParser';
import { analyzeResume } from '../../services/openai';
import ResumeUploader from './ResumeUploader';
import ResumeAnalysis from './ResumeAnalysis';

interface CandidateAnalysisModalProps {
  candidateId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateAnalysisModal = ({ candidateId, isOpen, onClose }: CandidateAnalysisModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);

  const candidate = useCandidateStore((state) =>
    state.candidates.find((c) => c.id === candidateId)
  );

  const vacancy = useVacancyStore((state) =>
    state.vacancies.find((v) => v.id === candidate?.vacancyId)
  );

  const updateCandidate = useCandidateStore((state) => state.updateCandidate);

  // Validate candidate and vacancy on mount and when they change
  useEffect(() => {
    if (isOpen) {
      if (!candidate) {
        setError('Candidate information not found.');
        return;
      }
      if (!vacancy) {
        setError('Vacancy information not found.');
        return;
      }
      setError('');
    }
  }, [candidate, vacancy, isOpen]);

  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      setError('Please upload a PDF or text file.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!candidate) {
      setError('Candidate information not found.');
      return;
    }

    if (!vacancy) {
      setError('Vacancy information not found.');
      return;
    }

    if (!selectedFile) {
      setError('Please upload a resume file first.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Parse the resume file
      const resumeText = await analyzeResumeFile(selectedFile);
      
      // Analyze the resume content
      const analysisResult = await analyzeResume(resumeText, vacancy);
      setAnalysis(analysisResult);

      // Extract information from resume text
      const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
      const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
      const locationMatch = resumeText.match(/(?:Location|Address|City):\s*([^,\n]+)/i);

      // Update candidate with analysis results and extracted information
      updateCandidate(candidateId, {
        status: 'screening',
        aiScore: analysisResult.score,
        aiNotes: JSON.stringify(analysisResult),
        skills: analysisResult.skillsMatch.map((skill: any) => skill.skill),
        experience: Math.round(analysisResult.experienceRelevance / 10),
        ...(emailMatch && { email: emailMatch[0] }),
        ...(nameMatch && { name: nameMatch[1] }),
        ...(locationMatch && { location: locationMatch[1].trim() }),
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError('');
    setAnalysis(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                AI Resume Analysis
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Candidate and Vacancy Info */}
            {candidate && vacancy && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Position:</span> {vacancy.title}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span> {vacancy.department}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Resume Upload Section */}
            {!error && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Upload Resume
                  </h3>
                  <ResumeUploader
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile || undefined}
                    onRemove={() => {
                      setSelectedFile(null);
                      setError('');
                    }}
                  />
                </div>

                {/* Analysis Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !selectedFile}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                  </button>
                </div>
              </>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Analysis Results
                </h3>
                <ResumeAnalysis analysis={analysis} />
              </div>
            )}

            {/* Position Requirements Reference */}
            {vacancy && (
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Position Requirements
                </h3>
                <ul className="space-y-2">
                  {vacancy.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-indigo-600 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {analysis && (
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue to Next Step
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CandidateAnalysisModal;