export default {
  namespace: 'global',
  state: {
    tabsList: [], //tabs页签列表
    activeKey: null, //当前激活的页签
    tabTrans: {} //页签传递参数
  },
  reducers: {
    setTabsList(state, { list }) {
      return { ...state, tabsList: list }
    },
    setActiveKey(state, { key }) {
      return { ...state, activeKey: key }
    },
    setTabTrans(state, { trans }) {
      return {
        ...state,
        tabTrans: {
          ...state.tabTrans,
          ...trans
        }
      }
    }
  },
  effects: {
    * addTabs({ path, trans = {} }, { put, select }) {
      const { tabsList } = yield select(({ global }) => global)
      if (!tabsList.includes(path)) {
        // 没有此菜单
        yield put({ type: 'setTabsList', list: tabsList.concat([path]) });
      }
      yield put({ type: 'setActiveKey', key: path });
      if (trans.path) {
        yield put({ type: 'setTabTrans', trans: trans });
      }
    },
    * removeTabs({ targetKey }, { put, select }) {
      let { tabsList, activeKey } = yield select(({ global }) => global);
      const newList = tabsList.filter(item => item !== targetKey);

      let newKey = activeKey;
      if (activeKey === targetKey) {
        let keyIndex = tabsList.indexOf(targetKey);
        if (tabsList.length === keyIndex + 1) {
          keyIndex--
        } else {
          keyIndex++
        }
        newKey = tabsList[keyIndex]
      }

      yield put({ type: 'setTabsList', list: newList });
      yield put({ type: 'setActiveKey', key: newKey });
    },
    * addRemoveTabs({ path, targetPath, trans = {} }, { put, select }) {
      const { tabsList } = yield select(({ global }) => global);

      let newList = [];
      if (tabsList.includes(targetPath)) {
        newList = tabsList.filter(item => item !== path);
      } else {
        newList = tabsList.map(item => item === path ? targetPath : item);
      }

      yield put({ type: 'setTabsList', list: newList });
      yield put({ type: 'setActiveKey', key: targetPath });
      if (trans.path) {
        yield put({ type: 'setTabTrans', trans: trans });
      }
    },
    * closeOtherTab(_, { put, select }) {
      let { activeKey } = yield select(({ global }) => global);
      yield put({ type: 'setTabsList', list: [ activeKey ] });
      yield put({ type: 'setActiveKey', key: activeKey });
    }
  },
}
