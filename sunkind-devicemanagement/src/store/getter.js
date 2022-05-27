
const getters = {
  routes: state => state.permission.routes,
  addroutes: state => state.permission.addroutes,
  token: state => state.user.token,
  id: state => state.user.id,
  name: state => state.user.name,
  menus: state => state.user.menus,
  selectedRows: state => state.data.selectedRows
}

export default getters
