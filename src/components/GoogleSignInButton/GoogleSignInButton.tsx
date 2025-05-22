import React, { useEffect } from 'react';
import { GoogleAuthProvider, setPersistence, signInWithPopup, signInWithRedirect, getRedirectResult, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebaseConfig.tsx';
import { useAuth } from '../../AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

export function GoogleSignInButton() {
	const { setUser } = useAuth();
	const navigate = useNavigate();
	const API = process.env.REACT_APP_API_URL!;
	const REDIRECT_AFTER = '/app';

	useEffect(() => {
		setPersistence(auth, browserLocalPersistence).catch(console.error);

		getRedirectResult(auth)
			.then(async (result) => {
				if (!result) return;
				const idToken = await result.user.getIdToken();
				window.location.href = `${API}/users/firebase-redirect` + `?token=${idToken}` + `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
			})
			.catch(console.error);
	}, []);

	const handleSignIn = async () => {
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		const provider = new GoogleAuthProvider();

		if (isSafari) {
			try {
				await signInWithRedirect(auth, provider);
			} catch (err) {
				console.error('Ошибка при signInWithRedirect в Safari:', err);
			}
		} else {
			try {
				const result = await signInWithPopup(auth, provider);
				const idToken = await result.user.getIdToken();
				window.location.href = `${API}/users/firebase-redirect` + `?token=${idToken}` + `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
			} catch (err) {
				console.error(err);
			}
		}
	};

	<button type="button" onClick={handleSignIn}>
		Войти через Google
	</button>;
}
