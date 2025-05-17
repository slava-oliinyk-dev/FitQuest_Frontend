import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Price.sass';
import './PriceMedia.sass';
import { p2rice440, p2rice440x2, price440, price440x2, price540, price540x2, price730, price730x2 } from '../../../assets/images.js';

function Price() {
	const navigate = useNavigate();

	const goToApp = () => {
		navigate('/app');
	};

	return (
		<div className="price" id="price">
			<picture>
				<source media="(max-width: 820px)" srcSet={`${p2rice440} 1x, ${p2rice440x2} 2x`} />
				<source media="(max-width: 940px)" srcSet={`${price440} 1x, ${price440x2} 2x`} />
				<source media="(max-width: 1130px)" srcSet={`${price540} 1x, ${price540x2} 2x`} />
				<img className="price__img" src={price730} srcSet={`${price730} 1x, ${price730x2} 2x`} alt="" loading="lazy" />
			</picture>
			<div className="price__content">
				<h2 className="price__title">[ TRY IT FREE ]</h2>
				<p className="price__subtitle">
					Enjoy our web app with complete, cost-free access. Discover premium features with no hidden fees or subscriptions, making your fitness journey smoother and more accessible. With our free
					platform, you can focus solely on achieving your goals without any financial barriers.
				</p>
				<button className="price__btn" onClick={goToApp}>
					Get Started Free
				</button>
			</div>
		</div>
	);
}

export default Price;
