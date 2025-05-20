import { GoogleAuthProvider, setPersistence, signInWithPopup, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebaseConfig.tsx';
import { useAuth } from '../../AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

export function GoogleSignInButton() {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const handleSignIn = async () => {
		try {
			await setPersistence(auth, browserLocalPersistence);
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
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
		} catch (err) {
			console.error('Google Sign-In error:', err);
		}
	};

	return <button onClick={handleSignIn}>Войти через Google</button>;
}
