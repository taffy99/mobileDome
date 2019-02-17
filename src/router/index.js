import Vue from 'vue'
import Router from 'vue-router'

//路由组件懒加载
const Login = () => import('@/pages/login/login.vue');
const My = () => import('@/pages/my.vue');
const Market = () => import('@/pages/market.vue');
const futuresLogin = () => import('@/pages/futures/login.vue');
const Transaction = () => import('@/pages/futures/transaction.vue');
const Auth = () => import('@/pages/auth.vue');
const Hold = () => import('@/pages/hold.vue');

Vue.use(Router);
export default new Router({
  mode:'hash',
  routes: [
    {
      path: '/', component: Login  //登录页面
    },
    {
      path: '/futures/login', component: futuresLogin //期货登录页面
    },
    {
      path: '/futures/transaction', component: Transaction //期货交易页面
    },
    {
      path: '/my', component: My
    }, 
    {
      path: '/market', component: Market
    }, 
    {
      path: '/auth', component: Auth
    },
    {
      path: '/hold', component: Hold
    }
    
  ]
})
