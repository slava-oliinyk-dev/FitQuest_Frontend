import { useState } from 'react';
import { arrowUp, arrowDown } from '../../../assets/icons';
import './Faq.sass';
import './FaqMedia.sass';

function Faq() {
	const [activeId, setActiveId] = useState(null);

	const toggle = (id) => {
		setActiveId(activeId === id ? null : id);
	};

	const data = [
		{
			id: 1,
			question: 'Our fitness app is more than just workouts?',
			answer: 'Yes! You get more than just workouts—there’s convenient progress tracking, nutrition tips, and an inspiring community.',
		},
		{
			id: 2,
			question: 'We offer a convenient calendar for planning your sessions?',
			answer: 'Absolutely. With the calendar, you can easily schedule workouts, set reminders, and see your weekly plan at a glance.',
		},
		{
			id: 3,
			question: 'Save your settings, take notes, and share plans?',
			answer: 'No problem! All your settings and notes are always at hand, and you can share your plans with friends or a coach.',
		},
		{
			id: 4,
			question: 'Want to effortlessly design your own exercise routines?',
			answer: 'Yes, you can create your own daily workout routines, choose exercises, sets, and reps—all tailored to your goals.',
		},
		{ id: 5, question: 'We offer a convenient calendar for planning?', answer: 'Exactly. The calendar helps you plan workouts, schedule rest days, and quickly adjust your routine whenever needed.' },
	];
	return (
		<div className="faq" id="faq">
			{data.map((item) => {
				const isActive = activeId === item.id;
				return (
					<div key={item.id} className={`faq__item ${isActive ? 'active' : ''}`} onClick={() => toggle(item.id)}>
						<div className="faq__question">
							<div className="faq__question-num">
								<span className="faq__num">{item.id < 10 ? `0${item.id}.` : `${item.id}.`}</span>
								{item.question}
							</div>
							<img className="faq__arrow" src={isActive ? arrowDown : arrowUp} alt="arrow" />
						</div>

						{isActive && <div className="faq__answer">{item.answer}</div>}
					</div>
				);
			})}
		</div>
	);
}

export default Faq;
