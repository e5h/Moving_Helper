// ItemDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../components/NavigationContext';

const ItemDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedItemId } = useNavigation();

    useEffect(() => {
        setLastViewedItemId(Number(id));
    }, [id, setLastViewedItemId]);

    const handleBack = () => {
        setLastViewedItemId(null); // Reset to go back to search next time
        navigate('/items'); // Navigate back to the items search page
    };

    return (
        <div>
            <h1>Item Details</h1>
            <p>Item ID: {id}</p>
            <button onClick={handleBack}>Back to Items</button>
        </div>
    );
};

export default ItemDetailsPage;
