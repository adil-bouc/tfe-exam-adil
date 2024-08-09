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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router