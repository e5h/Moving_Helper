// BoxSearchPage.tsx
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
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { boxes, setBoxes } = useCache();

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
            const response = await fetch('/api/v1/boxes/details');
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

    return (
        <div className="box-search">
            <h1>Box Search</h1>

            <div className="filter-section">
                <label htmlFor="filterInput">Filter:</label>
                <input
                    id="filterInput"
                    type="text"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <button onClick={handleClearFilter}>Clear</button>
            </div>

            <button className="add-box-button" onClick={() => setShowModal(true)}>Add Box</button>

            {showModal && (
                <BoxFormModal
                    onClose={() => setShowModal(false)}
                    onAddSuccess={() => {
                        setBoxes([]); // Clear the cache after adding a new box
                        fetchBoxes();
                    }}
                />
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="box-table">
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
