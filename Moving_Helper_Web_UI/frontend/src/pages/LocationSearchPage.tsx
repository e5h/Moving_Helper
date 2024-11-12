﻿import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationDetailsDto } from '../dtos/LocationDtos';
import '../styles/LocationSearchPage.css'

const LocationSearchPage: React.FC = () => {
    const [locations, setLocations] = useState<LocationDetailsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from API
        fetch('/api/v1/locations/details')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setLocations(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching locations:', error);
                setLoading(false);
            });
    }, []);

    // Handle the row click
    const handleRowClick = (id: number) => {
        navigate(`/locations/${id}`);
    }

    return (
        <div>
            <h1>Location Search</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
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
                    {locations.map((location) => (
                        <tr
                            key={location.id}
                            onClick={() => handleRowClick(location.id)} // Set the click handler
                            style={{cursor: 'pointer'}} // Add a pointer cursor for better UX
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
