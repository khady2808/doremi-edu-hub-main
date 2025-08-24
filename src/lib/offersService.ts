export interface RecruiterOffer {
  id: string;
  title: string;
  description: string;
  contractType?: string;
  location?: string;
  publishedAt: string;
  recruiterId: string;
  recruiterName: string;
  status: 'published' | 'draft';
}

const STORAGE_KEY = 'doremi_recruiter_offers';

export const offersService = {
  getAll(): RecruiterOffer[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },
  getByRecruiter(recruiterId: string): RecruiterOffer[] {
    return this.getAll().filter(o => o.recruiterId === recruiterId);
  },
  add(offer: Omit<RecruiterOffer, 'id' | 'publishedAt'>): RecruiterOffer {
    const newOffer: RecruiterOffer = {
      ...offer,
      id: 'offer_' + Math.random().toString(36).slice(2),
      publishedAt: new Date().toISOString(),
    };
    const all = this.getAll();
    all.unshift(newOffer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newOffer;
  },
  deleteOffer(offerId: string): boolean {
    try {
      const all = this.getAll();
      const filtered = all.filter(o => o.id !== offerId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      return false;
    }
  }
};


