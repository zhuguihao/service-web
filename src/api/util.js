export default {
    setToken(token) {
        window.sessionStorage.setItem('token',token)
    },
    getToken(){
        return window.sessionStorage.getItem('token')
    },
    removeToken(){
        window.sessionStorage.removeItem('token');
    },
    setUserInfo(userInfo) {
        window.sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
    },
    getUserInfo(){
        return JSON.parse(window.sessionStorage.getItem('userInfo'))
    },
    removeUserInfo(){
        window.sessionStorage.removeItem('userInfo');
    },
    setRoutes(router) {
        window.sessionStorage.setItem('router',JSON.stringify(router))
    },
    getRoutes(){
        return JSON.parse(window.sessionStorage.getItem('router'))
    },
    removeRoutes(){
        window.sessionStorage.removeItem('router');
    },
};
