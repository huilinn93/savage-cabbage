import { createRouter, createWebHistory } from 'vue-router'

const routers = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/instructions:tid?',
      name: 'instructions',
      component: () => import('@/views/Instructions.vue'),
    },
    {
      path: '/question:tid?:qid?',
      name: 'question',
      component: () => import('@/views/Question.vue'),
    },
    {
      path: "/:catchAll(.*)*",
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: "/allImages",
      component: () => import('@/views/MainScreen.vue'),
    },
  ],
})

export default routers
