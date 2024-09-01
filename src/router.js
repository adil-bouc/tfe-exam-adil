import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/province/:id',
    name: 'Province',
    component: () => import('./views/Province.vue')
  },
  // Modifiez cette route pour utiliser le chargement dynamique
  {
    path: '/:provinceName/studio/:studioId',
    name: 'StudioDetail',
    component: () => import('./views/StudioDetail.vue'),
    props: true
  },
  // Route pour la page 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router