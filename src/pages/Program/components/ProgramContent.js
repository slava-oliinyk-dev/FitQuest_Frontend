import { useState, useRef } from "react";
import "./ProgramContent.sass"
import { settingsIcon, profileIcon, editIcon, shareIcon, deleteIcon } from '../../../assets/icons'
import SettingsModal from "../../../components/SettingsModal/SettingsModal";

function ProgramContent({ page, cardsPerPage, cards }) {
  const [activeCardId, setActiveCardId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const buttonRefs = useRef({});

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  const openModal = (id) => {
    setActiveCardId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setActiveCardId(null);
    setModalVisible(false);
  };

  return (
 
    <div className="program-content">
      
      {currentCards.map((card, index) => (
        <div key={index} className="program-content__card" >
          <div className="program-content__card-header">
            <h3 className="program-content__card-title">{card.title}</h3>
            <button ref={(el) => (buttonRefs.current[card.id] = el)} className="program-content__icon-button" onClick={() => openModal(card.id)}>
              <img
                className="program-content__card-settings-icon"
                src={settingsIcon}
                alt="Settings Icon"
              />
            </button>
            {activeCardId === card.id && (
              <SettingsModal isVisible={true} onClose={closeModal} targetRef={buttonRefs.current[card.id]}>
                <div className="program-content__SettingsModal">
                  <ul className="program-content__settings-menu">
                    <li><img className="program-content__settings-icon" src={editIcon} alt="" /> Change name</li>
                    <li><img className="program-content__settings-icon" src={shareIcon} alt="" /> Send the program</li>
                    <li><img className="program-content__settings-icon" src={deleteIcon} alt="" /> Delete</li>
                  </ul>
                </div>
              </SettingsModal>
            )}
          </div>
          <p className="program-content__card-days">{card.days}</p>
          <div className="program-content__card-footer">
            <div className="program-content__card-user-container">
              <img
                className="program-content__card-profile-icon"
                src={profileIcon}
                alt="Profile Icon"
              />
              <span className="program-content__card-user">{card.user}</span>
            </div>
            <span className="program-content__card-date">{card.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProgramContent;

