import { useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
import './Exercise.sass';
import './ExerciseMedia.sass';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import ExerciseContent from './components/ExerciseContent';
import { apiRequest } from '../../api/apiRequest';
import Pagination from '../../components/Pagination/Pagination';

function Exercise({ selectedDayCardId, selectedExerciseCardId, setSelectedExerciseCardId }) {
	const [isModalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [exercises, setExercises] = useState([]);
	const [exerciseData, setExerciseData] = useState({
		name: '',
		weight: '',
		reps: '',
		sets: '',
	});
	const [exercisesPerPage, setExercisesPerPage] = useState(getExercisesPerPage());
	const [errorMessage, setErrorMessage] = useState('');

	function getExercisesPerPage() {
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
		const handleResize = () => {
			setExercisesPerPage(getExercisesPerPage());
		};
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const totalPages = Math.ceil(exercises.length / exercisesPerPage);

	const handlePageChange = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setPage(pageNumber);
		}
	};

	useEffect(() => {
		const fetchExercises = async () => {
			try {
				const data = await apiRequest(`/exercise/${selectedDayCardId}`, 'GET', null, { withCredentials: true });
				setExercises(data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
			}
		};
		fetchExercises();
	}, []);

	const initialExerciseData = {
		name: '',
		weight: '',
		reps: '',
		sets: '',
	};
	const openModal = () => {
		setExerciseData(initialExerciseData);
		setModalVisible(true);
	};
	const closeModal = () => {
		setModalVisible(false);
		setErrorMessage('');
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setExerciseData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleNumberInputChange = (e) => {
		const { name, value: raw } = e.target;
		let val = raw.replace(/\D/g, '');
		if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
		if (val.length > 5) val = val.slice(0, 5);

		setExerciseData((prev) => ({
			...prev,
			[name]: val,
		}));
	};

	const handleAddExercise = async () => {
		if (!exerciseData.name) {
			setErrorMessage('Enter the name');
			return;
		}
		if (!exerciseData.sets) {
			setErrorMessage('Enter sets');
			return;
		}
		if (!exerciseData.weight) {
			setErrorMessage('Enter weight');
			return;
		}
		if (!exerciseData.reps) {
			setErrorMessage('Enter repetitions');
			return;
		}

		const body = {
			name: exerciseData.name,
			sets: Number(exerciseData.sets),
			repetitions: Number(exerciseData.reps),
			weight: Number(exerciseData.weight),
		};

		try {
			const newExerciseCard = await apiRequest(`/exercise/${selectedDayCardId}`, 'POST', body, { withCredentials: true });
			setExercises((prev) => [...prev, newExerciseCard]);
			closeModal();
		} catch (error) {
			console.error('Error creating exercise card:', error.message);
		}
	};

	return (
		<div className="exercise">
			<div className="exercise__main">
				<Title title="EXERCISES" buttonText="Exercise" onButtonClick={openModal} />
				{loading ? (
					<div className="exercise__spinner">
						<Spinner />
					</div>
				) : (
					<ExerciseContent
						page={page}
						exercisesPerPage={exercisesPerPage}
						exercises={exercises}
						setExercises={setExercises}
						openModal={openModal}
						onExerciseCardClick={setSelectedExerciseCardId}
						onDayCardId={selectedDayCardId}
						isParentModalVisible={isModalVisible}
					/>
				)}
				{exercises.length > 0 && (
					<div className="exercise__pagination">
						<Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
					</div>
				)}
				<Modal isVisible={isModalVisible} onClose={closeModal}>
					<h2 className="exercise-modal__title">Add New Exercise</h2>
					<input className="exercise-modal__input" type="text" name="name" placeholder="Enter exercise name" onChange={handleInputChange} maxLength={25} />
					<div className="exercise-modal__inputs">
						<div className="exercise-modal__inputs-input-label">
							<input
								className="exercise-modal__inputs-input"
								value={exerciseData.sets}
								name="sets"
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								placeholder="0"
								onChange={handleNumberInputChange}
							/>
							<label htmlFor="sets">sets</label>
						</div>
						<div className="exercise-modal__inputs-input-label">
							<input
								className="exercise-modal__inputs-input"
								value={exerciseData.weight}
								name="weight"
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								placeholder="0"
								onChange={handleNumberInputChange}
							/>
							<label htmlFor="kg">kg</label>
						</div>
						<div className="exercise-modal__inputs-input-label">
							<input
								className="exercise-modal__inputs-input"
								value={exerciseData.reps}
								name="reps"
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								placeholder="0"
								onChange={handleNumberInputChange}
							/>
							<label htmlFor="reps">reps</label>
						</div>
					</div>
					{errorMessage && <p className="exercise__modal-error">{errorMessage}</p>}
					<div className="exercise-modal__buttons">
						<button className="exercise-modal__button-cancel" onClick={closeModal}>
							Cancel
						</button>
						<button className="exercise-modal__button-add" onClick={handleAddExercise}>
							Add
						</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}

export default Exercise;
