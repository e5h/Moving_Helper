import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { useCache } from '../components/CacheContext';
import '../styles/MoveBoxFormModal.css';
import {LocationDetailsDto} from "../dtos/LocationDtos.ts";
import {BoxDetailsDto} from "../dtos/BoxDtos.ts";

interface MoveBoxFormModalProps {
    onClose: () => void;
    onAddSuccess: () => void;
    boxId?: number; // Optional prop for pre-filling Location ID
}

const MoveBoxFormModal: React.FC<MoveBoxFormModalProps> = ({ onClose, onAddSuccess, boxId }) => {
    const { locations, setLocations, boxes, setBoxes } = useCache();
    const [boxIdInput, setBoxIdInput] = useState<number | ''>(boxId || '');
    const [newLocationId, setNewLocationId] = useState<number | null>(null);
    const [responseStatus, setResponseStatus] = useState<string | null>(null);

    // Using the same cache provider on render to allow friendly names for locations
    useEffect(() => {
        const fetchAllLocations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}locations/details`);
                if (!response.ok) throw new Error('Failed to fetch locations');
                const data: LocationDetailsDto[] = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        const fetchAllBoxes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}boxes/details`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data: BoxDetailsDto[] = await response.json();
                setBoxes(data);
            } catch (error) {
                console.error('Error fetching boxes:', error);
            }
        };

        if (!locations) {
            fetchAllLocations().then();
        }

        if(!boxes) {
            fetchAllBoxes().then();
        }
    }, [locations, setLocations, boxes, setBoxes]);

    const handleBoxSubmit = async () => {
        const boxData = {
            boxId: boxIdInput,
            newLocationId,
        }

        try{
            const response = await fetch(`${API_BASE_URL}boxes/move`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boxData),
            });

            setResponseStatus(`Response: ${response.status} - ${response.statusText}`)
            if (!response.ok) throw new Error('Failed to move box');

            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error moving box:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Move Box</h2>
                {(boxes && locations) ? (
                    <div className="dropdown-labels">
                        <label>
                            Box:
                            <select
                                value={boxIdInput || ''}
                                onChange={(e) => setBoxIdInput(Number(e.target.value))}
                                required
                            >
                                <option value="">Select</option>
                                {boxes!.map((box) => (
                                    <option key={box.id} value={box.id}>
                                        {box.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            New Location:
                            <select
                                value={newLocationId || ''}
                                onChange={(e) => setNewLocationId(Number(e.target.value))}
                                required
                            >
                                <option value="">Select</option>
                                {locations!.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
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
                    <button onClick={handleBoxSubmit}>
                        <span className="material-icons icon">check</span>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveBoxFormModal;