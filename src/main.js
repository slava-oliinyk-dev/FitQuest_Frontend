import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import './styles/main.sass'
import LandingMain from './pages/Landing/LandingMain/LandingMain';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './pages/App/App';
import Register from './pages/Landing/Register/Register';
import Login from './pages/Landing/Login/Login';
import Privacy from './pages/Landing/Privacy/Privacy';
import Terms from './pages/Landing/TermsOfUse/TermsOfUse';
import ScrollToTop from './components/Landing/ScrollToTop/ScrollToTop';
import ProtectedRoute from './ProtectedRoute.tsx';
import PublicRoute from './PublicRoute.tsx';
import Modal from './components/Modal/Modal.js'

function Main() {
    const [isVisible, setIsVisible] = useState(false);

    const location = useLocation();


    useEffect(() => {
        const accepted = localStorage.getItem('policyAccepted');
        if (!accepted && location.pathname !== '/privacy') {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [location]);

    const handleAccept = () => {
        localStorage.setItem('policyAccepted', 'true');
        setIsVisible(false);
    };

    const handleClose = () => {
        toast.error('To continue, you must accept the privacy policy.');
        setIsVisible(true);
    };

    return (
        <>
            <ScrollToTop />
            <Modal isVisible={isVisible} onClose={handleClose}>
                <div className='main__modal'>
                    <h2 className='main__modal-title'>Cookie Notice</h2>
                    <p className='main__modal-text'>
                        We use cookies to ensure a secure and seamless experience on our website. Our site uses only essential cookies for user authentication (e.g., storing a session token) and maintaining site stability. By clicking “Accept,” you consent to our use of these cookies. For more details about the cookies we use and how we handle your data, please review our <a className='main__modal-link' href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.{' '}
                    </p>
                    <button className='main__modal-button' onClick={handleAccept}>I agree</button>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Modal>
            <Routes>
                <Route path="/" element={<LandingMain />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/app" element={<App />} />
                </Route>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
            </Routes>
        </>
    );
}

export default Main;
