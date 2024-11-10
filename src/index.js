import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/Modern-normalize.min.css'
import './styles/global.sass'
import App from './pages/App/App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
