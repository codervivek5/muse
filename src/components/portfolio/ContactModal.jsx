import React from 'react';
import { motion } from 'framer-motion';
import { X, Palette } from 'lucide-react';
import Instagram from '../icons/Instagram';

const ContactModal = ({
    showContact,
    setShowContact,
    handleContactSubmit,
    initialMessage,
    setInitialMessage,
    selectedPhoto,
    setIsHovering
}) => {
    if (!showContact) return null;

    return (
        <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
        >
            <motion.div
                className="modal-modern contact-modal"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header-os">
                    <div className="window-controls">
                        <div className="control close" onClick={() => { setShowContact(false); setInitialMessage(''); }}></div>
                        <div className="control minimize"></div>
                        <div className="control maximize"></div>
                    </div>
                    <div className="modal-title-bar">Send an Inquiry — Muskan's Studio</div>
                    <button className="close-x-btn" onClick={() => setShowContact(false)}>
                        <X size={18} />
                    </button>
                </div>

                <form
                    onSubmit={handleContactSubmit}
                    className="contact-form-container"
                >
                    <input
                        type="hidden"
                        name="_subject"
                        value={initialMessage.includes('collecting') ? `Inquiry for "${selectedPhoto?.title}"` : "New Message from Atelier Visitor"}
                    />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value={window.location.href} />

                    <div className="canvas-header">
                        <Palette size={32} color="var(--accent-gold)" />
                        <h2>Collaborate with Muskan</h2>
                        <p>Share your vision and let's create something extraordinary together.</p>
                    </div>

                    <div className="contact-fields">
                        <div className="field-group">
                            <label>Your Name</label>
                            <input type="text" name="name" placeholder="Enter your name" required />
                        </div>
                        <div className="field-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="hello@example.com" required />
                        </div>
                        <div className="field-group">
                            <label>Your Message</label>
                            <textarea name="message" defaultValue={initialMessage} placeholder="Describe your inquiry..." rows="4" required></textarea>
                        </div>
                    </div>

                    <div className="contact-actions">
                        <button
                            type="submit"
                            className="modern-button send-inquiry-btn"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            SEND INQUIRY
                        </button>
                        <p className="contact-alt-text">or find me on</p>
                        <a
                            href="https://www.instagram.com/muskymuse/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-insta-link"
                        >
                            <Instagram size={18} /> @muskymuse
                        </a>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ContactModal;
