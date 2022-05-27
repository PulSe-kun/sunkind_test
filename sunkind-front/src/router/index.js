import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    redirect: {
      path: '/sunkind-home'
    }
  },
  {
    name: '登录',
    path: '/login',
    component: resolve => require(['@/pages/login/index.vue'], resolve)
  },
  {
    name: '平台首页',
    path: '/sunkind-home',
    component: resolve => require(['@/pages/sunkind-home/index.vue'], resolve)
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
