'use client';

import { enumTokenCategories, enumTokenProviders, enumTokenTypes, IToken } from '@/models/IToken';
import { useEffect, useState } from 'react';

export const useTokens = () => {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const SESSION_STORAGE_KEY = 'api-tokens';

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);

    if (saved) {
      try {
        const parsedTokens = JSON.parse(saved) as IToken[];
        setTokens(parsedTokens);
      } catch (error) {
        console.error('Error parsing instances from sessionStorage:', error);
      }
    }
  }, []);

  const addToken = (token: IToken) => {
    const updatedTokens = [...tokens, token];
    setTokens(updatedTokens);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedTokens));
  };

  const deleteToken = (id: string) => {
    const updatedTokens = tokens.filter((token) => token.id !== id);
    setTokens(updatedTokens);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedTokens));
  };

  const getTokenById = (id: string): IToken | undefined => {
    return tokens.find((token) => token.id === id);
  };
  const getTokenByType = (type: enumTokenTypes): IToken | undefined => {
    return tokens.find((token) => token.type === type);
  };

  // Get active tokens for a specific category and provider
  const getActiveTokens = (category?: enumTokenCategories, provider?: enumTokenProviders): IToken[] => {
    return tokens.filter((token) => {
      const matchesCategory = category ? token.category === category : true;
      const matchesProvider = provider ? token.provider === provider : true;
      return token.active && matchesCategory && matchesProvider;
    });
  };

  const updateToken = (updatedToken: IToken) => {
    const updatedTokens = tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token));
    setTokens(updatedTokens);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedTokens));
  };

  const setAllTokens = (newTokens: IToken[]) => {
    setTokens(newTokens);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newTokens));
  };

  return {
    tokens,
    addToken,
    deleteToken,
    updateToken,
    getTokenById,
    getTokenByType,
    getActiveTokens,
    setAllTokens,
  };
};
