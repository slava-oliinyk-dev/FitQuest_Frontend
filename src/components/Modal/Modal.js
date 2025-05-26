import './Modal.sass';
import { IoClose } from 'react-icons/io5';

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
					<IoClose className="modal__close-icon" aria-label="Close Icon" />
				</button>
				{children}
			</div>
		</div>
	);
}

export default Modal;
