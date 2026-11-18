import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!auth) return undefined;

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
        setAuthError(null);
      },
      (error) => {
        setAuthError(error);
        setLoading(false);
      },
    );
  }, []);

  async function signIn() {
    if (!auth) throw new Error("Firebase is not configured. Add your .env.local values.");
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function signOutUser() {
    if (!auth) throw new Error("Firebase is not configured. Add your .env.local values.");
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        signIn,
        signOut: signOutUser,
        isConfigured: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
