import { Permission } from "./permissions";

export type UserType = 'customer' | 'employee' | 'admin' | 'super_admin';

export interface User {
    id: number;
    name: string;
    email: string;
    user_type: UserType;
    profile_picture?: string; 
    phone?: string;
}

export interface ApiResponse {
    status: string;
    data?: {
        token?: string;
        user?: User;
        permissions?: Permission[];
    };
    message?: string;
}