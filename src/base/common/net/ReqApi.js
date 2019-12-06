import { UserInfo } from '../cache/userInfo'
import { Utils } from '../index';
import { ENV } from '../constants/environment'
import history from '../../../history'
import React from 'react';
import { message } from 'antd'

/**
 * 头部信息
 * @returns {Object}
 */
function getHeaders(){
  return {
    'Content-Type': 'application/json',
    'tokenid': UserInfo.getTokenId(),
  }
}


/**
 * 组合报文信息
 * @param {Object} params 请求参数
 * @returns {Object}
 */
function _transformParam(params) {
  return {
    body: JSON.stringify(params),
  }
}

const handlerReq = req =>
  req
    .then(response => response.json())
    .then(response => {
      if (response.status == '2000') {
        // if (response.data === null || response.data === undefined) {
        //   message.error('服务器出错，请稍后再试')
        //   return Promise.reject(response)
        // }
        return Promise.resolve(response.data)
      } else if (
        response.status === 4013 ||
        response.status === 4014 ||
        response.status === 4015 ||
        response.status === 4020
      ) {
        message.error('token失效，请重新登录')
        history.push('/#/productlist')
        return Promise.reject(response)
      } else {
        message.error(`${response.message}`)
        return Promise.reject(response)
      }
    })

const ReqApi = {
  get({ url, pm }) {
    const headers = getHeaders()
    let nocache = new Date()
    if (typeof url === 'function') {
      url = ENV === 'node' ? url().toLowerCase() : url()
    }
    if (typeof pm === 'string') {
      return handlerReq(
        fetch(
          url + `?nocache=${nocache.getTime()}&${pm}`,
          Object.assign({
            method: 'GET',
            headers,
            credentials: 'include'
          })
        )
      )
    } else {
      return handlerReq(
        fetch(
          url + `?nocache=${nocache.getTime()}&${Utils.JSON2Str(pm)}`,
          Object.assign({
            method: 'GET',
            headers,
            credentials: 'include'
          })
        )
      )
    }
  },

  post({ url, pm }) {
    const headers = getHeaders()
    if (typeof url === 'function') {
      url = ENV === 'node' ? url().toLowerCase() : url()
    }
    if (typeof pm === 'object') {
      return handlerReq(
        fetch(
          url,
          Object.assign(
            {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify(pm),
            }
          )
        )
      )
    } else {
      throw new Error(
        'ReqApi: Wrong Type of Arguments, should be Object, now is ' +
          typeof pm
      )
    }
  },
}

export { ReqApi }
