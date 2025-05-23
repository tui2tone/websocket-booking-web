export interface User {
    id: number;
    uuid: string;
    full_name: string;
    status?: UserStatus | null;
}

export enum UserStatus {
    Active = 1,
    Inactive = 2
}