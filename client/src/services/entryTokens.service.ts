import { User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Check if in browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Entry tokens service for managing room entry tokens
 */
export const EntryTokensService = {
  /**
   * Get current user's entry tokens
   * @param token JWT token for authentication
   * @returns Current token count
   */
  async getEntryTokens(token: string): Promise<number> {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/api/user/tokens`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get entry tokens');
    }

    const data = await response.json();
    return data.entryTokens;
  },

  /**
   * Deduct one entry token when joining a room
   * @param token JWT token for authentication
   * @returns Updated token count
   */
  async deductToken(token: string): Promise<number> {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/api/user/tokens/deduct`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to deduct entry token');
    }

    const data = await response.json();
    return data.entryTokens;
  },

  /**
   * Update user's entry tokens in local storage
   * @param user User object
   * @param tokenCount New token count
   */
  updateLocalTokens(user: User, tokenCount: number): void {
    if (!isBrowser || !user) return;

    // Update user object in local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      userData.entryTokens = tokenCount;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  },

  /**
   * Check if user has enough tokens
   * @param user User object
   * @returns Boolean indicating if user has tokens
   */
  hasTokens(user: User | null): boolean {
    if (!user) return false;
    return typeof user.entryTokens === 'number' && user.entryTokens > 0;
  }
};
