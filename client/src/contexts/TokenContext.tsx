import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { EntryTokensService } from '../services/entryTokens.service';

// Define context type
interface TokenContextType {
  tokens: number;
  isLoading: boolean;
  error: string | null;
  refreshTokens: () => Promise<void>;
  deductToken: () => Promise<boolean>;
  hasTokens: boolean;
}

// Create token context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, token } = useAuth();
  const [tokens, setTokens] = useState<number>(user?.entryTokens || 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate if user has tokens
  const hasTokens = EntryTokensService.hasTokens(user);

  // Refresh tokens from server
  const refreshTokens = async (): Promise<void> => {
    if (!isAuthenticated || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const tokenCount = await EntryTokensService.getEntryTokens(token);
      setTokens(tokenCount);

      // Update local storage
      if (user) {
        EntryTokensService.updateLocalTokens(user, tokenCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      console.error('Error fetching tokens:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Deduct a token when joining a room
  const deductToken = async (): Promise<boolean> => {
    if (!isAuthenticated || !token) return false;

    setIsLoading(true);
    setError(null);

    try {
      // Only attempt to deduct if user has tokens
      if (!hasTokens) {
        setError('You have no remaining entry tokens');
        return false;
      }

      const remainingTokens = await EntryTokensService.deductToken(token);
      setTokens(remainingTokens);

      // Update local storage
      if (user) {
        EntryTokensService.updateLocalTokens(user, remainingTokens);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deduct token');
      console.error('Error deducting token:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load tokens on auth change
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshTokens();
    } else {
      setTokens(0);
    }
  }, [isAuthenticated, token]);

  // Context value
  const contextValue: TokenContextType = {
    tokens,
    isLoading,
    error,
    refreshTokens,
    deductToken,
    hasTokens,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook for using token context
export const useTokens = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};
