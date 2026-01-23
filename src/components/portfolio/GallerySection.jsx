import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const ParallaxItem = ({ item, index, onClick, setIsHovering }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const parallaxOffset = isMobile ? 40 : 150;
    const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -parallaxOffset : parallaxOffset]);
    const z = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 100]);
    const rotateSlightly = index % 2 === 0 ? 1 : -1;

    return (
        <motion.div
            ref={ref}
            style={{ y, z, perspective: 1000 }}
            className={`grid-item item-${index % 5}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileHover={{ scale: 1.05, rotate: rotateSlightly, z: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="item-img-box">
                <motion.div
                    className="item-reveal-mask"
                    animate={{ x: isInView ? '100%' : '0%' }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
                />
                <img src={item.image_url || item.url} alt={item.title} />
                <div className="item-hover-info">
                    <h3>{item.title}</h3>
                    <span>VIEW WORK</span>
                </div>
            </div>
        </motion.div>
    );
};

const GallerySection = ({ loading, galleryItems, setSelectedPhoto, setIsHovering }) => {
    return (
        <section className="gallery-section">
            <div className="gallery-line-accent"></div>
            <div className="gallery-header">
                <motion.h2
                    initial={{ opacity: 0, letterSpacing: "-10px" }}
                    whileInView={{ opacity: 1, letterSpacing: "-2px" }}
                    transition={{ duration: 1 }}
                >
                    The Muskan Collection
                </motion.h2>
                <div className="gallery-line"></div>
            </div>

            {loading ? (
                <div className="gallery-loading">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton skeleton-card"></div>
                    ))}
                </div>
            ) : galleryItems.length === 0 ? (
                <div className="gallery-empty">
                    <p>The atelier is currently quiet. Coming Soon.</p>
                </div>
            ) : (
                <div className="modern-grid">
                    {galleryItems.map((item, idx) => (
                        <ParallaxItem
                            key={item.id}
                            item={item}
                            index={idx}
                            onClick={() => setSelectedPhoto(item)}
                            setIsHovering={setIsHovering}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default GallerySection;
