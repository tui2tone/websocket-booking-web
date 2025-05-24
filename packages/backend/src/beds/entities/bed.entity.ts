export interface Bed {
    id: number;
    room_id: number;
    bed_no: number;
    status?: BedStatus | null;
}

export enum BedStatus {
    Available = 1,
    Locked = 2,
    Booked = 3
}