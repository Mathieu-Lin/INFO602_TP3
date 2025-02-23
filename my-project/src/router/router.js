// router/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Preliminaires from '../components/Preliminaires.vue';
import Johnson from '../components/Johnson.vue';
import Maintenance from "../components/Maintenance.vue";
import CasGeneral from "../components/CasGeneral.vue";

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
    {
        path: '/casgeneral',
        name: 'CasGeneral',
        component: CasGeneral,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
