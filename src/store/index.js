/**
 * Created by Joker on 2017/11/15.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import { getToken } from '@/utils/token'
import { getUserId } from '@/utils/user'


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    footerVisible: true,
    selectedTab: 'my',
    chartType:'客户分类结构',
    token:getToken(),
    userId:getUserId(),
    LOADING:false
  },
  mutations: {
    setChartType(state, param){
      state.chartType = param
    },
    [types.TOGGLE_FOOTER] (state) {
      state.footerVisible = !state.footerVisible
    },
    [types.SELECT_TAB](state, val){
      state.selectedTab = val
    },
    SET_TOKEN(state,token){ //存储token
      state.token = token
    },
    setUserId(state,userId){
      state.userId = userId
    },
    showLoading(state){
      state.LOADING = true;
    },
    hideLoading(state){
      state.LOADING = false;
    }
  }
});
export default store
