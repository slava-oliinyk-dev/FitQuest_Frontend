import { useState, useEffect } from 'react';
import "./Program.sass"
import Spinner from '../../components/Spinner/Spinner'
import ProgramContent from "./components/ProgramContent"
import Sidebar from '../../components/Sidebar/Sidebar';
import Title from "../../components/Title/Title";
import Header from "../../components/Header/Header";
import Pagination from "../../components/Pagination/Pagination";
import Modal from '../../components/Modal/Modal';

function Program() {
  const [page, setPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardsPerPage = 9;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/cards');
        if (!response.ok) {
          throw new Error('Error while receiving data');
        }
        const data = await response.json();
        
        setCards(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
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
  const closeModal = () => setModalVisible(false);

  return (
    <div className="program">
      <Sidebar />
      <div className="program__main">
        <Header />
        <Title title="PROGRAMS" buttonText="New Program" onButtonClick={openModal} />
        {loading ? (
         <div className="program__spinner">
           <Spinner />
         </div>
        ) : (
          <ProgramContent page={page} cardsPerPage={cardsPerPage} cards={cards} />
        )}
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
        <Modal isVisible={isModalVisible} onClose={closeModal}>
          <h2 className='program__modal-title'>Add New Program</h2>
          <input className='program__modal-input' type="text" placeholder='Enter program name' />
          <div>
            <button className='program__modal-btn-cancel' onClick={closeModal}>Cancel</button>
            <button className='program__modal-btn-add'>Add</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Program;
