import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BoxDetailsDto } from '../dtos/BoxDtos';
import { ItemInfoDto } from '../dtos/ItemDtos';
import { useNavigation } from '../components/NavigationContext';
import { useCache} from "../components/CacheContext.tsx";
import ItemFormModal from '../components/ItemFormModal'; // Import the modal component
import '../styles/BoxDetailsPage.css';

const BoxDetailsPage: React.FC = () => {
    const { clearCache } = useCache();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedBoxId } = useNavigation();

    const [box, setBox] = useState<BoxDetailsDto | null>(null);
    const [picture, setPicture] = useState<string | null>(null);
    const [items, setItems] = useState<ItemInfoDto[]>([]);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showItemModal, setShowItemModal] = useState(false); // State for modal visibility

    const fetchBoxDetails = async () => {
        try {
            const boxResponse = await fetch(`/api/v1/boxes/details/${id}`);
            if (!boxResponse.ok) throw new Error('Box fetch failed');
            const boxData: BoxDetailsDto = await boxResponse.json();
            setBox(boxData);

            setLastViewedBoxId(Number(id));

            if (boxData.pictureId) {
                const pictureResponse = await fetch(`/api/v1/picture/download/${boxData.pictureId}`);
                if (!pictureResponse.ok) throw new Error('Picture fetch failed');
                const pictureBlob = await pictureResponse.blob();
                setPicture(URL.createObjectURL(pictureBlob));
            }

            const locationResponse = await fetch(`/api/v1/locations/info/${boxData.locationId}`);
            if (!locationResponse.ok) throw new Error('Location fetch failed');
            const locationData = await locationResponse.json();
            setLocationName(locationData.name);

            const itemPromises = boxData.itemIds.map((itemId) =>
                fetch(`/api/v1/items/info/${itemId}`).then((response) => response.json())
            );
            setItems(await Promise.all(itemPromises));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoxDetails();
    }, [id]);

    const handleLocationClick = () => {
        if (box?.locationId) {
            navigate(`/locations/${box.locationId}`);
        }
    };

    const handleAddItem = () => {
        setShowItemModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowItemModal(false); // Close the modal
    };

    const handleBack = () => {
        setLastViewedBoxId(null);
        navigate('/boxes');
    };

    const handleAddSuccess = () => {
        clearCache();
        setShowItemModal(false);
        fetchBoxDetails();
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="box-details">
            <div className="location-box" onClick={handleLocationClick}>
                Located at <span>{locationName}</span>
            </div>

            <h1 className="box-name">{box?.label}</h1>
            <p className="box-description">{box?.description}</p>

            {picture && <img src={picture} alt={`Box ${box?.id}`} className="box-picture" />}

            <div className="button-group">
                <button className="back-button" onClick={handleBack}>Back to Boxes</button>
                <button className="add-item-button" onClick={handleAddItem}>Add Item to Box</button>
            </div>

            <h2 className="section-title">Items</h2>
            {items.length > 0 ? (
                <table className="item-table">
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Item ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} onClick={() => navigate(`/items/${item.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.id}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No items available in this box.</p>
            )}

            {/* Render the modal */}
            {showItemModal && (
                <ItemFormModal
                    onClose={handleCloseModal}
                    onAddSuccess={handleAddSuccess} // Close modal after successful addition
                    boxId={Number(id)} // Pass the box ID to pre-populate
                />
            )}
        </div>
    );
};

export default BoxDetailsPage;
