import { collection, addDoc, updateDoc, onSnapshot, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Order } from '../types';

const COLLECTION_NAME = 'orders';

export const getOrderById = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt 
      } as Order;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
};

export const subscribeToUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      } as Order;
    });
    callback(orders);
  }, () => {
    callback([]);
  });
};

export const subscribeToAllOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      } as Order;
    });
    callback(orders);
  }, () => {
    callback([]);
  });
};

export const createOrder = async (order: Omit<Order, 'id'>) => {
  try {
    return await addDoc(collection(db, COLLECTION_NAME), {
      ...order,
      createdAt: new Date()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
};

export const updateOrderTracking = async (id: string, trackingNumber: string, shippingCarrier: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, { trackingNumber, shippingCarrier });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
};
