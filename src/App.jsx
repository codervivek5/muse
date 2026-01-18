import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Palette, Brush, Paintbrush, ChevronLeft, RefreshCcw, Gift, X, Camera, ArrowDown, Info, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gameCategories } from './data/gameData';
import { galleryData } from './data/galleryData';
import './App.css';
import './styles/animations.css';

const IconMap = {
  Sparkles: Sparkles,
  Palette: Palette,
  User: Brush,
};

function App() {
  const [currentMode, setCurrentMode] = useState('gallery'); // gallery, reflections, menu
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [usedPrompts, setUsedPrompts] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  // Custom Cursor Spring Physics
  const mouseX = useSpring(0, { damping: 40, stiffness: 250, mass: 0.8 });
  const mouseY = useSpring(0, { damping: 40, stiffness: 250, mass: 0.8 });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  // Custom Cursor Follower Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const firstPrompt = cat.prompts[Math.floor(Math.random() * cat.prompts.length)];
    setCurrentPrompt(firstPrompt);
    setUsedPrompts([firstPrompt]);
    setCurrentMode('reflections');
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#121212', '#E97451', '#ffffff']
    });
  };

  return (
    <div className="gallery-layout">
      {/* Premium Visual Overlays */}
      <div className="grain-overlay"></div>
      <motion.div
        className={`cursor-follower ${isHovering ? 'hovering' : ''}`}
        style={{ x: mouseX, y: mouseY }}
      />

      <div className="watercolor-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <AnimatePresence mode="wait">
        {currentMode === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* HERO SECTION */}
            <section className="hero-fullscreen" ref={heroRef}>
              <motion.div style={{ scale, opacity, y: yHero }} className="hero-content">
                <span className="hero-tagline">MUSE COLLECTION 2026</span>
                <h1 className="hero-title">Atelier<br /><span className="italic">of</span> Muskan</h1>
                <p className="hero-desc">An immersive experience celebrating artistic soul and shared inspiration.</p>
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="scroll-indicator"
                >
                  <ArrowDown size={32} strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            </section>

            {/* ARTIST STATEMENT */}
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

            {/* MAIN GALLERY */}
            <section className="gallery-section">
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

              <div className="modern-grid">
                {galleryData.map((item, idx) => (
                  <ParallaxItem
                    key={item.id}
                    item={item}
                    index={idx}
                    onClick={() => setSelectedPhoto(item)}
                    setIsHovering={setIsHovering}
                  />
                ))}
              </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section">
              <motion.div
                className="cta-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Curator's Workspace
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Ready to explore the deeper meaning behind the canvas?
                </motion.p>
                <motion.button
                  onClick={() => setCurrentMode('menu')}
                  className="modern-button"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Begin Reflection
                </motion.button>
              </motion.div>
            </section>
          </motion.div>
        )}

        {currentMode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 100 }}
            className="menu-modern"
          >
            <div className="menu-nav">
              <button
                onClick={() => setCurrentMode('gallery')}
                className="back-link"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <ChevronLeft size={20} /> Back to Gallery
              </button>
            </div>
            <div className="menu-header-box">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Muskan's Reflections
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Select a medium to explore your inner connection.
              </motion.p>
            </div>
            <div className="category-modern-list">
              {gameCategories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  className="category-item-modern"
                  whileHover={{ x: 30 }}
                  onClick={() => handleSelectCategory(cat)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 + 0.5 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="cat-number">0{idx + 1}</div>
                  <div className="cat-info">
                    <h3>{cat.title}</h3>
                    <p>{cat.description}</p>
                  </div>
                  <div className="cat-arrow">→</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentMode === 'reflections' && (
          <motion.div
            key="reflections"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="reflections-view"
          >
            <div className="ref-nav">
              <button
                onClick={() => setCurrentMode('menu')}
                className="back-btn-modern"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <ChevronLeft size={24} /> Back
              </button>
              <div className="ref-type" style={{ color: selectedCategory.color }}>
                {selectedCategory.title}
              </div>
            </div>

            <div className="prompt-canvas">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPrompt}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="big-prompt"
                >
                  {currentPrompt}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="ref-footer">
              <button
                onClick={() => { setCurrentMode('gallery'); fireConfetti(); }}
                className="finish-btn"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                End Reflection
              </button>
              <button
                onClick={() => {
                  const available = selectedCategory.prompts.filter(p => !usedPrompts.includes(p));
                  const next = available.length > 0
                    ? available[Math.floor(Math.random() * available.length)]
                    : selectedCategory.prompts[Math.floor(Math.random() * selectedCategory.prompts.length)];
                  setCurrentPrompt(next);
                  setUsedPrompts([...usedPrompts, next]);
                }}
                className="next-prompt-btn"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Next Prompt <RefreshCcw size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="modal-modern"
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-os">
                <div className="window-controls">
                  <div className="control close" onClick={() => setSelectedPhoto(null)}></div>
                  <div className="control minimize"></div>
                  <div className="control maximize"></div>
                </div>
                <div className="modal-title-bar">Muskan's Atelier — {selectedPhoto.title}</div>
                <button className="close-x-btn" onClick={() => setSelectedPhoto(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-inner">
                <div className="modal-img">
                  <img src={selectedPhoto.url} alt="" />
                </div>
                <div className="modal-content-modern" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                  <span className="modal-tag">ARTIST REFLECTION</span>
                  <h3>{selectedPhoto.title}</h3>
                  <p>{selectedPhoto.message}</p>
                  <div className="modal-signature">
                    <Brush size={20} color="#D4AF37" />
                    <span>Muskan's Signature Collection</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="gallery-footer">
        <div className="footer-logo">Atelier of Muskan</div>
        <motion.div
          className="footer-social"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div
            className="gift-glow"
            whileHover={{ y: -10, scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift onClick={fireConfetti} size={40} strokeWidth={1} style={{ cursor: 'pointer' }} />
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}

// Sub-component for Parallax Items with Reveal Animation
function ParallaxItem({ item, index, onClick, setIsHovering }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const parallaxOffset = isMobile ? 40 : 150;
  const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -parallaxOffset : parallaxOffset]);
  const rotateSlightly = index % 2 === 0 ? 1 : -1;

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`grid-item item-${index % 5}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02, rotate: rotateSlightly }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="item-img-box">
        {/* Entrance Reveal Mask */}
        <motion.div
          className="item-reveal-mask"
          animate={{ x: isInView ? '100%' : '0%' }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
        />
        <img src={item.url} alt={item.title} />
        <div className="item-hover-info">
          <h3>{item.title}</h3>
          <span>VIEW WORK</span>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
