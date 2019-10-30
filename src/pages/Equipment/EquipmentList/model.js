import createListModel from '../../../models/creatListModel';
import { request, Urls, ReqApi } from '../../../base/common';

export default createListModel({
  namespace: 'equipmentListModel',
  initState: {
    selectedRowKeys: [],
    selectedRows: [],
    freezerManufacturerPageList: {},
    dealerPageList: {},
    endCustomerPageList: {},
    currentFree: {
      current: 1,
      size: 5
    },
    searchFieldsFree: {},
    controllerList: {},
    beiList: {},
    rovinceCode: '',
    cityCode: '',
    countyCode: '',
  },
  reducers: {
    setSelect(state, { selectedRowKeys, selectedRows }) {
      return {
        ...state,
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows
      }
    },
    setFreezerManufacturerPageList(state, { resdata }) {
      return {
        ...state,
        freezerManufacturerPageList: resdata,
      }
    },
    setFreeSearch(state, { payload }) {
      return {
        ...state,
        searchFieldsFree: payload,
        currentFree: {
          current: 1,
          size: 5
        }
      }
    },
    resetFreeSearch(state, { payload }) {
      return {
        ...state,
        searchFieldsFree: {},
        currentFree: {
          current: 1,
          size: 5
        }
      }
    },
    setDealerPage(state, { resdata }) {
      return {
        ...state,
        dealerPageList: resdata,
      }
    },
    setEndCustomerPage(state, { resdata }) {
      return {
        ...state,
        endCustomerPageList: resdata,
      }
    },
    resetSelectData(state) {
      return {
        ...state,
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    setControllerList(state, { resdata }) {
      return {
        ...state,
        controllerList: resdata,
      }
    },
    setBeiTableList(state, { resdata }) {
      return {
        ...state,
        beiList: resdata,
      }
    },
    setCurrentFree(state, { payload }) {
      return {
        ...state,
        currentFree: payload
      }
    },
    setSelectVal(state, { provinceCode, cityCode, countyCode }) {
      return {
        ...state,
        provinceCode: provinceCode == undefined ? '' : provinceCode,
        cityCode: cityCode == false ? '' : cityCode,
        countyCode: countyCode == false ? '' : countyCode
      }
    },
    resetSelectVal(state, { provinceCode, cityCode, countyCode }) {
      return {
        ...state,
        provinceCode: '',
        cityCode: '',
        countyCode: ''
      }
    },
  },
  effects: {
    * getTableList({ payload }, { put, call, select }) {
      try {
        const { current, searchFields, provinceCode, cityCode, countyCode } = yield select(({ equipmentListModel }) => equipmentListModel)
        yield put({ type: 'setLoading', payload: true });
        const resdata = yield call(request.get, Urls.deviceList, { ...current, ...searchFields, provinceCode: provinceCode == undefined ? '' : provinceCode, cityCode: cityCode, countyCode: countyCode })
        yield put({ type: 'setTableList', resdata });
        yield put({ type: 'setLoading', payload: false });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    * watchChange({ payload }, { put, call, select, take }) {
      while (true) {
        yield take(['setSearch', 'setCurrent'])
        yield put({ type: 'getTableList' });
      }
    },
    * onSelectChange({ selectedRowKeys, selectedRows }, { put, call }) {
      yield put({ type: 'setSelect', selectedRowKeys, selectedRows });
    },
    //厂商列表
    * getFreezerManufacturerPageist({ payload }, { put, call, select }) {
      try {
        const { currentFree, searchFieldsFree } = yield select(({ equipmentListModel }) => equipmentListModel)
        const resdata = yield call(request.get, Urls.deviceFreezerManufacturerPage, { ...currentFree, ...searchFieldsFree })
        yield put({ type: 'setFreezerManufacturerPageList', resdata });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    //经销商列表
    * getDealerPagelist({ payload }, { put, call, select }) {
      try {
        const { currentFree, searchFieldsFree } = yield select(({ equipmentListModel }) => equipmentListModel)
        const resdata = yield call(request.get, Urls.deviceDealerPage, { ...currentFree, ...searchFieldsFree })
        yield put({ type: 'setDealerPage', resdata });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    //终端客户列表
    * getEndCustomerPageList({ payload }, { put, call, select }) {
      try {
        const { currentFree, searchFieldsFree } = yield select(({ equipmentListModel }) => equipmentListModel)
        const resdata = yield call(request.get, Urls.deviceEndCustomerPage, { ...currentFree, ...searchFieldsFree })
        yield put({ type: 'setEndCustomerPage', resdata });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    * handleSearch({ payload, types }, { put, call, select }) {
      yield put({ type: 'setFreeSearch', payload });
      switch (types) {
        case 'end':
          return yield put({ type: 'getEndCustomerPageList' });
        case 'dealer':
          return yield put({ type: 'getDealerPagelist' });
        case 'manufacturer':
          return yield put({ type: 'getFreezerManufacturerPageist' });
        case 'controller':
          return yield put({ type: 'getControllerList' });
        case 'bei':
          return yield put({ type: 'getBeiTableList' });
      }
    },
    //控制器列表
    * getControllerList({ payload }, { put, call, select }) {
      try {
        const { currentFree, searchFieldsFree } = yield select(({ equipmentListModel }) => equipmentListModel)
        const resdata = yield call(request.get, Urls.deviceListUnInstalledControllere, { ...currentFree, ...searchFieldsFree })
        yield put({ type: 'setControllerList', resdata });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    * getBeiTableList({ payload }, { put, call, select }) {
      try {
        const { currentFree, searchFieldsFree } = yield select(({ equipmentListModel }) => equipmentListModel)
        const resdata = yield call(request.get, Urls.deviceList, { ...currentFree, ...searchFieldsFree })
        yield put({ type: 'setBeiTableList', resdata });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    * pageChange({ payload, types }, { put, call, select }) {
      yield put({ type: 'setCurrentFree', payload });
      switch (types) {
        case 'end':
          return yield put({ type: 'getEndCustomerPageList' });
        case 'dealer':
          return yield put({ type: 'getDealerPagelist' });
        case 'manufacturer':
          return yield put({ type: 'getFreezerManufacturerPageist' });
        case 'controller':
          return yield put({ type: 'getControllerList' });
        case 'bei':
          return yield put({ type: 'getBeiTableList' });
      }
    }
  },
})
