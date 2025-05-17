import HourglassGif from '../../components/HourglassGif/HourglassGif.js';
import './Later.sass';

function Later() {
	return (
		<div className="later">
			<HourglassGif />
			<p className="later__message">This section is currently under development. New features will be available soon – stay tuned!</p>
		</div>
	);
}
export default Later;
