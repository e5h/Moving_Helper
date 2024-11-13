import React, { useState } from 'react';
import '../styles/BoxFormModal.css';

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

    // Handle file selection for picture upload
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
            moveFromId: moveFromId ?? undefined,
            moveToId: moveToId ?? undefined,
            pictureId: pictureId ?? undefined,
        };

        try {
            const response = await fetch('/api/v1/boxes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boxData),
            });

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
                    <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={20} required />
                </label>
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={512} required />
                </label>
                <label>
                    Location ID:
                    <input
                        type="number"
                        value={locationIdInput}
                        onChange={(e) => setLocationIdInput(Number(e.target.value))}
                        required
                    />
                </label>
                <label>
                    Move From ID:
                    <input type="number" value={moveFromId ?? ''} onChange={(e) => setMoveFromId(Number(e.target.value))} />
                </label>
                <label>
                    Move To ID:
                    <input type="number" value={moveToId ?? ''} onChange={(e) => setMoveToId(Number(e.target.value))} />
                </label>
                <label>
                    Picture (optional):
                    <input type="file" onChange={handleFileChange} />
                </label>
                {uploadSuccess && <p>{uploadSuccess}</p>}
                <div className="modal-buttons">
                    <button onClick={handleBoxSubmit}>Add</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default BoxFormModal;
