import React, { useCallback, useEffect } from 'react';
import { GoogleAuthProvider, setPersistence, signInWithRedirect, signInWithPopup, onAuthStateChanged, browserLocalPersistence, browserSessionPersistence, getRedirectResult } from 'firebase/auth';
import './GoogleSignInButton.sass';
import { auth } from '../../firebaseConfig.tsx';
import { FaGooglePlus } from 'react-icons/fa6';

export function GoogleSignInButton() {
	const API = process.env.REACT_APP_API_URL;
	const REDIRECT_AFTER = '/app';
	const GOOGLE_SIGN_IN_REQUESTED_KEY = 'googleSignInRequested';
	const GOOGLE_SIGN_IN_PENDING_KEY = 'googleSignInPending';

	const handleAuthenticatedUser = useCallback(
		async (user) => {
			if (!user || !API) return;

			const signInRequested = sessionStorage.getItem(GOOGLE_SIGN_IN_REQUESTED_KEY) === 'true';
			const signInPending = sessionStorage.getItem(GOOGLE_SIGN_IN_PENDING_KEY) === 'true';

			if (!signInRequested && !signInPending) return;

			sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
			sessionStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);

			const idToken = await user.getIdToken();
			window.location.href = `${API}/users/firebase-redirect` + `?token=${idToken}` + `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
		},
		[API, GOOGLE_SIGN_IN_PENDING_KEY, GOOGLE_SIGN_IN_REQUESTED_KEY, REDIRECT_AFTER],
	);

	useEffect(() => {
		const isiOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
		const persistence = isiOSSafari ? browserSessionPersistence : browserLocalPersistence;

		setPersistence(auth, persistence).catch(console.error);

		getRedirectResult(auth)
			.then((result) => {
				if (!result?.user) return;
				return handleAuthenticatedUser(result.user);
			})
			.catch((error) => {
				sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
				sessionStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);
				console.error('Google redirect result failed:', error);
			});

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) return;
			await handleAuthenticatedUser(user);
		});

		return () => unsubscribe();
	}, [handleAuthenticatedUser]);

	const getMaskedValue = (value?: string) => {
		if (!value) return 'missing';
		const cleanValue = value.trim().replace(/^['"]|['"]$/g, '');
		if (cleanValue.length <= 8) return `${cleanValue[0]}***${cleanValue[cleanValue.length - 1]}`;
		return `${cleanValue.slice(0, 4)}***${cleanValue.slice(-4)} (len: ${cleanValue.length})`;
	};

	const shouldUseRedirectFallback = (errorCode) => {
		return errorCode === 'auth/popup-blocked' || errorCode === 'auth/operation-not-supported-in-this-environment';
	};

	const handleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		const isiOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
		sessionStorage.setItem(GOOGLE_SIGN_IN_REQUESTED_KEY, 'true');
		sessionStorage.setItem(GOOGLE_SIGN_IN_PENDING_KEY, 'true');

		if (isiOSSafari) {
			try {
				await signInWithRedirect(auth, provider);
			} catch (redirectError) {
				sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
				sessionStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);
				console.error('Google redirect sign in failed:', redirectError);
			}
			return;
		}

		try {
			await signInWithPopup(auth, provider);
		} catch (popupError) {
			console.info('Google sign-in diagnostics:', {
				firebaseApiKeyFingerprint: getMaskedValue(process.env.REACT_APP_FIREBASE_API_KEY),
				apiUrl: API || 'missing',
				origin: window.location.origin,
			});
			const errorCode = popupError?.code || '';
			if (!shouldUseRedirectFallback(errorCode)) {
				sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
				sessionStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);
				console.error('Google popup sign in failed:', popupError);
				return;
			}

			try {
				await signInWithRedirect(auth, provider);
			} catch (redirectError) {
				sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
				sessionStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);
				console.error('Google redirect fallback failed:', redirectError);
			}
		}
	};

	return (
		<button type="button" className="google-sign-button" aria-label="Sign in with Google" onClick={handleSignIn}>
			<FaGooglePlus className="google-sign-icon" />
		</button>
	);
}
