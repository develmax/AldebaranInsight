import React, { useState, useEffect } from 'react';
import { X, Brain, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewStore } from '../../stores/interviewStore';
import { useCandidateStore } from '../../stores/candidateStore';
import { useVacancyStore } from '../../stores/vacancyStore';
import { startAIChat, analyzeInterviewResponse } from '../../services/aiChat';
import { ChatMessage } from '../../types/recruitment';

interface AIInterviewModalProps {
  candidateId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AIInterviewModal = ({ candidateId, isOpen, onClose }: AIInterviewModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const candidate = useCandidateStore((state) => 
    state.candidates.find((c) => c.id === candidateId)
  );
  const vacancy = useVacancyStore((state) =>
    state.vacancies.find((v) => v.id === candidate?.vacancyId)
  );
  const addInterview = useInterviewStore((state) => state.addInterview);
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);

  useEffect(() => {
    if (isOpen && candidate && vacancy) {
      // Start interview with initial AI message
      handleAIResponse("Hello! I'll be conducting your technical interview today. Could you start by telling me about your relevant experience for this position?");
    }
  }, [isOpen, candidate, vacancy]);

  const handleAIResponse = async (content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      candidateId,
      role: 'ai',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !candidate || !vacancy || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      candidateId,
      role: 'human',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await startAIChat(
        candidate,
        vacancy,
        userMessage.content
      );

      if (aiResponse) {
        await handleAIResponse(aiResponse);

        // Check if interview should be completed
        if (messages.length >= 10) {
          await completeInterview();
        }
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeInterview = async () => {
    if (!candidate || !vacancy) return;

    setIsLoading(true);
    try {
      // Analyze the entire conversation
      const analysis = await analyzeInterviewResponse(
        candidate,
        vacancy,
        messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      );

      // Create interview record
      addInterview({
        candidateId,
        vacancyId: vacancy.id,
        type: 'ai',
        status: 'completed',
        date: new Date().toISOString(),
        duration: 30,
        notes: analysis,
        aiSummary: analysis,
        score: 85, // This should be parsed from the analysis
      });

      // Update candidate status
      updateCandidate(candidateId, {
        status: 'hr_review',
        aiScore: 85, // This should be parsed from the analysis
        aiNotes: analysis,
      });

      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing interview:', error);
    } finally {
      setIsLoading(false);
    }
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
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">AI Interview</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'human' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'human'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                {!isCompleted ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-green-600 font-medium">
                      Interview completed! The HR team will review the results.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIInterviewModal;