<template>
  <div id="auth">
    <mt-header fixed title="策略交易平台">
      <!-- <mt-button class="iconfont icon-exit" slot="right" @click="exit"></mt-button> -->
    </mt-header>
    <mt-navbar class="page-part" v-model="tabSelected">
      <mt-tab-item id="1">持仓汇总</mt-tab-item>
      <mt-tab-item id="2">持仓明细</mt-tab-item> 
    </mt-navbar>
    <mt-tab-container v-model="tabSelected" class="holdContainer">
      <mt-tab-container-item id="1">
        <div class="holdTableWapper">
          <div class="holdTable">
          <ul>
            <li>合约名称</li>
            <li>买卖</li>
            <li>总持仓</li>
            <li>昨仓</li>
            <li>今仓</li>
            <li>可平今</li>
            <li>可平量</li>
            <li>持仓均价</li>
            <li>占用保证金</li>
            <li>持仓盈亏</li>
            <li>浮动盈亏</li>
            <li>交易所</li>
        </ul>
        <div v-for="(item,index) in holdList" :key="index">
          <ul :class="{trSelected:item.listAction}" @click="showListAction(index)" class="tbContent">
              <li>{{item.orderName}}</li>
              <li>{{item.buyOrsell}}</li>
              <li>{{item.holdAll}}</li>
              <li>{{item.yesterDayHold}}</li>
              <li>{{item.todayHold}}</li>
              <li>{{item.todayOffset}}</li>
              <li>{{item.OffsetAll}}</li>
              <li>{{item.holdAvg}}</li>
              <li>{{item.bail}}</li>
              <li>{{item.holdProfit}}</li>
              <li>{{item.floatProfit}}</li>
              <li>{{item.tradingPlace}}</li>
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.listAction">
                  <button>交易</button>
              </div>
          </transition> 
          </div>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
         <div class="holdTableWapper">
          <div class="holdTable">
          <ul>
            <li>合约名称</li>
            <li>买卖</li>
            <li>手数</li>
            <li>开仓价</li>
            <li>占用保证金</li>
            <li>持仓类型</li>
            <li>开仓时间</li>
            <li>持仓盈亏</li>
            <li>浮动盈亏</li>
        </ul>
        <div v-for="(item,index) in holdDetail" :key="index">
          <ul :class="{trSelected:item.detailAction}" @click="showDetailAction(index)" class="tbContent">
              <li>{{item.orderName}}</li>
              <li>{{item.buyOrsell}}</li>
              <li>{{item.lots}}</li>
              <li>{{item.openPrice}}</li>
              <li>{{item.bail}}</li>
              <li>{{item.holdType}}</li>
              <li>{{item.openTime}}</li>
              <li>{{item.holdProfit}}</li>
              <li>{{item.floatProfit}}</li>
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.detailAction">
                  <button>交易</button>
              </div>
          </transition> 
          </div>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <button class="cancelAllBtn">全部平仓</button>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
import Footer from '../components/FooterBar.vue'
  export default {
    data(){
      return {
        tabSelected:'1',
        holdList:[ //持仓列表
          {
            orderName:" IF1902",//合约名称
            buyOrsell:"买入", //买卖
            holdAll:"3",//总持仓
            yesterDayHold:"2",//昨仓
            todayHold:"2",//今仓
            todayOffset:"2",//可平今量
            OffsetAll:"3",//可平量
            holdAvg:"90",//持仓均价
            bail:"89",//占用保证金
            holdProfit:"233",//持仓盈亏
            floatProfit:"232",//浮动盈亏
            tradingPlace:"郑商所", //交易所
            listAction:false
          }
        ],
        holdDetail:[ //持仓明细
          {
            orderName:"IF1902",//合约名称
            buyOrsell:"买入",//买卖
            lots:"4",//手数
            openPrice:"10",//开仓价
            bail:"2",//占用保证金
            holdType:"平仓",//持仓类型
            openTime:"10:45",//开仓时间
            holdProfit:"23",//持仓盈亏
            floatProfit:"233", //浮动盈亏
            detailAction:false
          }
        ]
      }
    },
    components: {
      'footer-bar': Footer
    },
    methods: {
      showListAction(index){
          this.holdList[index].listAction = !this.holdList[index].listAction;
      },
      showDetailAction(index){
          this.holdDetail[index].detailAction = !this.holdDetail[index].detailAction;
      },
    },
    created(){
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
      this.$store.commit('SELECT_TAB', 'hold')
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
    .holdContainer{
      top:6.5em !important;
    .holdTableWapper{
      background-image:linear-gradient(-90deg, rgba(20,23,31,0.00) 5%, #1c2431 100%);
      padding:0;
      width: 100%;
      overflow-x: auto;
      .holdTable{
        width: 250%;
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
</style>

