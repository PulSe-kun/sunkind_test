import http from '../utils/http'
const resquest = '/api'
/**
 * 登录
 * @param {login} data
 * @returns
 */
export function login(data) {
  const params = new URLSearchParams()
  params.append('username', data.username)
  params.append('password', data.password)
  // params.append('grant_type', data.grant_type)
  return http.post(`${resquest}/admin/baseUsers/auth`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
/**
 * 登出
 */
export function logout() {
  return http.delete(`${resquest}/auth/token/removeToken`)
}

/**
 *
 *修改密码
 * @export
 * @param {*} params
 * @return {*}
 */
export function modifyPassword(params) {
  return http.put(`${resquest}/admin/baseUsers/password`, params)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get(`${resquest}/admin/baseUsers/info`)
}

/**
 * 获取用户权限
 */
export function getUserPermission() {
  return http.get(`${resquest}/admin/baseUsers/permission`)
}
