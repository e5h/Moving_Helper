// Sidebar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import { useNavigation } from './NavigationContext';

const Sidebar: React.FC = () => {
    const { lastViewedLocationId, lastViewedBoxId, lastViewedItemId } = useNavigation();
    const navigate = useNavigate();

    const handleNavigation = (type: 'location' | 'box' | 'item') => {
        switch (type) {
            case 'location':
                if (lastViewedLocationId) {
                    navigate(`/locations/${lastViewedLocationId}`);
                } else {
                    navigate('/locations');
                }
                break;
            case 'box':
                if (lastViewedBoxId) {
                    navigate(`/boxes/${lastViewedBoxId}`);
                } else {
                    navigate('/boxes');
                }
                break;
            case 'item':
                if (lastViewedItemId) {
                    navigate(`/items/${lastViewedItemId}`);
                } else {
                    navigate('/items');
                }
                break;
        }
    };

    return (
        <div className="sidebar">
            <nav>
                <button onClick={() => handleNavigation('location')}>Locations</button>
                <button onClick={() => handleNavigation('box')}>Boxes</button>
                <button onClick={() => handleNavigation('item')}>Items</button>
                <Link to="/settings">Settings</Link>
            </nav>
        </div>
    );
};

export default Sidebar;
