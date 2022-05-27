import Vue from 'vue'
import VueRouter from 'vue-router'
// import Layout from '@/layout/index.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

export const routes = [
  // {
  //   name: 'wellocome',
  //   path: '/HelloWorld',
  //   hidden: true,
  //   component: resolve => require(['@/components/HelloWorld.vue'], resolve)
  // },
  // {
  //   name: 'layout',
  //   path: '/',
  //   hidden: true,
  //   redirect: '/DeviceHome',
  //   component: resolve => require(['@/layouts/index.vue'], resolve),
  // },

]

const createRouter = () => new VueRouter({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  console.log(newRouter)
  router.matcher = newRouter.matcher // the relevant part
}

export default router
