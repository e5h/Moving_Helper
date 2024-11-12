// ItemDtos.ts
export interface ItemDetailsDto {
    id: number;
    name: string;
    description: string;
    boxId: number;
    boxLabel: string;
    locationId: number;
    locationName: string;
    moveFromId: number;
    moveFromName: string;
    moveToId: number;
    moveToName: string;
    pictureId: number;
}
