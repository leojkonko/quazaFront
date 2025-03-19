import { API_CONFIG } from '../config/api.config';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    validationErrors?: Record<string, string[]>;
}

interface FetchOptions extends RequestInit {
    timeout?: number;
}

class HttpError extends Error {
    constructor(public response: Response, public data: any) {
        super(`HTTP Error ${response.status}: ${response.statusText}`);
        this.name = 'HttpError';
    }
}

export class HttpService {
    private static async fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
        const { timeout = API_CONFIG.TIMEOUT } = options;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    protected static async request<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        console.log('🚀 Request:', {
            url,
            method: options.method || 'GET',
            body: options.body ? JSON.parse(options.body as string) : undefined
        });

        const defaultOptions: FetchOptions = {
            headers: API_CONFIG.HEADERS
        };

        try {
            const response = await this.fetchWithTimeout(url, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers
                }
            });

            const data = await response.json();
            console.log('📦 Response:', {
                status: response.status,
                ok: response.ok,
                data
            });

            if (!response.ok) {
                throw new HttpError(response, data);
            }

            return {
                success: true,
                data,
                message: data.message
            };
        } catch (error) {
            if (error instanceof HttpError) {
                console.log('❌ Error Response:', {
                    status: error.response.status,
                    data: error.data
                });

                const errorResponse: ApiResponse = {
                    success: false,
                    message: error.data.message || error.data || 'Erro na requisição'
                };

                if (error.data.errors) {
                    if (typeof error.data.errors === 'object' && !Array.isArray(error.data.errors)) {
                        errorResponse.validationErrors = error.data.errors;
                        const errorMessages = [];
                        for (const field in error.data.errors) {
                            errorMessages.push(...error.data.errors[field]);
                        }
                        errorResponse.message = errorMessages[0] || errorResponse.message;
                    } else {
                        errorResponse.errors = Array.isArray(error.data.errors)
                            ? error.data.errors
                            : [error.data.errors];
                        if (!errorResponse.message && errorResponse.errors.length > 0) {
                            errorResponse.message = errorResponse.errors[0];
                        }
                    }
                }

                return errorResponse;
            }

            console.error('💥 Unexpected Error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Erro na requisição'
            };
        }
    }

    protected static get<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    protected static post<T>(endpoint: string, body: any, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    protected static put<T>(endpoint: string, body: any, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    protected static delete<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}