import React, { useCallback, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { GoogleAuthProvider, setPersistence, signInWithRedirect, signInWithPopup, onAuthStateChanged, browserLocalPersistence, browserSessionPersistence, getRedirectResult } from 'firebase/auth';
import './GoogleSignInButton.sass';
import { auth } from '../../firebaseConfig.tsx';
import { FaGooglePlus } from 'react-icons/fa6';

type HandleAuthenticatedUserOptions = {
	allowWithoutPendingState?: boolean;
};

type FirebaseLikeError = {
	code?: string;
	message?: string;
};

export function GoogleSignInButton() {
	const API = process.env.REACT_APP_API_URL?.trim().replace(/\/+$/, '') || '/api';
	const REDIRECT_AFTER = '/app';
	const GOOGLE_SIGN_IN_REQUESTED_KEY = 'googleSignInRequested';
	const GOOGLE_SIGN_IN_PENDING_KEY = 'googleSignInPending';
	const redirectInProgressRef = useRef(false);

	const isMobileBrowser = useCallback((): boolean => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}, []);

	const clearGoogleSignInState = useCallback((): void => {
		localStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
		localStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);
		sessionStorage.removeItem(GOOGLE_SIGN_IN_REQUESTED_KEY);
		sessionStorage.removeItem(GOOGLE_SIGN_IN_PENDING_KEY);
	}, [GOOGLE_SIGN_IN_PENDING_KEY, GOOGLE_SIGN_IN_REQUESTED_KEY]);

	const markGoogleSignInStarted = useCallback((): void => {
		localStorage.setItem(GOOGLE_SIGN_IN_REQUESTED_KEY, 'true');
		localStorage.setItem(GOOGLE_SIGN_IN_PENDING_KEY, 'true');
		sessionStorage.setItem(GOOGLE_SIGN_IN_REQUESTED_KEY, 'true');
		sessionStorage.setItem(GOOGLE_SIGN_IN_PENDING_KEY, 'true');
	}, [GOOGLE_SIGN_IN_PENDING_KEY, GOOGLE_SIGN_IN_REQUESTED_KEY]);

	const hasPendingGoogleSignIn = useCallback((): boolean => {
		const signInRequested = sessionStorage.getItem(GOOGLE_SIGN_IN_REQUESTED_KEY) === 'true' || localStorage.getItem(GOOGLE_SIGN_IN_REQUESTED_KEY) === 'true';

		const signInPending = sessionStorage.getItem(GOOGLE_SIGN_IN_PENDING_KEY) === 'true' || localStorage.getItem(GOOGLE_SIGN_IN_PENDING_KEY) === 'true';

		return signInRequested || signInPending;
	}, [GOOGLE_SIGN_IN_PENDING_KEY, GOOGLE_SIGN_IN_REQUESTED_KEY]);

	const handleAuthenticatedUser = useCallback(
		async (user: User | null, options: HandleAuthenticatedUserOptions = {}): Promise<void> => {
			const { allowWithoutPendingState = false } = options;

			if (!user || !API || redirectInProgressRef.current) return;
			if (!allowWithoutPendingState && !hasPendingGoogleSignIn()) return;

			redirectInProgressRef.current = true;
			clearGoogleSignInState();

			try {
				const idToken = await user.getIdToken();

				window.location.href = `${API}/users/firebase-redirect` + `?token=${encodeURIComponent(idToken)}` + `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
			} catch (error) {
				redirectInProgressRef.current = false;
				console.error('Failed to handle authenticated user:', error);
			}
		},
		[API, REDIRECT_AFTER, clearGoogleSignInState, hasPendingGoogleSignIn],
	);

	useEffect(() => {
		const persistence = isMobileBrowser() ? browserSessionPersistence : browserLocalPersistence;

		void setPersistence(auth, persistence).catch((error) => {
			console.error('Failed to set Firebase persistence:', error);
		});

		void getRedirectResult(auth)
			.then(async (result) => {
				if (!result?.user) return;
				await handleAuthenticatedUser(result.user, {
					allowWithoutPendingState: true,
				});
			})
			.catch((error) => {
				clearGoogleSignInState();
				console.error('Google redirect result failed:', error);
			});

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user || !hasPendingGoogleSignIn()) return;
			await handleAuthenticatedUser(user);
		});

		return () => unsubscribe();
	}, [clearGoogleSignInState, handleAuthenticatedUser, hasPendingGoogleSignIn, isMobileBrowser]);

	const getMaskedValue = (value?: string): string => {
		if (!value) return 'missing';

		const cleanValue = value.trim().replace(/^['"]|['"]$/g, '');

		if (cleanValue.length <= 8) {
			return `${cleanValue[0]}***${cleanValue[cleanValue.length - 1]}`;
		}

		return `${cleanValue.slice(0, 4)}***${cleanValue.slice(-4)} (len: ${cleanValue.length})`;
	};

	const shouldUseRedirectFallback = (errorCode: string): boolean => {
		return errorCode === 'auth/popup-blocked' || errorCode === 'auth/operation-not-supported-in-this-environment';
	};

	const handleSignIn = async (): Promise<void> => {
		const provider = new GoogleAuthProvider();
		const shouldUseRedirect = isMobileBrowser();

		markGoogleSignInStarted();

		if (shouldUseRedirect) {
			try {
				await signInWithRedirect(auth, provider);
			} catch (redirectError) {
				clearGoogleSignInState();
				console.error('Google redirect sign in failed:', redirectError);
			}
			return;
		}

		try {
			await signInWithPopup(auth, provider);
		} catch (error: unknown) {
			const popupError = error as FirebaseLikeError;

			console.info('Google sign-in diagnostics:', {
				firebaseApiKeyFingerprint: getMaskedValue(process.env.REACT_APP_FIREBASE_API_KEY),
				apiUrl: API || 'missing',
				origin: window.location.origin,
			});

			const errorCode = popupError?.code ?? '';

			if (!shouldUseRedirectFallback(errorCode)) {
				clearGoogleSignInState();
				console.error('Google popup sign in failed:', popupError);
				return;
			}

			try {
				await signInWithRedirect(auth, provider);
			} catch (redirectError) {
				clearGoogleSignInState();
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
