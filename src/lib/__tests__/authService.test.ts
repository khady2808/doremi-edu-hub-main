import { authService } from '../authService';
import { API_CONFIG } from '../../config/api';

// Mock fetch
global.fetch = jest.fn();

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          surname: 'Doe',
          email: 'john@example.com',
          role: 'student',
          email_verified_at: null,
          created_at: '2024-01-01T00:00:00.000000Z',
          updated_at: '2024-01-01T00:00:00.000000Z',
        },
        token: 'mock-jwt-token',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await authService.login('john@example.com', 'password123');

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockResponse.user));
      expect(global.fetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ email: 'john@example.com', password: 'password123' }),
      });
    });

    it('should handle login error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      });

      await expect(authService.login('john@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        user: {
          id: 2,
          name: 'Jane Doe',
          surname: 'Doe',
          email: 'jane@example.com',
          role: 'teacher',
          email_verified_at: null,
          created_at: '2024-01-01T00:00:00.000000Z',
          updated_at: '2024-01-01T00:00:00.000000Z',
        },
        token: 'mock-jwt-token-2',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const registerData = {
        name: 'Jane Doe',
        surname: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'teacher' as const,
      };

      const result = await authService.register(registerData);

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token-2');
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockResponse.user));
    });

    it('should handle register error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Email already exists' }),
      });

      const registerData = {
        name: 'Jane Doe',
        surname: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'teacher' as const,
      };

      await expect(authService.register(registerData)).rejects.toThrow('Email already exists');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        surname: 'Doe',
        email: 'john@example.com',
        role: 'student',
        email_verified_at: null,
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      };

      // Set token in localStorage
      localStorage.setItem('auth_token', 'mock-jwt-token');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));
      expect(global.fetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/user`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': 'Bearer mock-jwt-token',
        },
      });
    });

    it('should handle no token error', async () => {
      await expect(authService.getCurrentUser()).rejects.toThrow('Aucun token d\'authentification trouvé');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Set token in localStorage
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('auth_user', '{"id": 1}');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Logout successful' }),
      });

      await authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': 'Bearer mock-jwt-token',
        },
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('auth_user', '{"id": 1}');

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', async () => {
      localStorage.setItem('auth_token', 'mock-jwt-token');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

      const result = await authService.validateToken();

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      localStorage.setItem('auth_token', 'invalid-token');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await authService.validateToken();

      expect(result).toBe(false);
    });

    it('should return false when no token', async () => {
      const result = await authService.validateToken();

      expect(result).toBe(false);
    });
  });

  describe('getAuthHeaders', () => {
    it('should return headers with token when authenticated', () => {
      localStorage.setItem('auth_token', 'mock-jwt-token');

      const headers = authService.getAuthHeaders();

      expect(headers).toEqual({
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': 'Bearer mock-jwt-token',
      });
    });

    it('should return headers without token when not authenticated', () => {
      const headers = authService.getAuthHeaders();

      expect(headers).toEqual(API_CONFIG.DEFAULT_HEADERS);
    });
  });
});
