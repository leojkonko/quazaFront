<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { logout } = useAuth();

const handleLogout = async () => {
    const success = await logout();
    if (success) {
        router.push('/login');
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
        <!-- Cabeçalho -->
        <header class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
                        <p class="mt-2 text-indigo-200">Bem-vindo de volta! Aqui está um resumo das suas atividades.</p>
                    </div>
                    <button @click="handleLogout"
                        class="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 transition-colors duration-200 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L11.586 7H6a1 1 0 1 1 0-2h5.586L8.293 1.707a1 1 0 0 1 1.414-1.414L14 4.586v2.828z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Conteúdo Principal -->
        <main class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
            <div class="px-4 sm:px-0">
                <!-- Mensagem de Sucesso -->
                <div class="mb-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-sm">
                    <p class="text-green-700 font-medium">✅ Login efetuado com sucesso!</p>
                </div>

                <!-- Cards Informativos -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Card 1: Total de Usuários -->
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-semibold text-gray-900">Total de Usuários</h2>
                                <p class="mt-2 text-3xl font-bold text-indigo-600">1,234</p>
                            </div>
                            <div class="p-3 bg-indigo-50 rounded-full">
                                <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-gray-500">Número total de usuários registrados.</p>
                    </div>

                    <!-- Card 2: Novos Pedidos -->
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-semibold text-gray-900">Novos Pedidos</h2>
                                <p class="mt-2 text-3xl font-bold text-purple-600">56</p>
                            </div>
                            <div class="p-3 bg-purple-50 rounded-full">
                                <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-gray-500">Pedidos recebidos nos últimos 7 dias.</p>
                    </div>

                    <!-- Card 3: Taxa de Conversão -->
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-semibold text-gray-900">Taxa de Conversão</h2>
                                <p class="mt-2 text-3xl font-bold text-green-600">12.5%</p>
                            </div>
                            <div class="p-3 bg-green-50 rounded-full">
                                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-gray-500">Aumento em relação ao mês anterior.</p>
                    </div>
                </div>

                <!-- Gráfico ou Outras Informações -->
                <div class="mt-8 bg-white p-6 rounded-lg shadow-lg">
                    <h2 class="text-xl font-semibold text-gray-900">Atividades Recentes</h2>
                    <p class="mt-2 text-gray-500">Aqui estão as últimas atividades registradas.</p>
                    <div class="mt-4 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <span class="text-gray-400">Gráfico ou tabela aqui</span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>