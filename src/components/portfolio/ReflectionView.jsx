import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RefreshCcw } from 'lucide-react';

export const ReflectionMenu = ({
    gameCategories,
    handleSelectCategory,
    setCurrentMode,
    setIsHovering
}) => (
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
);

export const ReflectionPrompt = ({
    selectedCategory,
    currentPrompt,
    usedPrompts,
    setUsedPrompts,
    setCurrentPrompt,
    setCurrentMode,
    setIsHovering,
    fireConfetti
}) => (
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
);
