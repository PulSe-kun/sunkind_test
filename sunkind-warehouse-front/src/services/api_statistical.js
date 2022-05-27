import http from '../utils/http'
import qs from 'qs'
const resquest = '/api'
/** 统计分析 */
/**
 * 所属仓库下拉选项
 * @returns
 */
export function getWareHouseList() {
  return http.get(`${resquest}/basicConfig/feeder/getWareHouseList`)
}
/**
 * 加载所有料架和对应的库位
 * @param {*} id
 * @returns
 */
export function findFeeders(id) {
  return http.get(`${resquest}/basicConfig/storagebin/findFeeders/${id}`)
}
/**
 * 查询库位信息
 * @param {*} id
 * @returns
 */
export function findInfo(id) {
  return http.get(`${resquest}/basicConfig/storagebin/findInfo/${id}`)
}
/**
 * 物料类型树形结构
 * @param {*} id
 * @returns
 */
export function typeTree(id) {
  return http.get(`${resquest}/basicConfig/mattertype/typeTree`)
}
/**
 * 库存查询——分页
 * @param {*} params
 * @returns
 */
export function pageMatter(params) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/pageMatter`, params)
}
/**
 * 查询物料分布
 * @param {*} id
 * @returns
 */
export function getDistribution(id) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/getDistribution/${id}`)
}
/**
 * 出入库记录分页
 * @param {*} params
 * @returns
 */
export function page(params) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/page`, params)
}
