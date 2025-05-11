import './LandingMain.sass'
import '../../../styles/global-landing.sass'
import Nav from '../../../components/Landing/Nav/Nav'
import MainScreen from '../../../components/Landing/MainScreen/MainScreen';
import AboutApp from '../../../components/Landing/About/About';
import Price from '../../../components/Landing/Price/Price';
import Faq from '../../../components/Landing/FAQ/Faq';
import Contact from '../../../components/Landing/Contact/Contact';
import Footer from '../../../components/Landing/Footer/Footer';


function LandingMain() {
    return (
        <div className='LandingMain'>
            <Nav />
            <MainScreen />
            <AboutApp />
            <Price />
            <Faq />
            <Contact />
            <Footer />
        </div>
    )
}
export default LandingMain