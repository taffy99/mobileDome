<template>
  <div id="transaction">
    <mt-header fixed :title="companyName">
      <mt-button class="iconfont icon-ico-exit" slot="left" @click="exitFuture"></mt-button>
      <mt-button class="iconfont icon-refresh" slot="right" :class="{rotate360:isrotate}" @click="rotate"></mt-button>
    </mt-header>
    <section class="equityInfo">
       <div class="infoContent">
         <div class="contentLf">
           <span>静态权益:</span>
           <span>{{staticRights}}</span>
         </div>
         <div class="contentRt">
            <span>动态权益:</span>
           <span>{{dynamicRights}}</span>
         </div>
       </div>
       <div class="infoContent">
         <div class="contentLf">
           <span>保证金:</span>
           <span>{{bond}}</span>
         </div>
         <div class="contentRt">
           <span>可用资金:</span>
           <span>{{availableFunds}}</span>
         </div>
       </div>
    </section>
    <div class="orderPanel">
      <div class="orderForm">
          <div class="orderContentLf">
            <div class="orderSearch">
                <i class="iconfont icon-password"></i>
                <button @click="handleClick">
                  <span>{{futureName}}</span>
                  <i class="iconfont icon-search searchBtn"></i>
                </button>
            </div>
            <div class="orderInput">
                <div class="lotsInput">
                  <span>手数</span><input type="text"  v-model="inputLots" @focus="isInput=true,isLots=true,isPrice=false" readonly=""/>
                </div>
                <div class="priceInput">
                  <span>价格</span><input type="text" v-model="inputPrice" @focus="isInput=true,isLots=false,isPrice=true" readonly=""/>
                </div>
            </div>
          </div>
          <div class="orderContentRt">
              <div class="info">
                 <span>新{{lastPrice}}</span>
                 <span>{{volume}}</span>
              </div>
              <div class="info">
                 <span>卖{{askPrice1}}</span>
                 <span>{{askVolume1}}</span>
              </div>
              <div class="info">
                 <span>买{{bidPrice1}}</span>
                 <span>{{bidVolume1}}</span>
              </div>
          </div>
      </div>
      <div class="orderForm">
          <div class="btn buyMoreBtn" @click="buyMore">
             <span>{{buyPrice}}</span>
             <hr>
             <span>买多</span>
          </div>
          <div class="btn sellNullBtn" @click="shortSelling">
             <span>{{sellPrice}}</span>
             <hr>
             <span>卖空</span>
          </div>
          <div class="btn closeOutBtn" @click="clsTodayPosition">
             <span>{{closePrice}}</span>
             <hr>
             <span>平今({{todayClose}})</span>
             <span></span>
          </div>
          <div class="btn closeOutBtn" @click="clsAllPosition()">
             <span>{{closePrice}}</span>
             <hr>
             <span v-if="closeFlag==='buy'">平仓({{totalClose}})</span>
             <span v-else-if="closeFlag==='sell'">平仓({{totalClose}})</span>
             <span v-else>平仓({{totalClose}})</span>
          </div>
      </div>
    </div>
    <mt-navbar class="stateNarBar" v-model="tabSelected">
      <mt-tab-item id="1" @click.native="tabChange(1)">持仓</mt-tab-item>
      <mt-tab-item id="2" @click.native="tabChange(2)">委托</mt-tab-item>
      <mt-tab-item id="3" @click.native="tabChange(3)">成交</mt-tab-item>
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
        <div v-for="(item,index) in searchHoldList" :key="index">
          <ul :class="{trSelected:item.holdAction}" @click="showHoldAction(index)" class="tbContent">
              <li>{{item.FutureName}}</li>
              <li :style="{'color':item.isBuy?'#ff6960':'#00bd9a'}">{{item.directionType}}</li>
              <li>{{item.totalPosition}}</li>
              <li>{{item.availableClose}}</li>
              <li>{{item.avgPosition}}</li>
              <li>{{item.positionProfit}}</li>
              <li>{{item.positionProfit}}</li>
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.holdAction">
                  <button @click="backhand(index)">反手</button>
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
              <li>{{item.FutureName}}</li>
              <li>{{item.orderExecutionStatus}}</li>
              <li :style="{'color':item.orderType == '买' ?'#ff6960':'#00bd9a'}">{{item.orderType}}</li>
              <li>{{item.offsetFlag}}</li>
              <li>{{item.orderPrice}}</li>
              <li>{{item.orderQty}}</li>
              <li>{{item.orderPriceType}}</li>
              <li>{{item.orderTime}}</li>
          </ul>
          <transition name="action">
              <div class="actionBtn" v-show="item.authAction">
                <button v-if="item.numOrderStatus == 2||item.numOrderStatus == 3||item.numOrderStatus == 7" @click="removerOrder(item.futureCode,item.exchId,item.contractId,item.futureOrderId)">撤单</button>
                <button v-else style="background-color: #999;" >撤单</button>
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
              <li>{{item.FutureName}}</li>
              <li :style="{'color':item.orderType == '买' ?'#ff6960':'#00bd9a'}">{{item.orderType}}</li>
              <li>{{item.orderPrice}}</li>
              <li>{{item.orderQty}}</li>
              <li>{{item.tradeTime}}</li>
          </ul>
          </div>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <mt-spinner type="fading-circle" :size="20" class="loadingCls" v-show="isLoading" style="margin:0;padding:0;"></mt-spinner>
    <mt-popup v-model="popupVisible" position="right">
        <mt-header fixed>
          <mt-button class="iconfont icon-left-" slot="left" @click="closePopup"></mt-button>
        </mt-header>
        <mt-search
            autofocus
            v-model="value"
            :result="filterResult">
            <ul  v-for="(item,index) in filterResult" v-bind:key="index" class="searchResult" @click="searchResult(index)">
              <li style="width:30%">{{item.name}}</li>
              <li style="width:50%">{{item.exchName}}</li>
            </ul>
        </mt-search>
      </mt-popup>
    <keyBoardLots v-show="isInput"
        :isInput = "isInput"
        :isLots = "isLots"
        :isPrice = "isPrice"
        :maxOpenLots = "maxOpenLots"
        @keyPressEvent="_keyPressEvent"
        @closeKeyBoard="_closeKeyBoard">
    </keyBoardLots>
    <KeyBoardPrice v-show="isPrice"
        :isInput = "isInput"
        :isPrice = "isPrice"
        :isLots = "isLots"
        :priceTick = "priceTick"
        :maketPrice = "maketPrice"
        :opponentPrice = "opponentPrice"
        :upperLimitPrice = "upperLimitPrice"
        :lowerLimitPrice = "lowerLimitPrice"
        @keyPressEvent="_keyPressEvent"
        @closeKeyBoard="_closeKeyBoard">
    </KeyBoardPrice>
  </div>
</template>
<script>
import { MessageBox, Toast  } from "mint-ui";
import KeyBoard from "../../components/keyBoard.vue"
  let interval;
  export default {
    inject:['reload'], //注入依赖 App.vue中有声明
    data(){
      return {
        companyName:sessionStorage.getItem('companyName'),
        isrotate:false, //刷新按钮
        tabSelected:"1",
        popupVisible:false,
        value: 'if',
        futureName:'请选合约',//合约名称
        futureCode:"",//合约代码
        searchList: [],  // 搜索列表
        staticRights:"0.00", //静态权益
        dynamicRights:"0.00", //动态权益
        lastPrice:"0.00", //最新价
        volume:"0", //成交手数
        askPrice1:"0.00", //申卖价
        askVolume1:"0", //申卖量
        bidPrice1:"0.00", //申买价
        bidVolume1:"0", //申买量
        bond:"0.00", //保证金
        availableFunds:"0.00", //可用资金
        isLoading:true,

        isInput:false, //是否输入
        isLots:false,//输入手数
        isPrice:false, //输入价格
        inputLots:0, //手数
        inputPrice:"",//输入价
        newPrice:"最新价",//最新价
        maketPrice:"市价",//市价
        opponentPrice:"对手价", //对手价

        buyPrice:"0.00",//买入价
        sellPrice:"0.00",//卖出价
        closeFlag:"",//平仓标志
        todayClose:0,//平今量
        totalClose:0,//平仓量
        closePrice:"0.00",//平仓价

        maxOpenLots:0,//最大开仓手数

        priceTick:0.00,//最小变动价
        upperLimitPrice:"0.00",//涨停板价
        lowerLimitPrice:"0.00", //跌停板价

        holdList:[], //持仓列表
        searchHoldList:[],//持仓列表筛选
        authList:[ //委托列表

        ],
        doneList:[ //成交列表
        ],
        //行情简写
        simpleFutureName:[
          {
            futureName:"沪深300股指",
            sName:"IF"
          },
          {
            futureName:"中证500股指",
            sName:"IC"
          },
          {
            futureName:"上证50股指",
            sName:"IH"
          },
          {
            futureName:"2年期国债",
            sName:"二债"
          },
          {
            futureName:"5年国债",
            sName:"五债"
          },
          {
            futureName:"10年国债",
            sName:"十债"
          }
        ]
      }
    },
    components:{
      keyBoardLots : KeyBoard,
      KeyBoardPrice : KeyBoard

    },
    computed:{
        filterResult() {
        return this.searchList.filter(item => new RegExp(this.value, 'i').test(item.code));
      }
    },
    mounted(){
       this.inputPrice = this.newPrice;
       this.queryTradingAccount();//资金查询
      /*当日委托查询(lyc)*/
      this.entrust();
      /*当日委托查询(lyc)*/
      this.scsTrading();

      let holdFutureCode = sessionStorage.getItem('holdFutureCode');//持仓
      let selfFutureCode = sessionStorage.getItem('selfFutureCode');//自选
      let marketFutureCode = sessionStorage.getItem('marketFutureCode');//市场

      if(holdFutureCode){ //持仓页面跳转
        let futureName = sessionStorage.getItem('holdFutureName');
        let exchId = sessionStorage.getItem('holdExchId');
        this.searchResult('sourceFormHoldPage',holdFutureCode,futureName,exchId)
        this.queryPosition(holdFutureCode);//持仓信息查询
        sessionStorage.removeItem('holdFutureCode');
        sessionStorage.removeItem('holdFutureName');
        sessionStorage.removeItem('holdExchId');
      }else if(selfFutureCode){ //自选页面跳转
        let futureName = sessionStorage.getItem('selfFutureName');
        let exchId = sessionStorage.getItem('selfExchId');
        this.searchResult('',selfFutureCode,futureName,exchId)
        this.queryPosition(selfFutureCode);//持仓信息查询
        sessionStorage.removeItem('selfFutureCode');
        sessionStorage.removeItem('selfFutureName');
        sessionStorage.removeItem('selfExchId');
      }else if(marketFutureCode){ //市场页面跳转
        let futureName = sessionStorage.getItem('marketFutureName');
        let exchId = sessionStorage.getItem('marketExchId');
        this.searchResult('',marketFutureCode,futureName,exchId)
        this.queryPosition(marketFutureCode);//持仓信息查询
        sessionStorage.removeItem('marketFutureCode');
        sessionStorage.removeItem('marketFutureName');
        sessionStorage.removeItem('marketExchId');
      }else{ //正常进入
        this.queryPosition();//持仓信息查询
      }
    },
    methods: {
      rotate(){ //刷新
          this.isrotate = true;
          setTimeout(()=>{
              this.isrotate = false;
          },1000)
          //this.reload();
          this.isLoading = true;
          this.searchHoldList = [];
          this.authList = [];
          this.doneList = [];
          this.queryPosition();//持仓信息查询
          this.queryTradingAccount();//资金查询
          /*当日委托查询(lyc)*/
          this.entrust();
          /*当日委托查询(lyc)*/
          this.scsTrading();
      },
      handleClick(){ //搜索
          this.popupVisible = true;
          this.getDefaultResult();
      },
      closePopup(){
          this.popupVisible = false;
      },
      getDefaultResult(){ //获取搜索列表
          let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
          if(futureInfo && futureInfo.length>0){
            this.setSimpleName(futureInfo);
            for(let i in futureInfo){
              if(futureInfo[i].ExchId == "111"){
                this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchId:futureInfo[i].ExchId,
                  exchName:'中国金融期货交易所',
                  addself:false
                })
              }else if(futureInfo[i].ExchId == "112"){
                this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchId:futureInfo[i].ExchId,
                  exchName:'上海期货交易所',
                  addself:false
                })
              }else if(futureInfo[i].ExchId == "113"){
                this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchId:futureInfo[i].ExchId,
                  exchName:'大连商品交易所',
                  addself:false
                })
              }else if(futureInfo[i].ExchId == "114"){
                 this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchId:futureInfo[i].ExchId,
                  exchName:'郑州商品交易所',
                  addself:false
                })
              }
            }
          }
          this.searchList = this.uniqArr(this.searchList,"code")
        },
        setSimpleName(futureInfo){ //期货名称替换简写
          for(let k in this.simpleFutureName){
              for (let m in futureInfo){
                futureInfo[m].FutureName = futureInfo[m].FutureName.replace(this.simpleFutureName[k].futureName,this.simpleFutureName[k].sName);
              }
          }
          return futureInfo;
      },
      queryFutureName(arr,key){ //查询期货名称
          if(sessionStorage.getItem('futureInfo') && sessionStorage.getItem('futureInfo')!="undefined"){
            let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
            if(futureInfo && futureInfo.length>0){
              this.setSimpleName(futureInfo);
              //市场行情展示
              for(let i in arr){
                for(let j in futureInfo){
                  if(arr[i][key] == futureInfo[j].FutureCode){
                    this.$set(arr[i],'FutureName',futureInfo[j].FutureName);
                    this.$set(arr[i],'exchId',futureInfo[j].ExchId);
                    this.$set(arr[i],'volumeMultiple',futureInfo[j].VolumeMultiple);//乘数
                    this.$set(arr[i],'priceTick',futureInfo[j].PriceTick)
                  }
                }
            }
            }
          }
          return arr;
        },
      showHoldAction(index){ //选择合约
          this.searchHoldList[index].holdAction = !this.searchHoldList[index].holdAction;
          if(this.searchHoldList[index].holdAction){
            this.futureName = this.searchHoldList[index].FutureName; //期货名称
            this.futureCode = this.searchHoldList[index].futureCode; //期货代码
            this.priceTick = this.searchHoldList[index].priceTick; //最小变动价
            if(this.searchHoldList[index].exchId == "112"){ //上期所
              this.todayClose =  this.searchHoldList[index].todayAvailbClose;//平今量
              this.totalClose = this.searchHoldList[index].availableClose- this.todayClose;
            } else{
              this.todayClose = 0;
              this.totalClose = this.searchHoldList[index].availableClose;//可平量
            }
             this.inputLots = this.totalClose;

            let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
            let exchId="";
            if(this.searchHoldList[index].directionType=="买"){
              this.closeFlag = "buy";
            }else if(this.searchHoldList[index].directionType=="卖"){
              this.closeFlag = "sell";
            }else{
              this.closeFlag = "";
            }
            if(futureInfo && futureInfo.length>0){
              for(let i in futureInfo){
                if(this.futureCode == futureInfo[i].FutureCode){
                  exchId = futureInfo[i].ExchId;
                  break;
                }
              }
            };
            let content =  { //按照期货代码订阅
                "functionId":"50000105",
                "requestId":"123",
                "req_ans":"req",
                "code": [{
                  "exchId":exchId,
                  "futureCode":this.futureCode
                }]
            };
            let message ={
              serviceCode: "10000702" ,
              content : JSON.stringify(content),
            };
            this.webSocketApi.sendSock(message);

            let self = this;
            this.$nextTick(()=>{
                if(self.webSocketApi.res!=undefined){
                      setInterval(function(){
                      let resData = self.webSocketApi.res[0];
                      self.lastPrice = resData.lastPrice.toFixed(2); //最新价
                      self.maxOpenLots = parseInt(self.availableFunds/self.lastPrice);//最大开仓手数
                      self.upperLimitPrice = resData.upperLimitPrice.toFixed(2);//涨停板价
                      self.lowerLimitPrice = resData.lowerLimitPrice.toFixed(2);//跌停板价
                      self.volume = resData.volume;
                      self.askPrice1 = resData.askPrice1.toFixed(2);
                      self.askVolume1 = resData.askVolume1;
                      self.bidPrice1 = resData.bidPrice1.toFixed(2);
                      self.bidVolume1 = resData.bidVolume1;
                  },1000);
                  clearInterval(interval);
                  interval = setInterval(function(){
                      let resData = self.webSocketApi.res[0];
                      if(self.inputPrice == "对手价"){
                        self.buyPrice = resData.askPrice1.toFixed(2);
                        self.sellPrice = resData.bidPrice1.toFixed(2);
                      }else if(self.inputPrice == "市价"){
                        self.buyPrice = self.upperLimitPrice;
                        self.sellPrice = self.lowerLimitPrice;
                      }else{
                        self.buyPrice = resData.bidPrice1.toFixed(2);
                        self.sellPrice = resData.askPrice1.toFixed(2);
                      }
                      if(self.closeFlag=="buy"){
                        self.closePrice = self.sellPrice;
                      }else if(self.closeFlag == "sell"){
                        self.closePrice = self.buyPrice;
                      }
                  },1000);
                }
              })
          }
      },
      showAuthAction(index){
          this.authList[index].authAction = !this.authList[index].authAction;
      },
      backhand(index){ //反手交易 买多<->卖空调转
        let futureCode = this.searchHoldList[index].futureCode;//选中的期货代码
        let directionType = this.searchHoldList[index].directionType;//选中的买卖方向
        let availableClose = this.searchHoldList[index].availableClose;//可平量
        let offsetFlag = 2;//平仓方向
        if(this.searchHoldList[index].exchId=="112"){ //上期所
            offsetFlag = 4
        }
         MessageBox.confirm("确定反手吗?", "提示",{
            confirmButtonText: '反手',
          }).then(action=>{
              //先平仓
              let content = { //持仓信息查询
                "functionId": "71000102",
                "sessionId": "321",     //由请求端自己填写，用于区分请求
                "custAcctCode":sessionStorage.getItem('custAcctCode'),
                "token":this.$store.state.futureToken, //futureToken期货token
                //包体参数
                "futureCode":this.futureCode,
                "custCode":sessionStorage.getItem('custAcctCode'),
                "orderPriceType":2,//报单价格条件类型 2-限价
                "orderType":directionType=="买"?2:1,//买卖方向 1-买 2-卖
                "offsetFlag":offsetFlag,//开平标志 1-开仓 2 平仓 4-平今  5 平昨
                "hedgeFlag":1,//投机套保标志 1-投机
                "orderPrice":directionType=="买"?parseFloat(this.sellPrice):parseFloat(this.buyPrice),//对手价
                "orderQty":parseInt(availableClose),//数量
                "effectiveTimeType":3,//有效期类型 3-当日有效
                "knockQtyType":1,//成交量类型 1-任何数量
                "minKnockQty":1,//最小成交量
                "triggerCondition":1 //触发条件 1-立即
              };
            let message = { //投资者持仓查询
                serviceCode: "10000701",
                content:JSON.stringify(content)
              };
            this.webSocketApi.sendSock(message);

            let self = this;
            setTimeout(() => {
                if(self.webSocketApi.transactionPush && self.webSocketApi.transactionPush!="undefined"){ //有平仓成交推送
                  //反向下单（买多<->卖空调转）
                  let content = { //持仓信息查询
                    "functionId": "71000102",
                    "sessionId": "123",     //由请求端自己填写，用于区分请
                    "custAcctCode":sessionStorage.getItem('custAcctCode'),
                    "token":self.$store.state.futureToken, //futureToken期货token
                    //包体参数
                    "futureCode":self.futureCode,
                    "custCode":sessionStorage.getItem('custAcctCode'),
                    "orderPriceType":2,//报单价格条件类型 2-限价
                    "orderType":directionType == "买"?2:1,//买卖方向 1-买 2-卖
                    "offsetFlag":1,//开平标志 1-开仓
                    "hedgeFlag":1,//投机套保标志 1-投机
                    "orderPrice":directionType=="买"?parseFloat(self.sellPrice):parseFloat(self.buyPrice),//价格
                    "orderQty":parseInt(availableClose),//数量
                    "effectiveTimeType":3,//有效期类型 3-当日有效
                    "knockQtyType":1,//成交量类型 1-任何数量
                    "minKnockQty":1,//最小成交量
                    "triggerCondition":1 //触发条件 1-立即
                  };
                  let message = { //投资者持仓查询
                      serviceCode: "10000701",
                      content:JSON.stringify(content)
                    };
                  self.webSocketApi.sendSock(message);
                }
              }, 2000)
              setTimeout(() => { //3s后刷新持仓列表
                  this.queryPosition();
                  this.isLoading = true;
                  this.searchHoldList = [];
              }, 3000)
          }).catch(err=>{
            console.log("")
          });
      },
      exitFuture(){ //向父组件传值
        this.$emit("reLogin", "reLogin")
      },
      _keyPressEvent(num){ //按键处理
       if(!this.isPrice){ //手数
         this.inputLots = 0;
         if(num&&num>0){
            this.inputLots = num;
          }
       }else{ //市价
          if(num&&num>0){
            clearInterval(interval);
            this.inputPrice = num;
            this.buyPrice = this.inputPrice;
            this.sellPrice = this.inputPrice;
            this.closePrice = this.inputPrice;
            }else if(num == "对手价"){
              this.inputPrice = this.opponentPrice;
              clearInterval(interval);
              let self = this;
              interval = setInterval(function(){
                  let resData = self.webSocketApi.res[0];
                  self.buyPrice = resData.askPrice1.toFixed(2);
                  self.sellPrice = resData.bidPrice1.toFixed(2);
                  if(self.closeFlag=="buy"){
                    self.closePrice = self.sellPrice;
                  }else if(self.closeFlag == "sell"){
                    self.closePrice = self.buyPrice;
                  }
              },1000);
            }else if(num =="市价"){
              this.inputPrice = this.maketPrice;
              clearInterval(interval);
              let self = this;
              interval = setInterval(function(){
                  let resData = self.webSocketApi.res[0];
                  self.buyPrice = self.upperLimitPrice;
                  self.sellPrice = self.lowerLimitPrice;

                  if(self.closeFlag=="buy"){
                    self.closePrice = self.sellPrice;
                  }else if(self.closeFlag == "sell"){
                    self.closePrice = self.buyPrice;
                  }
              },1000);

            }else if(num == "最新价"){
              this.inputPrice = this.newPrice;
              clearInterval(interval);
              let self = this;
              interval = setInterval(function(){
                  let resData = self.webSocketApi.res[0];
                  self.buyPrice = resData.bidPrice1.toFixed(2);
                  self.sellPrice = resData.askPrice1.toFixed(2);
                  if(self.closeFlag=="buy"){
                    self.closePrice = self.sellPrice;
                  }else if(self.closeFlag == "sell"){
                    self.closePrice = self.buyPrice;
                  }
              },1000);
            }else{
              this.inputPrice = "0.00";
              this.buyPrice =  this.inputPrice;
              this.sellPrice =  this.inputPrice;
              this.closePrice = this.inputPrice;
            }
       }
      },
      _confirmEvent(result){ //键盘确定
        //this.inputLotsAll = result;
      },
      _closeKeyBoard(res){ //关闭键盘
        this.isInput = false;
      },
      uniqArr(arr,key){ //数组去重
          for(let i=0;i<arr.length;i++){ //去重
            for(let j=i+1;j<arr.length;j++){
              if(arr[i][key] == arr[j][key]){
                arr.splice(j,1);
                j--;
              }
            }
          }
          return arr;
      },
        searchResult(index,futureCode,futureName,exchId){
        this.popupVisible = false;
        let content =  { //按照期货代码订阅
            "functionId":"50000101",
            "requestId":"123",
            "req_ans":"req",
        };
        if(futureCode){
          this.futureName = futureName;
          this.futureCode = futureCode;
          content.code = [{
            "exchId":exchId,
            "futureCode":futureCode
          }]
        }else{
          this.futureName = this.filterResult[index].name;
          this.futureCode = this.filterResult[index].code;
          this.priceTick = this.filterResult[index].priceTick;
          content.code = [{
            "exchId":this.filterResult[index].exchId,
            "futureCode":this.filterResult[index].code
          }]
        }
        let message ={
          serviceCode: "10000702" ,
          content : JSON.stringify(content),
        };
        this.webSocketApi.sendSock(message);
        this.searchHoldList = this.holdList.filter(item => item.futureCode == this.filterResult[index].code)
        let self = this;
        if(this.searchHoldList.length>0){
          this.showHoldAction(0);
        }else{
          this.todayClose = 0;
          this.totalClose = 0;
          this.closePrice = "0.00";
        }
         // debugger
        this.$nextTick(()=>{
            setInterval(function(){
                let resData = self.webSocketApi.res[0];
                self.lastPrice = resData.lastPrice.toFixed(2);
                self.maxOpenLots = parseInt(self.availableFunds/self.lastPrice);//最大开仓手数
                self.upperLimitPrice = resData.upperLimitPrice.toFixed(2);//涨停板价
                self.lowerLimitPrice = resData.lowerLimitPrice.toFixed(2);//跌停板价
                self.volume = resData.volume;
                self.askPrice1 = resData.askPrice1.toFixed(2);
                self.askVolume1 = resData.askVolume1;
                self.bidPrice1 = resData.bidPrice1.toFixed(2);
                self.bidVolume1 = resData.bidVolume1;
            },1000)
            clearInterval(interval);
            interval = setInterval(function(){
                let resData = self.webSocketApi.res[0];
                if(self.inputPrice == "对手价"){
                   self.buyPrice = resData.askPrice1.toFixed(2);
                   self.sellPrice = resData.bidPrice1.toFixed(2);
                }else if(self.inputPrice == "市价"){
                  self.buyPrice = self.upperLimitPrice;
                  self.sellPrice = self.lowerLimitPrice;
                }else{
                  self.buyPrice = resData.bidPrice1.toFixed(2);
                  self.sellPrice = resData.askPrice1.toFixed(2);
                }
            },1000);
          })
      },
      queryPosition(futureCode){ //持仓信息查询
          let content = { //持仓信息查询
            "functionId": "71000108",
            "sessionId": "123",     //由请求端自己填写，用于区分请求
            //"custAcctCode":"096539",
            "custAcctCode":sessionStorage.getItem('custAcctCode'),
            "token":this.$store.state.futureToken, //futureToken期货token
            //包体参数
            "futureCode":" "  //为空时查询全部合约
          };
        let message = { //投资者持仓查询
            serviceCode: "10000701",
            content:JSON.stringify(content)
          };
        this.webSocketApi.sendSock(message);

        let self = this;
        this.$nextTick(()=>{
             setTimeout(() => {
                this.isLoading = false;
                if(self.webSocketApi.ftdcQryInvestorPosition && self.webSocketApi.ftdcQryInvestorPosition!=undefined){ //ORS持仓查询
                  self.holdList = self.webSocketApi.ftdcQryInvestorPosition;
                  if(self.holdList && self.holdList.length>0){
                    self.holdList = self.queryFutureName(self.holdList,"futureCode");
                    for (let i in self.holdList){
                        let directionType;//买卖方向
                        if(self.holdList[i].posiDirection == 3){ //空头
                          directionType = "卖";
                          self.$set(self.holdList[i],'isBuy',false);
                        }else if(self.holdList[i].posiDirection == 2){ //多头
                           directionType = "买";
                           self.$set(self.holdList[i],'isBuy',true);
                        };
                        let todayAvailbClose = self.holdList[i].todayPosition - self.holdList[i].longFrozen - self.holdList[i].shortFrozen;//今日可平= 今日持仓-多头冻结-空头冻结
                        let totalPosition = self.holdList[i].totalPosition;//总持仓 = 今持 + 昨持
                        let availableClose = totalPosition - self.holdList[i].longFrozen - self.holdList[i].shortFrozen;//总可平量 = 总持- 多头冻结-空头冻结
                        let avgPosition = (self.holdList[i].positionCost / totalPosition /self.holdList[i].volumeMultiple).toFixed(2);//持仓均价 = 持仓成本/总持仓
                        if(self.holdList[i].positionProfit != undefined){
                          self.holdList[i].positionProfit = parseInt(self.holdList[i].positionProfit).toFixed(2); //持仓盈亏
                        }
                        self.$set(self.holdList[i],'directionType',directionType);//买卖方向
                        self.$set(self.holdList[i],'totalPosition',totalPosition);//总持仓
                        self.$set(self.holdList[i],'availableClose',availableClose);//总可平量
                        self.$set(self.holdList[i],'avgPosition',avgPosition);//持仓均价
                        self.$set(self.holdList[i],'todayAvailbClose',todayAvailbClose);//今日可平

                        self.$set(self.holdList[i], 'holdAction', false);
                      }
                    self.searchHoldList = self.holdList;
                    if(futureCode){
                      self.searchHoldList = self.holdList.filter(item => item.futureCode == futureCode)
                    }else{
                      self.showHoldAction(0);
                    }
                  }
                }
            }, 1000)
        })
      },
      queryTradingAccount(){ //资金查询
          let content1 ={ //资金查询
            "functionId": "71000109",
            "sessionId": "123",     //由请求端自己填写，用于区分请求
           "custAcctCode":sessionStorage.getItem('custAcctCode'),
            //"custAcctCode":"091673",
            "token":this.$store.state.futureToken, //futureToken期货token
          };
        let message1 = { //
            serviceCode: "10000701",
            content:JSON.stringify(content1)
          };
        this.webSocketApi.sendSock(message1);

        let self = this;
        this.$nextTick(()=>{
             setTimeout(() => {
               this.isLoading = false;
                if(self.webSocketApi.ftdcQryTradingAccount){//ORS资金查询
                  let preBalance = self.webSocketApi.ftdcQryTradingAccount.preBalance;//上次结算准备金
                  let closeProfit = self.webSocketApi.ftdcQryTradingAccount.closeProfit;//平仓盈亏
                  let positionProfit = self.webSocketApi.ftdcQryTradingAccount.positionProfit;//持仓盈亏
                  let commission = self.webSocketApi.ftdcQryTradingAccount.commission;//手续费
                  let exchangeMargin = self.webSocketApi.ftdcQryTradingAccount.exchangeMargin;//交易所保证金
                  let available = self.webSocketApi.ftdcQryTradingAccount.available;//可用资金

                  self.staticRights = Math.round(preBalance*100)/100; // 静态权益 = 上次结算准备金
                  self.dynamicRights = Math.round((preBalance + closeProfit + positionProfit - commission)*100)/100; //动态权益 = 上次结算准备金 + 出入金（0） + 平仓盈亏 + 持仓盈亏 - 当日手续费
                  self.bond = Math.round(exchangeMargin*100)/100;//保证金
                  self.availableFunds = Math.round(available*100)/100;//可用资金
                }
            }, 1000)
        })
      },
      buyMore(){ //买多
          if(this.futureName=="请选合约"){
            MessageBox.alert("请选择合约。");
            return
          }
          if(this.inputLots==0){
            MessageBox.alert("请输入手数。");
            return
          }
          let message1 = this.futureName+", "+this.buyPrice+", 买多 ,"+this.inputLots+"手";
          MessageBox.confirm(message1, "确定下单吗?",{
            confirmButtonText: '下单',
          }).then(action=>{
            let content = { //持仓信息查询
              "functionId": "71000102",
              "sessionId": "123",     //由请求端自己填写，用于区分请求
              "custAcctCode":sessionStorage.getItem('custAcctCode'),
              //"custAcctCode":"091673",
              "token":this.$store.state.futureToken, //futureToken期货token
              //包体参数
              "futureCode":this.futureCode,
              //"custCode":"096539",
              "custCode":sessionStorage.getItem('custAcctCode'),
              "orderPriceType":2,//报单价格条件类型 2-限价
              "orderType":1,//买卖方向 1-买 2-卖
              "offsetFlag":1,//开平标志 1-开仓
              "hedgeFlag":1,//投机套保标志 1-投机
              "orderPrice":parseFloat(this.buyPrice),//价格
              "orderQty":parseInt(this.inputLots),//数量
              "effectiveTimeType":3,//有效期类型 3-当日有效
              "knockQtyType":1,//成交量类型 1-任何数量
              "minKnockQty":1,//最小成交量
              "triggerCondition":1 //触发条件 1-立即
            };
          let message = { //投资者持仓查询
              serviceCode: "10000701",
              content:JSON.stringify(content)
            };
          this.webSocketApi.sendSock(message);

          setTimeout(() => { //1s后刷新持仓列表
              this.queryPosition();
              this.queryTradingAccount();
              this.isLoading = true;
              this.searchHoldList = [];
          }, 1000)
        }).catch(err=>{
          console.log("");
        });

      },
      shortSelling(){ //卖空
           if(this.futureName=="请选合约"){
            MessageBox.alert("请选择合约。");
            return
          }
          if(this.inputLots==0){
            MessageBox.alert("请输入手数。");
            return
          }
          let message2 = this.futureName+", "+this.sellPrice+", 卖空 ,"+this.inputLots+"手";
          MessageBox.confirm(message2, "确定下单吗?",{
            confirmButtonText: '下单',
          }).then(action=>{
              let content = { //持仓信息查询
                "functionId": "71000102",
                "sessionId": "123",     //由请求端自己填写，用于区分请求
                //"custAcctCode":"096539",
                "custAcctCode":sessionStorage.getItem('custAcctCode'),
                "token":this.$store.state.futureToken, //futureToken期货token
                //包体参数
                "futureCode":this.futureCode,
                //"custCode":"096539",
                "custCode":sessionStorage.getItem('custAcctCode'),
                "orderPriceType":2,//报单价格条件类型 2-限价
                "orderType":2,//买卖方向 1-买 2-卖
                "offsetFlag":1,//开平标志 1-开仓
                "hedgeFlag":1,//投机套保标志 1-投机
                "orderPrice":parseFloat(this.buyPrice),//价格
                "orderQty":parseInt(this.inputLots),//数量
                "effectiveTimeType":3,//有效期类型 3-当日有效
                "knockQtyType":1,//成交量类型 1-任何数量
                "minKnockQty":1,//最小成交量
                "triggerCondition":1 //触发条件 1-立即
              };
            let message = { //投资者持仓查询
                serviceCode: "10000701",
                content:JSON.stringify(content)
              };
            this.webSocketApi.sendSock(message);

            setTimeout(() => { //1s后刷新持仓列表
              this.queryPosition();
              this.queryTradingAccount();
              this.isLoading = true;
              this.searchHoldList = [];
          }, 1000)
          }).catch(err=>{
            console.log("")
          });
      },
      clsTodayPosition(){ //平今
          if(this.futureName=="请选合约"){
            MessageBox.alert("请选择合约。");
            return
          }
          if(this.inputLots==0){
            MessageBox.alert("请输入手数。");
            return
          }
          let message3 = this.futureName+", "+this.sellPrice+", 平今 ,"+this.inputLots+"手";
          MessageBox.confirm(message3, "确定下单吗?",{
            confirmButtonText: '下单',
          }).then(action=>{
              let content = { //持仓信息查询
                "functionId": "71000102",
                "sessionId": "123",     //由请求端自己填写，用于区分请求
                //"custAcctCode":"096539",
                "custAcctCode":sessionStorage.getItem('custAcctCode'),
                "token":this.$store.state.futureToken, //futureToken期货token
                //包体参数
                "futureCode":this.futureCode,
                //"custCode":"096539",
                "custCode":sessionStorage.getItem('custAcctCode'),
                "orderPriceType":2,//报单价格条件类型 2-限价
                "orderType":this.closeFlag=="buy"?2:1,//买卖方向 1-买 2-卖
                "offsetFlag":4,//开平标志 1-开仓 2-平仓 4-平今 5-平昨
                "hedgeFlag":1,//投机套保标志 1-投机
                "orderPrice":this.closeFlag=="buy"?parseFloat(this.sellPrice):parseFloat(this.buyPrice),//价格
                "orderQty":parseInt(this.inputLots),//数量
                "effectiveTimeType":3,//有效期类型 3-当日有效
                "knockQtyType":1,//成交量类型 1-任何数量
                "minKnockQty":1,//最小成交量
                "triggerCondition":1 //触发条件 1-立即
              };
            let message = { //投资者持仓查询
                serviceCode: "10000701",
                content:JSON.stringify(content)
              };
            this.webSocketApi.sendSock(message);

              setTimeout(() => { //1s后刷新持仓列表
                this.queryPosition();
                this.queryTradingAccount();
                this.isLoading = true;
                this.searchHoldList = [];
            }, 1000)
          }).catch(err=>{
            console.log("")
          });

      },
      clsAllPosition(){ //平仓
          if(this.futureName=="请选合约"){
            MessageBox.alert("请选择合约。");
            return
          }
          if(this.inputLots==0){
            MessageBox.alert("请输入手数。");
            return
          }
          let message4 = this.futureName+", "+this.sellPrice+", 平仓 ,"+this.inputLots+"手";
          MessageBox.confirm(message4, "确定下单吗?",{
            confirmButtonText: '下单',
          }).then(action=>{
              let content = { //持仓信息查询
                "functionId": "71000102",
                "sessionId": "123",     //由请求端自己填写，用于区分请求
                "custAcctCode":sessionStorage.getItem('custAcctCode'),
                //"custAcctCode":"091673",
                "token":this.$store.state.futureToken, //futureToken期货token
                //包体参数
                "futureCode":this.futureCode,
                //"custCode":"096539",
                "custCode":sessionStorage.getItem('custAcctCode'),
                "orderPriceType":2,//报单价格条件类型 2-限价
                "orderType":this.closeFlag=="buy"?2:1,//买卖方向 1-买 2-卖
                "offsetFlag":2,//开平标志 1-开仓 2 平仓
                "hedgeFlag":1,//投机套保标志 1-投机
                "orderPrice":this.closeFlag=="buy"?parseFloat(this.sellPrice):parseFloat(this.buyPrice),//对手价
                "orderQty":parseInt(this.inputLots),//数量
                "effectiveTimeType":3,//有效期类型 3-当日有效
                "knockQtyType":1,//成交量类型 1-任何数量
                "minKnockQty":1,//最小成交量
                "triggerCondition":1 //触发条件 1-立即
              };
            let message = { //投资者持仓查询
                serviceCode: "10000701",
                content:JSON.stringify(content)
              };
            this.webSocketApi.sendSock(message);

              setTimeout(() => { //1s后刷新持仓列表
                this.queryPosition();
                this.isLoading = true;
                this.searchHoldList = [];
            }, 1000)
          }).catch(err=>{
            console.log("")
          });
      },

      /*当日委托查询(lyc)*/
      entrust(){
        let content = {
          functionId:'71000106',
          custCode:sessionStorage.getItem('custAcctCode'),
          token:this.$store.state.futureToken,
          custAcctCode:sessionStorage.getItem('custAcctCode'),
          sessionId:'80001',
          insertTimeStart:'09:30:00',
          insertTimeEnd:'15:00:00'
        };
        let message = {
          serviceCode: "10000701",
          content:JSON.stringify(content)
        };
        this.webSocketApi.sendSock(message);
        let self = this;
        this.$nextTick(() => {
          setTimeout(() => {
            this.isLoading = false;
            if(self.webSocketApi.entrust){
              let data = self.webSocketApi.entrust
              self.authList = []
              for (let i = 0; i < data.length; i++) {
                let row = {
                  futureCode:data[i].futureCode, //合约名称
                  orderExecutionStatus:this.orderStatusType(data[i].orderExecutionStatus), //状态
                  numOrderStatus:data[i].orderExecutionStatus,
                  orderType:data[i].orderType == '1'?'买':'卖', //买卖
                  offsetFlag:data[i].offsetFlag == '1'?'开仓':'平仓', //开平
                  orderPrice:data[i].orderPrice, //报单价格
                  orderQty:data[i].orderQty, //手数
                  orderPriceType: data[i].orderQty-data[i].knockQty , //未成交
                  orderTime:data[i].orderTime,//报单时间
                  futureOrderId:data[i].futureOrderId,
                  exchId:  data[i].exchId,
                  contractId:  data[i].contractId,
                  authAction:false
                }
                self.authList.push(row)
                self.authList = self.queryFutureName(self.authList,'futureCode')
              }
            }
          }, 1000)
        })
      },
      /*当日成交查询(lyc)*/
      scsTrading(){
        let content = {
          functionId:'71000107',
          custCode:sessionStorage.getItem('custAcctCode'),
          token:this.$store.state.futureToken,
          custAcctCode:sessionStorage.getItem('custAcctCode'),
          sessionId:'80001',
          insertTimeStart:'09:30:00',
          insertTimeEnd:'15:00:00'
        };
        let message = {
          serviceCode: "10000701",
          content:JSON.stringify(content)
        };
        this.webSocketApi.sendSock(message);
        let self = this;
        this.$nextTick(() => {
          setTimeout(() => {
            this.isLoading = false;
            if(self.webSocketApi.scsTrading){
              let data = self.webSocketApi.scsTrading
              self.doneList = []
              for (let i = 0; i < data.length; i++) {
                let row = {
                  futureCode:data[i].futureCode, //合约名称
                  orderType:data[i].orderType == '1'?'买':'卖', //买卖
                  orderPrice:data[i].orderPrice, //成交价格
                  orderQty:data[i].orderQty, //手数
                  tradeTime:data[i].tradeTime//报单时间
                }
                self.doneList.push(row)
                self.doneList = self.queryFutureName(self.doneList,'futureCode')
              }
            }
          }, 1000)
        })
      },
      /*委托撤单(lyc)*/
      removerOrder(futureCode,exchId,contractId,futureOrderId){
        MessageBox.confirm("确定撤单吗?").then(action=>{
          let params = {
            "functionId": "71000105",
            "custCode":sessionStorage.getItem('custAcctCode'),
            "futureCode": futureCode,
            "token":  this.$store.state.futureToken,
            "custAcctCode":sessionStorage.getItem('custAcctCode'),
            "exchId":  parseInt(exchId),
            "contractId":  parseInt(contractId),
            "sessionId":  "80006",
            "futureOrderId":  parseInt(futureOrderId),
            "cancelOrderId":  futureOrderId,
          }
          let message = {
            serviceCode: "10000701",
            content:JSON.stringify(params)
          };
          this.webSocketApi.sendSock(message);
          let self = this;
          this.$nextTick(() => {
            setTimeout(() => {
              self.$store.commit('hideLoading');
              if (self.webSocketApi.removerOrder){
                //成功就刷新一下委托数据
                self.entrust()
                if (self.webSocketApi.removerOrder != 'failure'){
                  //Toast("撤单成功");
                }
              }
            }, 1000)
          })
        })
      },

      //报单状态
      orderStatusType(val){
        switch (val) {
          case 8:
            return '全部成交';
            break;
          case 7:
            return '部分成交';
            break;
          case 5:
            return '部成部撤';
            break;
          case 3:
            return '未成交';
            break;
          case 9:
            return '废单';
            break;
          case 6:
            return '撤单';
            break;
          case 2:
            return '已报';
            break;
          default:
            return '---';
        }
      },
      tabChange(index){ //tab切换
        if(index==1){ //持仓列表
            //this.searchHoldList = [];
            //this.isLoading = true;
            this.queryPosition();
        }else if(index==2){ //委托列表
            //this.authList = [];
            //this.isLoading = true;
            this.entrust();
        }else{ //成交列表
            //this.doneList = [];
           // this.isLoading = true;
            this.scsTrading();
        }
      }
    },
    created(){
      MessageBox.close();
    }
  }
</script>
<style lang='scss'>
  .loadingCls>div {margin:0 auto;}
  .rotate360{
    -webkit-transform:rotate(720deg);
    transform:rotate(720deg);
    -webkit-transition:-webkit-transform 2s linear;
    transition:transform 2s linear;
  }
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

.searchResult{
    margin-top:0.5em;
    display: flex;
 }
.searchResult li{
    height: 2em;
    line-height: 2em;
    text-align: left;
  }
 .searchResult:active{
    background: rgba(249,161,1,0.26)
 }
 .loadingCls{
    display: block;
    margin-left: 11em;
    padding: .5em 0;
}
</style>

