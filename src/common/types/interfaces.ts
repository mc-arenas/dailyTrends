import { roles } from "./enums";

export interface IDeleteResult {
    acknowledged: boolean;
    deletedCount: number;
}

export interface IUserPayload {
    userId: string;
    role: roles;
}