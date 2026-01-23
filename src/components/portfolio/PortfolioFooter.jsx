import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import Instagram from '../icons/Instagram';

const PortfolioFooter = ({ setIsHovering, fireConfetti }) => {
    return (
        <footer className="gallery-footer">
            <div className="footer-logo">Atelier of Muskan</div>
            <motion.div
                className="footer-social"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <motion.div
                    className="footer-social-links"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.a
                        href="https://www.instagram.com/muskymuse/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-link"
                        whileHover={{ y: -5, color: "var(--accent-gold)" }}
                    >
                        <Instagram size={24} strokeWidth={1.5} />
                    </motion.a>
                </motion.div>

                <motion.div
                    className="gift-glow"
                    whileHover={{ y: -10, scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Gift onClick={fireConfetti} size={40} strokeWidth={1} style={{ cursor: 'pointer' }} />
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default PortfolioFooter;
