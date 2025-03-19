<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AuthLayout from '../layouts/AuthLayout.vue';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
    email: '',
    senha: ''
});

const handleLogin = async () => {
    const success = await authStore.login(formData.value.email, formData.value.senha);
    if (success) {
        router.push('/dashboard');
    }
};
</script>

<template>
    <AuthLayout>
        <div class="text-center">
            <h2
                class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Bem-vindo de Volta!
            </h2>
            <p class="text-sm text-gray-500 mb-8">Faça login para acessar sua conta.</p>
            <!-- Mensagem de erro -->
            <p v-if="authStore.error" class="text-sm text-red-500 mb-4">{{ authStore.error }}</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input v-model="formData.email" type="email" required placeholder="Digite seu email"
                    class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input v-model="formData.senha" type="password" required placeholder="Digite sua senha"
                    class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400" />
            </div>
            <button type="submit" :disabled="authStore.isLoading"
                class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ authStore.isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
            <div class="text-center mt-4">
                <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                    Esqueceu sua senha?
                </a>
            </div>
            <div class="text-center mt-6">
                <span class="text-sm text-gray-600">Não tem uma conta? </span>
                <router-link to="/register" class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                    Cadastre-se
                </router-link>
            </div>
        </form>
    </AuthLayout>
</template>