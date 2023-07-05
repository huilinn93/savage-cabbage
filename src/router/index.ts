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
      path: '/question:tid?:qid?',
      name: 'question',
      component: () => import('@/views/Question.vue'),
    },
    {
      path: "/endHunt",
      component: () => import('@/views/EndHunt.vue'),
    },
    {
      path: "/allImages",
      component: () => import('@/views/MainScreen.vue'),
    },
    {
      path: "/:catchAll(.*)*",
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

export default routers
