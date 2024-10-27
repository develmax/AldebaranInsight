import { create } from 'zustand';
import { Offer } from '../types/recruitment';

interface OfferStore {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  getOffersByCandidate: (candidateId: string) => Offer[];
  getActiveOffers: () => Offer[];
}

export const useOfferStore = create<OfferStore>((set, get) => ({
  offers: [],
  addOffer: (offer) => set((state) => ({
    offers: [...state.offers, { ...offer, id: crypto.randomUUID() }],
  })),
  updateOffer: (id, updates) => set((state) => ({
    offers: state.offers.map((offer) =>
      offer.id === id ? { ...offer, ...updates } : offer
    ),
  })),
  getOffersByCandidate: (candidateId) => 
    get().offers.filter((offer) => offer.candidateId === candidateId),
  getActiveOffers: () =>
    get().offers.filter((offer) => 
      ['draft', 'sent', 'negotiating'].includes(offer.status)
    ),
}));