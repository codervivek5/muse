import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, LogOut, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../App.css';

const Dashboard = () => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = '';

            // Upload Image to Supabase Storage if selected
            if (image) {
                // Image Compression
                const options = {
                    maxSizeMB: 0.2, // 200KB
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };

                let fileToUpload = image;
                try {
                    console.log('Original size:', image.size / 1024 / 1024, 'MB');
                    fileToUpload = await imageCompression(image, options);
                    console.log('Compressed size:', fileToUpload.size / 1024 / 1024, 'MB');
                } catch (compressionError) {
                    console.error('Compression failed, proceeding with original:', compressionError);
                }

                const timestamp = Date.now();
                const fileName = `${timestamp}_${image.name}`;

                const { data, error } = await supabase.storage
                    .from('portfolio-images')
                    .upload(`gallery/${fileName}`, fileToUpload);

                if (error) {
                    throw new Error(`Supabase upload failed: ${error.message}`);
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio-images')
                    .getPublicUrl(`gallery/${fileName}`);

                imageUrl = publicUrl;
            }

            const itemData = {
                title,
                description,
            };

            if (imageUrl) {
                itemData.image_url = imageUrl;
            }

            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from('artworks')
                    .update(itemData)
                    .eq('id', editingId);

                if (error) throw error;

                Swal.fire({
                    title: 'Updated!',
                    text: 'Masterpiece updated successfully!',
                    icon: 'success',
                    confirmButtonColor: '#D4AF37',
                    background: '#111',
                    color: '#fff'
                });
            } else {
                // Create new
                if (!imageUrl) throw new Error("Image is required for new items");
                const { error } = await supabase
                    .from('artworks')
                    .insert([{
                        ...itemData,
                        image_url: imageUrl,
                        created_at: new Date().toISOString()
                    }]);

                if (error) throw error;

                Swal.fire({
                    title: 'Published!',
                    text: 'New masterpiece published successfully!',
                    icon: 'success',
                    confirmButtonColor: '#D4AF37',
                    background: '#111',
                    color: '#fff'
                });
            }

            // Reset form
            setTitle('');
            setDescription('');
            setImage(null);
            setEditingId(null);
            fetchItems();

        } catch (error) {
            console.error("Error saving item:", error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to save item: ' + (error.message || "Unknown error"),
                icon: 'error',
                confirmButtonColor: '#D4AF37',
                background: '#111',
                color: '#fff'
            });
        }
        setUploading(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        setImage(null); // Clear previous selection if any
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const { error } = await supabase
                .from('artworks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setImage(null);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Curator Dashboard</h1>
                    <div className="user-controls">
                        <span className="user-email">{currentUser?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    <div className="editor-column">
                        <div className="editor-card">
                            <h2 className="section-title">
                                {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                                {editingId ? 'Edit Masterpiece' : 'Add New Masterpiece'}
                            </h2>

                            <form onSubmit={handleSubmit} className="editor-form">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="editor-input"
                                        placeholder="e.g. The Silent Echo"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Reflection / Description</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="6"
                                        className="editor-textarea"
                                        placeholder="Describe the soul of this piece..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Artwork Image</label>
                                    <div className="file-upload-box">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="file-input-hidden"
                                            required={!editingId}
                                        />
                                        <Upload className="upload-icon" />
                                        <span className="upload-text">
                                            {image ? image.name : "Drag or click to upload"}
                                        </span>
                                    </div>
                                    {editingId && !image && <p className="hint-text">Leave empty to keep current image</p>}
                                </div>

                                <div className="form-actions">
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="submit-btn"
                                    >
                                        {uploading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="list-column">
                        <h2 className="section-title">Collection Inventory ({items.length})</h2>
                        {loading ? (
                            <div className="loading-state">Loading collection...</div>
                        ) : items.length === 0 ? (
                            <div className="empty-state">
                                No pieces found. Add your first masterpiece on the left.
                            </div>
                        ) : (
                            <div className="items-grid">
                                {items.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        className="inventory-card"
                                    >
                                        <div className="card-image-box">
                                            <img src={item.image_url} alt={item.title} />
                                            <div className="card-overlay">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="action-btn edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="action-btn delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-details">
                                            <h3 className="card-title">{item.title}</h3>
                                            <p className="card-desc">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
