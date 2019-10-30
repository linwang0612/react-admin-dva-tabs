import {
    CommonData
} from '../constants/commonDefine'

let cacheData = {}
let tokenId = ''

export const UserInfo = {
    getData() {
        if (cacheData.id) {
            return cacheData
        } else {
            let local_data = localStorage.getItem(CommonData.STORAGE_USERINFO);
            if (local_data) {
                local_data = JSON.parse(local_data)
            }
            return local_data
        }
    },

    setData(data) {
        cacheData = data
        localStorage.setItem(CommonData.STORAGE_USERINFO, JSON.stringify(data))
    },

    getTokenId() {
        if (tokenId) {
            return tokenId
        } else {
            let local_tokenId = localStorage.getItem(CommonData.STORAGE_KEY)
            return local_tokenId ? local_tokenId : tokenId
        }
    },

    setTokenId(t){
        tokenId = t
        localStorage.setItem(CommonData.STORAGE_KEY, t)
    },

    clear(){
        cacheData = {}
        tokenId = ''
        localStorage.clear()
    }

}
