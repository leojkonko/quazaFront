import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification';
import { AuthService, type RegisterData, type LoginResponse } from '../services/auth.service';

// Configurações padrão para os toasts
const TOAST_CONFIG = {
    duration: 5000,
    position: 'top-right',
} as const;

interface AuthUser {
    id: number;
    nomeCompleto: string;
    email: string;
}

interface AuthState {
    user: AuthUser | null;
    error: string | null;
    validationErrors: Record<string, string[]> | null;
    isLoading: boolean;
}

export const useAuthStore = defineStore('auth', () => {
    const state = ref<AuthState>({
        user: null,
        error: null,
        validationErrors: null,
        isLoading: false
    });

    const toast = useToast();

    // Getters
    const isAuthenticated = computed(() => !!state.value.user);
    const currentUser = computed(() => state.value.user);
    const error = computed(() => state.value.error);
    const validationErrors = computed(() => state.value.validationErrors);
    const isLoading = computed(() => state.value.isLoading);

    // Mutations
    const setError = (message: string | null) => {
        state.value.error = message;
    };

    const setValidationErrors = (errors: Record<string, string[]> | null) => {
        state.value.validationErrors = errors;
    };

    const setLoading = (loading: boolean) => {
        state.value.isLoading = loading;
    };

    const setUser = (user: AuthUser | null) => {
        state.value.user = user;
        if (user) {
            localStorage.setItem('user_data', JSON.stringify(user));
        } else {
            localStorage.removeItem('user_data');
        }
    };

    const clearErrors = () => {
        setError(null);
        setValidationErrors(null);
    };

    // Actions
    const initializeAuth = () => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                setUser(null);
            }
        }
    };

    const login = async (email: string, senha: string) => {
        try {
            setLoading(true);
            clearErrors();

            const response = await AuthService.login(email, senha);

            if (response.success && response.data) {
                const userData: AuthUser = {
                    id: response.data.id,
                    nomeCompleto: response.data.nomeCompleto,
                    email: response.data.email
                };

                setUser(userData);
                toast.success(response.message || 'Login realizado com sucesso!', TOAST_CONFIG);
                return true;
            } else {
                if (response.validationErrors) {
                    setValidationErrors(response.validationErrors);
                }
                throw new Error(response.message || 'Erro ao realizar login');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Erro ao realizar login';
            setError(errorMessage);
            toast.error(errorMessage, TOAST_CONFIG);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setLoading(true);
            clearErrors();

            const response = await AuthService.register(data);

            if (response.success) {
                toast.success(response.message || 'Cadastro realizado com sucesso!', TOAST_CONFIG);
                return true;
            } else {
                if (response.validationErrors) {
                    setValidationErrors(response.validationErrors);
                }
                throw new Error(response.message || 'Erro ao realizar cadastro');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Erro ao realizar cadastro';
            setError(errorMessage);
            toast.error(errorMessage, TOAST_CONFIG);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            clearErrors();

            const response = await AuthService.logout();

            if (response.success) {
                setUser(null);
                toast.success(response.message || 'Logout realizado com sucesso!', TOAST_CONFIG);
                return true;
            } else {
                throw new Error(response.message || 'Erro ao realizar logout');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Erro ao realizar logout';
            setError(errorMessage);
            toast.error(errorMessage, TOAST_CONFIG);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        user: computed(() => state.value.user),
        error,
        validationErrors,
        isLoading,

        // Getters
        isAuthenticated,
        currentUser,

        // Actions
        login,
        logout,
        register,
        initializeAuth
    };
});