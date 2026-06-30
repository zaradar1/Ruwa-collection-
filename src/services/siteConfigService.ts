import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  announcementText: string;
  announcementEnabled: boolean;
  colorScheme: 'rose' | 'purple' | 'amber' | 'emerald';
  showNewArrivals: boolean;
  showFeatured: boolean;
  footerTagline: string;
  logoText: string;
}

export const defaultSiteConfig: SiteConfig = {
  heroImage: 'https://image.qwenlm.ai/public_source/2cea05b4-e842-4876-8e91-c3a877163ecc/122fdc590-6d5f-4dd3-b74d-de66ce389a7e.png',
  heroTitle: 'ETHNIC ELEGANCE',
  heroSubtitle: 'Discover the finest collection of Sarees, Lehengas, and Kurtis. Crafted for the modern woman who cherishes tradition.',
  heroCTA: 'Shop Collection',
  announcementText: '🎉 Free shipping on orders above ₹1,000!',
  announcementEnabled: true,
  colorScheme: 'rose',
  showNewArrivals: true,
  showFeatured: true,
  footerTagline: 'Celebrating the rich heritage of South Asian fashion. From the looms of Banaras to the embroidery of Lucknow.',
  logoText: 'RuWa Verse',
};

const LS_KEY = 'ruwaverse_site_config';

export const loadLocalConfig = (): SiteConfig => {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? { ...defaultSiteConfig, ...JSON.parse(stored) } : defaultSiteConfig;
  } catch {
    return defaultSiteConfig;
  }
};

export const saveLocalConfig = (config: SiteConfig) => {
  localStorage.setItem(LS_KEY, JSON.stringify(config));
};

export const subscribeToSiteConfig = (callback: (config: SiteConfig) => void) => {
  callback(loadLocalConfig());
  try {
    const docRef = doc(db, 'siteConfig', 'main');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const merged = { ...defaultSiteConfig, ...snap.data() } as SiteConfig;
        saveLocalConfig(merged);
        callback(merged);
      }
    }, () => {});
  } catch {
    return () => {};
  }
};

export const updateSiteConfig = async (config: Partial<SiteConfig>) => {
  const current = loadLocalConfig();
  const next = { ...current, ...config };
  saveLocalConfig(next);
  try {
    const docRef = doc(db, 'siteConfig', 'main');
    await setDoc(docRef, next, { merge: true });
  } catch {
    // silently ignore — config is already saved to localStorage
  }
};
