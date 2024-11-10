import { useState } from 'react';
import "./Program.sass"
import ProgramContent from "./components/ProgramContent"
import Sidebar from '../../components/Sidebar/Sidebar';
import Title from "../../components/Title/Title";
import Header from "../../components/Header/Header";
import Pagination from "../../components/Pagination/Pagination";
import Modal from '../../components/Modal/Modal';

function Program() {
  const [page, setPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const cardsPerPage = 9;

  const cards = [
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },

    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },

    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Strength Surge",
      days: "4 training days",
      user: "Slava",
      date: "04/10/2024",
    },
    {
      title: "Endurance Boost",
      days: "5 training days",
      user: "Ivan",
      date: "05/11/2024",
    },
    {
      title: "Flexibility Focus",
      days: "3 training days",
      user: "Anna",
      date: "12/12/2024",
    },
    {
        title: "Strength Builder",
        days: "5 training days",
        user: "John",
        date: "01/15/2025",
    },
    {
        title: "Cardio Blast",
        days: "4 training days",
        user: "Emily",
        date: "02/10/2025",
    },
    {
        title: "Yoga and Recovery",
        days: "2 training days",
        user: "Sophia",
        date: "11/20/2024",
    },
    {
        title: "Endurance Training",
        days: "6 training days",
        user: "Michael",
        date: "03/05/2025",
    },
    {
        title: "HIIT Challenge",
        days: "3 training days",
        user: "Liam",
        date: "12/30/2024",
    },
    {
        title: "Full Body Sculpt",
        days: "4 training days",
        user: "Olivia",
        date: "01/08/2025",
    }
  ];

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
        <Header/>
        <Title title="PROGRAMS" buttonText="New Program" onButtonClick={openModal} />
        <ProgramContent page={page} cardsPerPage={cardsPerPage} cards={cards} />
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
         <Modal isVisible={isModalVisible} onClose={closeModal}>
          <h2 className='program__modal-title'>Add New Program</h2>
          <input className='program__modal-input'  type="text" placeholder='Enter program name'/>
          <div>
            <button className='program__modal-btn-cancel' onClick={closeModal}>Cancel</button>
            <button className='program__modal-btn-add'>Add</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Program;
