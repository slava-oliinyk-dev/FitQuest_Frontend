import { useEffect, useState } from 'react';
import Title from '../../components/Title/Title'
import './Exercise.sass'
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import ExerciseContent from './components/ExerciseContent';
import { apiRequest } from '../../api/apiRequest';
import Pagination from '../../components/Pagination/Pagination';

function Exercise({ selectedDayCardId, selectedExerciseCardId, setSelectedExerciseCardId }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [exercises, setExercises] = useState([])
    const [exerciseData, setExerciseData] = useState({
        name: '',
        weight: '',
        reps: '',
        sets: ''
    });

    const exercisesPerPage = 9;

    const totalPages = Math.ceil(exercises.length / exercisesPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await apiRequest(`/exercise/${selectedDayCardId}`, 'GET')
                setExercises(data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
        fetchExercises();
    }, [])

    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false);



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setExerciseData((prev) => ({
            ...prev,
            [name]: value
        }));
        console.log(exerciseData)
    };

    const handleAddExercise = async () => {
        if (!exerciseData.name || !exerciseData.sets || !exerciseData.reps || !exerciseData.weight) {
            alert('Please fill in all fields');
            return;
        }
        const body = {
            name: exerciseData.name,
            sets: Number(exerciseData.sets),
            repetitions: Number(exerciseData.reps),
            weight: Number(exerciseData.weight),
        };

        try {
            const newExerciseCard = await apiRequest(`/exercise/${selectedDayCardId}`, 'POST', body)
            setExercises((prev) => [...prev, newExerciseCard]);
            closeModal()
        } catch (error) {
            console.error('Error creating exercise card:', error.message);
        }
    }



    return (
        <div className='exercise'>
            <Title
                title="EXERCISES"
                buttonText="Exercise"
                onButtonClick={openModal}
            />
            {loading ? (
                <div className="exercise__spinner">
                    <Spinner />
                </div>
            ) : (
                <ExerciseContent page={page} exercisesPerPage={exercisesPerPage} exercises={exercises} setExercises={setExercises} openModal={openModal} onExerciseCardClick={setSelectedExerciseCardId} onDayCardId={selectedDayCardId} isParentModalVisible={isModalVisible} />)}
            {exercises.length > 0 && (
                <div className='exercise__pagination'>
                    <Pagination
                        currentPage={page}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                </div>
            )}
            <Modal isVisible={isModalVisible} onClose={closeModal}>
                <h2 className='exercise-modal__title'>Add New Exercise</h2>
                <input className='exercise-modal__input' type="text" name="name" placeholder='Enter exercise name' onChange={handleInputChange} maxLength={40} />
                <div className='exercise-modal__inputs'>
                    <div className='exercise-modal__inputs-input-label'><input className='exercise-modal__inputs-input' name="sets" type="number" placeholder='0' onChange={handleInputChange} />
                        <label htmlFor="sets">sets</label></div>
                    <div className='exercise-modal__inputs-input-label'><input className='exercise-modal__inputs-input' name="weight" type="number" placeholder='0' onChange={handleInputChange} />
                        <label htmlFor="kg">kg</label></div>
                    <div className='exercise-modal__inputs-input-label'><input className='exercise-modal__inputs-input' name="reps" type="number" placeholder='0' onChange={handleInputChange} />
                        <label htmlFor="reps">reps</label></div>
                </div>
                <div className='exercise-modal__buttons'>
                    <button className='exercise-modal__button-cancel' onClick={closeModal}>Cancel</button>
                    <button className='exercise-modal__button-add' onClick={handleAddExercise}>Add</button>
                </div>
            </Modal>
        </div>
    )
}

export default Exercise