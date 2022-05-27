import http from '../utils/http'
import qs from 'qs'
const resquest = '/api'
/**
 * 仓库管理数据
 * @param {*} params
 * @returns
 */
export function warehousePage(params) {
  return http.get(`${resquest}/basicConfig/warehouse/page`, params)
}
/**
 * 新建仓库信息
 * @param {*} params
 * @returns
 */
export function add_warehouse(params) {
  return http.post(`${resquest}/basicConfig/warehouse`, params)
}
/**
 * 编辑仓库
 * @param {*} params
 * @returns
 */
export function compile_warehouse(params) {
  return http.put(`${resquest}/basicConfig/warehouse`, params)
}
/** 删除仓库 */
export function isDelete(id) {
  return http.get(`${resquest}/basicConfig/warehouse/isDelete/${id}`)
}
/**
 * 获取仓库管理员列表
 * @returns
 */
export function getUserList() {
  return http.get(`${resquest}/basicConfig/warehouse/getUserList`)
}
/**
 * 获取料架数据
 * @param {*} params
 * @returns
 */
export function feederPage(params) {
  return http.get(`${resquest}/basicConfig/feeder/page`, params)
}
/**
 * 新建料架
 * @param {*} params
 * @returns
 */
export function add_feeder(params) {
  return http.post(`${resquest}/basicConfig/feeder`, params)
}
/**
 * 编辑料架
 * @param {*} params
 * @returns
 */
export function compile_feeder(params) {
  return http.put(`${resquest}/basicConfig/feeder`, params)
}
/**
 * 删除料架
 * @param {*} id
 * @returns
 */
export function isDelete_feeder(id) {
  return http.get(`${resquest}/basicConfig/feeder/isDelete/${id}`)
}
/**
 * 获取传送线数据
 * @param {*} params
 * @returns
 */
export function conveyerPage(params) {
  return http.get(`${resquest}/basicConfig/conveyer/page`, params)
}
/**
 * 新增传送线
 * @param {*} params
 * @returns
 */
export function add_conveyer(params) {
  return http.post(`${resquest}/basicConfig/conveyer`, params)
}
/**
 * 编辑传送线
 * @param {*} params
 * @returns
 */
export function compile_conveyer(params) {
  return http.put(`${resquest}/basicConfig/conveyer`, params)
}
/**
 * 删除传送线
 * @param {*} id
 * @returns
 */
export function isDelete_conveyer(id) {
  return http.get(`${resquest}/basicConfig/conveyer/isDelete/${id}`)
}
/** 编辑库位 */
export function storagebin(params) {
  return http.put(`${resquest}/basicConfig/storagebin`, params)
}
/**
 * 获取物料管理数据
 * @param {*} params
 * @returns
 */
export function matterPage(params) {
  return http.get(`${resquest}/basicConfig/matter/page`, params)
}
/**
 * 获取托盘管理数据
 * @param {*} params
 * @returns
 */
export function palletPage(params) {
  return http.get(`${resquest}/basicConfig/pallet/page`, params)
}
/**
 * 托盘编码随机数
 * @param {*} params
 * @returns
 */
export function findRandomNumber() {
  return http.get(`${resquest}/basicConfig/pallet/findRandomNumber`)
}
/** 新增托盘 */
export function add_pallet(params) {
  return http.post(`${resquest}/basicConfig/pallet`, params)
}
/** 编辑托盘 */
export function compile_pallet(params) {
  return http.put(`${resquest}/basicConfig/pallet`, params)
}
/**
 * 删除托盘
 * @param {*} id
 * @returns
 */
export function isDelete_pallet(id) {
  return http.get(`${resquest}/basicConfig/pallet/isDelete/${id}`)
}
/**
 * 新增物料类型
 * @param {*} params
 * @returns
 */
export function add_mattertype(params) {
  return http.post(`${resquest}/basicConfig/mattertype`, params)
}
/**
 * 编辑物料类型
 * @param {*} params
 * @returns
 */
export function compile_mattertype(params) {
  return http.put(`${resquest}/basicConfig/mattertype`, params)
}
/**
 * 删除物料类型
 * @param {*} id
 * @returns
 */
export function isDelete_mattertype(id) {
  return http.get(`${resquest}/basicConfig/mattertype/isDelete/${id}`)
}
/**
 * 新增物料
 * @param {*} params
 * @returns
 */
export function add_matter(params) {
  return http.post(`${resquest}/basicConfig/matter`, params)
}
/**
 * 编辑物料
 * @param {*} params
 * @returns
 */
export function compile_matter(params) {
  return http.put(`${resquest}/basicConfig/matter`, params)
}
/**
 * 删除物料
 * @param {*} id
 * @returns
 */
export function isDelete_matter(id) {
  return http.get(`${resquest}/basicConfig/matter/isDelete/${id}`)
}

/**
 * 导入物料
 * @param {*} params
 * @returns
 */
export function upload_matter(params) {
  return http.post(`${resquest}/basicConfig/matter/upload`, params)
}
/**
 * 导入物料失败数据
 * @param {*} params
 * @returns
 */
export function matterfail(params) {
  return http.get(`${resquest}/basicConfig/matterfail/page`, params)
}
/**
 * 导出物料
 * @param {*} params
 * @returns
 */
export function exportmatter(params) {
  return http.get(`${resquest}/basicConfig/matterfail/export`, params)
}
