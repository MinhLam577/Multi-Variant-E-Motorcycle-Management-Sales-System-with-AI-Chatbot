import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { AUTH_STORAGE_KEYS } from "../constants";

export const tokenUtils = {
    getAccessToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        }

        return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    },
    getRefreshToken(): string | null {
        return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    },
    setAccessToken(token: string): void {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
    },
    setRefreshToken(token: string): void {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, token);
    },
    clearAccessToken(): void {
        localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    },
    clearRefreshToken(): void {
        localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    },
    clearTokens(): void {
        localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    },
    hasTokens(): boolean {
        return !!(
            localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) &&
            localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
        );
    },
    getRefreshTokenAsync(): Promise<string | null> {
        return Promise.resolve(
            localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ||
                sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ||
                null
        );
    },
};

export function trimAddress(txnId: string) {
    if (txnId.length <= 8) {
        return txnId; // Return as is if the length is less than or equal to 8
    }
    const firstFour = txnId.slice(0, 4);
    const lastFour = txnId.slice(-4);
    return `${firstFour}...${lastFour}`;
}

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString); // Nhận chuỗi ISO và chuyển thành Date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};
