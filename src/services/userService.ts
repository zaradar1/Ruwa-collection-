import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from '../types';

const COLLECTION_NAME = 'users';

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${uid}`);
  }
};

export const subscribeToUserProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
  const docRef = doc(db, COLLECTION_NAME, uid);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
    } else {
      callback(null);
    }
  }, () => {
    callback(null);
  });
};

export const createUserProfile = async (profile: UserProfile) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profile.uid);
    return await setDoc(docRef, {
      ...profile,
      createdAt: new Date()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${profile.uid}`);
  }
};

export const updateUserProfile = async (uid: string, profile: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);
    return await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${uid}`);
  }
};

export const subscribeToAllUsers = (callback: (users: UserProfile[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(d => ({ uid: d.id, ...d.data() })) as UserProfile[];
    callback(users);
  }, () => callback([]));
};
