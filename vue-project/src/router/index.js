import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Products from '../pages/Products.vue'
import Info from '../pages/Info.vue'
import Profile from '../pages/Profile.vue'
import Settings from '../pages/Settings.vue'
import Contacts from '../pages/Contacts.vue'
import AdminConsole from '../pages/AdminConsole.vue'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/info', component: Info },
  { path: '/profile', component: Profile },
  { path: '/settings', component: Settings },
  { path: '/contacts', component: Contacts },
  { path: '/admin', component: AdminConsole, meta: { requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    const user = auth.currentUser
    if (!user) {
      return next('/profile')
    }
    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (userDoc.exists() && userDoc.data().role === "admin") {
      return next()
    } else {
      return next('/')
    }
  }
  next()
})

export default router
