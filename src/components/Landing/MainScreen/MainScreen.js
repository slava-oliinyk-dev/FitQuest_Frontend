import './MainScreen.sass';
import './MainScreenMedia.sass';
import { mainScreenSources, mainScreenImgSrcSet, mainScreenImgSizes } from './mainScreenImagesConfig.js';

function MainScreen() {
	return (
		<div className="landing-main" id="main-screen">
			<h1 className="landing-main__title">
				IT&rsquo;S NOT TRAINING
				<br />
				<span className="landing-main__title-orange">IT&rsquo;S LIFE</span>
			</h1>
			<picture>
				{mainScreenSources.map(({ media, srcSet }) => (
					<source key={media} media={media} srcSet={srcSet} />
				))}

				<img srcSet={mainScreenImgSrcSet} sizes={mainScreenImgSizes} alt="main" className="landing-main__image" />
			</picture>
		</div>
	);
}

export default MainScreen;
