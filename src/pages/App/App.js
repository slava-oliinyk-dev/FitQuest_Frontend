import { useState } from 'react';
import './App.sass'
import '../../styles/global.sass'
import Program from '../Program/Program'
import Day from '../Day/Day'
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Exercise from '../Exercise/Exercise';
import Later from '../Later/Later';


function App() {
  const [selectedProgramCardId, setSelectedProgramCardId] = useState(null);
  const [selectedDayCardId, setSelectedDayCardId] = useState(null)
  const [selectedExerciseCardId, setSelectedExerciseCardId] = useState(null)
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(1);


  const resetSelectedCardId = () => {
    setSelectedProgramCardId(null);
    setSelectedDayCardId(null)
    setSelectedExerciseCardId(null)
  };

  return (
    <div className='app'>
      <Sidebar
        onSelectPrograms={(id) => {
          setSelectedMenuItemId(id);
          if (id === 1) {
            resetSelectedCardId();
          }
        }}
        selectedMenuItemId={selectedMenuItemId}
      />

      <div className='app__main'>
        <Header />
        {selectedMenuItemId === 1 && (
          selectedDayCardId ? (
            <Exercise
              selectedDayCardId={selectedDayCardId}
              selectedExerciseCardId={selectedExerciseCardId}
              setSelectedExerciseCardId={setSelectedExerciseCardId}
            />
          ) : selectedProgramCardId ? (
            <Day
              selectedProgramCardId={selectedProgramCardId}
              setSelectedProgramCardId={setSelectedProgramCardId}
              onDayCardSelect={setSelectedDayCardId}
            />
          ) : (
            <Program onProgramCardSelect={setSelectedProgramCardId} />
          )
        )}
        {(selectedMenuItemId === 2 || selectedMenuItemId === 3 || selectedMenuItemId === 4) && (
          <Later />
        )}
      </div>
    </div>
  );
}



export default App