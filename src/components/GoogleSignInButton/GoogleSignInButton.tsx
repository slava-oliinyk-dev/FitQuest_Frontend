import React, { useEffect } from 'react';
import { GoogleAuthProvider, setPersistence, signInWithRedirect, onAuthStateChanged, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import './GoogleSignInButton.sass';
import { auth } from '../../firebaseConfig.tsx';
import { FaGooglePlus } from 'react-icons/fa6';

export function GoogleSignInButton() {
	const API = process.env.REACT_APP_API_URL;
	const REDIRECT_AFTER = '/app';
	const GOOGLE_SIGN_IN_REQUESTED_KEY = 'googleSignInRequested';

	useEffect(() => {
		const isiOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
		const persistence = isiOSSafari ? browserSessionPersistence : browserLocalPersistence;

		setPersistence(auth, persistence).catch(console.error);

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
				return;
			}

			const signInRequested = sessionStorage.getItem(GOOGLE_SIGN_IN_REQUESTED_KEY) === 'true';
			if (!signInRequested || !API) return;

			sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
			const idToken = await user.getIdToken();
			window.location.href = `${API}/users/firebase-redirect` + `?token=${idToken}` + `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
		});

		return () => unsubscribe();
	}, [API]);

	const handleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		sessionStorage.setItem(GOOGLE_SIGN_IN_REQUESTED_KEY, 'true');

		try {
			await signInWithRedirect(auth, provider);
		} catch (redirectError) {
			sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
			throw redirectError;
		}
	};

	return (
		<button type="button" className="google-sign-button" aria-label="Sign in with Google" onClick={handleSignIn}>
			<FaGooglePlus className="google-sign-icon" />
		</button>
	);
}
