var _domain = {
    dev: {
      APP_SERVER_URI: 'http://10.99.44.163',
    },
    wp: {
      APP_SERVER_URI: 'http://192.168.0.197:8080',
    },
    qa: {
      APP_SERVER_URI: 'http://10.99.2.47',
    },
    prd: {
      APP_SERVER_URI: 'http://10.99.2.102:80',
    }
}
var ENV = 'dev'
var Domain = _domain[ENV]
const SET_ENV = function(env) {
    Domain = _domain[env]
    ENV = env
}
export { ENV }
export const APP_SERVER_URI = () => Domain.APP_SERVER_URI
export { SET_ENV }
