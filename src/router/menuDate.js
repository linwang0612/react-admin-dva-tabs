/**
 * 路由菜单

 * 1控制器厂家 2冰柜整机厂 3冰柜经销商 4终端客户
 * show：配置菜单权限，默认不需要配置
 * insidePages为内页
 */

import MonitorData from '../pages/Monitor/MonitorData'
import MonitorPoint from '../pages/Monitor/MonitorPoint'
import MonitorDistribution from '../pages/Monitor/MonitorDistribution'

import EquipmentList from '../pages/Equipment/EquipmentList'
import AddAddEquipmentListComp from '../pages/Equipment/EquipmentList/AddEquipmentList/AddAddEquipmentListComp'
import EquipmentSpare from '../pages/Equipment/EquipmentSpare'
import AddEquipmentSpareComp from '../pages/Equipment/EquipmentSpare/AddEquipmentSpare/AddEquipmentSpareComp'
import EquipmentTrain from '../pages/Equipment/EquipmentTrain'

import AlertsRule from '../pages/Alerts/AlertsRule'
import AlertsRecord from '../pages/Alerts/AlertsRecord'
import AddAlertsRule from '../pages/Alerts/AlertsRule/AddAlertsRule/AddAlertsRule'
import DeviceAlertsRule from '../pages/Alerts/AlertsRule/DeviceAlertsRule/DeviceAlertsRule'

import TenantFactoryComp from '../pages/Tenant/TenantFactory/TenantFactoryComp'
import TenantDistributorComp from '../pages/Tenant/TenantDistributor/TenantDistributorComp'
import TenantCustomerComp from '../pages/Tenant/TenantCustomer/TenantCustomerComp'

export default [
  {
    name: '实时监控',
    icon: 'container',
    children: [
      {
        name: '数据监控',
        path: '/monitor/data',
        component: MonitorData,
      },
      {
        name: '地图位置',
        path: '/monitor/point',
        component: MonitorPoint,
        show: [1, 2, 3]
      },
      {
        name: '全国分布',
        path: '/monitor/distribution',
        component: MonitorDistribution,
        show: [1, 2, 3]
      }
    ]
  },
  {
    name: '设备管理',
    icon: 'gateway',
    children: [
      {
        name: '设备列表',
        path: '/equipment/list',
        component: EquipmentList,
        insidePages: [
          {
            name: '新建',
            path: '/equipment/add',
            component: AddAddEquipmentListComp,
          }
        ]
      },
      {
        name: '备件管理',
        path: '/equipment/spare',
        component: EquipmentSpare,
        show: [1, 2],
        insidePages: [
          {
            name: '新建',
            path: '/equipment/add',
            component: AddEquipmentSpareComp,
          }
        ]
      },
      {
        name: '设备培训',
        path: '/equipment/train',
        component: EquipmentTrain,
        show: [2, 3, 4]
      }
    ]
  },
  {
    name: '预警管理',
    icon: 'alert',
    children: [
      {
        name: '预警规则',
        path: '/alerts/rule',
        component: AlertsRule,
        insidePages: [
          {
            name: '新建',
            path: '/alerts/rule/add',
            component: AddAlertsRule,
          },
          {
            name: '编辑',
            path: '/alerts/rule/add/:id',
            component: AddAlertsRule,
          },
          {
            name: '设备列表',
            path: '/alerts/rule/device',
            component: DeviceAlertsRule,
          },
          {
            name: '设备列表',
            path: '/alerts/rule/device/:id',
            component: DeviceAlertsRule,
          },
        ]
      },
      {
        name: '预警记录',
        path: '/alerts/record',
        component: AlertsRecord,
      }
    ]
  },
  {
    name: '租户管理',
    icon: 'team',
    show: [1, 2],
    children: [
      {
        name: '冰柜厂',
        path: '/tenant/factory',
        component: TenantFactoryComp,
        show: [1],
      },
      {
        name: '经销商',
        path: '/tenant/distributor',
        component: TenantDistributorComp,
        show: [1, 2],
      },
      {
        name: '终端客户',
        path: '/tenant/customer',
        component: TenantCustomerComp,
        show: [1, 2],
      }
    ]
  },
]
