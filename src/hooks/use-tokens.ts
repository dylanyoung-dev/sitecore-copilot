'use client';

import { useStorage } from '@/context/StorageContext';
import { enumTokenCategories, enumTokenProviders, enumTokenTypes, IToken } from '@/models/IToken';

export const useTokens = () => {
  const { getData, setData } = useStorage();
  const KEY = 'tokens';

  const tokens = getData<IToken>(KEY);

  const addToken = (token: IToken) => {
    setData(KEY, [...tokens, token]);
  };

  const deleteToken = (id: string) => {
    setData(
      KEY,
      tokens.filter((token) => token.id !== id)
    );
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
    setData(
      KEY,
      tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token))
    );
  };

  const setAllTokens = (newTokens: IToken[]) => {
    setData(KEY, newTokens);
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
