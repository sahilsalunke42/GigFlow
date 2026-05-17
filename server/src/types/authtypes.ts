// global types for authentication
export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'sales';
}

export interface IAuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'sales';
    };
}