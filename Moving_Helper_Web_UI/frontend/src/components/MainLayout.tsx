import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css'

type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            <div className="title-bar">
                <Link to="/">Moving Helper App</Link>
                <a href="https://github.com/e5h/Moving_Helper" target="_blank" rel="noopener noreferrer">GitHub Source</a>
            </div>
            <Sidebar />
            <div className="content">{children}</div>
        </div>
    );
};

export default MainLayout;