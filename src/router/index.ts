import { createRouter, createWebHistory } from 'vue-router'
import BasicEditor from '../views/BasicEditor.vue'
import MultiEditors from '../views/MultiEditors.vue'
import Lifecycle from '../views/Lifecycle.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/basic' },
    { path: '/basic', name: 'basic', component: BasicEditor },
    { path: '/multi-editors', name: 'multi-editors', component: MultiEditors },
    { path: '/lifecycle', name: 'lifecycle', component: Lifecycle },
  ],
})

export default router
