/**
 * @description 校验对象是否为空
 * @export
 * @param {any} obj
 * @returns
 */
export function isEmpty(obj) {
  if (typeof obj === 'object') {
    return (
      !obj ||
      (Array.isArray(obj) && obj.length === 0) ||
      (obj.toString() === '[object Object]' && Object.keys(obj).length === 0)
    )
  }
  if (typeof obj === 'boolean' || typeof obj === 'number') {
    return false
  }
  if (typeof obj === 'string' && obj.trim().length === 0) {
    return true
  }
  return !obj
}

/**
 * @description 以当年为基准返回年份列表
 * @export
 * @param {*} start 往前数的年份
 * @param {*} end 往后数的年份
 * @returns
 */
export function getYears(start, end) {
  let years = []
  //获取当前年份
  var currentYear = new Date().getFullYear()
  for (let i = currentYear + start; i <= currentYear + end; i++) {
    years.push(i)
  }
  return years
}

/**
 * 把url中的hash部分转换成obj
 * @param {*} hash
 */
export const parseSearch = hash => {
  let result = {}
  if (hash.length > 0) {
    // 去除 #号
    let str = hash.substr(1, hash.length - 1)
    let arr = str.split('&')
    arr.map(item => {
      if (item.length > 0 && item.includes('=')) {
        let _arr = item.split('=')
        result[_arr[0]] = _arr[1]
      }
    })
  }
  return result
}

/**
 * get请求转换object参数
 */
export const JSON2Str = data => {
  let toString = ''
  for (var key in data) {
    var obj = data[key]
    if (Array.isArray(obj)) {
      let arrayString = obj.join(',')
      toString += key + '=' + encodeURIComponent(arrayString) + '&'
    } else {
      toString += key + '=' + encodeURIComponent(data[key]) + '&'
    }
  }
  return toString.replace(/\&$/, '')
}

/**
 * 应对，当有null,"",undefined的字符串需要被替换为制定字符串时使用
 * 例如： 所有的null需要替换为 --
 * @param {*} str 需要格式化的字符串
 * @param {*} replaceStr 替换的字符串
 */
export const formatNullStr = (str, replaceStr = '一 一') => {
  return str === null || str === undefined || str === '' ? replaceStr : str
}

/**
 * 校验是否为正整数
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
export function isErrInteger(obj) {
  if (isNaN(obj) || obj < 0 || (obj + '').indexOf('.') > -1) {
    return true
  } else {
    return false
  }
}

/**
 * 转换日期格式
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
export function formatDate(date) {
  if (typeof date === 'object') {
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    )
  } else if (typeof date === 'string') {
    return date
  } else {
    return ''
  }
}

export function formatNumber(num, precision, separator) {
  let parts

  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num)

    // 处理小数点位数
    num = (typeof precision !== 'undefined' ?
      num.toFixed(precision) :
      num
    ).toString()

    // 分离数字的小数部分和整数部分
    parts = num.split('.')

    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = parts[0]
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','))

    return parts.join('.')
  }
  return NaN
}

/**
 * 禁用键盘的某个键
 * @param  {[NewType]} date [description]
 * @return {[type]}      [description]
 * keyNum 键号
 */
export function checkEnter(e, keyNum) {
  var et = e || window.event;
  var keycode = et.charCode || et.keyCode;
  if (keycode === keyNum) {
    if (window.event) {
      window.event.returnValue = false;
    } else {
      e.preventDefault(); //for firefox
    }
  }
}

/**
 * 判断两个对象或数组相等
 *
 */
export function equalJudgment(data1, data2) {
  var result = true
  if (data1 && data2 && data1.constructor === Array && data2.constructor === Array) {
    if (data1.length !== data2.length) {
      result = false
    } else {
      for (var i = 0; i < data1.length; i++) {
        if (data1[i].constructor === Array && data2[i].constructor === Array) {
          if (!equalJudgment(data1[i], data2[i])) {
            result = false
            return result
          }
        } else if (data1[i].constructor === Object && data2[i].constructor === Object) {
          if (!equalJudgment(data1[i], data2[i])) {
            result = false
            return result
          }
        } else {
          if (data1[i] !== data2[i]) {
            result = false
            return result
          }
        }
      }
    }
  } else if (data1 && data2 && data1.constructor === Object && data2.constructor === Object) {
    var key1 = Object.getOwnPropertyNames(data1)
    var key2 = Object.getOwnPropertyNames(data2)
    if (key1.length !== key2.length) {
      result = false
    } else {
      for (var i = 0; i < key1.length; i++) {
        if (key2.indexOf(key1[i]) === -1) {
          result = false
          return result
        } else if (data1[key1[i]].constructor === Array && data2[key1[i]].constructor === Array) {
          if (!equalJudgment(data1[key1[i]], data2[key2[i]])) {
            result = false
            return result
          }
        } else if (data1[key1[i]].constructor === Object && data2[key1[i]].constructor === Object) {
          if (!equalJudgment(data1[key1[i]], data2[key1[i]])) {
            result = false
            return result
          }
        } else {
          if (data1[key1[i]] !== data2[key1[i]]) {
            result = false
            return result
          }
        }
      }
    }
  } else {
    result = false //只能是数组或对象
  }
  return result
}
