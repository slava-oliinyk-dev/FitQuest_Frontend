import { useState, useEffect } from 'react';
import './Program.sass';
import './ProgramMedia.sass';
import Spinner from '../../components/Spinner/Spinner';
import ProgramContent from './components/ProgramContent';
import Title from '../../components/Title/Title';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import { apiRequest } from '../../api/apiRequest';

function Program({ onProgramCardSelect }) {
	const [page, setPage] = useState(1);
	const [isModalVisible, setModalVisible] = useState(false);
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [programTitle, setProgramTitle] = useState('');
	const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());
	const [errorMessage, setErrorMessage] = useState('');

	function getCardsPerPage() {
		const w = window.innerWidth;
		if (w < 420) return 4;
		if (w < 604) return 5;
		if (w < 841) return 8;
		if (w < 1579) return 9;
		if (w < 1819) return 16;
		if (w < 1820) return 20;
		return 20;
	}

	useEffect(() => {
		const fetchCards = async () => {
			try {
				const data = await apiRequest('/program', 'GET', null, { withCredentials: true });
				setCards(data);
			} catch (error) {
				console.error('Error fetching programs:', error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCards();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setCardsPerPage(getCardsPerPage());
		};
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
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
		setErrorMessage('');
	};

	const handleInputChange = (event) => {
		setProgramTitle(event.target.value);
	};

	const handleAddProgram = async () => {
		if (!programTitle.trim()) {
			setErrorMessage('Program title cannot be empty');
			return;
		}
		setErrorMessage('');
		try {
			const newProgram = await apiRequest('/program', 'POST', { title: programTitle }, { withCredentials: true });
			setCards((prevCards) => [...prevCards, newProgram]);
			closeModal();
		} catch (error) {
			const msg = error.response?.data?.message || 'Failed to create program. Try again';
			setErrorMessage(msg);
		}
	};

	return (
		<div className="program">
			<div className="program__main">
				<Title title="PROGRAMS" buttonText="New Program" onButtonClick={openModal} />

				{loading ? (
					<div className="program__spinner">
						<Spinner />
					</div>
				) : (
					<ProgramContent
						page={page}
						cardsPerPage={cardsPerPage}
						cards={cards}
						setCards={setCards}
						onProgramCardClick={onProgramCardSelect}
						openModal={openModal}
						isParentModalVisible={isModalVisible}
					/>
				)}
				{cards.length > 0 && (
					<div className="program__pagination">
						<Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
					</div>
				)}
				<Modal isVisible={isModalVisible} onClose={closeModal}>
					<h2 className="program__modal-title">Add New Program</h2>
					<input className="program__modal-input" type="text" placeholder="Enter program name" value={programTitle} onChange={handleInputChange} maxLength={25} />
					{errorMessage && <p className="program__modal-error">{errorMessage}</p>}
					<div className="program__modal-btn">
						<button className="program__modal-btn-cancel" onClick={closeModal}>
							Cancel
						</button>
						<button className="program__modal-btn-add" onClick={handleAddProgram}>
							Add
						</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}

export default Program;
