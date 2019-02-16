import Vue from 'vue'
import Router from 'vue-router'
import Main from '../pages/main.vue'
import Tool from '../pages/tool.vue'
import My from '../pages/my.vue'
import Market from '../pages/market.vue'
import Transaction from '@/pages/futures/transaction.vue'
import Auth from '../pages/auth.vue'
import Hold from '../pages/hold.vue'
import Login from '../pages/login/login.vue'
import futuresLogin from '@/pages/futures/login.vue' 


//指定同一个chunkName打包后会打到同一个js中去
const MemoNew = () => import(/* webpackChunkName: 'memo' */'../pages/tool/memo/memonew.vue');
const MemoList = () => import(/* webpackChunkName: 'memo' */'../pages/tool/memo/memolist.vue');

const Loadmore = () => import(/* webpackChunkName: 'Loadmore' */'../pages/tool/Loadmore.vue');
const OtherTest = () => import(/* webpackChunkName: 'Other' */'../pages/tool/OtherTest.vue');
/**
 * 图表
 */
const chartBox = r => require.ensure([], () => r(require('../pages/tool/chart/chartBox')), 'chartBox')
const CustomerCategory = r => require.ensure([], () => r(require('../pages/tool/chart/CustomerCategory')), 'CustomerCategory')
const MonthlySalesStatistics = r => require.ensure([], () => r(require('../pages/tool/chart/MonthlySalesStatistics')), 'MonthlySalesStatistics')
const MonthlyTask = r => require.ensure([], () => r(require('../pages/tool/chart/MonthlyTask')), 'MonthlyTask')
const OppFunnel = r => require.ensure([], () => r(require('../pages/tool/chart/OppFunnel')), 'OppFunnel')
const SaleRank = r => require.ensure([], () => r(require('../pages/tool/chart/SaleRank')), 'SaleRank')
/*sassTest*/
const SassTest = r => require.ensure([], () => r(require('../pages/tool/SassTest')), 'SassTest')

/*国际化测试 */
const I18NTest = r => require.ensure([], () => r(require('../pages/tool/I18NTest')), 'I18NTest')
/*富文本测试 */
const RichTextTest = r => require.ensure([], () => r(require('../pages/tool/RichTextTest')), 'RichTextTest')

Vue.use(Router);
export default new Router({
  mode:'hash',
  routes: [
    {
      path: '/', component: Login  //登录页面
    },
    {
      path: '/main', component: Main  //主页面
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
    },
    {
      path: '/tool/memonew', component: MemoNew
    }, {
      path: '/tool/memolist', component: MemoList
    },
    {
      path: '/tool/loadmore', component: Loadmore
    },
    
    {
      path: '/tool/otherTest', component: OtherTest
    },
    {
      path: '/tool/sassTest', component: SassTest
    },
    {
      path: '/tool/I18NTest', component: I18NTest
    },
    {
      path: '/tool/richText', component: RichTextTest
    },
   
    {
      path: '/chartBox',
      name: 'chartBox',
      component: chartBox,
      children: [
        {
          name:'',
          path:'',
          component: CustomerCategory
        },
        {
          name: 'CustomerCategory',
          path: 'CustomerCategory',
          component: CustomerCategory
        },
        {
          name: 'MonthlySalesStatistics',
          path: 'MonthlySalesStatistics',
          component: MonthlySalesStatistics
        },
        {
          name: 'MonthlyTask',
          path: 'MonthlyTask',
          component: MonthlyTask
        },
        {
          name: 'OppFunnel',
          path: 'OppFunnel',
          component: OppFunnel
        },
        {
          name: 'SaleRank',
          path: 'SaleRank',
          component: SaleRank
        }
      ]
    },
    
  ]
})
