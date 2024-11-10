import "./Header.sass"
import {profileIcon, searchIcon} from '../../assets/icons'


function Header() {
    return (
        <div className="header">
            <div className="header__input-container">
                <img className="header__input-icon" src={searchIcon} alt="Search Icon" />
                <input className="header__input-field" placeholder="Search" type="text" />
            </div>
            <a href="#"><img className="header__icon" src={profileIcon} alt="Profile Icon" /></a>
        </div>
    )
}

export default Header