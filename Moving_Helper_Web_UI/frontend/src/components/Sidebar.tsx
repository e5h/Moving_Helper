import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <nav>
                <Link to="/locations">Locations</Link>
                <Link to="/boxes">Boxes</Link>
                <Link to="/items">Items</Link>
                <Link to="/settings">Settings</Link>
            </nav>
        </div>
    );
};

export default Sidebar;