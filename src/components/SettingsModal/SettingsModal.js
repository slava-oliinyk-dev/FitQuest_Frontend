import { useCallback, useLayoutEffect, useState } from 'react';
import './SettingsModal.sass';

function SettingsModal({ isVisible, onClose, children, targetRef, offsetX = 0, offsetY = 0 }) {
	const [modalStyle, setModalStyle] = useState({});

	const updateModalPosition = useCallback(() => {
		if (targetRef) {
			const rect = targetRef.getBoundingClientRect();
			setModalStyle({
				position: 'absolute',
				top: rect.bottom + window.scrollY + offsetY,
				left: rect.left + window.scrollX + offsetX,
			});
		}
	}, [targetRef, offsetX, offsetY]);

	useLayoutEffect(() => {
		if (isVisible) {
			updateModalPosition();
			window.addEventListener('resize', updateModalPosition);
			window.addEventListener('scroll', updateModalPosition);

			return () => {
				window.removeEventListener('resize', updateModalPosition);
				window.removeEventListener('scroll', updateModalPosition);
			};
		} else {
			setModalStyle(null);
		}
	}, [isVisible, updateModalPosition]);

	if (!isVisible || modalStyle === null) return null;

	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('settings-modal')) {
			e.stopPropagation();
			onClose();
		}
	};

	return (
		<div className="settings-modal" onClick={handleOverlayClick}>
			<div className="settings-modal__container" style={modalStyle}>
				{children}
			</div>
		</div>
	);
}

export default SettingsModal;
