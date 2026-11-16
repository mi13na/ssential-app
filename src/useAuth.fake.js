import { useSyncExternalStore } from "react";

const FAKE_USER = {
  name: "Test User",
  email: "test@example.com",
  photoURL: "https://picsum.photos/id/64/100",
};

let state = { user: null, loading: true };
const listeners = new Set();

function setState(changes) {
  state = { ...state, ...changes };
  listeners.forEach((listener) => listener());
}

// Pretend we're checking whether the user was already signed in
setTimeout(() => setState({ loading: false }), 800);

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAuth() {
  const { user, loading } = useSyncExternalStore(subscribe, getSnapshot);

  function signIn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setState({ user: FAKE_USER });
        resolve();
      }, 500);
    });
  }

  function signOut() {
    setState({ user: null });
    return Promise.resolve();
  }

  return { user, loading, signIn, signOut };
}