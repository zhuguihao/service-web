import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import router from './routes'
import Mock from './mock'
import MenuUtils from '@/utils/MenuUtils'
import util from '@/api/util'
/**
 * 打开数据模拟接口
 */
Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

let data = util.getRoutes()
if (data){
    //这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
    let routes = []
    MenuUtils(routes,data)
    console.log(JSON.stringify(routes))
    router.addRoutes(routes)
}
router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        // sessionStorage.removeItem('user');
        util.removeUserInfo()
    }
    let user = util.getUserInfo()
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

