import { Product } from '../types';

export const getRecommendedProducts = (currentProduct: Product, allProducts: Product[], limit: number = 4): Product[] => {
  // Simple recommendation logic:
  // 1. Same category
  // 2. Exclude current product
  // 3. Randomize or sort by rating
  
  const recommendations = allProducts.filter(p => 
    p.category === currentProduct.category && p.id !== currentProduct.id
  );

  // If not enough in same category, add from other categories
  if (recommendations.length < limit) {
    const others = allProducts.filter(p => 
      p.category !== currentProduct.category && p.id !== currentProduct.id
    );
    recommendations.push(...others.slice(0, limit - recommendations.length));
  }

  return recommendations.slice(0, limit);
};

export const getRecentlyViewed = (): string[] => {
  const saved = localStorage.getItem('recentlyViewed');
  return saved ? JSON.parse(saved) : [];
};

export const addToRecentlyViewed = (productId: string) => {
  const viewed = getRecentlyViewed();
  const updated = [productId, ...viewed.filter(id => id !== productId)].slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};
