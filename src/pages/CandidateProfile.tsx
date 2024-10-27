import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Link as LinkIcon,
  FileText,
  Github,
  Linkedin,
  MessageSquare,
  Brain,
  Send,
  Calendar,
  Trash2
} from 'lucide-react';
import { useCandidateStore } from '../stores/candidateStore';
import { useVacancyStore } from '../stores/vacancyStore';
import { useOfferStore } from '../stores/offerStore';
import CandidateAIChat from '../components/candidates/CandidateAIChat';
import CandidateAnalysis from '../components/candidates/CandidateAnalysis';
import CreateOfferModal from '../components/offers/CreateOfferModal';
import OfferTimeline from '../components/offers/OfferTimeline';
import { motion } from 'framer-motion';

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidates, deleteCandidate } = useCandidateStore();
  const candidate = candidates.find((c) => c.id === id);
  const vacancy = useVacancyStore((state) =>
    state.vacancies.find((v) => v.id === candidate?.vacancyId)
  );
  const offers = useOfferStore((state) =>
    state.getOffersByCandidate(id || '')
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'ai-analysis' | 'chat' | 'offers'>('overview');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      deleteCandidate(id || '');
      navigate('/candidates');
    }
  };

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Candidate not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
    { id: 'chat', label: 'Interview Chat', icon: MessageSquare },
    { id: 'offers', label: 'Offers', icon: Send },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-indigo-600">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600">{vacancy?.title || 'No vacancy assigned'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {candidate.status === 'team_interview' && (
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Send className="h-5 w-5 mr-2" />
                Create Offer
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Mail className="h-5 w-5 mr-2" />
              <a href={`mailto:${candidate.email}`} className="hover:text-indigo-600">
                {candidate.email}
              </a>
            </div>
            {candidate.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <a href={`tel:${candidate.phone}`} className="hover:text-indigo-600">
                  {candidate.phone}
                </a>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {candidate.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 mr-2" />
              {candidate.experience} years of experience
            </div>
          </div>

          <div className="space-y-4">
            {candidate.linkedinUrl && (
              <div className="flex items-center text-gray-600">
                <Linkedin className="h-5 w-5 mr-2" />
                <a 
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {candidate.githubUrl && (
              <div className="flex items-center text-gray-600">
                <Github className="h-5 w-5 mr-2" />
                <a 
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600"
                >
                  GitHub Profile
                </a>
              </div>
            )}
            {candidate.resumeUrl && (
              <div className="flex items-center text-gray-600">
                <FileText className="h-5 w-5 mr-2" />
                <a 
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600"
                >
                  View Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon && <tab.icon className="h-5 w-5" />}
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {vacancy && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Vacancy Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {vacancy.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ai-analysis' && candidate.aiNotes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CandidateAnalysis analysis={JSON.parse(candidate.aiNotes)} />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[600px]"
            >
              <CandidateAIChat
                candidateId={candidate.id}
                messages={[]}
                onSendMessage={async () => {}}
                isLoading={false}
              />
            </motion.div>
          )}

          {activeTab === 'offers' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <OfferTimeline offers={offers} />
            </motion.div>
          )}
        </div>
      </div>

      <CreateOfferModal
        candidateId={candidate.id}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
      />
    </div>
  );
};

export default CandidateProfile;