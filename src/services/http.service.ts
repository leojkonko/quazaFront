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

const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object') {
        if ('message' in error) return String(error.message);
        if (Array.isArray(error)) return error.map(String).join(', ');
    }
    return 'Ocorreu um erro inesperado';
};

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

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // Se não for JSON, tenta ler como texto
                data = await response.text();
            }

            console.log('📦 Response:', {
                status: response.status,
                ok: response.ok,
                data
            });

            if (!response.ok) {
                // Se a resposta for uma string direta, use-a como mensagem de erro
                if (typeof data === 'string') {
                    return {
                        success: false,
                        message: data
                    };
                }

                // Se o servidor retornou um objeto com mensagem específica, use-a
                if (data.message || data.mensagem || data.error) {
                    return {
                        success: false,
                        message: data.message || data.mensagem || data.error,
                        validationErrors: data.errors || null
                    };
                }

                // Caso contrário, trate baseado no status HTTP
                switch (response.status) {
                    case 401:
                        return {
                            success: false,
                            message: 'Email ou senha incorretos.'
                        };
                    case 400:
                        return {
                            success: false,
                            message: 'Dados inválidos. Verifique as informações e tente novamente.',
                            validationErrors: data.errors
                        };
                    case 404:
                        return {
                            success: false,
                            message: 'Recurso não encontrado.'
                        };
                    case 409:
                        return {
                            success: false,
                            message: 'Recurso já existe. Verifique os dados e tente novamente.'
                        };
                    case 500:
                        return {
                            success: false,
                            message: 'Erro interno do servidor. Tente novamente mais tarde.'
                        };
                    default:
                        return {
                            success: false,
                            message: 'Ocorreu um erro inesperado. Tente novamente.'
                        };
                }
            }

            return {
                success: true,
                data,
                message: typeof data === 'object' ? (data.message || data.mensagem) : undefined
            };
        } catch (error) {
            console.error('💥 Unexpected Error:', error);
            return {
                success: false,
                message: getErrorMessage(error)
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