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
            component: LoginView
        },
        {
            path: '/register',
            component: RegisterView
        },
        {
            path: '/dashboard',
            component: DashboardView
        }
    ]
});

export default router;
