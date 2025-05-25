import './Header.sass';
import './HeaderMedia.sass';
import { logoutIcon, searchIcon } from '../../assets/icons';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

function Header() {
	const [inputValue, setInputValue] = useState('');
	const [showNoResults, setShowNoResults] = useState(false);

	const handleChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		setShowNoResults(value.trim() !== '');
	};

	const handleBlur = () => {
		setInputValue('');
		setShowNoResults(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (inputValue.trim() !== '') {
				setShowNoResults(true);
			}
		}
	};

	return (
		<div className="header">
			<div className="header__input-container">
				<FaSearch className="header__input-icon" alt="Search Icon" />
				<input className="header__input-field" placeholder="Search" type="text" value={inputValue} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} />
				{showNoResults && (
					<div className="header__no-results">
						<FaSearch className="header__no-results-icon" alt="Search Icon" />
						<p className="header__no-results-result">No results found</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default Header;
