// BoxSearchPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxDetailsDto } from '../dtos/BoxDtos';
import '../styles/BoxSearchPage.css';

const BoxSearchPage: React.FC = () => {
    const [boxes, setBoxes] = useState<BoxDetailsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/v1/boxes/details')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setBoxes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching boxes:', error);
                setLoading(false);
            });
    }, []);

    const handleRowClick = (id: number) => {
        navigate(`/boxes/${id}`);
    };

    return (
        <div>
            <h1>Box Search</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Label</th>
                        <th>Description</th>
                        <th>Item IDs</th>
                        <th>Location Name</th>
                        <th>Move From Name</th>
                        <th>Move To Name</th>
                        <th>Picture ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boxes.map((box) => (
                        <tr
                            key={box.id}
                            onClick={() => handleRowClick(box.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{box.id}</td>
                            <td>{box.label}</td>
                            <td>{box.description}</td>
                            <td>{box.itemIds.join(', ')}</td>
                            <td>{box.locationName}</td>
                            <td>{box.moveFromName}</td>
                            <td>{box.moveToName}</td>
                            <td>{box.pictureId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BoxSearchPage;
