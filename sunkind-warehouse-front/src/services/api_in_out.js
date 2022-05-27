import http from '../utils/http'
import qs from 'qs'
const resquest = '/api'

/**
 * 获取托盘入库列表
 * @param {*} id
 * @returns
 */
export function getPutList(id) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/getPutList/${id}`)
}
/**
 * 获取托盘出库列表
 * @param {*} id
 * @returns
 */
export function getOutList(id) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/getOutList/${id}`)
}
/**
 * 更改出入库状态
 * @param {*} params
 * @returns
 */
export function updateStatus(params) {
  return http.post(`${resquest}/basicConfig/warehousingrecord/updateStatus`, qs.stringify(params))
}
/**
 * 托盘编码验证和托盘是否已在库的状态验证
 * @param {*} id
 * @returns
 */
export function findPalletCode(id, type) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/findPalletCode?code=${id}&type=${type}`)
}
/**
 * 根据托盘查询解绑物料
 * @param {*} id
 * @returns
 */
export function getMatterbindings(id) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/getMatterbindings/${id}`)
}
/**
 * 查询物料
 * @param {*} id
 * @returns
 */
export function getMatters(id, type) {
  let typeValue
  if (type == 'matterId') {
    typeValue = 'matterId'
  } else {
    typeValue = 'conditions'
  }
  return http.get(`${resquest}/basicConfig/warehousingrecord/getMatters?${typeValue}=${id}`)
}
/**
 * 绑定物料并返回自动匹配的料架和库位
 * @param {*} params
 * @returns
 */
export function matterBindingNew(params) {
  return http.post(`${resquest}/basicConfig/warehousingrecord/matterBindingNew`, params)
}
/**
 * 获取对应仓库的传送线
 * @param {*} params
 * @returns
 */
export function findConveyers(params) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/findConveyers`, params)
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
 * 托盘入库  回库
 * @param {*} params
 * @returns
 */
export function putStorage(params) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/putStorage`, params)
}
/**
 * 空托盘入库时自动分配料架和库位
 * @param {*} id
 * @returns
 */
export function getFeederAndStragebin(id) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/getFeederAndStragebin/${id}`)
}
/**
 * 选择出库托盘列表
 * @param {*} params
 * @returns
 */
export function pagePallet(params) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/pagePallet`, params)
}
/**
 * 托盘出库
 * @param {*} params
 * @returns
 */
export function outbound(params) {
  return http.post(`${resquest}/basicConfig/warehousingrecord/outbound`, params)
}

/** 出库解绑物料 */
export function unbundlingNew(params) {
  return http.post(`${resquest}/basicConfig/warehousingrecord/unbundlingNew`, params)
}
/**
 * 回库时查询库位、传送线、托盘信息
 * @param {*} id
 * @returns
 */
export function getReturnStoragebinInof(id) {
  return http.get(`${resquest}/basicConfig/warehousingrecord/getReturnStoragebinInof/${id}`)
}

/** 解绑物料 */
export function unbundling(params) {
  return http.post(`${resquest}/basicConfig/warehousingrecord/unbundling`, params)
}
/** 解绑物料 */
export function canPallent(params) {
  return http.post(`${resquest}/basicConfig/pallet/canPallent`, qs.stringify(params))
}
