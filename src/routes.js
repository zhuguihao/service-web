import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import dict from './views/sys/dict.vue'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let routes = [
    {
        path: '/login',
        component: Login,
        menuName: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        menuName: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        menuName: '首页',
        hidden: true,
        menuIcon: 'el-icon-message',//图标样式class
        children: []
    },
    // { path: '/main', component: Main },

    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '系统配置',
    //     iconCls: 'el-icon-setting',
    //     children: [
    //         { path: '/dict', component: dict, name: '字典表' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default new Router({routes:routes});