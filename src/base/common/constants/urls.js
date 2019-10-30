/**
 * 所有的接口；
 * 注意分类
 */

const Urls = {
  /* 公共接口 */
  login: '/cem/login', //登录
  provinceList: '/cem/province/list', //省份列表
  cityList: '/cem/city/list', //城市列表
  countyList: '/cem/county/list', //区县列表

  /* 设备管理 */
  EquipmentSpareList: '/cem/sparePart/list',//备件列表
  addEquipmentSpare: '/cem/sparePart/add',//新增备件
  updateEquipmentSpare: '/cem/sparePart/update',//编辑备件
  deleteEquipmentSpare: '/cem/sparePart/delete',//删除备件
  deviceList: '/cem/device/list',//设备列表
  deviceAdd: '/cem/device/add',//新增设备
  deviceUpdate: '/cem/device/update',//编辑设备
  deviceDelete: '/cem/device/delete',//删除设备
  deviceFreezerManufacturerPage: '/cem/tenant/freezerManufacturerPage',//冰柜厂商列表
  deviceBatchDistribute: '/cem/device/batchDistribute',//分配冰柜厂商
  deviceDealerPage: '/cem/tenant/dealerPage',//冰柜经销商列表
  deviceBatchDistributeDealer: '/cem/device/batchDistributeDealer',//分配经销商
  deviceEndCustomerPage: '/cem/tenant/endCustomerPage',//终端客户列表
  deviceBatchDistributeEndCustomer: '/cem/device/batchDistributeEndCustomer',//分配终端客户
  deviceBatchDelete: '/cem/device/batchDelete',//批量删除
  deviceBatchEnable: '/cem/device/batchEnable',//批量上架
  deviceBatchDisable: '/cem/device/batchDisable',//批量下架
  deviceListUnInstalledControllere: '/cem/device/listUnInstalledController',//控制器编号列表
  deviceDocumentlist: '/cem/document/list',//设备培训列表
  deviceDocumenDelete: '/cem/document/delete',//设备培训-删除
  deviceImportExcel: '/cem/device/importExcel',//设备列表-导入
  /* 租户管理 */
  etenantList: '/cem/tenant/list',//终端客户
  tenantadd: '/cem/tenant/add',//冰柜厂新增
  tenantupdate: '/cem/tenant/update',//冰柜厂新增-经销商新增
  tenantEnable: '/cem/tenant/enable',//冰柜厂启用
  tenantDisable: '/cem/tenant/disable',//冰柜厂禁用
  tenantDelete: '/cem/tenant/delete',//冰柜厂-删除
  tenantGetByTenantCode: '/cem/user/getByTenantCode',//详情_根据公司编码查询
  tenantAccountAdd: '/cem/user/add',//冰柜厂-账号新增
  tenantAccountUpdate: '/cem/user/update',//冰柜厂-账号编辑
  /* 预警规则 */
  alertsRuleList: '/cem/earlyWarningRule/list',//预警规则列表
  alertsRuleDetails: '/cem/earlyWarningRule/getDetail',//预警规则详情
  alertsRuleAdd: '/cem/earlyWarningRule/add',//预警规则新增
  alertsRuleUpdate: '/cem/earlyWarningRule/update',//预警规则更新
  alertsRuleDelete: '/cem/earlyWarningRule/delete',//预警规则删除
  alertsDeviceAdd: '/cem/earlyWarningDevice/add', //设备列表新增与删除
  alertsDeviceList: '/cem/earlyWarningDevice/list', //设备列表
  alertsDeviceModal: '/cem/earlyWarningDevice/listDevice', //设备列表弹窗
  alertsRecordList: '/cem/earlyWarningRecord/list',//预警记录

  /** 数据监控 */
  MonitorTenantList: '/cem/tenant/endListForMonitor',//终端客户列表
  MonitorDeviceList: '/cem/monitor/listDevice',//终端客户设备列表

  /** 地图位置 */
  MonitorPointCount: '/cem/device/countByCity',//根据省市统计区设备数据
  MonitorPointList: '/cem/device/listByCounty',//根据省市区编码查询具体的设备地址信息
  /** 全国分布 */
  countByProvince: '/cem/device/countByProvince',
  countByStatus: '/cem/device/countByStatus',
  countStatistics: '/cem/earlyWarningRecord/statistics',//最近7天预警
}

export { Urls }
