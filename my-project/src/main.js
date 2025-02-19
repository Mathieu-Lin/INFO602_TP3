import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';  // Assurez-vous que vous importez le bon fichier router.js
/* eslint-disable vue/multi-word-component-names */
createApp(App)
    .use(router)  // Utilisez le router
    .mount('#app');
