// Tests pour le service des actualités
import { describe } from 'node:test';
import { newsService } from '../newsService';

// Mock de fetch
global.fetch = jest.fn();

describe('NewsService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getNews', () => {
    it('devrait récupérer la liste des actualités', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Test News',
            content: 'Test content',
            author: 'Test Author',
            created_at: '2024-01-01T00:00:00Z',
            views_count: 100,
            likes_count: 10,
            comments_count: 5,
            shares_count: 2,
            is_featured: false,
            is_urgent: false,
            priority: 'medium',
            type: 'news',
            status: 'published'
          }
        ],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 1,
        from: 1,
        to: 1
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await newsService.getNews();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/news'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('devrait gérer les erreurs de réseau', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(newsService.getNews()).rejects.toThrow('Network error');
    });

    it('devrait gérer les erreurs HTTP', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(newsService.getNews()).rejects.toThrow('Erreur HTTP: 500');
    });
  });

  describe('getNewsById', () => {
    it('devrait récupérer une actualité par ID', async () => {
      const mockNews = {
        id: 1,
        title: 'Test News',
        content: 'Test content',
        author: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views_count: 100,
        likes_count: 10,
        comments_count: 5,
        shares_count: 2,
        is_featured: false,
        is_urgent: false,
        priority: 'medium',
        type: 'news',
        status: 'published'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockNews,
      });

      const result = await newsService.getNewsById(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/news/1'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result).toEqual(mockNews);
    });
  });

  describe('likeNews', () => {
    it('devrait liker une actualité', async () => {
      const mockResponse = {
        message: 'Like ajouté',
        likes_count: 11
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await newsService.likeNews(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/news/1/like'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('shareNews', () => {
    it('devrait partager une actualité', async () => {
      const mockResponse = {
        message: 'Partage comptabilisé',
        shares_count: 3
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await newsService.shareNews(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/news/1/share'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getNewsStats', () => {
    it('devrait récupérer les statistiques', async () => {
      const mockStats = {
        total: 10,
        published: 8,
        draft: 2,
        archived: 0,
        featured: 3,
        urgent: 1,
        total_views: 1000,
        total_likes: 100,
        total_comments: 50,
        total_shares: 25,
        by_category: [
          { category: 'Éducation', count: 5 },
          { category: 'Technologie', count: 3 }
        ],
        by_priority: [
          { priority: 'high', count: 2 },
          { priority: 'medium', count: 6 },
          { priority: 'low', count: 2 }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      });

      const result = await newsService.getNewsStats();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/news/stats'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result).toEqual(mockStats);
    });
  });
});
