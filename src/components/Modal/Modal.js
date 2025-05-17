import './Modal.sass';
import { closeIcon } from '../../assets/icons';

function Modal({ isVisible, onClose, children }) {
	if (!isVisible) return null;

	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('modal-overlay')) {
			onClose();
		}
	};

	return (
		<div className="modal-overlay" onClick={handleOverlayClick}>
			<div className="modal">
				<button className="modal__close" onClick={onClose}>
					<img className="modal__close-icon" src={closeIcon} alt="Close Icon" />
				</button>
				{children}
			</div>
		</div>
	);
}

export default Modal;
