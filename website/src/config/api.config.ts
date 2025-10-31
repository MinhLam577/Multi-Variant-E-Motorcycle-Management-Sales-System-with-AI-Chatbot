// src/config/api.ts
export const BACKEND_BASE = process.env.NEXT_PUBLIC_BACK_END_API_BASE_URL ?? "";
export const CHATBOT_BASE = process.env.NEXT_PUBLIC_CHATBOT_API_BASE_URL ?? "";
// Auth URLs
export const AUTH_URLS = {
    google: `${BACKEND_BASE}/auth/google`,
    facebook: `${BACKEND_BASE}/auth/facebook`,
};
