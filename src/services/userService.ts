import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${uid}`);
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
