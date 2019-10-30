import { request, Urls } from '../../../base/common';

export default {
    namespace: 'monitorDataModel',
    state: {
        search: null,
        menuList: [],
        cardList: [],
        menuActive: null,
        addrLinkValue: null,
        linkActiveCode: null,

        loadingMore: false,
        current: 1,
        endCode: '',
    },
    effects: {
        * getMenuList({ provinceCode = '', cityCode = '', countyCode = '' }, { put, call, select }) {
            try {
                const resdata = yield call(request.get, Urls.MonitorTenantList, { provinceCode, cityCode, countyCode })
                yield put({ type: 'setMenuList', resdata });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
        * getDeviceListInit({ endCode = '' }, { put, call, select }) {
            try {
                const resdata = yield call(request.get, Urls.MonitorDeviceList, { endCode, size: 12, current: 1 })
                yield put({ type: 'setCardList', records: resdata.records });
                yield put({ type: 'setloadInit', endCode });
                yield put({ type: 'setloadBool', len: resdata.records.length });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
        * getDeviceListMore({ }, { put, call, select }) {
            try {
                const { endCode, current, cardList } = yield select(({ monitorDataModel }) => monitorDataModel)
                yield put({ type: 'setCardList', records: cardList.concat([...new Array(12)].map(() => ({ loading: true, name: {} }))) });
                const resdata = yield call(request.get, Urls.MonitorDeviceList, { endCode, size: 12, current: current + 1 })
                yield put({ type: 'setCardList', records: cardList.concat(resdata.records) });
                yield put({ type: 'setloadMore', current });
                yield put({ type: 'setloadBool', len: resdata.records.length });
            } catch (err) {
                console.log('error===>', err.message);
            }
        },
    },
    reducers: {
        setMenuList(state, { resdata }) {
            return {
                ...state,
                menuList: resdata.records
            }
        },
        setCardList(state, { records }) {
            return {
                ...state,
                cardList: records
            }
        },
        setSearch(state, { search }) {
            return {
                ...state,
                search
            }
        },
        setloadInit(state, { endCode }) {
            return {
                ...state,
                current: 1,
                endCode
            }
        },
        setloadMore(state, { current }) {
            return {
                ...state,
                current: current + 1,
            }
        },
        setloadBool(state, { len }) {
            return {
                ...state,
                loadingMore: len === 12,
            }
        },
        setMenuActive(state, { item }) {
            return {
                ...state,
                menuActive: item
            }
        },
        setAddrLinkValue(state, { value }) {
            return {
                ...state,
                addrLinkValue: value
            }
        },
        setLinkActiveCode(state, { code }) {
            return {
                ...state,
                linkActiveCode: code
            }
        },
        resetData(state) {
            return {
                search: null,
                menuList: [],
                cardList: [],
                menuActive: null,
                addrLinkValue: null,
                linkActiveCode: null,
                loadingMore: false,
                current: 1,
                endCode: '',
            }
        },
    }
}
