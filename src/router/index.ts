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
      path: '/introduction:tid?',
      name: 'introduction',
      component: () => import('@/views/Introduction.vue'),
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
