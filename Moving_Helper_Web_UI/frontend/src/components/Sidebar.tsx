// Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import { useNavigation } from './NavigationContext';

const Sidebar: React.FC = () => {
    const { lastViewedLocationId, lastViewedBoxId, lastViewedItemId } = useNavigation();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (basePath: string) => location.pathname.startsWith(basePath);

    const handleNavigation = (type: 'location' | 'box' | 'item' | 'settings') => {
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
            case 'settings':
                navigate('/settings');
                break;
        }
    };

    return (
        <div className="sidebar">
            <nav>
                <button className={isActive('/locations') ? 'active' : ''} onClick={() => handleNavigation('location')}>
                    <span className="material-icons icon">location_on</span>
                    Locations
                </button>
                <button className={isActive('/boxes') ? 'active' : ''} onClick={() => handleNavigation('box')}>
                    <span className="material-icons icon">inventory_2</span>
                    Boxes
                </button>
                <button className={isActive('/items') ? 'active' : ''} onClick={() => handleNavigation('item')}>
                    <span className="material-icons icon">view_in_ar</span>
                    Items
                </button>
                <div className="nav-bottom">
                    <button className={isActive('/settings') ? 'active' : ''} onClick={() => handleNavigation('settings')}>
                        <span className="material-icons icon">settings</span>
                        Settings
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
