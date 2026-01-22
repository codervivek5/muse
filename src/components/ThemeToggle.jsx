import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const themes = [
    { id: 'light', label: 'Light', icon: Sun, value: '' },
    { id: 'midnight', label: 'Dark', icon: Moon, value: 'midnight-studio' }
];

const ThemeToggle = ({ currentTheme, onThemeChange }) => {
    return (
        <div className="theme-toggle-container">
            {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = currentTheme === theme.value;

                return (
                    <motion.button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.value)}
                        className={`theme-btn ${isActive ? 'active' : 'inactive'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={theme.label}
                    >
                        <Icon
                            size={20}
                            className="theme-btn-icon"
                        />
                        {isActive && (
                            <motion.div
                                layoutId="activeTheme"
                                className="theme-active-indicator"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;
