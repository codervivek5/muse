import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const HeroSection = ({
    heroRef,
    scale,
    opacity,
    yHero,
    setShowSecret,
    fireConfetti,
    setIsHovering,
    setShowContact
}) => {
    return (
        <section className="hero-fullscreen" ref={heroRef}>
            <motion.div style={{ scale, opacity, y: yHero }} className="hero-content">
                <motion.span
                    className="hero-tagline"
                    initial={{ opacity: 0, letterSpacing: "1rem" }}
                    animate={{ opacity: 1, letterSpacing: "0.6rem" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    MUSE COLLECTION 2026
                </motion.span>

                <h1 className="hero-title">
                    Atelier<br />
                    <span className="italic">of</span>{' '}
                    <motion.span
                        className="creators-name"
                        onClick={() => { setShowSecret(true); fireConfetti(); }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        whileHover={{ scale: 1.05, color: "var(--accent-gold)" }}
                        title="Click for a surprise"
                        style={{ cursor: 'pointer', color: 'var(--theme-text)' }}
                    >
                        Muskan
                    </motion.span>
                </h1>
                <motion.p
                    className="hero-desc"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    An immersive experience celebrating artistic soul and shared inspiration.
                </motion.p>

                <motion.button
                    className="contact-trigger-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ delay: 1.2 }}
                    onClick={() => setShowContact(true)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    Collaborate with Muskan
                </motion.button>
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="scroll-indicator"
                >
                    <ArrowDown size={32} strokeWidth={1.5} />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
