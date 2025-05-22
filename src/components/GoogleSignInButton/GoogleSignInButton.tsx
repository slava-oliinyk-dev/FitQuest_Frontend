import React, { useEffect } from 'react';
import {
  GoogleAuthProvider,
  setPersistence,
  signInWithRedirect,
  getRedirectResult,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../../firebaseConfig.tsx';
import { useNavigate } from 'react-router-dom';

export function GoogleSignInButton() {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL!;
  const REDIRECT_AFTER = '/app';

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return;
        const idToken = await result.user.getIdToken();
        window.location.href =
          `${API}/users/firebase-redirect` +
          `?token=${idToken}` +
          `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
      })
      .catch(console.error);
  }, []);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <button type="button" onClick={handleSignIn}>
      Войти через Google
    </button>
  );
}
