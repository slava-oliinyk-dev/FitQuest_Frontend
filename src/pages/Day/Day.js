import { useEffect, useState } from 'react';
import './Day.sass'
import Title from "../../components/Title/Title";
import Modal from '../../components/Modal/Modal';
import DayContent from './components/DayContent';
import { apiRequest } from '../../api/apiRequest';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import DropDown from '../../components/DropDown/DropDown';

function Day({ selectedProgramCardId, onDayCardSelect }) {
    const [selectedDayDrop, setSelectedDayDrop] = useState('Select day of the week')
    const [dayDescription, setDayDescription] = useState('')
    const [page, setPage] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [days, setDays] = useState([])
    const [loading, setLoading] = useState(true);

    const daysPerPage = 9;


    useEffect(() => {
        const fetchDays = async () => {
            try {
                const data = await apiRequest(`/day/${selectedProgramCardId}`, 'GET');
                setDays(data);
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }

        }
        fetchDays();
    }, [])

    const totalPages = Math.ceil(days.length / daysPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    };

    const openModal = () => setModalVisible(true);
    const closeModal = () => {
        setModalVisible(false);
        setSelectedDayDrop('Select day of the week')
    }

    const handleInputDayChange = (event) => {
        setDayDescription(event.target.value);
    };

    const handleAddDay = async () => {
        if (!dayDescription.trim() || selectedDayDrop === 'Select day of the week') {
            alert('Day cannot be empty');
            return;
        }
        try {
            const newDayCard = await apiRequest(`/day/${selectedProgramCardId}`, 'POST', { dayName: selectedDayDrop, muscle: dayDescription })
            setDays((prevDays) => [...prevDays, newDayCard])
            closeModal()
            setSelectedDayDrop('Select day of the week')
        } catch (error) {
            console.error('Error creating day card:', error.message);
        }
    }

    return (
        <div className='day'>
            <div className='day__main'>
                <Title
                    title="WORKOUT DAYS"
                    buttonText="Workout Day"
                    onButtonClick={openModal}
                />
                {loading ? (
                    <div className="day__spinner">
                        <Spinner />
                    </div>
                ) : (
                    <DayContent page={page} daysPerPage={daysPerPage} days={days} setDays={setDays} openModal={openModal} onProgramDayClick={onDayCardSelect} selectedDayDrop={selectedDayDrop} selectedProgramCardId={selectedProgramCardId} isParentModalVisible={isModalVisible} />)}
                {days.length > 0 && (
                    <div className='day__pagination'>
                        <Pagination
                            currentPage={page}
                            onPageChange={handlePageChange}
                            totalPages={totalPages}
                        />
                    </div>
                )}

                <Modal isVisible={isModalVisible} onClose={closeModal}>
                    <h2 className='day__modal-title'>Add new workout day</h2>
                    <div className='day__modal-input-dropdown'>
                        <DropDown
                            selectedDay={selectedDayDrop}
                            setSelectedDay={setSelectedDayDrop}
                        />
                        <input className='day__modal-input' type="text" placeholder='Enter description' onChange={handleInputDayChange} maxLength={85}
                        />

                    </div>
                    <div>
                        <button className='day__modal-btn-cancel' onClick={closeModal}>Cancel</button>
                        <button className='day__modal-btn-add' onClick={handleAddDay}>Add</button>
                    </div>
                </Modal>

            </div>
        </div>
    )
}

export default Day