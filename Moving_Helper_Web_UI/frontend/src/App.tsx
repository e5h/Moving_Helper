import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationSearchPage from './pages/LocationSearchPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import BoxSearchPage from './pages/BoxSearchPage';
import BoxDetailsPage from './pages/BoxDetailsPage';
import ItemSearchPage from './pages/ItemSearchPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
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
                    path="/locations/:id"
                    element={
                        <MainLayout>
                            <LocationDetailsPage/>
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
                    path="/boxes/:id"
                    element={
                        <MainLayout>
                            <BoxDetailsPage/>
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
                    path="/items/:id"
                    element={
                        <MainLayout>
                            <ItemDetailsPage/>
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
