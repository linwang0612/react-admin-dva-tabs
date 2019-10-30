import { ReqApi } from './ReqApi';

const request = {
    get(url, pm = {}) {
        return ReqApi.get({
            url,
            pm
        }).then((data) => {
            return data
        })
    },
    post(url, pm = {}) {
        return ReqApi.post({
            url,
            pm
        }).then((data) => {
            return data
        })
    },
}

export { request }
