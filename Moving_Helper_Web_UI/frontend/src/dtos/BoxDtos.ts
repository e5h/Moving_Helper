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
