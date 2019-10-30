import createListModel from '../../../models/creatListModel';
import { request, Urls, UserInfo } from '../../../base/common';

export default createListModel({
  namespace: 'equipmentTrain',
  effects: {
    * getTableList({ payload }, { put, call, select }) {
      try {
        const { current, searchFields } = yield select(({ equipmentTrain }) => equipmentTrain)
        yield put({ type: 'setLoading', payload: true });
        const resdata = yield call(request.get, Urls.deviceDocumentlist, { ...current, ...searchFields })
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
