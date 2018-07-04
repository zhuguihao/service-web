import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      chName: '登录界面',
      isShow: true,
      children: []
    },
    {
      groupName: '分组名称',
      path: '/home',
      name: 'home',
      chName: '主页',
      component: home,
      children: [{
        groupName: '分组名称',
        path: '/home',
        name: 'home',
        chName: '子主页',
        component: home
      }, {
        path: '/login',
        name: 'login',
        chName: '登录',
        component: login
      }]
    }
  ]
})
