import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
    lastViewedLocationId: number | null;
    lastViewedBoxId: number | null;
    lastViewedItemId: number | null;
    setLastViewedLocationId: (id: number | null) => void;
    setLastViewedBoxId: (id: number | null) => void;
    setLastViewedItemId: (id: number | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lastViewedLocationId, setLastViewedLocationId] = useState<number | null>(null);
    const [lastViewedBoxId, setLastViewedBoxId] = useState<number | null>(null);
    const [lastViewedItemId, setLastViewedItemId] = useState<number | null>(null);

    return (
        <NavigationContext.Provider
            value={{
                lastViewedLocationId,
                lastViewedBoxId,
                lastViewedItemId,
                setLastViewedLocationId,
                setLastViewedBoxId,
                setLastViewedItemId,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
