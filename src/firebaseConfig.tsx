import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const normalizeEnvValue = (value?: string) => {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	const withoutQuotes = trimmed.replace(/^['"]|['"]$/g, '');
	return withoutQuotes || undefined;
};

const getMaskedValue = (value?: string) => {
	if (!value) return 'missing';
	if (value.length <= 8) return `${value[0]}***${value[value.length - 1]}`;
	return `${value.slice(0, 4)}***${value.slice(-4)} (len: ${value.length})`;
};

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
