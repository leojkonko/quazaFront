export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL,
    TIMEOUT: 10000, // 10 segundos
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
} as const;