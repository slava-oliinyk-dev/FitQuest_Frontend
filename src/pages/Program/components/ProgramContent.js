import { useState, useRef } from "react";
import "./ProgramContent.sass"
import "../Program-media.sass"
import { settingsIcon, profileIcon, editIcon, shareIcon, deleteIcon, settingsOrangeIcon } from '../../../assets/icons'
import SettingsModal from "../../../components/SettingsModal/SettingsModal";
import EmptyStateMessage from '../../../components/EmptyStateMessage/EmptyStateMessage';
import { apiRequest } from "../../../api/apiRequest";

function ProgramContent({ page, cardsPerPage, cards, setCards, onProgramCardClick, openModal, isParentModalVisible }) {
  const [activeCardId, setActiveCardId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const buttonRefs = useRef({});

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  const openModalCard = (id) => {
    setActiveCardId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setActiveCardId(null);
    setModalVisible(false);
  };

  const handleCardClick = (id) => {
    onProgramCardClick(id);
    console.log('Selected Program card ID:', id);
  }

  const handleDeleteProgram = async () => {
    if (!activeCardId) return;
    try {
      await apiRequest(`/program/${activeCardId}`, 'DELETE');
      setCards((prevCards) => prevCards.filter((card) => card.id !== activeCardId));
      setActiveCardId(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting program:', error.message);
    }
  };

  const saveTitleChange = async (card, newTitle) => {
    if (newTitle !== card.title) {
      try {
        await apiRequest(`/program/${card.id}`, 'PUT', { title: newTitle });
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === card.id ? { ...c, title: newTitle } : c
          )
        );
        console.log('Program title successfully updated');
      } catch (error) {
        console.error('Error changing program title:', error.message);
      }
    }
  };

  const handleTitleBlur = (card) => {
    if (editedTitle.trim() && editedTitle.trim() !== card.title.trim()) {
      saveTitleChange(card, editedTitle.trim());
    }
    setEditingCardId(null);
    setEditedTitle('');
  };

  const handleChangeNameClick = (card) => {
    setEditingCardId(card.id);
    setEditedTitle(card.title);
    closeModal();
  };



  return (
    <div className={`program-content ${cards.length > 0 ? 'program-content--with-wrapper' : ''}`}>
      {
        currentCards.length === 0 && !isParentModalVisible ? (
          <EmptyStateMessage message="No programs found. Create one now!" buttonMessage='Add Program' onButtonClick={openModal} />
        ) : (
          currentCards.map((card, index) => (
            <div key={index} className="program-content__card" onClick={() => handleCardClick(card.id)}>
              <div className="program-content__card-header">
                {
                  editingCardId === card.id ? <input className="program-content__card-title-button" type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => handleTitleBlur(card)}
                    maxLength={25}
                    autoFocus /> : <h3 className="program-content__card-title">{card.title}</h3>
                }
                <button ref={(el) => (buttonRefs.current[card.id] = el)} className="program-content__icon-button" onClick={(event) => {
                  event.stopPropagation();
                  openModalCard(card.id)
                }
                }>
                  <img
                    className="program-content__card-settings-icon"
                    src={activeCardId === card.id ? settingsOrangeIcon : settingsIcon}
                    alt="Settings Icon"
                  />
                </button>
                {activeCardId === card.id && (
                  <SettingsModal isVisible={true} onClose={closeModal} targetRef={buttonRefs.current[card.id]} offsetX={-155}
                    offsetY={-6}>
                    <div className="program-content__SettingsModal">
                      <ul className="program-content__settings-menu">
                        <li onClick={(e) => { e.stopPropagation(); handleChangeNameClick(card); }}><img className="program-content__settings-icon" src={editIcon} alt="" /> Change name</li>
                        <li onClick={(e) => { e.stopPropagation(); handleDeleteProgram() }}><img className="program-content__settings-icon" src={deleteIcon} alt="" /> Delete</li>
                      </ul>
                    </div>
                  </SettingsModal>
                )}
              </div>
              <p className="program-content__card-days">{card.workoutDaysCount > 0 ? `${card.workoutDaysCount} training day${card.workoutDaysCount > 1 ? 's' : ''}`
                : 'No training days'}</p>
              <div className="program-content__card-footer">
                <div className="program-content__card-user-container">
                  <img
                    className="program-content__card-profile-icon"
                    src={profileIcon}
                    alt="Profile Icon"
                  />
                  <span className="program-content__card-user">{card.userName}</span>
                </div>
                <span className="program-content__card-date">{card.creationDate}</span>
              </div>
            </div>

          )))}
    </div>

  );
}

export default ProgramContent;

