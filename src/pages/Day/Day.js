import { useEffect, useState } from 'react';
import './Day.sass';
import './DayMedia.sass';
import Title from '../../components/Title/Title';
import Modal from '../../components/Modal/Modal';
import DayContent from './components/DayContent';
import { apiRequest } from '../../api/apiRequest';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import DropDown from '../../components/DropDown/DropDown';

function Day({ selectedProgramCardId, onDayCardSelect }) {
	const [selectedDayDrop, setSelectedDayDrop] = useState('Select day of the week');
	const [dayDescription, setDayDescription] = useState('');
	const [page, setPage] = useState(1);
	const [isModalVisible, setModalVisible] = useState(false);
	const [days, setDays] = useState([]);
	const [loading, setLoading] = useState(true);
	const [daysPerPage, setDaysPerPage] = useState(getDaysPerPage());
	const [errorMessage, setErrorMessage] = useState('');

	function getDaysPerPage() {
		const w = window.innerWidth;
		if (w < 604) return 4;
		if (w < 841) return 8;
		if (w < 1579) return 9;
		if (w < 1819) return 16;
		if (w < 1820) return 20;
		return 20;
	}

	useEffect(() => {
		const fetchDays = async () => {
			try {
				const data = await apiRequest(`/day/${selectedProgramCardId}`, 'GET', null, { withCredentials: true });
				setDays(data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
			}
		};
		if (selectedProgramCardId) {
			fetchDays();
		}
	}, [selectedProgramCardId]);

	useEffect(() => {
		const handleResize = () => {
			setDaysPerPage(getDaysPerPage());
		};
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const totalPages = Math.ceil(days.length / daysPerPage);
	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages > 0 ? totalPages : 1);
		}
	}, [page, totalPages]);

	const handlePageChange = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setPage(pageNumber);
		}
	};

	const openModal = () => {
		setDayDescription('');
		setSelectedDayDrop('Select day of the week');
		setErrorMessage('');
		setModalVisible(true);
	};
	const closeModal = () => {
		setModalVisible(false);
		setDayDescription('');
		setSelectedDayDrop('Select day of the week');
		setErrorMessage('');
	};

	const handleInputDayChange = (event) => {
		setDayDescription(event.target.value);
	};

	const handleAddDay = async () => {
		if (!dayDescription.trim() || selectedDayDrop === 'Select day of the week') {
			if (selectedDayDrop === 'Select day of the week') {
				setErrorMessage('Select day of the week');
				return;
			}
			if (!dayDescription.trim()) {
				setErrorMessage('Enter a description');
				return;
			}
			return;
		}
		try {
			const newDayCard = await apiRequest(`/day/${selectedProgramCardId}`, 'POST', { dayName: selectedDayDrop, muscle: dayDescription }, { withCredentials: true });
			setDays((prevDays) => [...prevDays, newDayCard]);
			closeModal();
			setSelectedDayDrop('Select day of the week');
		} catch (error) {
			const msg = error.response?.data?.message || 'Failed to create day. Try again';
			setErrorMessage(msg);
		}
	};

	return (
		<div className="day">
			<div className="day__main">
				<Title title="WORKOUT DAYS" buttonText="Workout Day" onButtonClick={openModal} />
				{loading ? (
					<div className="day__spinner">
						<Spinner />
					</div>
				) : (
					<DayContent
						page={page}
						daysPerPage={daysPerPage}
						days={days}
						setDays={setDays}
						openModal={openModal}
						onProgramDayClick={onDayCardSelect}
						selectedDayDrop={selectedDayDrop}
						selectedProgramCardId={selectedProgramCardId}
						isParentModalVisible={isModalVisible}
					/>
				)}
				{days.length > 0 && (
					<div className="day__pagination">
						<Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
					</div>
				)}

				<Modal isVisible={isModalVisible} onClose={closeModal}>
					<h2 className="day__modal-title">Add new workout day</h2>
					<div className="day__modal-input-dropdown">
						<DropDown selectedDay={selectedDayDrop} setSelectedDay={setSelectedDayDrop} />
						<input className="day__modal-input" type="text" placeholder="Enter description" onChange={handleInputDayChange} maxLength={50} />
						{errorMessage && <p className="day__modal-error">{errorMessage}</p>}
					</div>
					<div className="day__modal-btn">
						<button className="day__modal-btn-cancel" onClick={closeModal}>
							Cancel
						</button>
						<button className="day__modal-btn-add" onClick={handleAddDay}>
							Add
						</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}

export default Day;
