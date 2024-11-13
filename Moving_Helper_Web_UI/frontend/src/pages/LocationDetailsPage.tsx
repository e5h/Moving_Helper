// LocationDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LocationDetailsDto } from '../dtos/LocationDtos';
import { BoxInfoDto } from '../dtos/BoxDtos';
import { useNavigation } from '../components/NavigationContext';
import BoxFormModal from '../components/BoxFormModal'; // Import the BoxFormModal component
import '../styles/LocationDetailsPage.css';

const LocationDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLastViewedLocationId } = useNavigation();

    const [location, setLocation] = useState<LocationDetailsDto | null>(null);
    const [picture, setPicture] = useState<string | null>(null);
    const [boxes, setBoxes] = useState<BoxInfoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBoxModal, setShowBoxModal] = useState(false); // State for showing the modal

    const fetchLocationDetails = async () => {
        try {
            const locationResponse = await fetch(`/api/v1/locations/details/${id}`);
            if (!locationResponse.ok) throw new Error('Location fetch failed');
            const locationData: LocationDetailsDto = await locationResponse.json();
            setLocation(locationData);

            setLastViewedLocationId(Number(id));

            const pictureResponse = await fetch(`/api/v1/picture/download/${locationData.pictureId}`);
            if (!pictureResponse.ok) throw new Error('Picture fetch failed');
            const pictureBlob = await pictureResponse.blob();
            const pictureUrl = URL.createObjectURL(pictureBlob);
            setPicture(pictureUrl);

            const boxPromises = locationData.boxIds.map((boxId) =>
                fetch(`/api/v1/boxes/info/${boxId}`).then((response) => response.json())
            );
            const boxesData: BoxInfoDto[] = await Promise.all(boxPromises);
            setBoxes(boxesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocationDetails();
    }, [id]);

    const handleBoxClick = (boxId: number) => {
        navigate(`/boxes/${boxId}`);
    };

    const handleBack = () => {
        setLastViewedLocationId(null);
        navigate('/locations');
    };

    const handleAddBox = () => {
        setShowBoxModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowBoxModal(false); // Close the modal
    };

    const handleAddSuccess = () => {
        setShowBoxModal(false);
        fetchLocationDetails();
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="location-details">
            <h1 className="location-name">{location?.name}</h1>
            <p className="location-description">{location?.description}</p>

            {picture && <img src={picture} alt={`Location ${location?.id}`} className="location-picture" />}

            <div className="button-group">
                <button className="back-button" onClick={handleBack}>Back to Locations</button>
                <button className="add-box-button" onClick={handleAddBox}>Add Box to Location</button>
            </div>

            <h2 className="section-title">Boxes</h2>
            {boxes.length > 0 ? (
                <table className="box-table">
                    <thead>
                    <tr>
                        <th>Box Label</th>
                        <th>Box Description</th>
                        <th>Box ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boxes.map((box) => (
                        <tr key={box.id} onClick={() => handleBoxClick(box.id)} style={{ cursor: 'pointer' }}>
                            <td>{box.label}</td>
                            <td>{box.description}</td>
                            <td>{box.id}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No boxes available for this location.</p>
            )}

            {/* Render the BoxFormModal when showBoxModal is true */}
            {showBoxModal && (
                <BoxFormModal
                    onClose={handleCloseModal}
                    onAddSuccess={handleAddSuccess}
                    locationId={Number(id)} // Pass the location ID to pre-populate
                />
            )}
        </div>
    );
};

export default LocationDetailsPage;
