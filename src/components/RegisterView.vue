<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700">
        <div
            class="bg-white p-10 rounded-2xl shadow-2xl w-[800px] transform transition-all duration-300 hover:scale-105">
            <div class="text-center">
                <h2
                    class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Cadastro
                </h2>
                <p class="text-sm text-gray-500 mb-8">Crie sua conta para começar.</p>
                <!-- Mensagem de erro -->
                <p v-if="error" class="text-sm text-red-500 mb-4">{{ error }}</p>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Linha 1: Nome Completo e CPF -->
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                        <input v-model="formData.nomeCompleto" type="text" required
                            placeholder="Digite seu nome completo"
                            class="text-gray-700 mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                        <input v-model="formData.cpf" v-mask="'###.###.###-##'" type="text" required
                            placeholder="000.000.000-00"
                            class="text-gray-700 mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400" />
                    </div>
                </div>

                <!-- Linha 2: Data de Nascimento e Email -->
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                        <div class="relative">
                            <input v-model="formData.dataNascimento" type="date" required
                                class="mt-1 block w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none text-gray-700 bg-white" />
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input v-model="formData.email" type="email" required placeholder="Digite seu email"
                            class="text-gray-700 mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400" />
                    </div>
                </div>

                <!-- Linha 3: Senha e Confirmar Senha -->
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Senha (mínimo 6 caracteres)</label>
                        <input v-model="formData.senha" type="password" required minlength="6"
                            placeholder="Digite sua senha"
                            class="text-gray-700 mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                        <input v-model="formData.confirmacaoSenha" type="password" required minlength="6"
                            placeholder="Confirme sua senha"
                            class="text-gray-700 mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400" />
                    </div>
                </div>

                <!-- Botão de Cadastro -->
                <button type="submit" :disabled="isLoading"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
                </button>

                <!-- Link para Login -->
                <div class="text-center mt-6">
                    <span class="text-sm text-gray-600">Já tem uma conta? </span>
                    <router-link to="/login" class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                        Faça login
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import VueTheMask from 'vue-the-mask'

const router = useRouter();
const { register, error, isLoading } = useAuth();

const formData = ref({
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
});

const handleSubmit = async () => {
    const success = await register(formData.value);
    if (success) {
        router.push('/login');
    }
};
</script>

<style scoped>
/* Estilos personalizados */
</style>