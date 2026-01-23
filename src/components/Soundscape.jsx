import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const Soundscape = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Hidden audio element for ambient sounds
        // Note: In a real app, these would be hosted assets.
        // Using a placeholder YouTube-like stream or long ambient loop.
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.loop = true;
        }
    }, []);

    const togglePlayback = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => console.log("Audio play blocked by browser policy"));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="soundscape-toggle">
            <motion.button
                onClick={togglePlayback}
                className="soundscape-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isPlaying ? (
                        <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Volume2 size={20} style={{ color: 'var(--accent-gold)' }} />
                        </motion.div>
                    ) : (
                        <motion.div key="muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <VolumeX size={20} style={{ color: 'var(--accent-gold)', opacity: 0.5 }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="soundscape-label">
                    <span>Studio Soundscape</span>
                </div>
            </motion.button>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />
        </div>
    );
};

export default Soundscape;
