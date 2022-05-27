const getters = {
  routes: state => state.permission.routes,
  addroutes: state => state.permission.addroutes,
  token: state => state.user.token,
  id: state => state.user.id,
  portrait: state => state.user.portrait,
  name: state => state.user.name,
  menus: state => state.user.menus,
  warehouseId: state => state.warehouse.warehouseId
}

export default getters
