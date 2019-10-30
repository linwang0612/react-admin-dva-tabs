/**
 * 生成基础列表的model
 * @param {*} options
 */

export default function createListModel(options) {
  let { namespace, initState = {}, effects = {}, reducers = {} } = options;
  initState = {
    tableLoading: false, //加载动画
    listData: {}, //列表数据
    current: { //分页
      current: 1,
      size: 10
    },
    searchFields: {}, //搜索
    ...initState
  };
  return {
    namespace,
    state: {
      ...initState
    },
    reducers: {
      setTableList(state, { resdata }) {
        return {
          ...state,
          listData: resdata
        }
      },
      setSearch(state, { payload }) {
        return {
          ...state,
          searchFields: payload,
          current: {
            current: 1,
            size: 10
          }
        }
      },
      setCurrent(state, { payload }) {
        return {
          ...state,
          current: payload
        }
      },
      setLoading(state, { payload }) {
        return {
          ...state,
          tableLoading: payload
        }
      },
      resetData(state) { // 初始化数据
        return {
          ...initState
        }
      },
      ...reducers
    },
    effects: {
      ...effects
    }
  };
}
