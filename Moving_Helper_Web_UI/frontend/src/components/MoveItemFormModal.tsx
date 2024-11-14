import React, { useState, useEffect } from 'react';
import { useCache } from '../components/CacheContext';
import '../styles/MoveItemFormModal.css';
import {BoxDetailsDto} from "../dtos/BoxDtos.ts";
import {ItemDetailsDto} from "../dtos/ItemDtos.ts";

interface MoveItemFormModalProps {
    onClose: () => void;
    onAddSuccess: () => void;
    itemId?: number; // Optional prop for pre-filling Location ID
}

const MoveItemFormModal: React.FC<MoveItemFormModalProps> = ({ onClose, onAddSuccess, itemId }) => {
    const { items, setItems, boxes, setBoxes } = useCache();
    const [itemIdInput, setItemIdInput] = useState<number | ''>(itemId || '');
    const [newBoxId, setNewBoxId] = useState<number | null>(null);
    const [responseStatus, setResponseStatus] = useState<string | null>(null);

    // Using the same cache provider on render to allow friendly names for locations
    useEffect(() => {
        const fetchAllBoxes = async () => {
            try {
                const response = await fetch('/api/v1/boxes/details');
                if (!response.ok) throw new Error('Network response was not ok');
                const data: BoxDetailsDto[] = await response.json();
                setBoxes(data);
            } catch (error) {
                console.error('Error fetching boxes:', error);
            }
        };

        const fetchAllItems = async () => {
            try {
                const response = await fetch('/api/v1/items/details');
                if (!response.ok) throw new Error('Failed to fetch locations');
                const data: ItemDetailsDto[] = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        if(!boxes) {
            fetchAllBoxes().then();
        }

        if (!items) {
            fetchAllItems().then();
        }
    }, [items, setItems, boxes, setBoxes]);

    const handleItemSubmit = async () => {
        const itemData = {
            itemId: itemIdInput,
            newBoxId,
        }

        try{
            const response = await fetch('/api/v1/items/move', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });

            setResponseStatus(`Response: ${response.status} - ${response.statusText}`)
            if (!response.ok) throw new Error('Failed to move item');

            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error moving item:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Move Box</h2>
                {(items && boxes) ? (
                    <div className="dropdown-labels">
                        <label>
                            Item:
                            <select
                                value={itemIdInput || ''}
                                onChange={(e) => setItemIdInput(Number(e.target.value))}
                                required
                            >
                                <option value="">Select</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            New Box:
                            <select
                                value={newBoxId || ''}
                                onChange={(e) => setNewBoxId(Number(e.target.value))}
                                required
                            >
                                <option value="">Select</option>
                                {boxes.map((box) => (
                                    <option key={box.id} value={box.id}>
                                        {box.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                ) : (
                    <p>Loading Information...</p>
                )}
                {responseStatus && <p>{responseStatus}</p>}
                <div className="modal-buttons">
                    <button onClick={onClose}>
                        <span className="material-icons icon">close</span>
                        Cancel
                    </button>
                    <button onClick={handleItemSubmit}>
                        <span className="material-icons icon">check</span>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveItemFormModal;