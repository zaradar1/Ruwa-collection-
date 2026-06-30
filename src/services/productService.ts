import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    callback(products);
  }, () => {
    callback([]);
  });
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    return await addDoc(collection(db, COLLECTION_NAME), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};

export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
};

export const subscribeToReviews = (productId: string, callback: (reviews: any[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME, productId, 'reviews'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt 
      };
    });
    callback(reviews);
  }, () => {
    callback([]);
  });
};

export const addReview = async (productId: string, review: any) => {
  try {
    const reviewRef = collection(db, COLLECTION_NAME, productId, 'reviews');
    const result = await addDoc(reviewRef, {
      ...review,
      createdAt: new Date()
    });

    // Update product rating and review count (simplified)
    // In a real app, this should be a cloud function or transaction
    const productRef = doc(db, COLLECTION_NAME, productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const productData = productSnap.data();
      const currentReviews = productData.reviews || 0;
      const currentRating = productData.rating || 0;
      const newReviews = currentReviews + 1;
      const newRating = ((currentRating * currentReviews) + review.rating) / newReviews;
      await updateDoc(productRef, {
        reviews: newReviews,
        rating: Number(newRating.toFixed(1))
      });
    }

    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${productId}/reviews`);
  }
};
