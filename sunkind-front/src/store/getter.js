const getters = {
  routes: state => state.permission.routes,
  addroutes: state => state.permission.addroutes,
  token: state => state.user.token,
  name: state => state.user.name,
  id: state => state.user.id
}

export default getters
