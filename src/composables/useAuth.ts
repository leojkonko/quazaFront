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

export function useAuth() {
    const error = ref('');
    const isLoading = ref(false);
    const toast = useToast();

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

    return {
        error,
        isLoading,
        register
    };
}