import "./Sidebar.sass"
import { gymIcon, calendarIcon, exitIcon, helpIcon, letterIcon, infoIcon, progressIcon, homeIcon, communityIcon } from '../../assets/icons';

function Sidebar () {
    return (
        <div className='sidebar'>
            <div className='sidebar__app-name'>Fitness</div>

            <div className='sidebar__section'>
                <div className="sidebar__section-title">WORKSPACE</div>
                <ul className="sidebar__menu">
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon sidebar__icon--large" style={{ width: '1.5625rem', height: '1.5625rem' }}><img src={gymIcon} alt="Gym Icon" /></span>
                        <span className="sidebar__text"> My Workout  Programs</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon"><img src={calendarIcon} alt="Calendar Icon" /></span>
                        <span className="sidebar__text">Calendar</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon" style={{ width: '1.1875rem', height: '1.1875rem' }}><img src={progressIcon} alt="Progress Icon" /></span>
                        <span className="sidebar__text">Progress</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon" style={{ width: '1.1875rem', height: '1.1875rem' }}><img src={letterIcon} alt="Letter Icon" /></span>
                        <span className="sidebar__text">Program Inbox</span>
                    </li>
                </ul>

                <div className="sidebar__section-title">CONTROL PANEL</div>
                <ul className="sidebar__menu">
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon"><img src={homeIcon} alt="Home Icon" /></span>
                        <span className="sidebar__text">Home</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon sidebar__icon--medium"><img src={helpIcon} alt="Help Icon" /></span>
                        <span className="sidebar__text">About the App</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon sidebar__icon--large" style={{ width: '1.4375rem', height: '1.4375rem' }}><img src={communityIcon} alt="Community Icon" /></span>
                        <span className="sidebar__text">Contact & Social</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon"><img src={infoIcon} alt="Info Icon" /></span>
                        <span className="sidebar__text">Privacy & Legal</span>
                    </li>
                    <li className="sidebar__menu-item">
                        <span className="sidebar__icon sidebar__icon--medium" style={{ width: '1.25rem', height: '1.25rem' }}><img src={exitIcon} alt="Exit Icon" /></span>
                        <span className="sidebar__text">Log Out</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar