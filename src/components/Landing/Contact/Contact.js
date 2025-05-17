import { useEffect, useState } from 'react';
import { apiRequest } from '../../../api/apiRequest';
import './Contact.sass';
import './ContactMedia.sass';
import { contact420, contact420x2, contact500, contact500x2, contact560, contact560x2 } from '../../../assets/images.js';
import Modal from '../../../components/Modal/Modal';

function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		if (errorMessage) setErrorMessage('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrorMessage('');

		if (formData.name.trim().length < 2) {
			setErrorMessage('The name must be at least 2 characters');
			return;
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(formData.email)) {
			setErrorMessage('Please enter a valid email address.');
			return;
		}

		if (formData.message.trim().length < 10) {
			setErrorMessage('The message must be at least 10 characters');
			return;
		}

		const body = {
			name: formData.name,
			email: formData.email,
			message: formData.message,
		};
		try {
			const sentMessage = await apiRequest(`/telegram/consultation`, 'POST', body);
			setFormData({ name: '', email: '', message: '' });
			openModal();
		} catch (error) {
			console.error('Error send your question:', error.message);
		}
	};

	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	return (
		<div className="contact" id="contact">
			<h2 className="contact__title">[ STILL HAVE QUESTIONS? ]</h2>
			<span className="contact__subtitle">Leave a request</span>
			<div className="contact__content">
				<div className="contact__forms">
					<input type="text" className="contact__input contact__input-name" value={formData.name} placeholder="Name" name="name" onChange={handleChange} />
					<input type="text" className="contact__input contact__input-email" value={formData.email} placeholder="Email" name="email" onChange={handleChange} />
					<textarea className="contact__input contact__input-question" value={formData.message} placeholder="Your question" name="message" onChange={handleChange} />
					<Modal className="modal__contact" isVisible={isModalVisible} onClose={closeModal}>
						<div>
							<h2 className="modal__contact-title">Request Received</h2>
							<p className="modal__contact-subtitle">Thank you for reaching out. We will respond to your inquiry via email shortly.</p>
							<button className="modal__contact-button" onClick={closeModal}>
								Close
							</button>
						</div>
					</Modal>
					{errorMessage && <div className="contact__error">{errorMessage}</div>}
					<button className="contact__btn" onClick={handleSubmit}>
						Send a request
					</button>
				</div>
				<picture>
					<source media="(max-width: 620px)" srcSet={`${contact560} 1x, ${contact560x2} 2x`} />
					<source media="(max-width: 1060px)" srcSet={`${contact420} 1x, ${contact420x2} 2x`} />
					<source media="(max-width: 1250px)" srcSet={`${contact500} 1x, ${contact500x2} 2x`} />
					<img className="contact__img" src={contact560} srcSet={`${contact560} 1x, ${contact560x2} 2x`} alt="" loading="lazy" />
				</picture>
			</div>
		</div>
	);
}

export default Contact;
