import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Signup.vue')
    },
    {
      path: '/todo',
      name: 'TodoList',
      component: () => import('../views/ToDoList.vue')
    }
  ]
})

export default router
