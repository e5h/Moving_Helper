// ItemSearchPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemDetailsDto } from '../dtos/ItemDtos';
import '../styles/ItemSearchPage.css';

const ItemSearchPage: React.FC = () => {
    const [items, setItems] = useState<ItemDetailsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/v1/items/details')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
                setLoading(false);
            });
    }, []);

    const handleRowClick = (id: number) => {
        navigate(`/items/${id}`);
    };

    return (
        <div>
            <h1>Item Search</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Box Label</th>
                        <th>Location Name</th>
                        <th>Move From Name</th>
                        <th>Move To Name</th>
                        <th>Picture ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => handleRowClick(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.boxLabel}</td>
                            <td>{item.locationName}</td>
                            <td>{item.moveFromName}</td>
                            <td>{item.moveToName}</td>
                            <td>{item.pictureId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ItemSearchPage;
