import { useState, useRef } from 'react';
import './DayContent.sass';
import './DayContentMedia.sass';
import { IoEllipsisVertical } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import EmptyStateMessage from '../../../components/EmptyStateMessage/EmptyStateMessage';
import SettingsModal from '../../../components/SettingsModal/SettingsModal';
import { apiRequest } from '../../../api/apiRequest';

function DayContent({ page, daysPerPage, days, setDays, openModal, onProgramDayClick, selectedDayDrop, selectedProgramCardId, isParentModalVisible }) {
	const [activeCardId, setActiveCardId] = useState(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const [editingDayId, setEditingDayId] = useState(null);
	const [editedDescription, setEditedDescription] = useState('');

	const startIndex = (page - 1) * daysPerPage;
	const endIndex = startIndex + daysPerPage;
	const currentDays = days.slice(startIndex, endIndex);

	const buttonRefs = useRef({});

	const handleDayCardClick = (id) => {
		onProgramDayClick(id);
		console.log('Selected Day card ID:', id);
	};

	const openDayCardModal = (id) => {
		setActiveCardId(id);
		setModalVisible(true);
	};

	const closeDayCardModal = () => {
		setActiveCardId(null);
		setModalVisible(false);
	};

	const saveDescriptionChange = async (day, newDescription) => {
		if (newDescription !== day.muscle) {
			try {
				await apiRequest(`/day/${selectedProgramCardId}/days/${day.id}`, 'PUT', { muscle: newDescription, dayName: day.dayName }, { withCredentials: true });
				setDays((prevDays) => prevDays.map((c) => (c.id === day.id ? { ...c, muscle: newDescription } : c)));
				console.log('Day description successfully updated');
			} catch (error) {
				console.error('Error changing day description:', error.message);
			}
		}
	};

	const handleDescriptionBlur = (day) => {
		if (editedDescription.trim() && editedDescription.trim() !== day.muscle.trim()) {
			saveDescriptionChange(day, editedDescription.trim());
		}
		setEditingDayId(null);
		setEditedDescription('');
	};

	const handleChangeDescriptionClick = (day) => {
		setEditingDayId(day.id);
		setEditedDescription(day.muscle);
		closeDayCardModal();
	};

	const handleDeleteDay = async () => {
		if (!activeCardId) return;
		try {
			await apiRequest(`/day/${selectedProgramCardId}/days/${activeCardId}`, 'DELETE', null, { withCredentials: true });
			setDays((prevDays) => prevDays.filter((day) => day.id !== activeCardId));
			setActiveCardId(null);
			setModalVisible(false);
		} catch (error) {
			console.error('Error deleting program:', error.message);
		}
	};

	return (
		<div className={`day-content ${days.length > 0 ? 'day-content--with-wrapper' : ''}`}>
			{days.length === 0 && !isParentModalVisible ? (
				<EmptyStateMessage message="No workout days found. Create one now!" buttonMessage="Add days" onButtonClick={openModal} />
			) : (
				currentDays.map((day, index) => (
					<div key={index} className="day-content__card" onClick={() => handleDayCardClick(day.id)}>
						<div className="day-content__card-container">
							<div className="day-content__card-title-button">
								<h3 className="day-content__card-title">{day.dayName}</h3>
								<button
									ref={(el) => (buttonRefs.current[day.id] = el)}
									className="day-content__card-button"
									onClick={(event) => {
										event.stopPropagation();
										openDayCardModal(day.id);
									}}
									aria-label="Card Burger Menu"
								>
									<IoEllipsisVertical className={activeCardId === day.id ? 'day-content__settings-icon--active' : 'day-content__settings-icon'} />
								</button>
								{activeCardId === day.id && (
									<SettingsModal isVisible={true} onClose={closeDayCardModal} targetRef={buttonRefs.current[day.id]} offsetX={-135} offsetY={-6}>
										<div className="day-content__SettingsModal">
											<ul className="day-content__settings-menu">
												<li
													onClick={(e) => {
														e.stopPropagation();
														handleChangeDescriptionClick(day);
													}}
													className="day-content__settings-menu--list"
												>
													<MdEdit className="day-content__edit-icon" aria-label="Card edit" /> Edit description
												</li>
												<li
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteDay();
													}}
													className="day-content__settings-menu--list"
												>
													<MdDelete className="day-content__delete-icon" aria-label="Card delete" /> Delete
												</li>
											</ul>
										</div>
									</SettingsModal>
								)}
							</div>
							{editingDayId === day.id ? (
								<input
									className="day-content__edit-description-input"
									type="text"
									value={editedDescription}
									onChange={(e) => setEditedDescription(e.target.value)}
									onClick={(e) => e.stopPropagation()}
									onBlur={(e) => handleDescriptionBlur(day)}
									maxLength={50}
									autoFocus
								/>
							) : (
								<p className="day-content__card-description" lang="en">
									{day.muscle}
								</p>
							)}
						</div>
						<div className="day-content__card-footer">
							<span className="day-content__card-exercises">{day.workoutExercisesCount} exercises</span>
							<span className="day-content__card-date">{day.creationDate}</span>
						</div>
					</div>
				))
			)}
		</div>
	);
}

export default DayContent;
