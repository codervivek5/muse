import React from 'react';
import { motion } from 'framer-motion';
import { Paintbrush } from 'lucide-react';

const StatementSection = ({ setIsHovering }) => {
    return (
        <section className="artist-statement">
            <div className="statement-inner">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                >
                    <h2>The Vision</h2>
                    <p>In every stroke of life, we find a story waiting to be told. This gallery is a tribute to Muskan's artistic journey—the raw elegance of connection and the beauty of shared inspiration.</p>
                </motion.div>
                <motion.div
                    className="stat-box"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Paintbrush size={100} color="#D4AF37" strokeWidth={1} />
                </motion.div>
            </div>
        </section>
    );
};

export default StatementSection;
