import { API_BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemDetailsDto } from '../dtos/ItemDtos';
import { useCache } from '../components/CacheContext';
import ItemFormModal from '../components/ItemFormModal';
import '../styles/ItemSearchPage.css';

const ItemSearchPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>(() => localStorage.getItem('itemFilter') || '');
    const [filteredItems, setFilteredItems] = useState<ItemDetailsDto[]>([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const navigate = useNavigate();
    const { clearCache, items, setItems } = useCache();

    useEffect(() => {
        if (items) {
            setLoading(false);
            applyFilter(filter, items); // Apply initial filter if available
        } else {
            fetchItems();
        }
    }, [items]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}items/details`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data: ItemDetailsDto[] = await response.json();
            setItems(data);
            applyFilter(filter, data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (searchTerm: string, itemsToFilter: ItemDetailsDto[]) => {
        const filtered = itemsToFilter.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        localStorage.setItem('itemFilter', newFilter);
        applyFilter(newFilter, items || []);
    };

    const handleClearFilter = () => {
        setFilter('');
        localStorage.removeItem('itemFilter');
        setFilteredItems(items || []);
    };

    const handleRowClick = (id: number) => {
        navigate(`/items/${id}`);
    };

    const handleCloseModal = () => {
        setShowItemModal(false);
    }

    const handleAddSuccess = () => {
        clearCache();
        setShowItemModal(false);
        fetchItems();
    }

    return (
        <div className="search-container">
            <h1>Item Search</h1>

            <div className="search-options">
                <div className="filter">
                    <label htmlFor="filterInput">Filter:</label>
                    <input
                        id="filterInput"
                        type="text"
                        value={filter}
                        onChange={handleFilterChange}
                    />
                    <button id="clearFilterButton" onClick={handleClearFilter}>
                        <span className="material-icons icon">disabled_by_default</span>
                        Clear
                    </button>
                </div>

                <div className="option-buttons">
                    <button className="add-form-button" onClick={() => setShowItemModal(true)}>
                        <span className="material-icons icon">add_box</span>
                        Add Item
                    </button>
                </div>
            </div>

            {showItemModal && (
                <ItemFormModal
                    onClose={handleCloseModal}
                    onAddSuccess={handleAddSuccess}
                />
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="search-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Box Label</th>
                        <th>Location Name</th>
                        <th>Move From Name</th>
                        <th>Move To Name</th>
                        <th>Picture ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => handleRowClick(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.boxLabel}</td>
                            <td>{item.locationName}</td>
                            <td>{item.moveFromName}</td>
                            <td>{item.moveToName}</td>
                            <td>{item.pictureId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ItemSearchPage;
