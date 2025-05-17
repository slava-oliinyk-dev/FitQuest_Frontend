import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/Modern-normalize.min.css';
import Main from './main';
import { AuthProvider } from './AuthContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AuthProvider>
			<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
				<Router>
					<Main />
				</Router>
			</GoogleOAuthProvider>
		</AuthProvider>
	</React.StrictMode>,
);
