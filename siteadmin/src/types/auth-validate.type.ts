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
