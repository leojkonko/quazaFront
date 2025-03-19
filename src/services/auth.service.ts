import { HttpService, type ApiResponse } from './http.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface RegisterData {
    nomeCompleto: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
}

export interface LoginResponse {
    id: number;
    nomeCompleto: string;
    email: string;
    token?: string;
}

export class AuthService extends HttpService {
    static async register(data: RegisterData): Promise<ApiResponse> {
        const formattedData = {
            ...data,
            cpf: data.cpf.replace(/\D/g, ''),
            email: data.email.toLowerCase().trim()
        };

        return this.post(API_ENDPOINTS.AUTH.REGISTER, formattedData);
    }

    static async login(email: string, senha: string): Promise<ApiResponse<LoginResponse>> {
        return this.post(API_ENDPOINTS.AUTH.LOGIN, {
            email: email.toLowerCase().trim(),
            senha
        });
    }

    static async logout(): Promise<ApiResponse> {
        return this.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    }
}