import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig, defaultSiteConfig, subscribeToSiteConfig } from '../services/siteConfigService';

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);
export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    const unsub = subscribeToSiteConfig(setConfig);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};
