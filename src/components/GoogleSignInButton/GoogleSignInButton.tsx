import React, { useEffect } from 'react';
import { GoogleAuthProvider, setPersistence, signInWithPopup, signInWithRedirect, getRedirectResult, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebaseConfig.tsx';
import { useAuth } from '../../AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

export function GoogleSignInButton() {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		setPersistence(auth, browserLocalPersistence).catch((err) => console.error(err));
		getRedirectResult(auth)
			.then(async (result) => {
				if (result) {
					const idToken = await result.user.getIdToken();
					const response = await fetch(`${process.env.REACT_APP_API_URL}/users/firebase`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${idToken}`,
						},
						credentials: 'include',
					});
					const data = await response.json();
					setUser(data);
					navigate('/app');
				}
			})
			.catch((err) => console.error(err));
	}, [navigate, setUser]);

	const handleSignIn = () => {
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		const provider = new GoogleAuthProvider();
		if (isSafari) {
			signInWithRedirect(auth, provider);
		} else {
			signInWithPopup(auth, provider)
				.then(async (result) => {
					const idToken = await result.user.getIdToken();
					const response = await fetch(`${process.env.REACT_APP_API_URL}/users/firebase`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${idToken}`,
						},
						credentials: 'include',
					});
					const data = await response.json();
					setUser(data);
					navigate('/app');
				})
				.catch((err) => console.error(err));
		}
	};

	return <button onClick={handleSignIn}>Войти через Google</button>;
}
