import createListModel from '../../../models/creatListModel';
import { request, Urls, UserInfo } from '../../../base/common';

export default createListModel({
  namespace: 'tenantDistributor',
  initState: {
    provinceCode: '',
    cityCode: '',
    countyCode: ''
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
    resetSelectVal(state, { }) {
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
        const { current, searchFields } = yield select(({ tenantDistributor }) => tenantDistributor)
        yield put({ type: 'setLoading', payload: true });
        const resdata = yield call(request.get, Urls.etenantList, { ...current, ...searchFields, type: 3 })
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
  },
})
