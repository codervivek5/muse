import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, LogOut, Upload, Image as ImageIcon, XCircle, Search } from 'lucide-react';
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
    // 'image' holds the NEW file object selected from the computer
    const [image, setImage] = useState(null);
    // 'previewUrl' holds the URL to display in the form (either existing remote URL or new local preview)
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // Options: newest, oldest, az, za


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
            Swal.fire({ icon: 'error', title: 'Error loading items', text: error.message, background: '#111', color: '#fff' });
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


    // --- New Image Selection Handler ---
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 1. Store the actual file object for eventual upload
            setImage(file);
            // 2. Create a temporary local URL for immediate preview feedback
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- Clear selected image while editing ---
    const clearSelectedImage = () => {
        setImage(null);
        // If editing, revert preview back to the original item's image
        if (editingId) {
            const originalItem = items.find(i => i.id === editingId);
            setPreviewUrl(originalItem ? originalItem.image_url : null);
        } else {
            setPreviewUrl(null);
        }
        // Reset file input value so onChange fires again if same file chosen
        document.getElementById('artwork-file-input').value = "";
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Title and description are required.', background: '#111', color: '#fff' });
            return;
        }

        // Validation: Creating new requires an image
        if (!editingId && !image) {
            Swal.fire({ icon: 'warning', title: 'Image Required', text: 'Please select an image for the new masterpiece.', background: '#111', color: '#fff' });
            return;
        }

        setIsSubmitting(true);
        setStatusText('Preparing...');

        try {
            let finalImageUrl = null;

            // --- Image Upload Logic ---
            // Only attempt upload if a NEW image file has been selected into state
            if (image) {
                setStatusText('Compressing Image...');
                const options = {
                    maxSizeMB: 0.3, // Slightly larger limit (300KB) to ensure quality
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/jpeg' // ensure output is jpeg for consistency
                };

                let fileToUpload = image;
                try {
                    // console.log('Original size:', (image.size / 1024 / 1024).toFixed(2), 'MB');
                    const compressedFile = await imageCompression(image, options);
                    // console.log('Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
                    // Ensure the compressed result is actually a Blob/File before using
                    if (compressedFile instanceof Blob) {
                        fileToUpload = compressedFile;
                    }
                } catch (compressionError) {
                    console.warn('Compression failed, continuing with original file:', compressionError);
                }

                setStatusText('Uploading to Gallery...');
                const timestamp = Date.now();
                // Clean filename to prevent issues
                const cleanFileName = image.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const filePath = `gallery/${timestamp}_${cleanFileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('portfolio-images')
                    .upload(filePath, fileToUpload, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('portfolio-images')
                    .getPublicUrl(filePath);

                finalImageUrl = urlData.publicUrl;
            }

            // --- Database Record Logic ---
            setStatusText('Saving Masterpiece...');

            // Prepare base data
            const itemData = {
                title: title.trim(),
                description: description.trim(),
            };

            // IMPORTANT: Only add image_url to the update payload IF a new one was generated.
            // If editing and finalImageUrl is null, Supabase will keep the existing value.
            if (finalImageUrl) {
                itemData.image_url = finalImageUrl;
            }

            if (editingId) {
                // --- UPDATE EXISTING ---
                console.log('Attempting update for ID:', editingId, 'with data:', itemData);
                const { data, error: updateError } = await supabase
                    .from('artworks')
                    .update(itemData)
                    .eq('id', editingId)
                    .select();

                if (updateError) throw updateError;

                if (!data || data.length === 0) {
                    throw new Error("Update failed: No record was modified. This usually happens if your Supabase RLS policies are not set up for Updates.");
                }

                Swal.fire({
                    title: 'Updated!',
                    text: 'The masterpiece has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#D4AF37',
                    background: '#111', color: '#fff', timer: 2000, showConfirmButton: false
                });

            } else {
                // --- CREATE NEW ---
                // Safety check: Should be caught above, but double check image exists for new
                if (!finalImageUrl) throw new Error("Failed to generate image URL for new item.");

                const { error: insertError } = await supabase
                    .from('artworks')
                    .insert([{
                        ...itemData,
                        created_at: new Date().toISOString()
                    }]);

                if (insertError) throw insertError;

                Swal.fire({
                    title: 'Published!',
                    text: 'New masterpiece added to collection.',
                    icon: 'success',
                    confirmButtonColor: '#D4AF37',
                    background: '#111', color: '#fff', timer: 2000, showConfirmButton: false
                });
            }

            resetForm();
            // Small delay to allow Supabase propagation before re-fetching
            setTimeout(fetchItems, 800);

        } catch (error) {
            console.error("Operation failed:", error);
            Swal.fire({
                title: 'Error',
                text: error.message || "An unexpected error occurred.",
                icon: 'error',
                confirmButtonColor: '#d33',
                background: '#111', color: '#fff'
            });
        } finally {
            setIsSubmitting(false);
            setStatusText('');
        }
    };


    const handleEdit = (item) => {
        setEditingId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        // Important: We don't set 'image' file state, as we haven't picked a NEW one yet.
        setImage(null);
        // Set the preview URL to the existing remote URL so the user sees what's currently saved.
        setPreviewUrl(item.image_url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Reset file input if it had value previously
        const fileInput = document.getElementById('artwork-file-input');
        if (fileInput) fileInput.value = "";
    };

    const handleDelete = async (id, imageUrl) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! The image will also be deleted from storage.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#111', color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    // 1. Delete database record
                    console.log('Attempting delete for ID:', id);
                    const { data, error: dbError } = await supabase
                        .from('artworks')
                        .delete()
                        .eq('id', id)
                        .select();

                    if (dbError) throw dbError;

                    if (!data || data.length === 0) {
                        throw new Error("Delete failed: No record was removed. Ensure your Supabase RLS policies allow Deletions for authenticated users.");
                    }

                    // 2. Try delete image from storage (optional step, good practice)
                    if (imageUrl) {
                        // Extract path from URL (e.g., 'gallery/123_image.jpg')
                        const path = imageUrl.split('/portfolio-images/')[1];
                        if (path) {
                            await supabase.storage.from('portfolio-images').remove([path]);
                        }
                    }

                    await fetchItems();
                    Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });

                } catch (error) {
                    console.error("Delete failed:", error);
                    Swal.fire({ icon: 'error', title: 'Delete Failed', text: error.message, background: '#111', color: '#fff' });
                    setLoading(false); // Only stop loading on error, success will reload via fetchItems
                }
            }
        })
    };


    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setImage(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('artwork-file-input');
        if (fileInput) fileInput.value = "";
    };

    // Filter and Sort items
    const processedItems = items
        .filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'az') return a.title.localeCompare(b.title);
            if (sortBy === 'za') return b.title.localeCompare(a.title);
            return 0;
        });


    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Curator Dashboard</h1>
                    <div className="user-controls">
                        <span className="user-email">{currentUser?.email}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* --- EDITOR COLUMN --- */}
                    <div className="editor-column">
                        <div className="editor-card shadow-lg">
                            <h2 className="section-title">
                                {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                                {editingId ? 'Edit Masterpiece' : 'Add New Masterpiece'}
                            </h2>

                            <form onSubmit={handleSubmit} className="editor-form">
                                <div className="form-group">
                                    <label htmlFor="titleInput">Title</label>
                                    <input
                                        id="titleInput"
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="editor-input"
                                        placeholder="e.g. The Silent Echo"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descInput">Reflection / Description</label>
                                    <textarea
                                        id="descInput"
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="6"
                                        className="editor-textarea"
                                        placeholder="Describe the soul of this piece..."
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Artwork Image</label>

                                    {/* Enhanced Image Preview Area - only shows if an image exists or is selected */}
                                    {previewUrl && (
                                        <div className="image-preview-area has-image">
                                            <div className="preview-container">
                                                <img src={previewUrl} alt="Preview" className="preview-img" />
                                                {/* Overlay indicating if it's current or new */}
                                                <div className="preview-overlay-badge">
                                                    {image ? 'New Selection' : 'Current Image'}
                                                </div>
                                                {/* Button to clear selection (only if a NEW image is picked) */}
                                                {image && (
                                                    <button type="button" onClick={clearSelectedImage} className="clear-image-btn" title="Undo selection">
                                                        <XCircle size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className={`file-upload-box ${isSubmitting ? 'disabled' : ''}`}>
                                        <input
                                            id="artwork-file-input"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleImageSelect}
                                            className="file-input-hidden"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="artwork-file-input" className="upload-label-wrapper">
                                            <Upload className="upload-icon" />
                                            <span className="upload-text">
                                                {image ? "Click to change selection" : (editingId ? "Click to upload new version (optional)" : "Click to upload artwork")}
                                            </span>
                                        </label>
                                    </div>
                                    {editingId && !image && <p className="hint-text mt-2 text-sm text-gray-400">Keep blank to use the current image.</p>}
                                </div>

                                <div className="form-actions">
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="cancel-btn"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`submit-btn ${isSubmitting ? 'pulse-animation' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="loader-spinner small"></span>
                                                {statusText}
                                            </span>
                                        ) : (
                                            editingId ? 'Update Masterpiece' : 'Publish Masterpiece'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* --- LIST COLUMN --- */}
                    <div className="list-column">
                        <div className="inventory-header">
                            <h2 className="section-title">Collection ({processedItems.length})</h2>

                            <div className="inventory-controls">
                                <div className="search-bar">
                                    <Search size={16} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="az">Title (A-Z)</option>
                                    <option value="za">Title (Z-A)</option>
                                </select>
                            </div>
                        </div>
                        {loading ? (
                            <div className="loading-container">
                                <div className="loader-spinner large"></div>
                                <p>Loading collection...</p>
                            </div>
                        ) : processedItems.length === 0 ? (
                            <div className="empty-state">
                                <ImageIcon size={48} opacity={0.5} />
                                <p>{searchTerm ? "No results found for your search." : "No pieces found. Add your first masterpiece on the left."}</p>
                            </div>
                        ) : (
                            <div className="items-grid two-columns">
                                {processedItems.map(item => (
                                    <motion.div
                                        key={item.id}
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