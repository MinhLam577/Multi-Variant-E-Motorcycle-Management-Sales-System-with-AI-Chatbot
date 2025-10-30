export type JwtPayload = {
    username: string;
    email: string;
    id: string;
    role: string;
    iat: number;
    exp: number;
};
