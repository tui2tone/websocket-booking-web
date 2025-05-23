export interface Room {
    id: number;
    name: string;
    description?: string | null;
    slot?: number | null;
    available_slot?: number | null;
    status?: RoomStatus | null;

}

export enum RoomStatus {
    Available = 1,
    FullyBooked = 2
}