import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './components/LoginView.vue';
import RegisterView from './components/RegisterView.vue';
import DashboardView from './components/DashboardView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresAuth: false }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: { requiresAuth: false }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
            meta: { requiresAuth: true }
        }
    ]
});

// Guarda de navegação
router.beforeEach((to, from, next) => {
    // Adicionar um pequeno delay para garantir que o localStorage foi atualizado
    setTimeout(() => {
        const isAuthenticated = !!localStorage.getItem('user_data');
        const requiresAuth = to.meta.requiresAuth;

        console.log('Navegação:', {
            to: to.path,
            isAuthenticated,
            requiresAuth,
            userData: localStorage.getItem('user_data')
        });

        if (requiresAuth && !isAuthenticated) {
            console.log('Redirecionando para login: usuário não autenticado');
            next({ name: 'login' });
        } else if (!requiresAuth && isAuthenticated && (to.name === 'login' || to.name === 'register')) {
            console.log('Redirecionando para dashboard: usuário já autenticado');
            next({ name: 'dashboard' });
        } else {
            next();
        }
    }, 100); // pequeno delay para garantir sincronização
});

export default router;
