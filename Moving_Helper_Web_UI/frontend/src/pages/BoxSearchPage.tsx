import { API_BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxDetailsDto } from '../dtos/BoxDtos';
import { useCache } from '../components/CacheContext';
import BoxFormModal from '../components/BoxFormModal';
import '../styles/BoxSearchPage.css';

const BoxSearchPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>(() => localStorage.getItem('boxFilter') || '');
    const [filteredBoxes, setFilteredBoxes] = useState<BoxDetailsDto[]>([]);
    const [showBoxModal, setShowBoxModal] = useState(false);
    const navigate = useNavigate();
    const { clearCache, boxes, setBoxes } = useCache();

    useEffect(() => {
        if (boxes) {
            setLoading(false);
            applyFilter(filter, boxes); // Apply initial filter if available
        } else {
            fetchBoxes();
        }
    }, [boxes]);

    const fetchBoxes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}boxes/details`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data: BoxDetailsDto[] = await response.json();
            setBoxes(data);
            applyFilter(filter, data);
        } catch (error) {
            console.error('Error fetching boxes:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (searchTerm: string, boxesToFilter: BoxDetailsDto[]) => {
        const filtered = boxesToFilter.filter(box =>
            box.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            box.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBoxes(filtered);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        localStorage.setItem('boxFilter', newFilter);
        applyFilter(newFilter, boxes || []);
    };

    const handleClearFilter = () => {
        setFilter('');
        localStorage.removeItem('boxFilter');
        setFilteredBoxes(boxes || []);
    };

    const handleRowClick = (id: number) => {
        navigate(`/boxes/${id}`);
    };

    const handleCloseModal = () => {
        setShowBoxModal(false);
    }

    const handleAddSuccess = () => {
        clearCache();
        setShowBoxModal(false);
        fetchBoxes();
    }

    return (
        <div className="search-container">
            <h1>Box Search</h1>

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
                    <button className="add-form-button" onClick={() => setShowBoxModal(true)}>
                        <span className="material-icons icon">add_box</span>
                        Add Box
                    </button>
                </div>
            </div>

            {showBoxModal && (
                <BoxFormModal
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
                        <th>Label</th>
                        <th>Description</th>
                        <th>Item IDs</th>
                        <th>Location Name</th>
                        <th>Move From Name</th>
                        <th>Move To Name</th>
                        <th>Picture ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBoxes.map((box) => (
                        <tr
                            key={box.id}
                            onClick={() => handleRowClick(box.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{box.id}</td>
                            <td>{box.label}</td>
                            <td>{box.description}</td>
                            <td>{box.itemIds.join(', ')}</td>
                            <td>{box.locationName}</td>
                            <td>{box.moveFromName}</td>
                            <td>{box.moveToName}</td>
                            <td>{box.pictureId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BoxSearchPage;
