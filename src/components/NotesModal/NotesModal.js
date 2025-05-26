import './NotesModal.sass';
import { IoClose } from 'react-icons/io5';

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
					<IoClose className="notes-modal__close-icon" aria-label="Close Icon" />
				</button>
				{children}
			</div>
		</div>
	);
}

export default NotesModal;
