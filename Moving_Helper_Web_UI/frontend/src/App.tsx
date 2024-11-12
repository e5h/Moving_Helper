import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationSearchPage from './pages/LocationSearchPage';
import BoxSearchPage from './pages/BoxSearchPage';
import ItemSearchPage from './pages/ItemSearchPage';
import SettingsPage from './pages/SettingsPage';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <MainLayout>
                            <HomePage/>
                        </MainLayout>
                    }
                />
                <Route
                    path="/locations"
                    element={
                        <MainLayout>
                            <LocationSearchPage/>
                        </MainLayout>
                    }
                />
                <Route
                    path="/boxes"
                    element={
                        <MainLayout>
                            <BoxSearchPage/>
                        </MainLayout>
                    }
                />
                <Route
                    path="/items"
                    element={
                        <MainLayout>
                            <ItemSearchPage/>
                        </MainLayout>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <MainLayout>
                            <SettingsPage/>
                        </MainLayout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App
