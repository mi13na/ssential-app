import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";

export function useFirestoreCollection(collectionPath, enabled = true) {
  const [result, setResult] = useState({ path: null, documents: [], error: null });

  useEffect(() => {
    if (
      !enabled ||
      !isFirebaseConfigured ||
      !db ||
      typeof collectionPath !== "string" ||
      !collectionPath.trim()
    ) {
      return undefined;
    }

    return onSnapshot(
      collection(db, collectionPath),
      (snapshot) => {
        setResult({
          path: collectionPath,
          documents: snapshot.docs.map((document) => ({ ...document.data(), id: document.id })),
          error: null,
        });
      },
      (snapshotError) => {
        setResult({ path: collectionPath, documents: [], error: snapshotError });
      },
    );
  }, [collectionPath, enabled]);

  if (!enabled) return { documents: [], loading: false, error: null };
  if (!isFirebaseConfigured || !db) {
    return {
      documents: [],
      loading: false,
      error: new Error("Firebase is not configured. Add your .env.local values."),
    };
  }
  if (typeof collectionPath !== "string" || !collectionPath.trim()) {
    return {
      documents: [],
      loading: false,
      error: new Error("A Firestore collection path is required."),
    };
  }
  if (result.path !== collectionPath) {
    return { documents: [], loading: true, error: null };
  }

  return { ...result, loading: false };
}
