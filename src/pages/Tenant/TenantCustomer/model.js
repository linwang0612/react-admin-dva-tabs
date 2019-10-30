import createListModel from '../../../models/creatListModel';
import { request, Urls, UserInfo } from '../../../base/common';

export default createListModel({
  namespace: 'tenantCustomerModel',
  initState: {
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    currentFree: {
      current: 1,
      size: 5
    },
    searchFieldsFree: {},
    distributorList: {}
  },
  reducers: {
    setSelectVal(state, { provinceCode, cityCode, countyCode }) {
      return {
        ...state,
        provinceCode: provinceCode,
        cityCode: cityCode,
        countyCode: countyCode
      }
    },
    setDistributorList(state, { resdata }) {
      return {
        ...state,
        distributorList: resdata
      }
    },
    setCurrentFree(state, { payload }) {
      return {
        ...state,
        currentFree: payload
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
    resetSelectVal(state, { }) {
      return {
        ...state,
        provinceCode: '',
        cityCode: '',
        countyCode: ''
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
  },
  effects: {
    * getTableList({ payload }, { put, call, select }) {
      try {
        const { current, searchFields } = yield select(({ tenantCustomerModel }) => tenantCustomerModel)
        yield put({ type: 'setLoading', payload: true });
        const resdata = yield call(request.get, Urls.etenantList, { ...current, ...searchFields, type: 4 })
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
    * getDistributorList({ payload }, { put, call, select }) {
      try {
        const { currentFree, searchFieldsFree } = yield select(({ tenantCustomerModel }) => tenantCustomerModel)
        const resdata = yield call(request.get, Urls.etenantList, { ...currentFree, ...searchFieldsFree, type: 3, enableFlag: 1 })
        yield put({ type: 'setDistributorList', resdata });
      } catch (err) {
        console.log('error===>', err.message);
      }
    },
    * pageChange({ payload, types }, { put, call, select }) {
      yield put({ type: 'setCurrentFree', payload });
      yield put({ type: 'getDistributorList' });
    },
    * handleSearch({ payload, types }, { put, call, select }) {
      yield put({ type: 'setFreeSearch', payload });
      yield put({ type: 'getDistributorList' });
    },
  },
})
