// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import { initPlugins, initI18N } from './init-plugins'
//import * as webSocketApi from './utils/webSocket'
import * as webSocketApi from './utils/webSocketNew'
import $ from 'jquery'
//import Vonic from 'vonic/src/index'
import { MessageBox } from 'mint-ui'
import './assets/iconfont/iconfont.css'  //全局引入iconfont
import './assets/css/my-mint.scss'//全局引入mint-ui修改样式
//init the third-party plugins
//初始化第三方的组件
initPlugins();
//get i18n object
const i18n = initI18N('zh');
router.afterEach(()=>{
  MessageBox.close()
})
//全局注册webSocketApi
//使用：this.webSocketApi.sendSock(agentData,this.getConfigResult);【agentData：发送的参数；this.getConfigResult：回调方法】
Vue.prototype.webSocketApi = webSocketApi;
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})
