
const getters = {
  routes: state => state.permission.routes,
  addroutes: state => state.permission.addroutes,
  token: state => state.user.token,
  portrait: state => state.user.portrait,
  name: state => state.user.name,
  menus: state => state.user.menus
}

export default getters
