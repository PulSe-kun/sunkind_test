import router from './router'
import store from './store'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken, getToken, removeToken } from '@/utils/auth' // get token from cookie
NProgress.configure({ showSpinner: false })
// 可访问的白名单
// const whiteList = ['/login']
/** 获取路由上的参数 */
function getQueryVariable(variable) {
  var search = window.location.search.substring(1)
  if (!search) {
    search = window.location.hash.split('?')[1]
  }
  if (search) {
    var obj = JSON.parse(
      '{"' +
        decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    )
    return variable ? obj[variable] : obj
  }
}
// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log(getQueryVariable('id'), getQueryVariable('token'))
  let hasToken = ''
  if (getQueryVariable('token')) {
    hasToken = setToken(getQueryVariable('token'))
  } else {
    hasToken = getToken()
  }
  if (getQueryVariable('id')) {
    localStorage.setItem('systemId', getQueryVariable('id'))
  }
  NProgress.start()
  /**
   * 判断是否存在cookie
   */
  console.log(hasToken, localStorage.getItem('systemId'))
  if (hasToken && localStorage.getItem('systemId')) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next('/')
      NProgress.done()
    } else {
      // TODO 授权过期后重复打开登陆弹窗
      const hasGetUserInfo = store.getters.name
      console.log(hasGetUserInfo)
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 拉取用户信息
          await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('GenerateRoutes', localStorage.getItem('systemId'))
          router.addRoutes(accessRoutes)
          console.log(accessRoutes)
          // console.log(router, accessRoutes)
          next({ ...to, replace: true })
        } catch {
          console.log('router.beforeEach() error: ')
          NProgress.done()
        }
      }
    }
  } else {
    NProgress.done()
    window.localStorage.clear()
    window.sessionStorage.clear()
    removeToken()
    window.location.href = process.env.VUE_APP_URL
  }
})
router.afterEach(() => {
  NProgress.done()
})
