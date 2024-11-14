import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemDetailsDto } from '../dtos/ItemDtos';
import { useNavigation } from '../components/NavigationContext';
import { useCache} from "../components/CacheContext.tsx";
import '../styles/ItemDetailsPage.css';
import MoveItemFormModal from "../components/MoveItemFormModal.tsx";

const ItemDetailsPage: React.FC = () => {
    const { clearCache } = useCache();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedItemId } = useNavigation();

    const [item, setItem] = useState<ItemDetailsDto | null>(null);
    const [picture, setPicture] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMoveModal, setShowMoveModal] = useState(false); // State for moving item

    useEffect(() => {
        fetchItemDetails();
    }, [id, setLastViewedItemId]);

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
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleBoxClick = () => {
        if (item?.boxId) {
            navigate(`/boxes/${item.boxId}`);
        }
    };

    const handleLocationClick = () => {
        if(item?.locationId) {
            navigate(`/locations/${item?.locationId}`);
        }
    }

    const handleBack = () => {
        setLastViewedItemId(null);
        navigate('/items');
    };

    const handleMoveItem = () => {
        setShowMoveModal(true);
    }

    const handleCloseMoveItemModal = () => {
        setShowMoveModal(false);
    }

    const handleAddSuccess = () => {
        clearCache();
        setShowMoveModal(false);
        fetchItemDetails();
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="details-container">
            <div className="details-header">
                <button className="back-button" onClick={handleBack}>
                    <span className="material-icons icon">arrow_back</span>
                    Back to Items
                </button>
                <h1 className="details-name">{item?.name}</h1>
                <button className="move-button" onClick={handleMoveItem}>
                    <span className="material-icons icon">local_shipping</span>
                    Move Item
                </button>
            </div>

            <div className="details-body">
                <div className="picture-frame">
                    {picture && <img src={picture} alt={`Item ${item?.id}`} className="details-picture"/>}
                </div>
                <div className="details-body-info">
                    <div className="details-metadata">
                        <div className="located-at" onClick={handleBoxClick}>
                            Stored inside: <span>"{item?.boxLabel}"</span>
                        </div>
                        <div className="located-at" onClick={handleLocationClick}>
                            Located at: <span>"{item?.locationName}"</span>
                        </div>
                    </div>
                    <p className="details-description">{item?.description}</p>
                </div>
            </div>

            {showMoveModal && (
                <MoveItemFormModal
                    onClose={handleCloseMoveItemModal}
                    onAddSuccess={handleAddSuccess}
                    itemId={Number(id)}
                />
            )}
        </div>
    );
};

export default ItemDetailsPage;
