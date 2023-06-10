import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/introduction',
      name: 'introduction',
      component: () => import('@/views/Introduction.vue'),
    },
    {
      path: '/:id/question/:id',
      name: 'question',
      component: () => import('@/views/Question.vue'),
    },
    {
      path: "/:catchAll(.*)",
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})
