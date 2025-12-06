const BaseStatusProps = {
    INITIAL: "initial",
    SUBMITTING: "submitting",
} as const;

export const LoginStatusProps = {
    ...BaseStatusProps,
    LOGIN_SUCCESS: "loginSuccess",
    LOGIN_FAILED: "loginFailed",
} as const;

export type LoginStatusProps =
    (typeof LoginStatusProps)[keyof typeof LoginStatusProps];

export const ForgotPasswordStatusProps = {
    ...BaseStatusProps,
    FORGOT_PASSWORD_SUCCESS: "forgotPasswordSuccess",
    FORGOT_PASsWORD_FAILED: "forgotPasswordFailed",
};

export type ForgotPasswordStatusProps =
    (typeof ForgotPasswordStatusProps)[keyof typeof ForgotPasswordStatusProps];

export type LoginData = {
    email: string;
    password: string;
    remember?: boolean;
};

export type UserResponse = {
    userId: string;
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
