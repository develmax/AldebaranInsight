import { create } from 'zustand';
import { ChatMessage } from '../types/recruitment';

interface ChatStore {
  messages: Record<string, ChatMessage[]>;
  addMessage: (candidateId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getMessages: (candidateId: string) => ChatMessage[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {},
  addMessage: (candidateId, message) => set((state) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    return {
      messages: {
        ...state.messages,
        [candidateId]: [...(state.messages[candidateId] || []), newMessage],
      },
    };
  }),
  getMessages: (candidateId) => get().messages[candidateId] || [],
}));