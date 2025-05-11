import './EmptyStateMessage.sass'
import './EmptyStateMessageMedia.sass'

function EmptyStateMessage({ message, buttonMessage, onButtonClick }) {
  return <div className='empty-state'>
    <p className="empty-state__message">{message}</p>
    <button className='empty-state__button' onClick={onButtonClick}>{buttonMessage}</button>
  </div>
}

export default EmptyStateMessage;