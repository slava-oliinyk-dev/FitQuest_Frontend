import { useRef, useState } from 'react';
import { TbNotes } from 'react-icons/tb';
import { IoEllipsisVertical } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import './ExerciseContent.sass';
import './ExerciseContentMedia.sass';
import EmptyStateMessage from '../../../components/EmptyStateMessage/EmptyStateMessage';
import SettingsModal from '../../../components/SettingsModal/SettingsModal';
import { apiRequest } from '../../../api/apiRequest';
import NotesModal from '../../../components/NotesModal/NotesModal';

function ExerciseContent({ page, exercisesPerPage, onDayCardId, setExercises, exercises, openModal, onExerciseCardClick, isParentModalVisible }) {
	const [activeCardId, setActiveCardId] = useState(null);
	const [activeNotesId, setActiveNotesId] = useState(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
	const [editingExerciseId, setEditingExerciseId] = useState(null);
	const [editingExerciseTitle, setEditingExerciseTitle] = useState('');
	const [editingParameters, setEditingParameters] = useState(null);
	const [currentParametersValue, setCurrentParametersValue] = useState('');
	const [currentNotesValue, setCurrentNotesValue] = useState('');

	const startIndex = (page - 1) * exercisesPerPage;
	const endIndex = startIndex + exercisesPerPage;
	const currentExercises = exercises.slice(startIndex, endIndex);

	const closeModal = () => {
		setActiveCardId(null);
		setModalVisible(false);
	};

	const openNotesModal = (id) => {
		setActiveNotesId(id);
		setIsNotesModalVisible(true);
	};

	const closeNotesModal = () => {
		setActiveNotesId(null);
		setIsNotesModalVisible(false);
	};

	const buttonRefs = useRef({});

	const handleExerciseCardClick = (id) => {
		onExerciseCardClick(id);
		console.log('Selected Exercise card ID:', id);
	};

	const handleNumberInputKeyDown = (e) => {
		if (['e', 'E', '+', '-'].includes(e.key)) {
			e.preventDefault();
		}
	};

	const handleNumberInputChange = (e) => {
		let val = e.target.value.replace(/\D/g, '');

		if (val.length > 1 && val.startsWith('0')) {
			val = val.replace(/^0+/, '');
		}

		if (val.length > 5) {
			val = val.slice(0, 5);
		}

		setCurrentParametersValue(val);
	};

	const handleFocus = () => {
		if (currentParametersValue === '0') {
			setCurrentParametersValue('');
		}
	};

	const openExerciseCardModal = (id) => {
		setActiveCardId(id);
		setModalVisible(true);
	};

	const handleChangeTitleClick = (exercise) => {
		setEditingExerciseId(exercise.id);
		setEditingExerciseTitle(exercise.name);
		closeModal();
	};

	const handleParametersClick = (exercise, field) => {
		setEditingParameters({ id: exercise.id, field });
		setCurrentParametersValue(String(exercise[field] ?? ''));
	};

	const handleNotesValueChange = (event) => {
		setCurrentNotesValue(event.target.value);
	};

	const handleNotesBlur = async (exercise, note) => {
		try {
			await apiRequest(`/exercise/${onDayCardId}/exercises/${exercise.id}/note`, 'PUT', { note: note }, { withCredentials: true });
			setCurrentNotesValue('');
			setExercises((prevExercises) => prevExercises.map((c) => (c.id === exercise.id ? { ...c, note: note } : c)));
		} catch (error) {
			console.log('Error update note exercise:', error.message);
		}
	};

	const handleTitleBlur = (exercise) => {
		if (editingExerciseTitle.trim() && editingExerciseTitle.trim() !== exercise.name.trim()) {
			handleTitleChange(exercise, editingExerciseTitle.trim());
		}
		setEditingExerciseId(null);
		setEditingExerciseTitle('');
	};

	const handleDeleteExercise = async () => {
		if (!activeCardId) return;
		try {
			await apiRequest(`/exercise/${onDayCardId}/exercises/${activeCardId}`, 'DELETE', null, { withCredentials: true });
			setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== activeCardId));
			setActiveCardId(null);
			setModalVisible(false);
		} catch (error) {
			console.error('Error deleting exercise:', error.message);
		}
	};

	const handleTitleChange = async (exercise, newTitle) => {
		if (!newTitle || newTitle === exercise.name) return;

		const payload = {
			name: newTitle.trim(),
			sets: Number(exercise.sets),
			repetitions: Number(exercise.repetitions),
			weight: Number(exercise.weight),
		};

		console.log('Sending payload:', payload);

		try {
			await apiRequest(`/exercise/${onDayCardId}/exercises/${exercise.id}`, 'PUT', payload, { withCredentials: true });
			setExercises((prevExercises) => prevExercises.map((c) => (c.id === exercise.id ? { ...c, name: newTitle } : c)));
			console.log('Exercise title successfully updated');
		} catch (error) {
			console.error('Error changing exercise title:', error.message);
		}
	};

	const handleParametersChange = async (exercise, field, newValue) => {
		newValue = String(newValue ?? '').trim();
		if (newValue.trim() === '') {
			newValue = '0';
			setCurrentParametersValue('0');
		}
		const parsedValue = Number(newValue);

		if (isNaN(parsedValue) || parsedValue === exercise[field]) return;

		const payload = {
			name: exercise.name,
			sets: field === 'sets' ? parsedValue : Number(exercise.sets),
			weight: field === 'weight' ? parsedValue : Number(exercise.weight),
			repetitions: field === 'repetitions' ? parsedValue : Number(exercise.repetitions),
		};

		console.log('Sending payload:', payload);

		try {
			await apiRequest(`/exercise/${onDayCardId}/exercises/${exercise.id}`, 'PUT', payload, { withCredentials: true });
			setExercises((prevExercises) => prevExercises.map((ex) => (ex.id === exercise.id ? { ...ex, [field]: newValue } : ex)));
			console.log(`Updated ${field} successfully`);
		} catch (error) {
			console.error(`Error updating ${field}:`, error.message);
		}
	};

	return (
		<div className={`exercise-content ${exercises.length > 0 ? 'exercise-content--with-wrapper' : ''}`}>
			{exercises.length === 0 && !isParentModalVisible ? (
				<EmptyStateMessage message="No exercises found. Create one now!" buttonMessage="Add exercises" onButtonClick={openModal} />
			) : (
				currentExercises.map((exercise, index) => (
					<div key={exercise.id} className="exercise-content__card" onClick={() => handleExerciseCardClick(exercise.id)}>
						<div className="exercise-content__card-container">
							<div className="exercise-content__card-title-button">
								{editingExerciseId === exercise.id ? (
									<input
										className="exercise-content__edit-title-input"
										type="text"
										value={editingExerciseTitle}
										onChange={(e) => setEditingExerciseTitle(e.target.value)}
										onClick={(e) => e.stopPropagation()}
										onBlur={(e) => handleTitleBlur(exercise)}
										maxLength={25}
										autoFocus
									/>
								) : (
									<span className="exercise-content__card-title" lang="en">
										{exercise.name}
									</span>
								)}

								<div>
									<button
										className="exercise-content__card-button"
										onClick={(e) => {
											e.stopPropagation();
											openNotesModal(exercise.id);
										}}
										aria-label="Notepad"
									>
										<TbNotes className="exercise-content__notepad-icon" />
									</button>
									{isNotesModalVisible && activeNotesId === exercise.id && (
										<NotesModal isVisible={isNotesModalVisible} onClose={closeNotesModal}>
											<h2 className="exercise-content__notes-modal-title">Exercise Notes</h2>
											<textarea
												className="exercise-content__notes-modal-textarea"
												placeholder="Add notes, for example, about exercise technique or any tips to improve performance..."
												onBlur={() => handleNotesBlur(exercise, currentNotesValue)}
												onChange={handleNotesValueChange}
												maxLength={2000}
											>
												{exercise.note}
											</textarea>
											<div className="exercise-content__notes-modal-buttons">
												<button className="exercise-content__notes-modal-button-cancel" onClick={closeNotesModal}>
													Cancel
												</button>
												<button className="exercise-content__notes-modal-button-save" onClick={closeNotesModal}>
													Save
												</button>
											</div>
										</NotesModal>
									)}
									<button
										className="exercise-content__card-button"
										ref={(el) => {
											buttonRefs.current[exercise.id] = el;
										}}
										onClick={(event) => {
											event.stopPropagation();
											openExerciseCardModal(exercise.id);
										}}
										aria-label="Card Burger Menu"
									>
										<IoEllipsisVertical className={activeCardId === exercise.id ? 'exercise-content__settings-icon--active' : ' exercise-content__settings-icon'} />
									</button>
									{activeCardId === exercise.id && buttonRefs.current[exercise.id] && (
										<SettingsModal isVisible={true} onClose={closeModal} targetRef={buttonRefs.current[exercise.id]} offsetX={-127} offsetY={-6}>
											<div className="exercise-content__settings-modal">
												<ul className="exercise-content__settings-menu">
													<li
														onClick={(e) => {
															e.stopPropagation();
															handleChangeTitleClick(exercise);
														}}
														className="exercise-content__settings-menu-item"
													>
														<MdEdit className="exercise-content__settings-menu-item-icon" aria-label="Change name" /> Change name
													</li>
													<li
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteExercise();
														}}
														className="exercise-content__settings-menu-item"
													>
														<MdDelete className="exercise-content__settings-menu-item-icon" aria-label="Delete" />
														Delete
													</li>
												</ul>
											</div>
										</SettingsModal>
									)}
								</div>
							</div>

							<div className="exercise-content__inputs">
								<div className="exercise-content__inputs-input-label">
									{editingParameters?.id === exercise.id && editingParameters?.field === 'sets' ? (
										<input
											className="exercise-content__inputs-input"
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											placeholder="0"
											value={currentParametersValue}
											onKeyDown={handleNumberInputKeyDown}
											onBlur={() => handleParametersChange(exercise, 'sets', currentParametersValue)}
											onChange={handleNumberInputChange}
											onFocus={handleFocus}
											autoFocus
										/>
									) : (
										<div className="exercise-content__inputs-div" onClick={() => handleParametersClick(exercise, 'sets')}>
											{exercise.sets}
										</div>
									)}
									<label htmlFor="sets">sets</label>
								</div>

								<div className="exercise-content__inputs-input-label">
									{editingParameters?.id === exercise.id && editingParameters?.field === 'weight' ? (
										<input
											className="exercise-content__inputs-input"
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											placeholder="0"
											value={currentParametersValue}
											onKeyDown={handleNumberInputKeyDown}
											onBlur={() => handleParametersChange(exercise, 'weight', currentParametersValue)}
											onChange={handleNumberInputChange}
											onFocus={handleFocus}
											autoFocus
										/>
									) : (
										<div className="exercise-content__inputs-div" onClick={() => handleParametersClick(exercise, 'weight')}>
											{exercise.weight}
										</div>
									)}
									<label htmlFor="kg">kg</label>
								</div>
								<div className="exercise-content__inputs-input-label">
									{editingParameters?.id === exercise.id && editingParameters?.field === 'repetitions' ? (
										<input
											className="exercise-content__inputs-input"
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											placeholder="0"
											value={currentParametersValue}
											onKeyDown={handleNumberInputKeyDown}
											onBlur={() => handleParametersChange(exercise, 'repetitions', currentParametersValue)}
											onChange={handleNumberInputChange}
											onFocus={handleFocus}
											autoFocus
										/>
									) : (
										<div className="exercise-content__inputs-div" onClick={() => handleParametersClick(exercise, 'repetitions')}>
											{exercise.repetitions}
										</div>
									)}
									<label htmlFor="reps">reps</label>
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
}

export default ExerciseContent;
