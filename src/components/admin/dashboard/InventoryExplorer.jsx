import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';
import InventoryCard from './InventoryCard';

const InventoryExplorer = ({
    processedItems,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    loading,
    editingId,
    handleEdit,
    handleDelete,
    isSubmitting
}) => {
    return (
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
                <div className="items-grid two-columns">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="inventory-card skeleton" style={{ height: '300px' }}></div>
                    ))}
                </div>
            ) : processedItems.length === 0 ? (
                <div className="empty-state">
                    <ImageIcon size={48} opacity={0.5} />
                    <p>{searchTerm ? "No results found for your search." : "No pieces found. Add your first masterpiece on the left."}</p>
                </div>
            ) : (
                <div className="items-grid two-columns">
                    {processedItems.map(item => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            editingId={editingId}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            isSubmitting={isSubmitting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default InventoryExplorer;
