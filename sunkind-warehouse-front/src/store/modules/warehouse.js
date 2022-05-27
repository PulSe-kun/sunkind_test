const warehouse = {
  state: {
    warehouseId: ''
  },
  mutations: {
    WAREHOUSEID: (state, name) => {
      state.warehouseId = name
    }
  },
  actions: {
    warehouseId({ commit }, name) {
      commit('WAREHOUSEID', name)
    }
  }
}
export default warehouse
