import React, { useState, useEffect } from 'react';
import { useCache } from '../components/CacheContext';
import '../styles/BoxFormModal.css';
import {LocationDetailsDto} from "../dtos/LocationDtos.ts";

interface BoxFormModalProps {
    onClose: () => void;
    onAddSuccess: () => void;
    locationId?: number; // Optional prop for pre-filling Location ID
}

const BoxFormModal: React.FC<BoxFormModalProps> = ({ onClose, onAddSuccess, locationId }) => {
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [locationIdInput, setLocationIdInput] = useState<number | ''>(locationId || ''); // Initialize with locationId directly
    const [moveFromId, setMoveFromId] = useState<number | null>(null);
    const [moveToId, setMoveToId] = useState<number | null>(null);
    const [picture, setPicture] = useState<File | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [responseStatus, setResponseStatus] = useState<string | null>(null);
    const { locations, setLocations } = useCache();

    // Using the same cache provider on render to allow friendly names for locations
    useEffect(() => {
        const fetchAllLocations = async () => {
            try {
                const response = await fetch('/api/v1/locations/details');
                if (!response.ok) throw new Error('Failed to fetch locations');
                const data: LocationDetailsDto[] = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        if (!locations) {
            fetchAllLocations().then();
        }
    }, [locations, setLocations]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPicture(event.target.files[0]);
        }
    };

    // Function to upload picture and get the picture ID
    const uploadPicture = async (file: File): Promise<number | null> => {
        const pictureDescription = `Box: ${label} - ${description}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('Filename', file.name);
        formData.append('Description', pictureDescription);

        try {
            const response = await fetch('/api/v1/picture/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Picture upload failed');
            const result = await response.json();
            setUploadSuccess(`Picture uploaded: ${result.fileName} with ID: ${result.id}`);
            return result.id;
        } catch (error) {
            console.error('Error uploading picture:', error);
            setUploadSuccess('Picture upload failed');
            return null;
        }
    };

    // Submit the box with the picture ID (if available)
    const handleBoxSubmit = async () => {
        let pictureId = null;

        if (picture) {
            pictureId = await uploadPicture(picture);
            if (!pictureId) return;
        }

        const boxData = {
            label,
            description,
            locationId: locationIdInput || 0,
            moveFromId: moveFromId ?? null,
            moveToId: moveToId ?? null,
            pictureId: pictureId ?? null,
        };

        try {
            const response = await fetch('/api/v1/boxes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boxData),
            });

            setResponseStatus(`Response: ${response.status} - ${response.statusText}`)
            if (!response.ok) throw new Error('Failed to create box');

            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating box:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Box</h2>
                <label>
                    Label:
                    <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={20}
                           required/>
                </label>
                <label>
                    Description:
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                              rows={5} maxLength={512}></textarea>
                </label>
                {!locations ? (
                    <p>Loading Locations...</p>
                ) : (
                    <div className="dropdown-labels">
                        <label>
                            Location:
                            <select
                                value={locationIdInput || ''}
                                onChange={(e) => setLocationIdInput(Number(e.target.value))}
                                required
                            >
                                <option value="">Select</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Move From:
                            <select
                                value={moveFromId || ''}
                                onChange={(e) => setMoveFromId(Number(e.target.value))}
                                required
                            >
                                <option value="">Select (optional)</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Move To:
                            <select
                                value={moveToId || ''}
                                onChange={(e) => setMoveToId(Number(e.target.value))}
                                required
                            >
                                <option value="">Select (optional)</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}
                <label>
                    Picture (optional):
                    <input type="file" onChange={handleFileChange}/>
                </label>
                {uploadSuccess && <p>{uploadSuccess}</p>}
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

export default BoxFormModal;
