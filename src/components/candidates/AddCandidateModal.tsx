import React, { useState } from 'react';
import { X, Upload, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidateStore } from '../../stores/candidateStore';
import { CandidateSource } from '../../types/recruitment';
import { analyzeResumeFile, ResumeAnalysis } from '../../services/resumeParser';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCandidateModal({ isOpen, onClose }: AddCandidateModalProps) {
  const addCandidate = useCandidateStore((state) => state.addCandidate);
  const [activeTab, setActiveTab] = useState<'form' | 'log'>('form');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [openAIResponse, setOpenAIResponse] = useState<string>('');
  const [requestLog, setRequestLog] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    source: 'linkedin' as CandidateSource,
    linkedinUrl: '',
    githubUrl: '',
    experience: 0,
    skills: [''],
    status: 'new' as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ''],
    }));
  };

  const removeSkill = (index: number) => {
    if (formData.skills.length > 1) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      setAnalysisError('Please select a file to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setOpenAIResponse('Analyzing resume...\n\n');
    setRequestLog('');

    try {
      const analysis = await analyzeResumeFile(selectedFile, (log) => {
        if (log.request) {
          setRequestLog(prev => prev + '\n=== REQUEST ===\n' + 
            `Timestamp: ${log.request.timestamp}\n` +
            `Model: ${log.request.model}\n` +
            'Prompt:\n' + log.request.prompt + '\n'
          );
        }
        if (log.response) {
          setRequestLog(prev => prev + '\n=== RESPONSE ===\n' + 
            `Timestamp: ${log.response.timestamp}\n` +
            'Content:\n' + log.response.content + '\n'
          );
        }
        if (log.error) {
          setRequestLog(prev => prev + '\n=== ERROR ===\n' + 
            `Timestamp: ${log.error.timestamp}\n` +
            'Message:\n' + log.error.message + '\n'
          );
        }
      });

      setAnalysisResult(analysis);
      
      // Update form data with analysis results
      setFormData({
        ...formData,
        name: analysis.personal.name || formData.name,
        email: analysis.personal.email || formData.email,
        phone: analysis.personal.phone || formData.phone,
        location: analysis.personal.location || formData.location,
        experience: analysis.professional.experience || formData.experience,
        linkedinUrl: analysis.professional.linkedinUrl || formData.linkedinUrl,
        githubUrl: analysis.professional.githubUrl || formData.githubUrl,
        skills: analysis.professional.skills.length > 0 
          ? analysis.professional.skills 
          : formData.skills,
      });

      // Format and display OpenAI response
      setOpenAIResponse(prev => prev + JSON.stringify(analysis, null, 2));
      
      // Switch to log tab to show the response
      setActiveTab('log');
    } catch (error) {
      console.error('Resume analysis failed:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Resume analysis failed');
      setOpenAIResponse(prev => prev + `\nError: ${error instanceof Error ? error.message : 'Analysis failed'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty skills
    const cleanedSkills = formData.skills.filter(skill => skill.trim() !== '');
    
    if (cleanedSkills.length === 0) {
      alert('Please add at least one skill');
      return;
    }

    // Add new candidate
    addCandidate({
      ...formData,
      skills: cleanedSkills,
    });

    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      source: 'linkedin',
      linkedinUrl: '',
      githubUrl: '',
      experience: 0,
      skills: [''],
      status: 'new',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Add New Candidate</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'form'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Form
                  </button>
                  <button
                    onClick={() => setActiveTab('log')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'log'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Analysis Log
                  </button>
                </nav>
              </div>

              {activeTab === 'form' ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume Upload
                      </label>
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <input
                          type="file"
                          accept=".txt,.pdf"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PDF or TXT files only
                          </span>
                        </label>
                      </div>
                      {selectedFile && (
                        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600">{selectedFile.name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleAnalyzeResume}
                          disabled={isAnalyzing}
                          className="mt-2 inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                        </button>
                      )}
                      {analysisError && (
                        <p className="mt-2 text-sm text-red-600">{analysisError}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Source
                        </label>
                        <select
                          name="source"
                          value={formData.source}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="referral">Referral</option>
                          <option value="internal">Internal</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          name="linkedinUrl"
                          value={formData.linkedinUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Skills
                        </label>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Add Skill
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => handleSkillChange(index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter skill"
                              required
                            />
                            {formData.skills.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add Candidate
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">OpenAI Request/Response Log</h3>
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                        {requestLog || 'No analysis performed yet. Upload a resume and click "Analyze Resume" to see the OpenAI interaction log.'}
                      </pre>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Analysis Result</h3>
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                        {openAIResponse || 'No analysis results yet.'}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}