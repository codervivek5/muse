import React from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Play, Mic, Brush } from 'lucide-react';

const ArtworkModal = ({
    selectedPhoto,
    setSelectedPhoto,
    setIsHovering,
    handleMediaModuleClick,
    setInitialMessage,
    setShowContact
}) => {
    if (!selectedPhoto) return null;

    return (
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
                                <button
                                    className="media-item-compact"
                                    onClick={() => handleMediaModuleClick('reel')}
                                >
                                    <Play size={16} fill="currentColor" />
                                    <span>Process Reel</span>
                                </button>
                                <button
                                    className="media-item-compact"
                                    onClick={() => handleMediaModuleClick('voiceover')}
                                >
                                    <Mic size={16} fill="currentColor" />
                                    <span>Artist Voiceover</span>
                                </button>
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
    );
};

export default ArtworkModal;
