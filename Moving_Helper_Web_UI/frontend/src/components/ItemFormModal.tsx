import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { useCache } from "./CacheContext.tsx";
import '../styles/ItemFormModal.css';
import {BoxDetailsDto} from "../dtos/BoxDtos.ts";

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
    const [responseStatus, setResponseStatus] = useState<string | null>(null);
    const { boxes, setBoxes } = useCache();

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}boxes/details`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data: BoxDetailsDto[] = await response.json();
                setBoxes(data);
            } catch (error) {
                console.error('Error fetching boxes:', error);
            }
        };

        if (!boxes) {
            fetchBoxes().then();
        }
    }, [boxes, setBoxes]);

    // Handle file selection for picture upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPicture(event.target.files[0]);
        }
    };

    // Function to upload picture and get the picture ID
    const uploadPicture = async (file: File): Promise<number | null> => {
        const pictureDescription = `Item: ${name} - ${description}`;
        const newFileName = `item_${name.replace(/ /g, "-")}_${file.name.replace(/ /g, "-")}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('Filename', newFileName);
        formData.append('Description', pictureDescription);

        try {
            const response = await fetch(`${API_BASE_URL}picture/upload`, {
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
            pictureId: pictureId ?? null,
        };

        try {
            const response = await fetch(`${API_BASE_URL}items/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });

            setResponseStatus(`Response: ${response.status} - ${response.statusText}`)
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
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                              rows={5} maxLength={512}></textarea>
                </label>
                {!boxes ? (
                    <p>Loading Boxes...</p>
                ) : (
                    <div className="dropdown-labels">
                        <label>
                            Box:
                            <select
                                value={boxIdInput || ''}
                                onChange={(e) => setBoxIdInput(Number(e.target.value))}
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
                    <button onClick={handleItemSubmit}>
                        <span className="material-icons icon">check</span>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemFormModal;
