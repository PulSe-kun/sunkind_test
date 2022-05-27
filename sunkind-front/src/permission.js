import router from './router'
import store from './store'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, removeToken } from '@/utils/auth' // get token from cookie
NProgress.configure({ showSpinner: false })
// 可访问的白名单
const whiteList = ['/login']
// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  /**
   * 判断是否存在cookie
   */
  const hasToken = getToken()
  // console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      window.localStorage.clear()
      window.sessionStorage.clear()
      removeToken()
      next({ path: '/' })
      NProgress.done()
    } else {
      // TODO 授权过期后重复打开登陆弹窗
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        // debugger
        try {
          // 拉取用户信息
          console.log(111)
          await store.dispatch('user/getInfo')
          next()
        } catch {
          console.log('router.beforeEach() error: ')
          NProgress.done()
        }
      }
    }
  } else {
    // NProgress.done()
    window.localStorage.clear()
    window.sessionStorage.clear()
    removeToken()
    // next('/login')
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
