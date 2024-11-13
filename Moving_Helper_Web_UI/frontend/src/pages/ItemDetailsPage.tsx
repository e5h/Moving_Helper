// ItemDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemDetailsDto } from '../dtos/ItemDtos';
import { useNavigation } from '../components/NavigationContext';
import '../styles/ItemDetailsPage.css';

const ItemDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedItemId } = useNavigation();

    const [item, setItem] = useState<ItemDetailsDto | null>(null);
    const [picture, setPicture] = useState<string | null>(null);
    const [boxLabel, setBoxLabel] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const itemResponse = await fetch(`/api/v1/items/details/${id}`);
                if (!itemResponse.ok) throw new Error('Item fetch failed');
                const itemData: ItemDetailsDto = await itemResponse.json();
                setItem(itemData);
                setLastViewedItemId(Number(id));

                if (itemData.pictureId) {
                    const pictureResponse = await fetch(`/api/v1/picture/download/${itemData.pictureId}`);
                    if (!pictureResponse.ok) throw new Error('Picture fetch failed');
                    const pictureBlob = await pictureResponse.blob();
                    setPicture(URL.createObjectURL(pictureBlob));
                }

                // Fetch the box label
                const boxResponse = await fetch(`/api/v1/boxes/info/${itemData.boxId}`);
                if (!boxResponse.ok) throw new Error('Box fetch failed');
                const boxData = await boxResponse.json();
                setBoxLabel(boxData.label);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id, setLastViewedItemId]);

    const handleBoxClick = () => {
        if (item?.boxId) {
            navigate(`/boxes/${item.boxId}`);
        }
    };

    const handleBack = () => {
        setLastViewedItemId(null);
        navigate('/items');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="item-details">
            <div className="location-box" onClick={handleBoxClick}>
                Inside box: <span>'{boxLabel}'</span>
            </div>

            <h1 className="item-name">{item?.name}</h1>
            <p className="item-description">{item?.description}</p>

            {picture && <img src={picture} alt={`Item ${item?.id}`} className="item-picture" />}

            <div className="button-group">
                <button className="back-button" onClick={handleBack}>Back to Items</button>
            </div>
        </div>
    );
};

export default ItemDetailsPage;
