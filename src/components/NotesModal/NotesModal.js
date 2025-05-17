import './NotesModal.sass';
import { closeIcon } from '../../assets/icons';

function NotesModal({ isVisible, onClose, children }) {
	if (!isVisible) return null;

	const handleOverlayClickNotesModal = (e) => {
		if (e.target.classList.contains('notes-modal__overlay')) {
			onClose();
		}
	};

	return (
		<div className="notes-modal__overlay" onClick={handleOverlayClickNotesModal}>
			<div className="notes-modal">
				<button className="notes-modal__close" onClick={onClose}>
					<img className="notes-modal__close-icon" src={closeIcon} alt="Close Icon" />
				</button>
				{children}
			</div>
		</div>
	);
}

export default NotesModal;
