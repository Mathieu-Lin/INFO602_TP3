// router/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Preliminaires from '../components/Preliminaires.vue';
import Johnson from '../components/Johnson.vue';
import Maintenance from "../components/Maintenance.vue";

const routes = [
    {
        path: '/preliminaires',
        name: 'Preliminaires',
        component: Preliminaires,
    },
    {
        path: '/johnson',
        name: 'Johnson',
        component: Johnson,
    },
    {
        path: '/maintenance',
        name: 'Maintenance',
        component: Maintenance,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
