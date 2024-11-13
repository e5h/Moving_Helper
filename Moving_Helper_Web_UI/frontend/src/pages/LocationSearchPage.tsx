import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationDetailsDto } from '../dtos/LocationDtos';
import { useCache } from '../components/CacheContext';
import LocationFormModal from '../components/LocationFormModal';
import '../styles/LocationSearchPage.css';

const LocationSearchPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>(() => localStorage.getItem('locationFilter') || '');
    const navigate = useNavigate();
    const [filteredLocations, setFilteredLocations] = useState<LocationDetailsDto[]>([]);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const { clearCache, locations, setLocations } = useCache();

    useEffect(() => {
        if (locations) {
            setLoading(false);
            applyFilter(filter, locations); // Apply initial filter if it exists in localStorage
        } else {
            fetchAllLocations();
        }
    }, [locations]);

    const fetchAllLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/locations/details');
            if (!response.ok) throw new Error('Failed to fetch locations');
            const data: LocationDetailsDto[] = await response.json();
            setLocations(data);
            applyFilter(filter, data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Modify applyFilter to return the filtered list instead of setting state directly
    const applyFilter = (searchTerm: string, locationsToFilter: LocationDetailsDto[]) => {
        const filtered = locationsToFilter.filter(location =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLocations(filtered);
    };

    // Handle filter input change with real-time filtering and localStorage persistence
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        localStorage.setItem('locationFilter', newFilter); // Save filter term to localStorage
        applyFilter(newFilter, locations || []); // Apply filter in real-time
    };

    const handleClearFilter = () => {
        setFilter('');
        localStorage.removeItem('locationFilter'); // Clear filter from localStorage
        setFilteredLocations(locations || []); // Reset to full list if available
    };

    const handleRowClick = (id: number) => {
        navigate(`/locations/${id}`);
    };

    const handleCloseModal = () => {
        setShowLocationModal(false);
    }

    const handleAddSuccess = () => {
        clearCache();
        setShowLocationModal(false);
        fetchAllLocations();
    }

    return (
        <div className="location-search">
            <h1>Location Search</h1>

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

            <button className="add-location-button" onClick={() => setShowLocationModal(true)}>Add Location</button>

            {showLocationModal && (
                <LocationFormModal
                    onClose={handleCloseModal}
                    onAddSuccess={handleAddSuccess}
                />
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="location-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Number of Boxes</th>
                        <th>Box IDs</th>
                        <th>Picture ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredLocations.map((location) => (
                        <tr
                            key={location.id}
                            onClick={() => handleRowClick(location.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{location.id}</td>
                            <td>{location.name}</td>
                            <td>{location.description}</td>
                            <td>{location.numBoxes}</td>
                            <td>{location.boxIds.join(', ')}</td>
                            <td>{location.pictureId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LocationSearchPage;
