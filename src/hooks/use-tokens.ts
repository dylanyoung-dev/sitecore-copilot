'use client';

import { enumTokenTypes, IToken } from '@/models/IToken';
import { useEffect, useState } from 'react';

export const useTokens = () => {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const SESSION_STORAGE_KEY = 'api-tokens';

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);

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
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedTokens));
  };

  const deleteToken = (id: string) => {
    const updatedTokens = tokens.filter((token) => token.id !== id);
    setTokens(updatedTokens);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedTokens));
  };

  const getTokenById = (id: string): IToken | undefined => {
    return tokens.find((token) => token.id === id);
  };

  const getTokenByType = (type: enumTokenTypes): IToken | undefined => {
    return tokens.find((token) => token.type === type);
  };

  return { tokens, addToken, deleteToken, getTokenById, getTokenByType };
};
