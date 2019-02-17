<template>
  <div id="auth" style="min-height: 140px;">
    <mt-header fixed title="策略交易平台">
      <!-- <mt-button class="iconfont icon-exit" slot="right" @click="exit"></mt-button> -->
    </mt-header>
    <mt-navbar class="page-part" v-model="tabSelected">
      <mt-tab-item id="1" @click.native="tabChange('1')">持仓汇总</mt-tab-item>
      <mt-tab-item id="2" @click.native="tabChange('2')">持仓明细</mt-tab-item>
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
            <div v-for="(item,index) in searchHoldList" :key="index" @click="goToTrade(item.futureCode,item.FutureName,item.exchId)">
              <ul :class="{trSelected:item.holdAction}" @click="showHoldAction(index)" class="tbContent">
                <!--合约名称-->
                <li>{{item.FutureName}}</li>
                <!--买卖-->
                <li :style="{'color':item.isBuy?'#ff6960':'#00bd9a'}">{{item.directionType}}</li>
                <!--总持仓-->
                <li>{{item.totalPosition}}</li>
                <!--昨仓-->
                <li>{{item.ydPosition}}</li>
                <!--今仓-->
                <li>{{item.todayPosition}}</li>
                <!--ydPosition todayPosition useMargin positionProfit-->
                <!--可平今-->
                <li>{{item.availableClose}}</li>
                <!--可平量-->
                <li>{{item.availableClose}}</li>
                <!--持仓均价-->
                <li>{{item.avgPosition}}</li>
                <!--占用保证金-->
                <li>{{item.useMargin}}</li>
                <!--持仓盈亏-->
                <li>{{item.positionProfit}}</li>
                <!--todo:浮动盈亏-->
                <li>{{item.positionProfit}}</li>
                <!--交易所-->
                <li>{{item.exchName}}</li>
              </ul>
              <!--<transition name="action">
                <div class="actionBtn" v-show="item.holdAction">
                  <button @click="backhand(index)">反手</button>
                </div>
              </transition>-->
            </div>
          </div>
        </div>
        <mt-spinner type="fading-circle" :size="20" class="loadingCls" v-show="isLoading" style="margin:110px 0 0 0;padding:0;"></mt-spinner>
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
            <!--<li>持仓类型</li>-->
            <li>开仓时间</li>
            <li>持仓盈亏</li>
            <li>浮动盈亏</li>
        </ul>
            <div v-for="(item,index) in holdDetail" :key="index" @click="goToTrade(item.futureCode,item.FutureName,item.exchId)">
              <ul :class="{trSelected:item.detailAction}" @click="showDetailAction(index)" class="tbContent">
                <!--合约名称 -->
                <li>{{item.FutureName}}</li>
                <!--买卖-->
                <li :style="{'color':item.orderType == '1'?'#ff6960':'#00bd9a'}">{{item.orderType == '1'?'买':'卖'}}</li>
                <!--手数-->
                <li>{{item.volume}}</li>
                <!--开仓价-->
                <li>{{item.openPrice}}</li>
                <!--占用保证金-->
                <li>{{item.exchMargin}}</li>
                <!--持仓类型-->
                <!--<li>{{item.posiDirection}}</li>-->
                <!--开仓时间-->
                <li>{{item.openDate}}</li>
                <!--持仓盈亏-->
                <li>{{item.positionProfitByDate}}</li>
                <!--todo:浮动盈亏-->
                <li>{{item.positionProfitByTrade}}</li>
              </ul>
              <!--<transition name="action">
                <div class="actionBtn" v-show="item.detailAction">
                  <button>交易</button>
                </div>
              </transition>-->
            </div>
          </div>
        </div>
        <mt-spinner type="fading-circle" :size="20" class="loadingCls" v-show="isLoading" style="margin:110px 0 0 0;padding:0;"></mt-spinner>
      </mt-tab-container-item>
    </mt-tab-container>
    <button v-if="btnAll" class="cancelAllBtn" style="margin-top: 10em;" @click="closeAllPosition">全部平仓</button>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
import Footer from '../components/FooterBar.vue'
import {MessageBox} from "mint-ui"
  let interval;
  export default { 
    data(){
      return {
        btnAll:false,
        isLoading:true,
        tabSelected:'1',
        holdList:[],//持仓列表
        searchHoldList:[],
        holdDetail:[ //持仓明细
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
            futureName:"2年国债",
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
    components: {
      'footer-bar': Footer
    },
    methods: {
      /*跳交易页面*/
      goToTrade(futureCode,futureName,exchId){
        sessionStorage.setItem('holdFutureCode',futureCode);
        sessionStorage.setItem('holdFutureName',futureName);
        sessionStorage.setItem('holdExchId',exchId);
        this.$router.push('/futures/login');
      },
      showListAction(index){
          this.holdList[index].listAction = !this.holdList[index].listAction;
      },
      showDetailAction(index){
          this.holdDetail[index].detailAction = !this.holdDetail[index].detailAction;
      },
      /*查询期货名称*/
      queryFutureName(arr, key){
        if (sessionStorage.getItem('futureInfo') && sessionStorage.getItem('futureInfo') != "undefined"){
          let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
          if (futureInfo && futureInfo.length > 0){
            this.setSimpleName(futureInfo);
            //市场行情展示
            for (let i in arr){
              for (let j in futureInfo){
                if (arr[i][key] == futureInfo[j].FutureCode){
                  this.$set(arr[i], 'FutureName', futureInfo[j].FutureName);
                  this.$set(arr[i], 'exchId', futureInfo[j].ExchId);
                  let exchName;
                  switch (futureInfo[j].ExchId){
                    case '111':
                      exchName = '中金所'
                      break;
                    case '112':
                      exchName = '上期所'
                      break;
                    case '113':
                      exchName = '大商所'
                      break;
                    case '114':
                      exchName = '郑商所'
                      break;
                  }
                  this.$set(arr[i], 'exchName', exchName);
                  this.$set(arr[i], 'volumeMultiple', futureInfo[j].VolumeMultiple);//乘数
                }
              }
            }
          }
        }
        return arr;
      },
      /*期货名称替换简写*/
      setSimpleName(futureInfo){ //
        for (let k in this.simpleFutureName){
          for (let m in futureInfo){
            futureInfo[m].FutureName = futureInfo[m].FutureName.replace(this.simpleFutureName[k].futureName, this.simpleFutureName[k].sName);
          }
        }
        return futureInfo;
      },
      closeAllPosition(){ //全部平仓
        MessageBox.confirm("确定全部平仓吗?").then(action => {
          if(this.searchHoldList.length>0){
              for (let i = 0; i < this.searchHoldList.length; i++) {
                  let params = { //持仓信息查询
                    "functionId": "71000102",
                    "sessionId": "123",     //由请求端自己填写，用于区分请求
                    "custAcctCode":sessionStorage.getItem('custAcctCode'),
                    //"custAcctCode":"091673",
                    "token":this.$store.state.futureToken, //futureToken期货token
                    //包体参数
                    "futureCode":this.searchHoldList[i].futureCode,
                    //"custCode":"096539",
                    "custCode":sessionStorage.getItem('custAcctCode'),
                    "orderPriceType":2,//报单价格条件类型 2-限价
                    "orderType":this.searchHoldList[i].isBuy?2:1,//买卖方向 1-买 2-卖
                    "offsetFlag":2,//开平标志 1-开仓 2 平仓
                    "hedgeFlag":1,//投机套保标志 1-投机
                    "orderPrice":this.searchHoldList[i].isBuy?parseFloat(this.searchHoldList[i].sellPrice):parseFloat(this.searchHoldList[i].buyPrice),//对手价
                    "orderQty":parseInt(this.searchHoldList[i].availableClose),//数量
                    "effectiveTimeType":3,//有效期类型 3-当日有效
                    "knockQtyType":1,//成交量类型 1-任何数量
                    "minKnockQty":1,//最小成交量
                    "triggerCondition":1 //触发条件 1-立即
                  };
                  let message = {
                    serviceCode: "10000701",
                    content:JSON.stringify(params)
                  };
                  this.webSocketApi.sendSock(message);

                  setTimeout(() => { //1s后刷新持仓列表
                      this.queryPosition();
                      this.isLoading = true;
                      this.searchHoldList = [];
                  }, 1000)
              }
            }

        })
      },
      /*选择合约*/
      showHoldAction(index){
        this.searchHoldList[index].holdAction = !this.searchHoldList[index].holdAction;
        if (this.searchHoldList[index].holdAction){
          this.futureName = this.searchHoldList[index].FutureName; //期货名称
          this.futureCode = this.searchHoldList[index].futureCode; //期货代码
          this.priceTick = this.searchHoldList[index].priceTick; //最小变动价
          if (this.searchHoldList[index].exchId == "112"){ //上期所
            this.todayClose = this.searchHoldList[index].todayAvailbClose;//平今量
            this.totalClose = this.searchHoldList[index].availableClose - this.todayClose;
          } else {
            this.todayClose = 0;
            this.totalClose = this.searchHoldList[index].availableClose;//可平量
          }
          this.inputLots = this.totalClose;

          let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
          let exchId = "";
          if (this.searchHoldList[index].directionType == "买"){
            this.closeFlag = "buy";
          } else if (this.searchHoldList[index].directionType == "卖"){
            this.closeFlag = "sell";
          } else {
            this.closeFlag = "";
          }
          if (futureInfo && futureInfo.length > 0){
            for (let i in futureInfo){
              if (this.futureCode == futureInfo[i].FutureCode){
                exchId = futureInfo[i].ExchId;
                break;
              }
            }
          };
          let content = { //按照期货代码订阅
            "functionId":"50000101",
            "requestId":"123",
            "req_ans":"req",
            "code": [{
              "exchId":exchId,
              "futureCode":this.futureCode
            }]
          };
          let message = {
            serviceCode: "10000702",
            content : JSON.stringify(content)
          };
          this.webSocketApi.sendSock(message);

          let self = this;
          this.$nextTick(() => {
            if(self.webSocketApi.res!=undefined){
                setInterval(function(){
                let resData = self.webSocketApi.res[0];
                self.lastPrice = resData.lastPrice.toFixed(2); //最新价
                self.maxOpenLots = parseInt(self.availableFunds / self.lastPrice);//最大开仓手数
                self.upperLimitPrice = resData.upperLimitPrice;//涨停板价
                self.lowerLimitPrice = resData.lowerLimitPrice;//跌停板价
                self.volume = resData.volume;
                self.askPrice1 = resData.askPrice1.toFixed(2);
                self.askVolume1 = resData.askVolume1;
                self.bidPrice1 = resData.bidPrice1.toFixed(2);
                self.bidVolume1 = resData.bidVolume1;
              }, 1000);
              clearInterval(interval);
              interval = setInterval(function(){
                let resData = self.webSocketApi.res[0];
                self.buyPrice = resData.askPrice1.toFixed(2);
                self.sellPrice = resData.bidPrice1.toFixed(2);
                if (self.closeFlag == "buy"){
                  self.closePrice = self.sellPrice;
                } else if (self.closeFlag == "sell"){
                  self.closePrice = self.buyPrice;
                }
              }, 1000);
            }

          })
        }
      },
      /*持仓信息查询*/
      queryPosition(){
        let content = {
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
                  let avgPosition = (self.holdList[i].positionCost / totalPosition / self.holdList[i].volumeMultiple).toFixed(2);//持仓均价 = 持仓成本/总持仓
                  if (self.holdList[i].positionProfit != undefined){
                    self.holdList[i].positionProfit = parseInt(self.holdList[i].positionProfit).toFixed(2); //持仓盈亏
                  }
                  //合约名称 买卖 总持仓 昨仓 今仓 可平今 可平量 持仓均价 占用保证金 持仓盈亏 浮动盈亏 交易所
                  //ydPosition todayPosition useMargin positionProfit
                  self.$set(self.holdList[i], 'directionType', directionType);//买卖方向
                  self.$set(self.holdList[i], 'totalPosition', totalPosition);//总持仓
                  self.$set(self.holdList[i], 'ydPosition', self.holdList[i].ydPosition);//昨仓
                  self.$set(self.holdList[i], 'todayPosition', self.holdList[i].todayPosition);//今仓
                  self.$set(self.holdList[i], 'todayAvailbClose', todayAvailbClose);//今日可平
                  self.$set(self.holdList[i], 'availableClose', availableClose);//总可平量
                  self.$set(self.holdList[i], 'avgPosition', avgPosition);//持仓均价
                  self.$set(self.holdList[i], 'useMargin', parseInt(self.holdList[i].useMargin).toFixed(2));//占用保证金 useMargin
                  self.$set(self.holdList[i], 'positionProfit', self.holdList[i].positionProfit);//持仓盈亏 positionProfit
                  //todo://浮动盈亏
                  self.$set(self.holdList[i], 'positionProfit', self.holdList[i].positionProfit);
                  self.$set(self.holdList[i], 'exchId', self.holdList[i].exchId);//交易所 // CFFEX: 中金所  SHFE：上期所  DCE：大商所 CZCE：郑商所
                  self.$set(self.holdList[i], 'holdAction', false);
                }
                self.searchHoldList = self.holdList;
                let shl = self.searchHoldList;
                for (let i = 0; i < shl.length ; i++) {
                  self.btnAll = shl[i].availableClose > 0
                }
                //查询合约行情
                let code =[];
                for(let j=0;j<self.searchHoldList.length;j++){
                  code.push({
                      "futureCode":self.searchHoldList[j].futureCode
                    })
                }
                let content =  { //按照期货代码订阅
                    "functionId":"50000101",
                    "requestId":"123",
                    "req_ans":"req",
                    "code": code
                };
                let message ={
                  serviceCode: "10000702" ,
                  content : JSON.stringify(content)
                };
                self.webSocketApi.sendSock(message);
                this.$nextTick(()=>{
                  if(self.webSocketApi.res !=undefined){
                    setInterval(function(){
                      let resData = self.webSocketApi.res;
                      for(let i in self.searchHoldList){
                        for(let j in resData){
                          if(self.searchHoldList[i].futureCode == resData[j].instrumentID){
                            self.$set(self.searchHoldList[i],'buyPrice',resData[j].bidPrice1);
                            self.$set(self.searchHoldList[i],'sellPrice',resData[j].askPrice1);
                          }
                        }
                      }
                    },1000)
                  }
                })
              }
            }
          }, 2000)
        })
      },
      /*持仓明细查询*/
      queryDetail(){
        let content = {
          "functionId": "71000116",
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
        this.$nextTick(() => {
          setTimeout(() => {
            this.isLoading = false;
            if (self.webSocketApi.holdDetail && self.webSocketApi.holdDetail != undefined){
              let d = JSON.parse(self.webSocketApi.holdDetail);
              if (d){
                for (let i = 0; i < d.length; i++) {
                  let row = {}
                  /*--合约名称--买卖--手数--开仓价--占用保证金--持仓类型--开仓时间--持仓盈亏--浮动盈亏--*/
                  /*--futureCode--orderType--volume--openPrice--exchMargin--posiDirection--openDate--positionProfitByDate--positionProfitByTrade--*/
                  row.futureCode = d[i].futureCode
                  row.orderType = d[i].orderType
                  row.volume = d[i].volume
                  row.openPrice = d[i].openPrice
                  row.exchMargin = d[i].exchMargin.toFixed(2)
                  row.posiDirection = d[i].posiDirection
                  row.openDate = d[i].openDate.substr(0, 4) + '-' + d[i].openDate.substr(4, 2) + '-' + d[i].openDate.substr(6, 2)
                  row.positionProfitByDate = d[i].positionProfitByDate.toFixed(2)
                  row.positionProfitByTrade = d[i].positionProfitByTrade.toFixed(2)
                  row.detailAction = i == 0
                  self.holdDetail.push(row)
                }
                self.holdDetail = self.queryFutureName(self.holdDetail, "futureCode");
              }
            }
          }, 2000)
        })
      },

      /*tab切换*/
      tabChange(index){
        if (index == 1){
          this.searchHoldList = [];
          this.isLoading = true;
          this.queryPosition();
        } else if (index == 2){
          this.holdDetail = [];
          this.isLoading = true;
          this.queryDetail();
        }
      }
    },
    created(){
      if (this.$store.state.token==""){//userToken为空
         this.$store.commit('SELECT_TAB', '')
         this.$router.push('/');
      }else if(this.$store.state.futureToken==""||this.$store.state.futureToken==undefined){ //期货toke为空
          MessageBox.alert('请先登录资金账户。')
          this.$store.commit('SELECT_TAB', 'transacton');
      }else{
        /*持仓信息查询(lyc)*/
        this.queryPosition();
        let _footer = this.$store.state.footerVisible;
        if (!_footer) {
          this.$store.commit('TOGGLE_FOOTER');
        }
        this.$store.commit('SELECT_TAB', 'hold')
      }
    }
  }
</script>
<style lang='scss'>
  #auth .loadingCls>div {margin:20px auto 0;}
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

