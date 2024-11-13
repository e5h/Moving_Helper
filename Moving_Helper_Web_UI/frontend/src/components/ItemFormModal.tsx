import React, { useState } from 'react';
import '../styles/ItemFormModal.css';

interface ItemFormModalProps {
    onClose: () => void;
    onAddSuccess: () => void; // Callback for successful addition
    boxId?: number; // Optional prop to pre-populate the Box ID
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ onClose, onAddSuccess, boxId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [boxIdInput, setBoxIdInput] = useState<number | ''>(boxId || ''); // Initialize with boxId directly
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
        const pictureDescription = `Item: ${name} - ${description}`;

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
            return result.id; // Return the picture ID from PictureInfoDto
        } catch (error) {
            console.error('Error uploading picture:', error);
            setUploadSuccess('Picture upload failed');
            return null;
        }
    };

    // Submit the item with the picture ID (if available)
    const handleItemSubmit = async () => {
        let pictureId = null;

        if (picture) {
            pictureId = await uploadPicture(picture); // Upload picture first and get the ID
            if (!pictureId) return; // If picture upload fails, stop the submission
        }

        const itemData = {
            name,
            description,
            boxId: boxIdInput || 0, // Ensure BoxId is provided
            pictureId: pictureId ?? undefined, // Use pictureId if available, otherwise undefined
        };

        try {
            const response = await fetch('/api/v1/items/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });

            if (!response.ok) throw new Error('Failed to create item');

            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Item</h2>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} required />
                </label>
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={512} required />
                </label>
                <label>
                    Box ID:
                    <input
                        type="number"
                        value={boxIdInput}
                        onChange={(e) => setBoxIdInput(Number(e.target.value))}
                        required
                    />
                </label>
                <label>
                    Picture (optional):
                    <input type="file" onChange={handleFileChange} />
                </label>
                {uploadSuccess && <p>{uploadSuccess}</p>}
                <div className="modal-buttons">
                    <button onClick={handleItemSubmit}>Add</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ItemFormModal;
