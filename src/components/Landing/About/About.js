import './About.sass';
import './AboutMedia.sass';
import {
	mockupOne300,
	mockupOne300x2,
	mockupTwo300,
	mockupTwo300x2,
	mockupThree300,
	mockupThree300x2,
	aboutPlan500,
	aboutPlan500x2,
	aboutVisual500,
	aboutVisual500x2,
	aboutCalendar500,
	aboutCalendar500x2,
} from '../../../assets/images.js';

function About() {
	return (
		<div className="about" id="about">
			<div className="about__plan">
				<h2 className="about__plan-title">
					[ PLAN, TRACK AND SHARE WITH EASE <br />
					<span className="about__plan-title-text">SEE IT IN ACTION ]</span>
				</h2>
				<div className="about__plan-content">
					<picture>
						<source media="(max-width: 550px)" srcSet={`${aboutPlan500} 1x, ${aboutPlan500x2} 2x`} />
						<img className="about__plan-img" src={mockupOne300} srcSet={`${mockupOne300} 1x, ${mockupOne300x2} 2x`} alt="" loading="lazy" />
					</picture>
					<p className="about__plan-info">
						In this section of the app, you can effortlessly design a personalized training plan. Add exercises, record your results, save your settings, and take notes to track your progress in
						detail. The user-friendly and intuitive interface lets you quickly assemble a routine tailored to your specific goals—whether it's building muscle, boosting endurance, or improving overall
						health. All your data is saved so you can always revisit and see how you've grown along with your program.
					</p>
					<span className="about__plan-num">01.</span>
				</div>
			</div>

			<div className="about__visual">
				<h2 className="about__visual-title">[ VISUALIZE YOUR PROGRESS ]</h2>
				<div className="about__visual-content">
					<span className="about__visual-num">02.</span>
					<p className="about__visual-info">
						In this section, you can monitor your progress with detailed, interactive charts. Record your workout data, compare results over time, and see improvements at a glance. The intuitive
						interface displays trends in your performance—from strength gains to endurance boosts—empowering you to fine-tune your training plan. With all your data securely saved, your fitness
						journey is clearly mapped out, keeping you motivated and on track to reach your goals.
					</p>
					<picture>
						<source media="(max-width: 550px)" srcSet={`${aboutVisual500} 1x, ${aboutVisual500x2} 2x`} />
						<img className="about__visual-img" src={mockupTwo300} srcSet={`${mockupTwo300} 1x, ${mockupTwo300x2} 2x`} alt="" loading="lazy" />
					</picture>
				</div>
			</div>

			<div className="about__calendar">
				<h2 className="about__calendar-title">[ SCHEDULE YOUR SUCCESS ]</h2>
				<div className="about__calendar-content">
					<picture>
						<source media="(max-width: 550px)" srcSet={`${aboutCalendar500} 1x, ${aboutCalendar500x2} 2x`} />
						<img className="about__calendar-img" src={mockupThree300} srcSet={`${mockupThree300} 1x, ${mockupThree300x2} 2x`} alt="" loading="lazy" />
					</picture>
					<p className="about__calendar-info">
						Effortlessly plan your workouts with our interactive calendar. Select training days, set reminders, and organize your fitness journey all in one place. With an intuitive interface,
						scheduling becomes a key step in achieving your goals.
					</p>
					<span className="about__calendar-num">03.</span>
				</div>
			</div>
		</div>
	);
}
export default About;
