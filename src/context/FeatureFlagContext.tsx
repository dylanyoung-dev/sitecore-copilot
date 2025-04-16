'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Flags = { [key: string]: boolean };

const FeatureFlagContext = createContext<{
  flags: Flags;
  toggleFlag: (flag: string) => void;
}>({
  flags: {},
  toggleFlag: () => {},
});

export const FeatureFlagProvider = ({ children }: { children: React.ReactNode }) => {
  const [flags, setFlags] = useState<Flags>({});

  useEffect(() => {
    const storedFlags = window.sessionStorage.getItem('featureFlags');
    if (storedFlags) {
      setFlags(JSON.parse(storedFlags));
    }
  }, []);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => {
      const updatedFlags = { ...prev, [flag]: !prev[flag] };
      sessionStorage.setItem('featureFlags', JSON.stringify(updatedFlags));
      return updatedFlags;
    });
  };

  return <FeatureFlagContext.Provider value={{ flags, toggleFlag }}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = () => useContext(FeatureFlagContext);
