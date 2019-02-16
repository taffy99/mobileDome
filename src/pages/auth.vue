<template>
  <div id="auth">
    <mt-header fixed title="策略交易平台">
      <!-- <mt-button class="iconfont icon-exit" slot="right" @click="exit"></mt-button> -->
    </mt-header>
    <mt-navbar class="page-part" v-model="tabSelected">
      <mt-tab-item id="1">已报</mt-tab-item>
      <mt-tab-item id="2">已成交</mt-tab-item>
      <mt-tab-item id="3">部分成交</mt-tab-item>
      <mt-tab-item id="4">废单</mt-tab-item>
    </mt-navbar>
     <mt-tab-container v-model="tabSelected" class="authContainer">
      <mt-tab-container-item id="1">
        <div class="authTableWapper">
          <div class="authTable">
          <ul>
            <li>合约名称</li>
            <li>买卖</li>
            <li>开平</li>
            <li>报单价格</li>
            <li>手数</li>
            <li>报单时间</li>
            <li>来源</li> 
        </ul>
        <div v-for="(item,index) in authList" :key="index">
          <ul :class="{trSelected:item.authAction}" @click="showAuthAction(index)" class="tbContent">
              <li>{{item.orderName}}</li>
              <li>{{item.buyOrsell}}</li>
              <li>{{item.openOrClose}}</li>
              <li>{{item.authPrice}}</li>
              <li>{{item.authNum}}</li>
              <li>{{item.orderTime}}</li>
              <li>{{item.resource}}</li> 
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.authAction">
                  <button @click="cancel">撤单</button>
              </div>
          </transition> 
          </div>
          </div>
        </div>
         <button class="cancelAllBtn">全部撤单</button>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" style="padding-top:35%">
        <div class="noData">
            <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="3" style="padding-top:35%">
        <div class="noData">
            <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="4" style="padding-top:35%">
        <div class="noData">
            <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
    </mt-tab-container> 
    <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script> 
 import Footer from '../components/FooterBar.vue'
 import { MessageBox } from "mint-ui";
  export default {
    data(){
      return {
        tabSelected:'1',
        authList:[ //委托列表
          {
              orderName:"螺纹1901", //合约名称
              orderState:"1", //状态 1-已报 2-已成交 3-部分成交 4-废单
              buyOrsell:"买入",//买卖
              openOrClose:"买开",//开平
              authPrice:"4423",//报单价格
              authNum:"1",//手数
              orderTime:"10:48", //报单时间
              resource:"策略", //来源
              authAction:false
          },
          {
              orderName:"螺纹1901", //合约名称
              orderState:"2", //状态 1-已报 2-已成交 3-部分成交 4-废单
              buyOrsell:"买入",//买卖
              openOrClose:"买开",//开平
              authPrice:"4423",//报单价格
              authNum:"1",//手数
              orderTime:"10:48", //报单时间
              resource:"策略", //来源
              authAction:false
          }
        ]
      }
    },
    components: {
      'footer-bar': Footer
    },
    methods: {
      showAuthAction(index){
          this.authList[index].authAction = !this.authList[index].authAction;
      },
      cancel(){
        MessageBox.alert("确定撤单么？");
      }
    },
    created(){
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
      this.$store.commit('SELECT_TAB', 'auth')
    }
  }
</script>
<style lang='scss'>
    .cancelAllBtn{
      margin:10em 3em;
      width: 80%;
      height: 3em;
      line-height: 3em;
      background: #f9a101;
      border-radius: 2em;
    }
  .authContainer{
    top:6.5em !important;
   .authTableWapper{
     background-image:linear-gradient(-90deg, rgba(20,23,31,0.00) 5%, #1c2431 100%);
     padding:0;
     width: 100%;
     overflow-x: auto;
     .authTable{
       width: 160%;
       border-spacing: initial !important;
       ul{
         list-style: none;
         display: flex;
         padding:0 1em;
         margin:0;
         height: 2.5em;
         line-height: 2.5em;
         color: #979797;
         li{
           width:15%;
           text-align: center;
         }
       }
       .tbContent{
         color: #fff;
       }
       .trSelected{
         background: rgba(249,161,1,0.26)
       }
       .actionBtn{
         width: 100%;
         height: 3em;
         display: flex;
         background: #060818;
         //transform:translate3d(0,-100%,0);
         button{
           margin:0.5em auto;
           background: #f9a101;;
           border-radius: 100px;
           width: 16%;
           height: 2em;
         }
       }
     }
   }
 }
 .noData{
   width: 80%;
   margin-left:10%;
   height: 70%;
   text-align: center;
   img{
     width: auto;
     height: auto;
     max-height: 100%;
     max-width: 100%;
   }
 }
</style>

