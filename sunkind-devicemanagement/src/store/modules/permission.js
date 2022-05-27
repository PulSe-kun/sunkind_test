import { routes } from '@/router'
import Layout from '@/layouts/index.vue'
import { getUserPermission } from '@/services/api_user'
function getAllTreeList(list) {
  list.map(item => {
    if (item.leaf) {
      item.component = 'layout'
      item.children = [
        {
          children: [],
          name: item.name,
          path: item.path,
          filePath: item.filePath,
          menuIcon: require('../../assets/icon/' + item.menuIcon + '.png'),
          menuIconSelect: require('../../assets/icon_select/' + item.menuIconSelect + '.png'),
          hidden: false,
          meta: {
            title: item.meta.title
          },
          component: ''
        }
      ]
    } else {
      item.menuIcon = require('../../assets/icon/' + item.menuIcon + '.png')
      item.menuIconSelect = require('../../assets/icon_select/' + item.menuIconSelect + '.png')
    }
  })
}
const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, route) => {
      state.addroutes = route
      state.routes = route.concat(routes)
    },
    RESET_ROUTES(state, route) {
      state.addroutes = []
      state.routes = []
    }
  },
  actions: {
    GenerateRoutes({ commit }, id) {
      return new Promise(resolve => {
        getUserPermission().then(res => {
          let router_data = []
          for (let i = 0; i < res.data.menuTree.length; i++) {
            if (id == res.data.menuTree[i].id) {
              if (res.data.menuTree[i].parentId == 'root') {
                router_data = res.data.menuTree[i].children
                getAllTreeList(router_data)
              }
            }
          }
          // console.log('!!!!',router_data)
          router_data.unshift({
            children: [
              {
                children: [],
                name: '首页',
                path: '/DeviceHome',
                filePath: '/DeviceHome',
                menuIcon: require('../../assets/icon/icon_1.png'),
                menuIconSelect: require('../../assets/icon_select/icon_select_1.png'),
                hidden: false,
                meta: {
                  title: '首页'
                },
                component: ''
              }
            ],
            path: '/',
            leaf: true,
            filePath: '/DeviceHome',
            redirect: '/DeviceHome',
            component: 'layout'
          })
          const accessedRoutes = filterAsyncRouter(router_data)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    }
  }
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  // console.log(asyncRouterMap)
  return asyncRouterMap.filter(route => {
    // Layout组件特殊处理
    if (route.component === 'layout') {
      route.component = Layout
    } else {
      route.component = loadView(route.filePath)
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@/pages${view}` + '/index.vue'], resolve)
}
export default permission
