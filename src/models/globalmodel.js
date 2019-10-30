import menuDate from '../router/menuDate';

const defaultSelected = pathname => {
    let showindex = []
    function findindex(menu, keys) {
        menu.forEach((item, index) => {
            if (item.path === pathname) {
                if (keys) {
                    let keyStr = keys.join('');
                    for (let i = 1; i <= keys.length; i++) {
                        showindex.unshift(keyStr.substring(0,i));
                    }
                    showindex.unshift(keyStr + index);
                } else {
                    showindex.unshift(index + '');
                }
            } else {
                if (Object.prototype.toString.call(item.children) === '[object Array]') {
                    if (keys) {
                        findindex(item.children, [...keys,index])
                    } else {
                        findindex(item.children, [index])
                    }
                } else if (Object.prototype.toString.call(item.insidePages) === '[object Array]') {
                    if (keys) {
                        findindex(item.insidePages, [...keys,index])
                    } else {
                        findindex(item.insidePages, [index])
                    }
                }
            }
        })
    }
    findindex(menuDate);
    return showindex
}

export default {
    namespace: 'global',
    state: {
        selectedMenuKeys: [],
    },
    reducers: {
        setKeys(state, { payload }) {
            return { ...state, selectedMenuKeys: payload }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
                dispatch({
                    type: 'setKeys',
                    payload: defaultSelected(pathname)
                });
                // if (pathname === '/') {
                //     if (UserInfo.getTokenId()) {
                //         console.log('登陆了', UserInfo.getTokenId())
                //     } else {
                //         console.log('没登录')
                //     }
                // }
            });
        },
    },
}
