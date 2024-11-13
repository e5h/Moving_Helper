import React, { createContext, useContext, useState } from 'react';
import { LocationDetailsDto } from '../dtos/LocationDtos';
import { BoxDetailsDto } from '../dtos/BoxDtos';
import { ItemDetailsDto } from '../dtos/ItemDtos';

interface CacheContextType {
    locations: LocationDetailsDto[] | null;
    boxes: BoxDetailsDto[] | null;
    items: ItemDetailsDto[] | null;
    setLocations: (data: LocationDetailsDto[]) => void;
    setBoxes: (data: BoxDetailsDto[]) => void;
    setItems: (data: ItemDetailsDto[]) => void;
    clearCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locations, setLocations] = useState<LocationDetailsDto[] | null>(null);
    const [boxes, setBoxes] = useState<BoxDetailsDto[] | null>(null);
    const [items, setItems] = useState<ItemDetailsDto[] | null>(null);

    const clearCache = () => {
        setLocations(null);
        setBoxes(null);
        setItems(null);
    };

    return (
        <CacheContext.Provider value={{ locations, boxes, items, setLocations, setBoxes, setItems, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => {
    const context = useContext(CacheContext);
    if (context === undefined) {
        throw new Error('useCache must be used within a CacheProvider');
    }
    return context;
};
