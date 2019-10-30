import createListModel from '../../../models/creatListModel';
import { request, Urls } from '../../../base/common';

export default createListModel({
  namespace: 'equipmentSpareModel',
  initState: {
    currentFree: {
      current: 1,
      size: 5
    },
    searchFieldsFree: {}
  },
  reducers: {
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
        keywords:'',
        currentFree: {
          current: 1,
          size: 5
        }
      }
    }
  },
  effects: {
    * getTableList({ payload }, { put, call, select }) {
      try {
        const { current, searchFields } = yield select(({ equipmentSpareModel }) => equipmentSpareModel)
        yield put({ type: 'setLoading', payload: true });
        const resdata = yield call(request.get, Urls.EquipmentSpareList, { ...current, ...searchFields })
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
    * handleSearch({ payload }, { put, call, select }) {
      yield put({ type: 'setFreeSearch', payload });
      this.props.dispatch({ type: 'equipmentListModel/getTableList' })
    },
  },
})
