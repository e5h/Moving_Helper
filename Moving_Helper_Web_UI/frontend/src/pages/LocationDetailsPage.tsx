// LocationDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../components/NavigationContext';

const LocationDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedLocationId } = useNavigation();

    useEffect(() => {
        setLastViewedLocationId(Number(id));
    }, [id, setLastViewedLocationId]);

    const handleBack = () => {
        setLastViewedLocationId(null); // Reset to go back to search next time
        navigate('/locations'); // Navigate back to the search page
    };

    return (
        <div>
            <h1>Location Details</h1>
            <p>Location ID: {id}</p>
            <button onClick={handleBack}>Back to Locations</button>
        </div>
    );
};

export default LocationDetailsPage;
