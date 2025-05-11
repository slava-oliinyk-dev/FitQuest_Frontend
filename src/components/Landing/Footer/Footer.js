import { HashLink } from 'react-router-hash-link';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.sass'
import './FooterMedia.sass'
import { logo } from '../../../assets/icons';

function Footer() {
    const navigate = useNavigate();

    const goToPrivacy = () => {
        navigate('/privacy');
    };

    const goToTerms = () => {
        navigate('/terms');
    };

    return (
        <footer className='footer'>
            <div className="footer__wrapper">
                <a href="#"><HashLink smooth to="/#main-screen"><img className="footer__logo" src={logo} alt="logo" /></HashLink></a>
                <ul className='footer__nav'>
                    <li><HashLink smooth to="/#main-screen">Home page</HashLink></li>
                    <li><HashLink smooth to="/#about">About the App</HashLink></li>
                    <li><HashLink smooth to="/#price">Pricing</HashLink></li>
                    <li><HashLink smooth to="/#contact">Contact Us</HashLink></li>
                    <li><HashLink smooth to="/#faq">FAQ</HashLink></li>
                </ul>
                <ul className='footer__privacy'>
                    <li onClick={goToPrivacy}>Privacy Policy</li>
                    <li onClick={goToTerms}>Terms of Use</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer