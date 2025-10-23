export type UserResponse = {
    userId: number;
    username: string;
    email: string;
    Roles: string;
    avatarUrl?: string;
    age?: number;
    gender?: string;
    isActice?: boolean;
    birthday?: Date;
    phoneNumber?: string;
    address?: string;
    permissions?: any;
};

export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    user: UserResponse;
};

export enum ForgotPassword {
    FORGOT_PASSWORD_FAILED = "forgotPasswordFailed",
    FORGOT_PASSWORD_SUCCESS = "forgotPasswordSuccess",
}

export enum LoginStatus {
    INITIAL = "initial",
    SUBMITTING = "submitting",
    LOGIN_FAILED = "loginFailed",
    LOGIN_SUCCESS = "loginSuccess",
}
