import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

export const routes = [
  {
    name: '登录',
    path: '/login',
    hidden: true,
    component: resolve => require(['@/pages/login/index.vue'], resolve)
  }
]

const createRouter = () =>
  new VueRouter({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

const router = createRouter()

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

export default router
