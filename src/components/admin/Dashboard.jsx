import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../App.css';

// Modular Components
import DashboardHeader from './dashboard/DashboardHeader';
import ArtworkEditor from './dashboard/ArtworkEditor';
import InventoryExplorer from './dashboard/InventoryExplorer';

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
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

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

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearSelectedImage = () => {
        setImage(null);
        if (editingId) {
            const originalItem = items.find(i => i.id === editingId);
            setPreviewUrl(originalItem ? originalItem.image_url : null);
        } else {
            setPreviewUrl(null);
        }
        const fileInput = document.getElementById('artwork-file-input');
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Title and description are required.', background: '#111', color: '#fff' });
            return;
        }

        if (!editingId && !image) {
            Swal.fire({ icon: 'warning', title: 'Image Required', text: 'Please select an image for the new masterpiece.', background: '#111', color: '#fff' });
            return;
        }

        setIsSubmitting(true);
        setStatusText('Preparing...');

        try {
            let finalImageUrl = null;

            if (image) {
                setStatusText('Compressing Image...');
                const options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/jpeg'
                };

                let fileToUpload = image;
                try {
                    const compressedFile = await imageCompression(image, options);
                    if (compressedFile instanceof Blob) {
                        fileToUpload = compressedFile;
                    }
                } catch (compressionError) {
                    console.warn('Compression failed, continuing with original file:', compressionError);
                }

                setStatusText('Uploading to Gallery...');
                const timestamp = Date.now();
                const cleanFileName = image.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const filePath = `gallery/${timestamp}_${cleanFileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('portfolio-images')
                    .upload(filePath, fileToUpload, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

                const { data: urlData } = supabase.storage
                    .from('portfolio-images')
                    .getPublicUrl(filePath);

                finalImageUrl = urlData.publicUrl;
            }

            setStatusText('Saving Masterpiece...');
            const itemData = {
                title: title.trim(),
                description: description.trim(),
            };

            if (finalImageUrl) {
                itemData.image_url = finalImageUrl;
            }

            if (editingId) {
                const { data, error: updateError } = await supabase
                    .from('artworks')
                    .update(itemData)
                    .eq('id', editingId)
                    .select();

                if (updateError) throw updateError;
                if (!data || data.length === 0) {
                    throw new Error("Update failed: No record was modified.");
                }

                Swal.fire({
                    title: 'Updated!', text: 'The masterpiece has been updated.', icon: 'success',
                    confirmButtonColor: '#D4AF37', background: '#111', color: '#fff', timer: 2000, showConfirmButton: false
                });

            } else {
                if (!finalImageUrl) throw new Error("Failed to generate image URL.");

                const { error: insertError } = await supabase
                    .from('artworks')
                    .insert([{
                        ...itemData,
                        created_at: new Date().toISOString()
                    }]);

                if (insertError) throw insertError;

                Swal.fire({
                    title: 'Published!', text: 'New masterpiece added to collection.', icon: 'success',
                    confirmButtonColor: '#D4AF37', background: '#111', color: '#fff', timer: 2000, showConfirmButton: false
                });
            }

            resetForm();
            setTimeout(fetchItems, 800);

        } catch (error) {
            console.error("Operation failed:", error);
            Swal.fire({
                title: 'Error', text: error.message || "An unexpected error occurred.", icon: 'error',
                confirmButtonColor: '#d33', background: '#111', color: '#fff'
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
        setImage(null);
        setPreviewUrl(item.image_url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    const { data, error: dbError } = await supabase
                        .from('artworks')
                        .delete()
                        .eq('id', id)
                        .select();

                    if (dbError) throw dbError;
                    if (!data || data.length === 0) {
                        throw new Error("Delete failed: No record was removed.");
                    }

                    if (imageUrl) {
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
                    setLoading(false);
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
                <DashboardHeader currentUser={currentUser} handleLogout={handleLogout} />

                <div className="dashboard-grid">
                    <ArtworkEditor
                        editingId={editingId}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        previewUrl={previewUrl}
                        image={image}
                        handleImageSelect={handleImageSelect}
                        clearSelectedImage={clearSelectedImage}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        statusText={statusText}
                        resetForm={resetForm}
                    />

                    <InventoryExplorer
                        processedItems={processedItems}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        loading={loading}
                        editingId={editingId}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;