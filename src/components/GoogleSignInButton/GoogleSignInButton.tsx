import React, { useEffect } from 'react';
import { GoogleAuthProvider, setPersistence, signInWithPopup, signInWithRedirect, getRedirectResult, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebaseConfig.tsx';
import { useAuth } from '../../AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

export function GoogleSignInButton() {
	const { setUser } = useAuth();
	const navigate = useNavigate();
	const API = process.env.REACT_APP_API_URL;
	const FRONT = window.location.origin;

	useEffect(() => {
		setPersistence(auth, browserLocalPersistence).catch(console.error);

		getRedirectResult(auth)
			.then(async (result) => {
				if (!result) return;
			})
			.catch(console.error);
	}, []);

	const handleSignIn = async () => {
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		const provider = new GoogleAuthProvider();

		if (isSafari) {
			await signInWithRedirect(auth, provider);
		} else {
			try {
				const result = await signInWithPopup(auth, provider);
				const idToken = await result.user.getIdToken();
				window.location.href = `${API}/users/firebase-redirect` + `?token=${idToken}` + `&redirect=${encodeURIComponent(FRONT + '/app')}`;
			} catch (err) {
				console.error(err);
			}
		}
	};

	return <button onClick={handleSignIn}>Войти через Google</button>;
}
