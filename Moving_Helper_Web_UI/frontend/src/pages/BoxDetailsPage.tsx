// BoxDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../components/NavigationContext';

const BoxDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedBoxId } = useNavigation();

    useEffect(() => {
        setLastViewedBoxId(Number(id));
    }, [id, setLastViewedBoxId]);

    const handleBack = () => {
        setLastViewedBoxId(null); // Reset to go back to search next time
        navigate('/boxes'); // Navigate back to the boxes search page
    };

    return (
        <div>
            <h1>Box Details</h1>
            <p>Box ID: {id}</p>
            <button onClick={handleBack}>Back to Boxes</button>
        </div>
    );
};

export default BoxDetailsPage;
