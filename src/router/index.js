import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import BranchesView from '../views/BranchesView.vue'
import NewBranch from '../views/NewBranch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/branches',
      name: 'branches',
      component: BranchesView
    },
    {
      path: '/new',
      name: 'new',
      component: NewBranch
    }
  ]
})

export default router
