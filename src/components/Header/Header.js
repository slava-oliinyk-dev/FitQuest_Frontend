import "./Header.sass";
import { profileIcon, searchIcon } from '../../assets/icons';
import { useState } from "react";

function Header() {
    const [inputValue, setInputValue] = useState("");
    const [showNoResults, setShowNoResults] = useState(false);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (showNoResults) setShowNoResults(false);
    };

    const handleBlur = () => {
        setInputValue("");
        setShowNoResults(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue.trim() !== "") {
                setShowNoResults(true);
            }
        }
    };

    return (
        <div className="header">
            <div className="header__input-container">
                <img className="header__input-icon" src={searchIcon} alt="Search Icon" />
                <input
                    className="header__input-field"
                    placeholder="Search"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
                {showNoResults && (
                    <div className="header__no-results"><img className="header__no-results-icon" src={searchIcon} alt="Search Icon" /><p>No results found.</p></div>
                )}
            </div>
            <a href="#">
                <img className="header__icon" src={profileIcon} alt="Profile Icon" />
            </a>
        </div>
    );
}

export default Header;
