// Generated by https://quicktype.io

export interface LoginResponse {
    ok: boolean;
    token: string;
    user: User;
}

export interface User {
    id: number;
    name: string;
    user: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
}

