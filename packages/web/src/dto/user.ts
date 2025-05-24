export interface User {
    id: number;
    uuid: string;
    email: string;
    status?: UserStatus | null;
}

export enum UserStatus {
    Active = 1,
    Inactive = 2
}