export interface JoinBookingQueueDto {
    roomId: number;
    token: string;
}

export interface ViewBookingQueueDto {
    roomId: number;
}

export interface SelectBookingQueueDto {
    roomId: number;
    bedId: number;
    token: string;
}
export interface BookingQueue {
    room_id: number;
    bed_id?: number;
    user_id: number;
}

export interface ValidateMyQueueDto {
    room_id: number;
    user_id: number;
}


export enum QueueStatus {
  Checking = 1,
  Waiting = 2,
  OnGoing = 3,
}