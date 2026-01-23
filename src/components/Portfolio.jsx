import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

// Data
import { gameCategories } from '../data/gameData';
import { galleryData } from '../data/galleryData';
import { supabase } from '../supabaseClient';

// CSS
import '../App.css';
import '../styles/animations.css';

// Core Components
import ThemeToggle from './ThemeToggle';
import EphemeralInk from './EphemeralInk';
import Soundscape from './Soundscape';

// Portfolio Modular Components
import HeroSection from './portfolio/HeroSection';
import StatementSection from './portfolio/StatementSection';
import GallerySection from './portfolio/GallerySection';
import { ReflectionMenu, ReflectionPrompt } from './portfolio/ReflectionView';
import ArtworkModal from './portfolio/ArtworkModal';
import ContactModal from './portfolio/ContactModal';
import CuratorsLetter from './portfolio/CuratorsLetter';
import PortfolioFooter from './portfolio/PortfolioFooter';

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
        setGalleryItems([...(data || []), ...galleryData]);
      } catch (error) {
        console.error("Error fetching gallery:", error);
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
    return () => window.removeMouseMoveListener?.(handleMouseMove); // Standardized cleanup
  }, [mouseX, mouseY]);

  // Handle Mouse Move Standard Cleanup Fix
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
        text: 'Something went wrong. Please try again later.',
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
    const title = type === 'reel' ? 'Process Reel — Coming Soon' : 'Artist Voiceover — Coming Soon';
    const text = type === 'reel'
      ? 'You’ll soon be able to watch a short time-lapse of Muskan creating this piece — from first sketch to final detail.'
      : 'Soon you’ll be able to listen to Muskan talk through the story, choices, and emotions behind this artwork.';

    Swal.fire({
      title, text, icon: 'info',
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
            <HeroSection
              heroRef={heroRef}
              scale={scale}
              opacity={opacity}
              yHero={yHero}
              setShowSecret={setShowSecret}
              fireConfetti={fireConfetti}
              setIsHovering={setIsHovering}
              setShowContact={setShowContact}
            />

            <StatementSection setIsHovering={setIsHovering} />

            <GallerySection
              loading={loading}
              galleryItems={galleryItems}
              setSelectedPhoto={setSelectedPhoto}
              setIsHovering={setIsHovering}
            />

            <section className="cta-section">
              <motion.div
                className="cta-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3>Curator's Workspace</h3>
                <p>Ready to explore the deeper meaning behind the canvas?</p>
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
          <ReflectionMenu
            gameCategories={gameCategories}
            handleSelectCategory={handleSelectCategory}
            setCurrentMode={setCurrentMode}
            setIsHovering={setIsHovering}
          />
        )}

        {currentMode === 'reflections' && (
          <ReflectionPrompt
            selectedCategory={selectedCategory}
            currentPrompt={currentPrompt}
            usedPrompts={usedPrompts}
            setUsedPrompts={setUsedPrompts}
            setCurrentPrompt={setCurrentPrompt}
            setCurrentMode={setCurrentMode}
            setIsHovering={setIsHovering}
            fireConfetti={fireConfetti}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <ArtworkModal
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhoto}
          setIsHovering={setIsHovering}
          handleMediaModuleClick={handleMediaModuleClick}
          setInitialMessage={setInitialMessage}
          setShowContact={setShowContact}
        />
      </AnimatePresence>

      <CuratorsLetter />

      <PortfolioFooter
        setIsHovering={setIsHovering}
        fireConfetti={fireConfetti}
      />

      {/* Secret Card & Contact Modals */}
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
                  "Art is the only way to run away without leaving home."<br /><br />
                  Muskan, your creativity isn't just in the paintings—it's in the way you see the world.
                </p>
                <button className="close-secret-btn" onClick={() => setShowSecret(false)}>
                  Close Secret
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <ContactModal
          showContact={showContact}
          setShowContact={setShowContact}
          handleContactSubmit={handleContactSubmit}
          initialMessage={initialMessage}
          setInitialMessage={setInitialMessage}
          selectedPhoto={selectedPhoto}
          setIsHovering={setIsHovering}
        />
      </AnimatePresence>
    </div>
  );
}

export default Portfolio;
