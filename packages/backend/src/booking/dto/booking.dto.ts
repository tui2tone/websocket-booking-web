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