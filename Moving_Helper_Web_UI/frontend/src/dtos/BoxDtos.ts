// BoxDtos.ts
export interface BoxDetailsDto {
    id: number;
    label: string;
    description: string;
    itemIds: number[];
    locationId: number;
    locationName: string;
    moveFromId: number;
    moveFromName: string;
    moveToId: number;
    moveToName: string;
    pictureId: number;
}

// BoxDtos.ts
export interface BoxInfoDto {
    id: number;
    label: string;
    description: string;
    locationId: number;
    moveFromId: number;
    moveToId: number;
    pictureId: number;
}
