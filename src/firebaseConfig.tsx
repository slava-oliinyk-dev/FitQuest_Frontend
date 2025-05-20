import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyBZ8VK2LRrrUHOK1lVLzrmqPpRVFl1doOk',
	authDomain: 'fitquest-a3ae4.firebaseapp.com',
	projectId: 'fitquest-a3ae4',
	storageBucket: 'fitquest-a3ae4.appspot.com',
	messagingSenderId: '686300008573',
	appId: '1:686300008573:web:f94fd779dcd6b710dba114',
	measurementId: 'G-G4ZDF73HRZ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
