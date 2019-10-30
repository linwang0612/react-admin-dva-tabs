import { request, Urls } from '../../../base/common';

export default {
    namespace: 'monitorPointModel',
    state: {
        countList: [],
        pointList: [],
        provinceCode: '',
        cityCode: '',
        countActive: null,
        search: null,
    },
    effects: {
        * getCount({ provinceCode = '', cityCode = '', callback }, { put, call, select }) {
            try {
                yield put({ type: 'setProvinceCity', provinceCode, cityCode });

                const resdata = yield call(request.get, Urls.MonitorPointCount, { provinceCode, cityCode })
                yield put({ type: 'setCount', resdata });
                if (callback && typeof callback === 'function') {
                    callback(resdata)
                }
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
        * getList({ provinceCode = '', cityCode = '', countyCode = '', callback }, { put, call, select }) {
            try {
                const resdata = yield call(request.get, Urls.MonitorPointList, { provinceCode, cityCode, countyCode })
                yield put({ type: 'setList', resdata });
                if (callback && typeof callback === 'function') {
                    callback(resdata)
                }
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
    },
    reducers: {
        setCount(state, { resdata }) {
            return {
                ...state,
                countList: resdata
            }
        },
        setList(state, { resdata }) {
            return {
                ...state,
                pointList: resdata
            }
        },
        setProvinceCity(state, { provinceCode, cityCode }) {
            return {
                ...state,
                provinceCode,
                cityCode
            }
        },
        setSearch(state, { search }) {
            return {
                ...state,
                search
            }
        },
        setActive(state, { item }) {
            return {
                ...state,
                countActive: item
            }
        },
        resetData(state) {
            return {
                countList: [],
                pointList: [],
                countActive: null,
                search: null,
            }
        },
    }
}
