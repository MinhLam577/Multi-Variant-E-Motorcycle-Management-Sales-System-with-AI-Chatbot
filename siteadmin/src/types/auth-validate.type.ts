export interface ForgotPassword {
    email: string;
}

export interface ResetPassword {
    token: string;
    newPassword: string;
}

export interface VerifyResetPassword {
    token: string;
}

export interface BasicResetPassword {
    id: string;
    newPassword: string;
    oldPassword: string;
}
