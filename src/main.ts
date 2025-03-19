import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ToastPlugin from 'vue-toast-notification';
import VueTheMask from 'vue-the-mask'
import 'vue-toast-notification/dist/theme-default.css';
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ToastPlugin);
app.use(VueTheMask);

app.mount('#app');
