import { request, Urls } from '../../../base/common';

export default {
    namespace: 'monitorDistributionModel',
    state: {
        provinceCount: [],
        active: null,
        countStatus: null
    },
    effects: {
        * getProvinceCount({ }, { put, call, select }) {
            try {
                const resdata = yield call(request.get, Urls.countByProvince)
                yield put({ type: 'setProvinceCount', resdata });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
        * getCountByStatus({ }, { put, call, select }) {
            try {
                const { active } = yield select(({ monitorDistributionModel }) => monitorDistributionModel)
                let provinceCode = active ? active.code : '';
                const resdata = yield call(request.get, Urls.countByStatus, { provinceCode } );
                yield put({ type: 'setCountStatus', resdata });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
    },
    reducers: {
        setProvinceCount(state, { resdata }) {
            return {
                ...state,
                provinceCount: resdata
            }
        },
        setCountStatus(state, { resdata }) {
            return {
                ...state,
                countStatus: resdata
            }
        },
        setActive(state, { code }) {
            return {
                ...state,
                active: code
            }
        },
        resetData(state) {
            return {
                provinceCount: [],
                active: null,
            }
        },
    }
}
