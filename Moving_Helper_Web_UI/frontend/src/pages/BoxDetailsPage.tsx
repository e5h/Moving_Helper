import { API_BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BoxDetailsDto } from '../dtos/BoxDtos';
import { ItemInfoDto } from '../dtos/ItemDtos';
import { useNavigation } from '../components/NavigationContext';
import { useCache} from "../components/CacheContext.tsx";
import ItemFormModal from '../components/ItemFormModal'; // Import the modal component
import '../styles/BoxDetailsPage.css';
import MoveBoxFormModal from "../components/MoveBoxFormModal.tsx";

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
    const [showItemModal, setShowItemModal] = useState(false); // State for adding items
    const [showMoveModal, setShowMoveModal] = useState(false); // State for moving box

    useEffect(() => {
        fetchBoxDetails();
    }, [id]);
    const fetchBoxDetails = async () => {
        try {
            const boxResponse = await fetch(`${API_BASE_URL}boxes/details/${id}`);
            if (!boxResponse.ok) throw new Error('Box fetch failed');
            const boxData: BoxDetailsDto = await boxResponse.json();
            setBox(boxData);

            setLastViewedBoxId(Number(id));

            if (boxData.pictureId) {
                const pictureResponse = await fetch(`${API_BASE_URL}picture/download/${boxData.pictureId}`);
                if (!pictureResponse.ok) throw new Error('Picture fetch failed');
                const pictureBlob = await pictureResponse.blob();
                setPicture(URL.createObjectURL(pictureBlob));
            }

            const locationResponse = await fetch(`${API_BASE_URL}locations/info/${boxData.locationId}`);
            if (!locationResponse.ok) throw new Error('Location fetch failed');
            const locationData = await locationResponse.json();
            setLocationName(locationData.name);

            const itemPromises = boxData.itemIds.map((itemId) =>
                fetch(`${API_BASE_URL}items/info/${itemId}`).then((response) => response.json())
            );
            setItems(await Promise.all(itemPromises));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationClick = () => {
        if (box?.locationId) {
            navigate(`/locations/${box.locationId}`);
        }
    };

    const handleAddItem = () => {
        setShowItemModal(true); // Open the modal
    };

    const handleMoveBox = () => {
        setShowMoveModal(true);
    }

    const handleCloseItemModal = () => {
        setShowItemModal(false); // Close the modal
    };

    const handleCloseMoveModal = () => {
        setShowMoveModal(false);
    }

    const handleBack = () => {
        setLastViewedBoxId(null);
        navigate('/boxes');
    };

    const handleAddSuccess = () => {
        clearCache();
        setShowItemModal(false);
        setShowMoveModal(false);
        fetchBoxDetails();
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="details-container">
            <div className="details-header">
                <button className="back-button" onClick={handleBack}>
                    <span className="material-icons icon">arrow_back</span>
                    Back to Boxes
                </button>
                <h1 className="details-name">{box?.label}</h1>
                <button className="move-button" onClick={handleMoveBox}>
                    <span className="material-icons icon">local_shipping</span>
                    Move Box
                </button>
            </div>

            <div className="details-body">
                <div className="picture-frame">
                    {picture && <img src={picture} alt={`Box ${box?.id}`} className="details-picture"/>}
                </div>
                <div className="details-body-info">
                    <div className="details-metadata">
                        <div className="located-at" onClick={handleLocationClick}>
                            Located at: <span>"{locationName}"</span>
                        </div>
                    </div>
                    <p className="details-description">{box?.description}</p>
                </div>
            </div>

            <div className="subcontents-section">
                <div className="subcontents-header">
                    <h2 className="subcontents-title">Items In Box</h2>
                    <button className="add-form-button" onClick={handleAddItem}>
                        <span className="material-icons icon">add_box</span>
                        Add Item To Box
                    </button>
                </div>
                <div className="subcontents-body">
                    {items.length > 0 ? (
                        <table className="subcontents-table">
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
                </div>
            </div>

            {/* Render the modal */}
            {showItemModal && (
                <ItemFormModal
                    onClose={handleCloseItemModal}
                    onAddSuccess={handleAddSuccess} // Close modal after successful addition
                    boxId={Number(id)} // Pass the box ID to pre-populate
                />
            )}
            {showMoveModal && (
                <MoveBoxFormModal
                    onClose={handleCloseMoveModal}
                    onAddSuccess={handleAddSuccess}
                    boxId={Number(id)}
                />
            )}
        </div>
    );
};

export default BoxDetailsPage;
