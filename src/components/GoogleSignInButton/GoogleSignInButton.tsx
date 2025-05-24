import React, { useEffect } from 'react';
import { GoogleAuthProvider, setPersistence, signInWithPopup, signInWithRedirect, onAuthStateChanged, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../firebaseConfig.tsx';

export function GoogleSignInButton() {
	const API = process.env.REACT_APP_API_URL!;
	const REDIRECT_AFTER = '/app';

	useEffect(() => {
		// Для iOS Safari используем sessionPersistence, иначе localPersistence
		const isiOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Version\/[\d.]+.*Safari/.test(navigator.userAgent);

		const persistence = isiOSSafari ? browserSessionPersistence : browserLocalPersistence;

		setPersistence(auth, persistence).catch(console.error);

		// Универсальный слушатель, срабатывает и после popup, и после redirect
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) return;
			const idToken = await user.getIdToken();
			window.location.href = `${API}/users/firebase-redirect` + `?token=${idToken}` + `&redirect=${encodeURIComponent(window.location.origin + REDIRECT_AFTER)}`;
		});

		return () => unsubscribe();
	}, []);

	const handleSignIn = async () => {
		const provider = new GoogleAuthProvider();

		try {
			// Сначала пробуем popup (работает и на большинстве iOS-браузеров)
			await signInWithPopup(auth, provider);
		} catch (popupError) {
			console.warn('Popup не сработал, пробуем Redirect:', popupError);
			// Если не получилось — переходим на redirect
			await signInWithRedirect(auth, provider);
		}
	};

	return <button onClick={handleSignIn}>Войти через Google</button>;
}
