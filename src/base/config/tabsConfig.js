import React from 'react';
import ProductComp from '../../pages/Product/Productcomp'
import WorkCenterComp from '../../pages/WorkCenter/WorkCenterComp'
import ProductionLineComp from '../../pages/ProductionLine/ProductionLineComp'
import WorkManagementComp from '../../pages/WorkManagement/WorkManagementComp'

export default {
    'productlist': {
        name: '产品',
        component: () => <ProductComp />
    },
    'workCenterlist': {
        name: '工作中心',
        component: () => <WorkCenterComp />
    },
    'productionLinelist': {
        name: '产线',
        component: () => <ProductionLineComp />
    },
    'workManagementlist': {
        name: '工单管理',
        component: () => <WorkManagementComp />
    }

}
