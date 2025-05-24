export interface Bed {
  id: number;
  room_id: number;
  bed_no: number;
  status: BedStatus;
}

export enum BedStatus {
  Available = 1,
  Locked = 2,
  Selected = 3,
  Booked = 4,
}
