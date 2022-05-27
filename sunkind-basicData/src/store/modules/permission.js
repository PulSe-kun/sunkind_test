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
    addroutes: []
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
      return new Promise((resolve, reject) => {
        getUserPermission().then(res => {
          // console.log(id)
          console.log(res)
          // console.log(111, res, console.log(localStorage.getItem('systemId')))
          let router_data = []
          for (let i = 0; i < res.data.menuTree.length; i++) {
            if (id == res.data.menuTree[i].id) {
              if (res.data.menuTree[i].parentId === 'root') {
                router_data = res.data.menuTree[i].children
                getAllTreeList(router_data)
              }
            }
          }
          // 向后端请求路由数据
          // router_data = [
          //   {
          //     "children": [
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "组织管理",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'user-management/organization-management/index',
          //         "path": "organization-management",
          //         "component": " "
          //       },
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "人员管理",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'user-management/personnel-management/index',
          //         "path": "personnel-management",
          //         "component": " "
          //       },
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "角色管理",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'user-management/role-management/index',
          //         "path": "role-management",
          //         "component": " "
          //       },
          //     ],
          //     "createDate": "",
          //     "icon": require('../../assets/img/menu/icon2_n.png'),
          //     "icon_select": require('../../assets/img/menu/icon2.png'),
          //     "menuType": 0,
          //     "meta": {
          //       "title": "用户管理",
          //     },
          //     "parentName": "",
          //     "permissions": "",
          //     "pid": 0,
          //     "sort": 0,
          //     "type": 0,
          //     "path": "/user-management",
          //     "component": "Layout"
          //   },
          //   {
          //     "children": [
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "操作日志",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'system-monitoring/operation-log/index',
          //         "path": "operation-log",
          //         "component": " "
          //       }
          //     ],
          //     "createDate": "",
          //     "icon": require('../../assets/img/menu/icon2_n.png'),
          //     "icon_select": require('../../assets/img/menu/icon2.png'),
          //     "menuType": 0,
          //     "meta": {
          //       "title": "系统监控",
          //     },
          //     "parentName": "",
          //     "permissions": "",
          //     "pid": 0,
          //     "sort": 0,
          //     "type": 0,
          //     "path": "/system-monitoring",
          //     "component": "Layout"
          //   },
          //   {
          //     "children": [
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "系统选项",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'system-settings/system-options/index',
          //         "path": "system-options",
          //         "component": " "
          //       },
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "数据字典",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'system-settings/data-dictionary/index',
          //         "path": "data-dictionary",
          //         "component": " "
          //       },
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "系统管理",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'system-settings/system-management/index',
          //         "path": "system-management",
          //         "component": " "
          //       },
          //       {
          //         "children": [],
          //         "createDate": "",
          //         "icon": " ",
          //         "menuType": 0,
          //         "meta": {
          //           "title": "菜单管理",
          //         },
          //         "parentName": "",
          //         "permissions": "",
          //         "pid": 0,
          //         "sort": 0,
          //         "type": 0,
          //         "filePath": 'system-settings/menu-management/index',
          //         "path": "menu-management",
          //         "component": " "
          //       }
          //     ],
          //     "createDate": "",
          //     "icon": require('../../assets/img/menu/icon2_n.png'),
          //     "icon_select": require('../../assets/img/menu/icon2.png'),
          //     "menuType": 0,
          //     "meta": {
          //       "title": "系统设置",
          //     },
          //     "parentName": "",
          //     "permissions": "",
          //     "pid": 0,
          //     "sort": 0,
          //     "type": 0,
          //     "path": "/system-settings",
          //     "component": "Layout"
          //   },
          // ];
          router_data.unshift({
            children: [
              {
                children: [],
                menuIcon: require('../../assets/icon/icon_1.png'),
                menuIconSelect: require('../../assets/icon_select/icon_select_1.png'),
                menuType: 0,
                meta: {
                  title: '首页'
                },
                type: 0,
                filePath: '/basicdata-home',
                path: '/basicdata-home',
                component: ''
              }
            ],
            leaf: true,
            path: '/',
            filePath: '/basicdata-home',
            redirect: '/basicdata-home',
            component: 'layout'
          })
          // router_data.unshift(router_data)
          // console.log(router_data)
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
