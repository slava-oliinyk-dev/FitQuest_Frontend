import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/Modern-normalize.min.css';
import Main from './main';
import { AuthProvider } from './AuthContext.tsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AuthProvider>
			<Router>
				<Main />
			</Router>
		</AuthProvider>
	</React.StrictMode>,
);
