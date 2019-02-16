<template>
  <div id="transaction">
    <mt-header fixed title="中证期货 11788283">
      <mt-button class="iconfont icon-ico-exit" slot="left" @click="exitFuture"></mt-button>
      <mt-button class="iconfont icon-refresh" slot="right"></mt-button>
    </mt-header>
    <section class="equityInfo">
       <div class="infoContent">
         <div class="contentLf">
           <span>静态权益:</span>
           <span>1982332.12</span>
         </div>
         <div class="contentRt">
            <span>动态权益:</span>
           <span>1982332.12</span>
         </div>
       </div>
       <div class="infoContent">
         <div class="contentLf">
           <span>保证金:</span>
           <span>0.00</span>
         </div>
         <div class="contentRt">
           <span>可用资金:</span>
           <span>1982332.12</span>
         </div>
       </div>
    </section>
    <div class="orderPanel">
      <div class="orderForm">
          <div class="orderContentLf">
            <div class="orderSearch">
                <i class="iconfont icon-password"></i>
                <button>
                  <span>IF903</span>
                  <i class="iconfont icon-search searchBtn"></i> 
                </button>
            </div>
            <div class="orderInput">
                <div class="lotsInput">
                  <span>手数</span><input type="text"  v-model="inputLots" @focus="isInput=true,isPrice=false" readonly=""/>
                </div>
                <div class="priceInput">
                  <span>价格</span><input type="text" v-model="inputPrice" @focus="isInput=true,isPrice=true" readonly=""/>
                </div>
            </div> 
          </div>
          <div class="orderContentRt">
              <div class="info">
                 <span>新3276.4</span>
                 <span>1789</span>
              </div>
              <div class="info">
                 <span>卖3276.4</span>
                 <span>1</span>
              </div>
              <div class="info">
                 <span>买3276.4</span>
                 <span>1</span>
              </div>
          </div>
      </div>
      <div class="orderForm">
          <div class="btn buyMoreBtn">
             <span>3455.2</span>
             <hr>
             <span>买多</span>
          </div>
          <div class="btn sellNullBtn">
             <span>2827.2</span>
             <hr>
             <span>卖空</span>
          </div>
          <div class="btn closeOutBtn">
             <span>2827.2</span>
             <hr>
             <span>平今</span>
          </div>
          <div class="btn closeOutBtn">
             <span>2827.2</span>
             <hr>
             <span>平仓</span>
          </div>
      </div>
    </div>
    <mt-navbar class="stateNarBar" v-model="tabSelected">
      <mt-tab-item id="1">持仓</mt-tab-item>
      <mt-tab-item id="2">委托</mt-tab-item>
      <mt-tab-item id="3">成交</mt-tab-item>
    </mt-navbar>
     <mt-tab-container v-model="tabSelected" class="orderContainer">
      <mt-tab-container-item id="1">
        <div class="orderTableWapper">
          <div class="orderTable">
          <ul>
            <li>合约名称</li>
            <li>买卖</li>
            <li>总持仓</li>
            <li>可平量</li>
            <li>持仓均价</li>
            <li>持仓盈亏</li>
            <li>浮动盈亏</li> 
        </ul>
        <div v-for="(item,index) in holdList" :key="index">
          <ul :class="{trSelected:item.holdAction}" @click="showHoldAction(index)" class="tbContent">
              <li>{{item.orderName}}</li>
              <li>{{item.buyOrsell}}</li>
              <li>{{item.open}}</li>
              <li>{{item.orderPrice}}</li>
              <li>{{item.lots}}</li>
              <li>{{item.orderDate}}</li>
              <li>{{item.source}}</li> 
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.holdAction">
                  <button @click="backhand">反手</button>
              </div>
          </transition> 
          </div>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="orderTableWapper">
          <div class="orderTable">
          <ul>
            <li>合约名称</li>
            <li>状态</li>
            <li>买卖</li>
            <li>开平</li>
            <li>报单价格</li>
            <li>手数</li>
            <li>未成交</li>
            <li>报单时间</li>
        </ul>
        <div v-for="(item,index) in authList" :key="index">
          <ul :class="{trSelected:item.authAction}" @click="showAuthAction(index)" class="tbContent">
              <li>{{item.orderName}}</li>
              <li>{{item.orderState}}</li>
              <li>{{item.buyOrsell}}</li>
              <li>{{item.openOrClose}}</li>
              <li>{{item.authPrice}}</li>
              <li>{{item.authNum}}</li>
              <li>{{item.noDeal}}</li> 
              <li>{{item.orderTime}}</li>
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.authAction">
                  <button @click="cancel">撤单</button>
              </div>
          </transition> 
          </div>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <div class="orderTableWapper">
          <div class="orderTable doneTable">
          <ul>
            <li>合约名称</li>
            <li>买卖</li>
            <li>成交价</li>
            <li>手数</li>
            <li>成交时间</li>
        </ul>
        <div v-for="(item,index) in doneList" :key="index">
          <ul class="tbContent">
              <li>{{item.orderName}}</li>
              <li>{{item.buyOrsell}}</li>
              <li>{{item.donePrice}}</li>
              <li>{{item.doneNum}}</li>
              <li>{{item.doneTime}}</li>
          </ul>
          </div>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <keyBoard v-show="isInput" 
        :isInput = "isInput"
        :isPrice = "isPrice"
        @confirmEvent="_confirmEvent"
        @keyPressEvent="_keyPressEvent"
        @closeKeyBoard="_closeKeyBoard">
    </keyBoard>
    <keyBoard v-show="isInput" 
        :isInput = "isInput"
        :isPrice = "isPrice"
        @confirmEvent="_confirmEvent"
        @keyPressEvent="_keyPressEvent"
        @closeKeyBoard="_closeKeyBoard">
    </keyBoard>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import KeyBoard from "../../components/KeyBoard"
  export default {
    data(){
      return {
        tabSelected:"1",
        isInput:false,//是否输入
        isPrice:false,//输入价格
        inputLots:"1",//手数
        inputPrice:"市价",//价格
        holdList:[ //持仓列表
          { 
            orderName:"IF902", //合约名称
            buyOrsell:"买入",//买卖
            open:"开仓",//开平
            orderPrice:"3000",//报单价格
            lots:"2",//手数
            orderDate:"2018/9/20",//报单时间
            source:"1200", //来源
            holdAction:false
          },
          { 
            orderName:"IF902", //合约名称
            buyOrsell:"买入",//买卖
            open:"开仓",//开平
            orderPrice:"3000",//报单价格
            lots:"2",//手数
            orderDate:"2018/9/20",//报单时间
            source:"1200", //来源
            holdAction:false
          },
        ],
        authList:[ //委托列表
          { 
              orderName:"螺纹1901", //合约名称
              orderState:"全成", //状态
              buyOrsell:"买入",//买卖
              openOrClose:"买开",//开平
              authPrice:"4423",//报单价格
              authNum:"1",//手数
              noDeal:"未成交",//未成交
              orderTime:"10:48", //报单时间
              authAction:false
          }, { 
              orderName:"螺纹1901", //合约名称
              orderState:"全成", //状态
              buyOrsell:"买入",//买卖
              openOrClose:"买开",//开平
              authPrice:"4423",//报单价格
              authNum:"1",//手数
              noDeal:"未成交",//未成交
              orderTime:"10:48", //报单时间
              authAction:false
          }
        ],
        doneList:[ //成交列表
          {
              orderName:"螺纹1901", //合约名称
              buyOrsell:"买入",//买卖
              donePrice:"4423",//成交价格
              doneNum:"1",//手数
              doneTime:"10:48" //成交时间
          }
        ]
      }
    },
    components:{
      keyBoard : KeyBoard
    },
    methods: {
      showHoldAction(index){
          this.holdList[index].holdAction = !this.holdList[index].holdAction;
      },
      showAuthAction(index){
          this.authList[index].authAction = !this.authList[index].authAction;
      },
      backhand(){
        MessageBox.alert("确定反手么？")
      },
      cancel(){
        MessageBox.alert("确定撤单么？")
      },
      exitFuture(){ //向父组件传值
        this.$emit("reLogin","reLogin")
      },
      _keyPressEvent(num){ //按键处理 
       if(!this.isPrice){ //手数
         this.inputLots = "0";
         if(num&&num>0){
            this.inputLots = num;
          }
       }else{ //市价
          if(num&&num>0){
            this.inputPrice = num;
            }else{
                this.inputPrice = "0";
            }
       }
       
      },
      _confirmEvent(result){ //键盘确定
        //this.inputLotsAll = result;
      },
      _closeKeyBoard(res){ //关闭键盘
        this.isInput = false;
      }
    },
    created(){

    }
  }
</script>
<style lang='scss'>
 .equityInfo{
   margin-top:3em;
   padding:1em 1em 0 1em;
   .infoContent{
     display: inline-flex;
     flex-direction: row;
     justify-content: space-between;
     width: 100%;
     margin-bottom: 1em;
     .contentLf{
       margin-right: 1em;
     }
   }
 }
 .orderPanel{
   background: #1c2431;
   padding: 1em 1em 0 1em;
   .orderForm{
     display:inline-flex;
     flex-wrap: wrap;
     width: 100%;
     justify-content:space-between;
     margin-bottom:1em;
     .orderContentLf{
       width: 49%;
       border-radius: 4px;
       .orderSearch{
         position: relative;
         background: #3b4049;
         padding:0.5em;
         border-radius: 4px;
         margin-bottom: 0.5em;
         .searchBtn{
           position:absolute;
           right: .5em;
           top:.5em;
         }
       }
       .orderInput{
         display:flex;
         width: 100%;
         span{
           color: #979797;
           padding-left:5px;;
         }
         input{
           display: inline-block;
           width: 50% !important;
           background: transparent;
           border:0;
           color: #fff;
           text-align: right;
           padding:0;
           margin:0;
           font-size:14px;
         }
         .lotsInput{
           background: #3b4049;
           padding:.5em 0;
           border-radius: 4px;
           margin-right: .5em;
         }
         .priceInput{
           background: #3b4049;
           padding:.5em 0;
           border-radius: 4px;
         }
       }
     }
     .orderContentRt{
       width: 45%;
       color:#979797;
       background: #3b4049;
       border-radius: 4px;
       padding:.5em;
       .info{
         display:flex;
         justify-content:space-between;
       }
     }
     .btn{
       width: 15%;
       text-align: center;
       border-radius: 4px;
       padding:0.5em 1em;
     }
     .buyMoreBtn{ 
       background: #ff6960;
     }
     .sellNullBtn{
       background: #00bd9a;
     }
     .closeOutBtn{
       background: #3b4049;
     }
   }
 }
 .stateNarBar{
   position: relative !important;
   z-index: 0 !important;
   margin-top:.5em !important;
   
 }
 .orderContainer{
   margin-top:.5em;
   top:0 !important;
   .orderTableWapper{
     background-image:linear-gradient(-90deg, rgba(20,23,31,0.00) 5%, #1c2431 100%);
     padding:0;
     width: 100%;
     overflow-x: auto;
     .orderTable{
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
 .doneTable{
    width: 100% !important;
    li{
      width: 20% !important;
    }
 }
      
</style>

