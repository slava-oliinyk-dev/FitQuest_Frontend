import "./ProgramContent.sass"
import { settingsIcon, profileIcon } from '../../../assets/icons'

function ProgramContent({ page, cardsPerPage, cards }) {
  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  return (
    <div className="program-content">
      {currentCards.map((card, index) => (
        <div key={index} className="program-content__card">
          <div className="program-content__card-header">
            <h3 className="program-content__card-title">{card.title}</h3>
            <img
              className="program-content__card-settings-icon"
              src={settingsIcon}
              alt="Settings Icon"
            />
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

