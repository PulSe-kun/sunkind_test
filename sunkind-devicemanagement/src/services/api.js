import http from '../utils/http'
import qs from 'qs'
const base = '/api/cm' // 设备管理接口Mock地址
const base1 = '/api/admin' // 基础数据中心接口Mock地址

/**
 * 批量上传图片(更新)
 * @param {*} searchId
 * @param {*} files
 * @returns
 */
export function uploadImages(files) {
  return http.post(`${base}/attachment/upload/batch`, files, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 批量上传图片(更新)
 * @param {*} searchId
 * @param {*} files
 * @returns
 */
export function updateImages(searchId, files) {
  return http.post(`${base}/attachment/upload/batch/${searchId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
/**
 * 删除图片
 */
export function delByIdsImages(params) {
  return http.post(`${base}/attachment/delByIds/`, params)
}

/**
 * 根据searchId获取附件列表
 * @param {*} searchId
 * @returns
 */
export function getBatchImages(searchId) {
  return http.get(`${base}/attachment/att/${searchId}`)
}

/**
 * 获取四个状态的数量(首页)
 * @param {*} params
 * @returns
 */
export function getOrdersNum() {
  return http.get(`${base}/home_page/workorder`)
}
/**
 * 获取设备三个状态的数量(首页)
 * @param {*} params
 * @returns
 */
export function getEquipmentNum() {
  return http.get(`${base}/home_page/equipment`)
}
/**
 * 获取工单折线图的数据(首页)
 * @param {*} params
 * @returns
 */
export function getWorkOrderData() {
  return http.get(`${base}/home_page/workorder_total_count`)
}

// 设备下拉列表
export function getDeviceSelect(value) {
  // console.log(value)
  let name = ''
  if (value !== undefined) {
    name = value
  }
  return http.get(`${base}/equipment/list?like=${name}`)
}
/**
 * 设备模块
 * 设备树形列表
 * @param {*} param
 * @returns
 */
export function getDeviceTree() {
  return http.get(`${base}/equipment_type/type/tree`)
}
/**
 * 设备类型列表
 * @returns
 */
export function getDeviceData() {
  return http.get(`${base}/equipment_type/list`)
}

/**
 * 设备类型新增
 * @param {*} params
 * @returns
 */
export function addDeviceType(params) {
  return http.post(`${base}/equipment_type`, params)
}

/**
 * 设备类型更新
 * @param {*} params
 * @returns
 */
export function ediDeviceType(id, params) {
  return http.put(`${base}/equipment_type/${id}`, params)
}

/**
 * 设备类型删除
 * @param {*} params
 * @returns
 */
export function deleteDeviceType(id) {
  return http.delete(`${base}/equipment_type/${id}`)
}
/**
 * 设备管理table数据
 * @param {*} params
 * @returns
 */
export function getDeviceTable(params) {
  return http.get(`${base}/equipment`, params)
}
/**
 * 删除设备
 * @param {*} id
 * @returns
 */
export function canDelete(id) {
  return http.get(`${base}/equipment/canDelete?id=${id}`)
}

/**
 * 删除设备类型
 * @param {*} id
 * @returns
 */
export function equipment_type_canDelete(id) {
  return http.get(`${base}/equipment_type/canDelete?id=${id}`)
}

/**
 * 新增设备
 * @param {*} params
 * @returns
 */
export function addDevice(params) {
  return http.post(`${base}/equipment/insert`, params)
}
/**
 * 更新设备
 * @param {*} id
 * @param {*} params
 * @returns
 */
export function updateDevice(id, params) {
  return http.put(`${base}/equipment/${id}`, params)
}
/**
 * 删除设备
 * @param {*} id
 * @returns
 */
export function deleteDevice(id) {
  return http.delete(`${base}/equipment/${id}`)
}
/**
 * 获取部门树
 * @param {*} params
 * @returns
 */
export function getDepartments() {
  const params = {
    userCount: false
  }
  return http.get(`${base1}/baseDepts/tree`, params)
}

/**
 * 获取保养项的所有信息
 * @param {*} params
 * @returns
 */
export function getMaintainSelect(params) {
  return http.get(`${base}/maintenance_items`, params)
}
// 获取点检项的所有信息
export function getInspectionSelect(params) {
  return http.get(`${base}/checkout/list`, params)
}

/**
 * 新增保养项
 * @param {*} params
 * @returns
 */
export function addMaintainItem(params) {
  return http.post(`${base}/maintenance_items`, params)
}
// 保养计划的保养项关联更新
export function updateMaintainItems(id, params) {
  return http.put(`${base}/cm_plan/update_items/${id}`, params)
}

/**
 * 更新保养项
 * @param {*} id
 * @param {*} params
 * @returns
 */
export function editMaintainItem(id, params) {
  return http.put(`${base}/maintenance_items/${id}`, params)
}
/**
 * 删除保养项
 * @param {*} id
 * @returns
 */
export function deleteMaintainItem(id) {
  return http.delete(`${base}/maintenance_items/${id}`)
}

// 点检计划的保养项关联更新
export function updateInspectionPlanMaintainItems(id, params) {
  return http.put(`${base}/cm_checkout_plan/update_items/${id}`, params)
}
/**
 * 获取点检项的所有信息
 * @param {*} params
 * @returns
 */
export function getInspectionTable(params) {
  return http.get(`${base}/checkout`, params)
}
/**
 * 新增点检项
 * @param {*} params
 * @returns
 */
export function addInspection(params) {
  return http.post(`${base}/checkout`, params)
}
/**
 * 更新点检项
 * @param {*} id
 * @param {*} params
 * @returns
 */
export function updateInspection(id, params) {
  return http.put(`${base}/checkout/${id}`, params)
}
/**
 * 删除点检项
 * @param {*} id
 * @returns
 */
export function deleteInspection(id) {
  return http.delete(`${base}/checkout/${id}`)
}

/**
 * 故障
 * @param {*} params
 * @returns
 */
export function equipment_fault(params) {
  return http.get(`${base}/equipment_fault`, params)
}

/**
 * 设备使用率统计-设备使用率排名(TOP10)
 * @param {*} params
 * @returns
 */
export function equipment_usage_total_top_10(params) {
  return http.post(`${base}/equipment_usage_total/top_10`, params)
}
/**
 * 设备使用率统计-设备使用率汇总
 * @param {*} params
 * @returns
 */
export function equipment_usage_total_summary(params) {
  return http.post(`${base}/equipment_usage_total/summary`, params)
}

// 停机
// 停机中table数据
export function getShutdowningTable(params) {
  return http.get(`${base}/cm_operation`, params)
}

// 停机记录table数据
export function getShutdownRecordTable(params) {
  return http.get(`${base}/cm_operation/run_record`, params)
}

// 新建停机
export function addShutDown(params) {
  return http.post(`${base}/cm_operation`, params)
}

// 新建开机
export function powerOn(id, params) {
  return http.post(`${base}/cm_operation/start/${id}`, params)
}

// 获取保养/点检人员信息select列表(新建)
export function getUsers_xj() {
  return http.get(`${base1}/baseUsers/getUsersForXj`)
}

// 获取保养/点检人员信息select列表(转办)
export function getUsers_zb() {
  return http.get(`${base1}/baseUsers/getUsersForZb`)
}

// 保养计划模块
// 保养计划 列表
export function getMaintainPlanTable(params) {
  return http.get(`${base}/cm_plan`, params)
}

// 获取所有部门信息
export function getDepartmentList() {
  return http.get(`${base1}/baseDepts/list`, {})
}

// 删除保养计划
export function deleteMaintainPlan(id) {
  return http.delete(`${base}/cm_plan/${id}`)
}

// 新增保养计划
export function addMaintainPlan(params) {
  return http.post(`${base}/cm_plan`, params)
}

// 更新保养计划
export function editMaintainPlan(id, params) {
  return http.put(`${base}/cm_plan/${id}`, params)
}

// 点检模块
// 点检计划table数据
export function getInspectionPlanTable(params) {
  return http.get(`${base}/cm_checkout_plan`, params)
}

// 删除点检计划
export function deleteInspectionPlan(id) {
  return http.delete(`${base}/cm_checkout_plan/${id}`, {})
}

// 新增点检计划
export function addInspectionPlan(params) {
  return http.post(`${base}/cm_checkout_plan`, params)
}

// 更新点检计划
export function editInspectionPlan(id, params) {
  return http.put(`${base}/cm_checkout_plan/${id}`, params)
}

// 点检单
// 点检单table数据
export function getInspectionBillsTable(params) {
  return http.get(`${base}/cm_checkout_plan_task`, params)
}

// 点检单作废操作
export function removeInspectionBill(id) {
  return http.post(`${base}/cm_checkout_plan_task/to_void/${id}`)
}

// 新增点检单
export function addInspectionBill(params) {
  return http.post(`${base}/cm_checkout_plan_task`, params)
}

// 查询待处理点检单
export function getRemainingInspectionTable(params) {
  return http.get(`${base}/cm_checkout_plan_task/runtask/list`, params)
}

// 查询已处理点检单
export function getFinishedInspectionTable(params) {
  return http.get(`${base}/cm_checkout_plan_task/history/list`, params)
}

// 点检单的点检操作
export function inspectionBill(id) {
  return http.post(`${base}/cm_checkout_plan_task/maintain/${id}`)
}

// 点检单的转办操作
export function transferInspectionBill(id, param) {
  return http.post(`${base}/cm_checkout_plan_task/transfer/${id}`, param)
}

// 点检单的保养项关联更新
export function updateInspectionMaintainItems(id, params) {
  return http.put(`${base}/cm_checkout_plan_task/update_items/${id}`, params)
}

// 保养单
// 获取保养单table数据
export function getMaintainBillTable(params) {
  return http.get(`${base}/cm_plan_task`, params)
}

// 新增保养单
export function addMaintainBill(params) {
  return http.post(`${base}/cm_plan_task`, params)
}

// 更新保养单
export function editMaintainBill(id, params) {
  return http.put(`${base}/cm_plan_task/${id}`, params)
}

// 保养单作废
export function removeMaintainBill(id) {
  return http.post(`${base}/cm_plan_task/to_void/${id}`)
}

// 查询待处理保养单
export function getRemainingTable(params) {
  return http.get(`${base}/cm_plan_task/runtask/list`, params)
}

// 查询已处理保养单
export function getFinishedTable(params) {
  return http.get(`${base}/cm_plan_task/history/list`, params)
}

// 保养单的保养操作
export function maintainBill(id) {
  return http.post(`${base}/cm_plan_task/maintain/${id}`)
}

// 保养单的无需处理操作
export function doNothingToMaintainBill(id) {
  return http.post(`${base}/cm_plan_task/nothing_todo/${id}`)
}

// 保养单的转办操作
export function transferMaintainBill(id, params) {
  return http.post(`${base}/cm_plan_task/transfer/${id}`, params)
}

// 保养单的保养项关联更新
export function updateBillMaintainItems(id, params) {
  return http.put(`${base}/cm_plan_task/update_items/${id}`, params)
}

// 处理节点新增
export function addActivities(params) {
  return http.post(`${base}/activiti_log`, params)
}

// 节点list
export function getActivities(id) {
  return http.get(`${base}/activiti_log/list?kfId=${id}`)
}

// 维修模块
// 维修单table数据
export function getRepairBillsTable(params) {
  return http.get(`${base}/cm_repair_order/getList`, params)
}

// 维修单作废操作
export function removeRepairBill(id) {
  return http.post(`${base}/cm_repair_order/to_void/${id}`)
}

// 新增维修单
export function addRepairBill(params) {
  return http.post(`${base}/cm_repair_order`, params)
}

// 待处理维修单列表
export function getRemainingRepairTable(params) {
  return http.get(`${base}/cm_repair_order/runtask/list`, params)
}

// 已处理维修单列表
export function getFinishedRepairTable(params) {
  return http.get(`${base}/cm_repair_order/history/list`, params)
}

// 维修单的维修操作
export function maintainRepairBill(id) {
  return http.post(`${base}/cm_repair_order/maintain/${id}`)
}

// 维修单的误报操作
export function falutRepairBill(id) {
  return http.post(`${base}/cm_repair_order/misinformation/${id}`)
}

// 维修单的转办操作
export function transferRepairBill(id, params) {
  return http.post(`${base}/cm_repair_order/transfer/${id}`, params)
}

// 处置单模块
// 处置单table列表
export function getDispositionTable(params) {
  return http.get(`${base}/cm_dispose_order`, params)
}

// 处置单撤回
export function withdrawDisposition(id, params) {
  return http.post(`${base}/cm_dispose_order/to_void/${id}`, params)
}
// 新建处置单
export function addDisposition(params) {
  return http.post(`${base}/cm_dispose_order`, params)
}

// 处置单待处理table数据
export function getRemainingDispositionTable(params) {
  return http.get(`${base}/cm_dispose_order/runtask/list`, params)
}

// 处置单已处理table数据
export function getFinishedDispositionTable(params) {
  return http.get(`${base}/cm_dispose_order/history/list`, params)
}

// 处置单审批
export function complete_task(id, params) {
  return http.post(`${base}/cm_dispose_order/complete_task/${id}`, params)
}

export function getGzfl() {
  return http.get(`${base1}/sysDictValues/dict_type/gzfl`)
}

export function copyPictures(params) {
  return http.post(`${base}/attachment/copyPictures`, params)
}

/**
 * 获取停机原因
 * @returns
 */
export function getTjyy() {
  return http.get(`${base1}/sysDictValues/dict_type/tjyy`)
}
/**
 * 判断设备是否需要手动输入
 * @returns
 */
export function getCmCodingIsAuto() {
  return http.get(`${base1}/sysconf/cmCodingIsAuto`)
}

export function getCmPlanBuildRule() {
  return http.get(`${base}/sys_conf/getCmPlanBuildRule`)
}

export function getCmCheckBuildRule() {
  return http.get(`${base}/sys_conf/getCmCheckBuildRule`)
}
