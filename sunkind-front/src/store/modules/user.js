import { login, logout, getUserInfo, getUserPermission } from '@/services/api_user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  // 用户姓名
  name: '',
  // 用户头像
  id: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // 用户登陆
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, grant_type: 'password' })
        .then(response => {
          if (response.data.access_token) {
            commit('SET_TOKEN', response.data.access_token)
            setToken(response.data.access_token)
          }
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token)
        .then(response => {
          console.log(response)
          if (!response) {
            reject('获取用户信息失败，请重新登陆！')
          }
          commit('SET_NAME', response.data.baseUser.name)
          commit('SET_ID', response.data.baseUser.id)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(response => {
          console.log(response)
          commit('SET_TOKEN', '')
          // 清楚用户权限缓存
          // localStorage.removeItem('menuPermission')
          // localStorage.removeItem('buttonPermission')
          window.localStorage.clear()
          window.sessionStorage.clear()
          commit('SET_NAME', '')
          commit('SET_ID', '')
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
