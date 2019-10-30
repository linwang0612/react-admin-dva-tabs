import createListModel from '../../../models/creatListModel';
import { request, Urls } from '../../../base/common';

export default createListModel({
    namespace: 'alertsRuleModel',
    initState: {
        deviceList: {},
        deviceCurrent: {
            current: 1,
            size: 10
        },
        deviceSelectedRowKeys: []
    },
    effects: {
        * getTableList({ payload }, { put, call, select }) {
            try {
                const { current, searchFields} = yield select(({ alertsRuleModel }) => alertsRuleModel)
                yield put({ type: 'setLoading', payload: true });
                const resdata = yield call(request.get, Urls.alertsRuleList, { ...current, ...searchFields })
                yield put({ type: 'setTableList', resdata });
                yield put({ type: 'setLoading', payload: false });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
        * getDeviceList({ ruleId }, { put, call, select }) {
            try {
                const { deviceCurrent } = yield select(({ alertsRuleModel }) => alertsRuleModel)
                yield put({ type: 'setLoading', payload: true });
                const resdata = yield call(request.get, Urls.alertsDeviceList, { ...deviceCurrent, ruleId })
                yield put({ type: 'setDeviceList', resdata });
                yield put({ type: 'setLoading', payload: false });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
        * watchChange({ payload }, { put, call, select, take }) {
            while (true) {
                yield take(['setCurrent', 'setSearch'])
                yield put({ type: 'getTableList' });
            }
        }
    },
    reducers: {
        setDeviceList(state, { resdata }) {
            return {
                ...state,
                deviceList: resdata
            }
        },
        devicePageChange(state, { e }) {
            return {
                ...state,
                deviceCurrent: e
            }
        },
        setSelectedRowKeys(state, { selectedRowKeys }) {
            return {
                ...state,
                deviceSelectedRowKeys: selectedRowKeys
            }
        },
        resetDeviceData(state) {
            return {
                ...state,
                deviceList: {},
                deviceCurrent: {
                    current: 1,
                    size: 10
                },
                deviceSelectedRowKeys: []
            }
        },
    }
})
