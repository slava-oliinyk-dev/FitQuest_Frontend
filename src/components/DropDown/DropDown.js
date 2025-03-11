import { useState } from 'react';
import './DropDown.sass'

function DropDown({ selectedDay, setSelectedDay }) {
    const [isOpenDropList, setIsOpenDropList] = useState(false)

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleSelectDropList = (day) => {
        setSelectedDay(day);
        setIsOpenDropList(false)
    }

    return <div className="dropdown">
        <div className='dropdown-selected' onClick={() => setIsOpenDropList(!isOpenDropList)}>
            {selectedDay}
        </div>
        {isOpenDropList && (
            <ul className='dropdown-list'>
                {days.map((day, index) => (
                    <li
                        key={index}
                        className='dropdown-item'
                        onClick={() => handleSelectDropList(day)}
                    >
                        {day}
                    </li>
                ))}
            </ul>
        )}
    </div>
}

export default DropDown;