import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Palette, Brush, Paintbrush, ChevronLeft, RefreshCcw, Gift, X, Camera, ArrowDown, Info, Sparkles, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { gameCategories } from '../data/gameData';
import { galleryData } from '../data/galleryData';
import { supabase } from '../supabaseClient';

// CSS Imports - adjusting paths since we moved to components folder
import '../App.css';
import '../styles/animations.css';

import ThemeToggle from './ThemeToggle';
import EphemeralInk from './EphemeralInk';
import Soundscape from './Soundscape';
import SignatureCanvas from './SignatureCanvas';

function Portfolio() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('muse-theme');
      if (stored) {
        return stored === 'golden-hour' ? '' : stored;
      }
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'midnight-studio' : '';
    }
    return '';
  });

  const [currentMode, setCurrentMode] = useState('gallery');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [usedPrompts, setUsedPrompts] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  // DYNAMIC DATA STATE
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Merge: Dynamic items first, then static items
        setGalleryItems([...(data || []), ...galleryData]);
      } catch (error) {
        console.error("Error fetching gallery:", error);
        // Fallback to static data on error
        setGalleryItems([...galleryData]);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme || '');
    window.localStorage.setItem('muse-theme', theme || '');
  }, [theme]);

  // DATA REPLACEMENT
  // Instead of galleryData, we use galleryItems.
  // We need to handle the loading state locally or just show skeleton.

  const mouseX = useSpring(0, { damping: 40, stiffness: 250, mass: 0.8 });
  const mouseY = useSpring(0, { damping: 40, stiffness: 250, mass: 0.8 });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setShowContact(false);
        fireConfetti();
        Swal.fire({
          title: 'Message Received!',
          text: 'Muskan will review your vision and get back to you soon.',
          icon: 'success',
          confirmButtonColor: 'var(--accent-gold)',
          background: 'var(--theme-bg)',
          color: 'var(--theme-text)',
          fontFamily: "var(--font-serif)"
        });
      } else {
        throw new Error('Failed to send');
      }
    } catch {
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong. Please try again later or contact us directly.',
        icon: 'error',
        confirmButtonColor: '#121212'
      });
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#121212', '#E97451', '#ffffff']
    });
  };

  const handleMediaModuleClick = (type) => {
    const title =
      type === 'reel'
        ? 'Process Reel — Coming Soon'
        : 'Artist Voiceover — Coming Soon';

    const text =
      type === 'reel'
        ? 'You’ll soon be able to watch a short time-lapse of Muskan creating this piece — from first sketch to final detail.'
        : 'Soon you’ll be able to listen to Muskan talk through the story, choices, and emotions behind this artwork.';

    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Got it',
      confirmButtonColor: 'var(--accent-gold)',
      background: 'var(--theme-bg)',
      color: 'var(--theme-text)',
      fontFamily: 'var(--font-serif)'
    });
  };

  return (
    <div className="gallery-layout">
      <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
      <Soundscape />
      <EphemeralInk />
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

              {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                  Loading Masterpieces...
                </div>
              ) : galleryItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                  Coming Soon.
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
                  <img src={selectedPhoto.image_url || selectedPhoto.url} alt="" />
                </div>
                <div className="modal-content-modern" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                  <span className="modal-tag">ARTIST REFLECTION</span>
                  <h3>{selectedPhoto.title}</h3>
                  <p>{selectedPhoto.description || selectedPhoto.message}</p>

                  <div className="multimedia-module">
                    <h4 className="multimedia-title">
                      <Camera size={14} /> Behind the Brush
                    </h4>
                    <div className="multimedia-grid">
                      <div
                        className="media-item"
                        onClick={() => handleMediaModuleClick('reel')}
                      >
                        <span className="media-placeholder">Play Process Reel</span>
                        <div className="media-overlay"></div>
                      </div>
                      <div
                        className="media-item"
                        onClick={() => handleMediaModuleClick('voiceover')}
                      >
                        <span className="media-placeholder">Artist Voiceover</span>
                        <div className="media-overlay"></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setInitialMessage(`I am interested in collecting "${selectedPhoto.title}". Please send me more details.`);
                      setShowContact(true);
                    }}
                    className="inquiry-btn-modern"
                  >
                    Inquire to Collect
                  </button>

                  <div className="modal-signature mt-8">
                    <Brush size={20} color="#D4AF37" />
                    <span>Muskan's Signature Collection</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {showSecret && (
          <motion.div
            className="secret-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecret(false)}
          >
            <motion.div
              className="secret-card"
              initial={{ scale: 0.5, rotate: -10, y: 100 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="secret-close-x" onClick={() => setShowSecret(false)}>
                <X size={24} />
              </button>
              <div className="secret-inner">
                <Sparkles className="secret-icon" size={48} />
                <h2>The Artist's Heart</h2>
                <div className="secret-divider"></div>
                <p>
                  "Art is the only way to run away without leaving home."<br />
                  <br />
                  Muskan, your creativity isn't just in the paintings—it's in the way you see the world.
                  Every click in this gallery is a step through your beautiful mind.
                  Stay bold, stay artistic, stay uniquely you.
                </p>
                <button
                  className="close-secret-btn"
                  onClick={() => setShowSecret(false)}
                >
                  Close Secret
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContact && (
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
        )}
      </AnimatePresence>
    </div>
  );
}

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
}

export default Portfolio;
