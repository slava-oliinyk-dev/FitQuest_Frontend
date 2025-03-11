import { useState, useEffect } from 'react';
import "./Program.sass"
import Spinner from '../../components/Spinner/Spinner'
import ProgramContent from "./components/ProgramContent"
import Title from "../../components/Title/Title";
import Pagination from "../../components/Pagination/Pagination";
import Modal from '../../components/Modal/Modal';
import { apiRequest } from '../../api/apiRequest';

function Program({ onProgramCardSelect }) {
  const [page, setPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programTitle, setProgramTitle] = useState('');
  const cardsPerPage = 9;

  useEffect(() => {
    console.log('Fetching programs');
    const fetchCards = async () => {
      try {
        const data = await apiRequest('/program', 'GET');
        setCards(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const totalPages = Math.ceil(cards.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    setProgramTitle('');
  }

  const handleInputChange = (event) => {
    setProgramTitle(event.target.value);
  };

  const handleAddProgram = async () => {
    if (!programTitle.trim()) {
      alert('Program title cannot be empty');
      return;
    }
    try {
      const newProgram = await apiRequest('/program', 'POST', { title: programTitle });
      setCards((prevCards) => [...prevCards, newProgram]);
      closeModal();
    } catch (error) {
      console.error('Error creating program:', error.message);
    }
  };



  return (
    <div className="program">
      <div className="program__main">

        <Title
          title="PROGRAMS"
          buttonText="New Program"
          onButtonClick={openModal}
        />

        {loading ? (
          <div className="program__spinner">
            <Spinner />
          </div>
        ) : (
          <ProgramContent page={page} cardsPerPage={cardsPerPage} cards={cards} setCards={setCards} onProgramCardClick={onProgramCardSelect} openModal={openModal} isParentModalVisible={isModalVisible} />
        )}
        {cards.length > 0 && (
          <div className="program__pagination">
            <Pagination
              currentPage={page}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        )}
        <Modal isVisible={isModalVisible} onClose={closeModal}>
          <h2 className='program__modal-title'>Add New Program</h2>
          <input className='program__modal-input' type="text" placeholder='Enter program name' value={programTitle}
            onChange={handleInputChange} maxLength={25} />
          <div>
            <button className='program__modal-btn-cancel' onClick={closeModal}>Cancel</button>
            <button className='program__modal-btn-add' onClick={handleAddProgram}>Add</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Program;
