import { useLayoutEffect, useState } from 'react';
import './SettingsModal.sass';

function SettingsModal({ isVisible, onClose, children, targetRef }) {
  const [modalStyle, setModalStyle] = useState({});

  const updateModalPosition = () => {
    const offsetX = -168;
    const offsetY = -5; 

    if (targetRef) {
      const rect = targetRef.getBoundingClientRect();
      setModalStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + offsetY,
        left: rect.left + window.scrollX + offsetX,
      });
    }
  };

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
  }, [isVisible, targetRef]);

  if (!isVisible || modalStyle === null) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('settings-modal')) {
      onClose();
    }
  };

  return (
    <div className="settings-modal" onClick={handleOverlayClick}>
      <div className="settings-modal__container" style={modalStyle} >
        {children}
      </div>
    </div>
  );
}

export default SettingsModal;
