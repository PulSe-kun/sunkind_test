import http from '../utils/http'
import qs from 'qs'
const resquest = '/api'
/**
 * 仓库使用率
 * @returns
 */
export function getUseBasic(id) {
  return http.get(`${resquest}/basicConfig/home/${id}`)
}
/**
 * 出入库走势图
 * @param {*} id
 * @returns
 */
export function getchart(id) {
  return http.get(`${resquest}/basicConfig/home/chart/${id}`)
}
/**
 * 首页查询出入库队列信息
 * @param {*} params
 * @returns
 */
export function getPutOrOut(params) {
  return http.post(`${resquest}/basicConfig/home/getPutOrOutList`, qs.stringify(params))
}
/**
 * 加载所有仓库
 * @returns
 */
export function getWarehouse() {
  return http.get(`${resquest}/basicConfig/storagebin/getWarehouse`)
}
/**
 * 首页故障列表信息
 * @param {*} params
 * @returns
 */
export function getFaultList(params) {
  return http.post(`${resquest}/basicConfig/home/getFaultList`, qs.stringify(params))
}
