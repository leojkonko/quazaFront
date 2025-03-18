import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';

interface RegisterData {
    nomeCompleto: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
}

interface LoginData {
    email: string;
    senha: string;
}

export function useAuth() {
    const error = ref('');
    const isLoading = ref(false);
    const toast = useToast();

    const isAuthenticated = () => {
        const userData = localStorage.getItem('user_data');
        return !!userData;
    };

    const validateRegisterData = (data: RegisterData) => {
        if (!data.nomeCompleto.trim()) {
            error.value = 'Nome completo é obrigatório';
            return false;
        }

        // Remove formatação do CPF para validação
        const cpfNumbers = data.cpf.replace(/\D/g, '');
        if (!/^\d{11}$/.test(cpfNumbers)) {
            error.value = 'CPF deve conter exatamente 11 dígitos';
            return false;
        }

        if (!data.dataNascimento) {
            error.value = 'Data de nascimento é obrigatória';
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            error.value = 'Email inválido';
            return false;
        }

        if (data.senha.length < 6) {
            error.value = 'A senha deve ter no mínimo 6 caracteres';
            return false;
        }

        if (data.senha !== data.confirmacaoSenha) {
            error.value = 'As senhas não coincidem';
            return false;
        }

        return true;
    };

    const register = async (data: RegisterData) => {
        try {
            if (!validateRegisterData(data)) {
                return false;
            }

            isLoading.value = true;
            error.value = '';

            const apiUrl = import.meta.env.VITE_API_URL
            const endpoint = import.meta.env.VITE_API_AUTH_ENDPOINT
            const url = `${apiUrl}${endpoint}`;

            console.log('Tentando conectar à API:', url);

            const requestData = {
                nomeCompleto: data.nomeCompleto,
                cpf: data.cpf.replace(/\D/g, ''),
                dataNascimento: data.dataNascimento,
                email: data.email.toLowerCase().trim(),
                senha: data.senha,
                confirmacaoSenha: data.confirmacaoSenha
            };

            console.log('Dados a serem enviados:', {
                ...requestData,
                senha: '[PROTEGIDO]',
                confirmacaoSenha: '[PROTEGIDO]'
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('Status da resposta:', response.status);

            if (!response.ok) {
                const responseData = await response.json().catch(() => null);
                console.error('Erro da API:', responseData);

                switch (response.status) {
                    case 400:
                        throw new Error(responseData?.message || 'Dados inválidos. Verifique as informações e tente novamente.');
                    case 409:
                        throw new Error('Este usuário já está cadastrado.');
                    case 422:
                        throw new Error('Dados inválidos. Verifique as informações e tente novamente.');
                    case 500:
                        throw new Error('Erro no servidor. Tente novamente mais tarde.');
                    default:
                        throw new Error(responseData?.message || 'Erro ao realizar cadastro');
                }
            }

            const responseData = await response.json();
            console.log('Resposta bem-sucedida:', responseData);

            toast.success('Cadastro realizado com sucesso! Redirecionando para o login...', {
                duration: 5000,
                position: 'top-right'
            });
            return true;
        } catch (err) {
            console.error('Erro durante o cadastro:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.';

            error.value = errorMessage;
            toast.error(errorMessage, {
                duration: 5000,
                position: 'top-right'
            });
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const login = async (data: LoginData) => {
        try {
            isLoading.value = true;
            error.value = '';

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const endpoint = import.meta.env.VITE_API_LOGIN_ENDPOINT || '/api/usuario/login';
            const url = `${apiUrl}${endpoint}`;

            console.log('Tentando login:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email.toLowerCase().trim(),
                    senha: data.senha
                })
            });

            console.log('Status da resposta:', response.status);

            const responseData = await response.json();
            console.log('Resposta completa do login:', responseData);

            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        throw new Error('Dados inválidos. Verifique as informações e tente novamente.');
                    case 401:
                        throw new Error('Email ou senha incorretos.');
                    case 500:
                        throw new Error('Erro no servidor. Tente novamente mais tarde.');
                    default:
                        throw new Error(responseData?.message || 'Erro ao realizar login');
                }
            }

            // Verificar se temos os dados do usuário na resposta
            if (!responseData.id || !responseData.email) {
                console.error('Estrutura da resposta:', responseData);
                throw new Error('Dados do usuário não encontrados na resposta');
            }

            // Armazenar os dados do usuário
            const userData = {
                id: responseData.id,
                nomeCompleto: responseData.nomeCompleto,
                email: responseData.email
            };

            localStorage.setItem('user_data', JSON.stringify(userData));
            console.log('Dados do usuário armazenados com sucesso');

            toast.success(responseData.mensagem || 'Login realizado com sucesso!', {
                duration: 3000,
                position: 'top-right'
            });

            return true;
        } catch (err) {
            console.error('Erro durante o login:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.';

            error.value = errorMessage;
            toast.error(errorMessage, {
                duration: 5000,
                position: 'top-right'
            });
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = async () => {
        try {
            isLoading.value = true;
            error.value = '';

            const apiUrl = import.meta.env.VITE_API_URL;
            const endpoint = import.meta.env.VITE_API_LOGOUT_ENDPOINT;
            const url = `${apiUrl}${endpoint}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao realizar logout');
            }

            const data = await response.json();

            // Limpar dados do usuário
            localStorage.removeItem('user_data');

            toast.success(data.mensagem || 'Logout realizado com sucesso!', {
                duration: 3000,
                position: 'top-right'
            });

            return true;
        } catch (err) {
            console.error('Erro durante o logout:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Erro ao realizar logout. Tente novamente.';

            error.value = errorMessage;
            toast.error(errorMessage, {
                duration: 5000,
                position: 'top-right'
            });
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        error,
        isLoading,
        register,
        login,
        logout,
        isAuthenticated
    };
}