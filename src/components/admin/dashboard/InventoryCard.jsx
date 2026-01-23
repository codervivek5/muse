import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

const InventoryCard = ({ item, editingId, handleEdit, handleDelete, isSubmitting }) => {
    return (
        <motion.div
            layoutId={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inventory-card ${editingId === item.id ? 'is-editing' : ''}`}
        >
            <div className="card-image-box aspect-video">
                <img src={item.image_url} alt={item.title} loading="lazy" />
                <div className="card-overlay">
                    <button
                        onClick={() => handleEdit(item)}
                        className="action-btn edit"
                        disabled={isSubmitting}
                        title="Edit this piece"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id, item.image_url)}
                        className="action-btn delete"
                        disabled={isSubmitting || editingId === item.id}
                        title="Delete this piece"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <div className="card-details p-4">
                <h3 className="card-title text-lg font-semibold truncate">{item.title}</h3>
                <p className="card-desc text-sm line-clamp-2 text-gray-400">{item.description}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(item.created_at).toLocaleDateString()}
                </span>
            </div>
        </motion.div>
    );
};

export default InventoryCard;
