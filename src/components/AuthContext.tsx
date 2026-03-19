import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout as firebaseLogout, loginWithEmail, signupWithEmail, updateProfile } from '../services/firebase';
import { UserProfile } from '../types';
import { subscribeToUserProfile, createUserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<any>;
  loginWithEmail: (email: string, pass: string) => Promise<any>;
  signupWithEmail: (email: string, pass: string, displayName: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Subscribe to profile changes
        const unsubscribeProfile = subscribeToUserProfile(currentUser.uid, async (userProfile) => {
          if (userProfile) {
            setProfile(userProfile);
          } else {
            // Create profile if it doesn't exist
              const newProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || '',
                displayName: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL || '',
                role: 'user',
                createdAt: new Date().toISOString(),
              };
            await createUserProfile(newProfile);
            setProfile(newProfile);
          }
          setLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSignupWithEmail = async (email: string, pass: string, displayName: string) => {
    const userCredential = await signupWithEmail(email, pass);
    await updateProfile(userCredential.user, { displayName });
    
    const newProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: email,
      displayName: displayName,
      photoURL: '',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    await createUserProfile(newProfile);
    return userCredential;
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail: handleSignupWithEmail,
    logout: firebaseLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
