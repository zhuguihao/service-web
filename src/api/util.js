export default {
    setToken(token) {
        window.sessionStorage.setItem('token',token)
    },
    getToken(){
        return window.sessionStorage.getItem('token')
    },
    setUserInfo(userInfo) {
        window.sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
    },
    getUserInfo(){
        return JSON.parse(window.sessionStorage.getItem('userInfo'))
    },
    removeUserInfo(){
        sessionStorage.removeItem('userInfo');
    },
    setRoutes(router) {
        window.sessionStorage.setItem('router',JSON.stringify(router))
    },
    getRoutes(){
        return JSON.parse(window.sessionStorage.getItem('router'))
    }
};
