import { routes } from '@/router'
import { getUserPermission } from '@/services/api_user'
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
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getUserPermission().then(res => {
          console.log(res)
          // let router_data = [];
          // for (let i = 0; i < res.data.menuTree.length; i++) {
          //   if (res.data.menuTree[i].parentId == "root") {
          //     router_data = res.data.menuTree[i].children;
          //   }
          // }
          // const accessedRoutes = filterAsyncRouter(router_data);
          // commit('SET_ROUTES', accessedRoutes)
          // resolve(accessedRoutes)
        })
      })
    }
  }
}
export default permission
