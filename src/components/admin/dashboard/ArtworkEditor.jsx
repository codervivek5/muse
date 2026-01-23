import React from 'react';
import { Plus, Edit2, Upload, XCircle } from 'lucide-react';

const ArtworkEditor = ({
    editingId,
    title,
    setTitle,
    description,
    setDescription,
    previewUrl,
    image,
    handleImageSelect,
    clearSelectedImage,
    handleSubmit,
    isSubmitting,
    statusText,
    resetForm
}) => {
    return (
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

                        {previewUrl && (
                            <div className="image-preview-area has-image">
                                <div className="preview-container">
                                    <img src={previewUrl} alt="Preview" className="preview-img" />
                                    <div className="preview-overlay-badge">
                                        {image ? 'New Selection' : 'Current Image'}
                                    </div>
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
    );
};

export default ArtworkEditor;
