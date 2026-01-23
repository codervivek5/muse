import React from 'react';
import { motion } from 'framer-motion';
import { Brush } from 'lucide-react';
import SignatureCanvas from '../SignatureCanvas';

const CuratorsLetter = () => {
    return (
        <section className="curators-letter">
            <div className="letter-grid">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="letter-tag">The Inner Circle</span>
                    <h2 className="letter-title italic">Curator's Weekly Letter</h2>
                    <p className="letter-desc leading-relaxed font-light italic mb-10">Receive a weekly meditation on art, inspiration, and the unseen stories behind the canvas. No noise, just soul.</p>
                </motion.div>
                <motion.div
                    className="subscribe-card"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="relative z-10">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="subscribe-input"
                        />
                        <SignatureCanvas onSign={() => {/* Handle subscription */ }} />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="subscribe-btn"
                        >
                            Join the Collection
                        </motion.button>
                    </div>
                    <div className="subscribe-icon">
                        <Brush size={120} color="#D4AF37" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CuratorsLetter;
