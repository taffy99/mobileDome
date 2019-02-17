<template>
  <div id="auth">
    <mt-header fixed title="策略交易平台">
      <!-- <mt-button class="iconfont icon-exit" slot="right" @click="exit"></mt-button> -->
    </mt-header>
    <mt-navbar class="page-part" v-model="tabSelected">
      <mt-tab-item id="2" @click.native="tabChange('2')">已报</mt-tab-item>
      <mt-tab-item id="8" @click.native="tabChange('8')">已成交</mt-tab-item>
      <mt-tab-item id="7" @click.native="tabChange('7')">部分成交</mt-tab-item>
      <mt-tab-item id="9" @click.native="tabChange('9')">废单</mt-tab-item>
    </mt-navbar>
     <mt-tab-container v-model="tabSelected" class="authContainer">
       <!--authList2:[ ],//已报-->
      <mt-tab-container-item id="2">
        <div class="authTableWapper">
          <div class="authTable">
            <ul>
              <li>合约名称</li>
              <li>买卖</li>
              <li>开平</li>
              <li>报单价格</li>
              <li>手数</li>
              <li>报单时间</li>
              <!--<li>来源</li>-->
            </ul>
            <div v-if="!noDataImg2" v-for="(item,index) in authList2" :key="index">
              <ul :class="{trSelected:item.authAction}" @click="showAuthAction(index,'2')" class="tbContent">
                <li>{{item.FutureName}}</li>
                <li :style="{'color':item.orderType == '买' ?'#ff6960':'#00bd9a'}">{{item.orderType}}</li>
                <li>{{item.offsetFlag}}</li>
                <li>{{item.orderPrice}}</li>
                <li>{{item.orderQty}}</li>
                <li>{{item.orderTime}}</li>
                <!--<li>{{item.resource}}</li>-->
              </ul>
              <transition name="action">
                <div class="actionBtn" v-show="item.authAction">
                  <button @click="removerOrder(item.futureCode,item.exchId,item.contractId,item.futureOrderId)">撤单</button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <button v-if="!noDataImg2 && !isLoading" class="cancelAllBtn" @click ="allRemoverOrder('2')">全部撤单</button>
        <div v-if="noDataImg2" class="noData">
          <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
       <!--authList8:[ ],//已成交-->
      <mt-tab-container-item id="8">
        <div class="authTableWapper">
          <div class="authTable">
            <ul>
              <li>合约名称</li>
              <li>买卖</li>
              <li>开平</li>
              <li>报单价格</li>
              <li>手数</li>
              <li>报单时间</li>
              <!--<li>来源</li>-->
            </ul>
            <div v-if="!noDataImg8" v-for="(item,index) in authList8" :key="index">
              <ul :class="{trSelected:item.authAction}" class="tbContent">
                <li>{{item.FutureName}}</li>
                <li :style="{'color':item.orderType == '买' ?'#ff6960':'#00bd9a'}">{{item.orderType}}</li>
                <li>{{item.offsetFlag}}</li>
                <li>{{item.orderPrice}}</li>
                <li>{{item.orderQty}}</li>
                <li>{{item.orderTime}}</li>
                <!--<li>{{item.resource}}</li>-->
              </ul>
            </div>
          </div>
        </div>
        <div v-if="noDataImg8" class="noData">
          <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
       <!--authList7:[ ],//部分成交-->
      <mt-tab-container-item id="7">
        <div class="authTableWapper">
          <div class="authTable">
            <ul>
              <li>合约名称</li>
              <li>买卖</li>
              <li>开平</li>
              <li>报单价格</li>
              <li>手数</li>
              <li>报单时间</li>
              <!--<li>来源</li>-->
            </ul>
            <div v-if="!noDataImg7" v-for="(item,index) in authList7" :key="index">
              <ul :class="{trSelected:item.authAction}" @click="showAuthAction(index,'7')" class="tbContent">
                <li>{{item.FutureName}}</li>
                <li :style="{'color':item.orderType == '买' ?'#ff6960':'#00bd9a'}">{{item.orderType}}</li>
                <li>{{item.offsetFlag}}</li>
                <li>{{item.orderPrice}}</li>
                <li>{{item.orderQty}}</li>
                <li>{{item.orderTime}}</li>
                <!--<li>{{item.resource}}</li>-->
              </ul>
              <transition name="action">
                <div class="actionBtn" v-show="item.authAction">
                  <button @click="removerOrder(item.futureCode,item.exchId,item.contractId,item.futureOrderId)">撤单</button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <button v-if="!noDataImg7 && !isLoading" class="cancelAllBtn" @click ="allRemoverOrder('7')">全部撤单</button>
        <div v-if="noDataImg7" class="noData">
          <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
       <!--authList9:[ ],//废单-->
      <mt-tab-container-item id="9">
        <div class="authTableWapper">
          <div class="authTable">
            <ul>
              <li>合约名称</li>
              <li>买卖</li>
              <li>开平</li>
              <li>报单价格</li>
              <li>手数</li>
              <li>报单时间</li>
              <!--<li>来源</li>-->
            </ul>
            <div v-for="(item,index) in authList9" :key="index">
              <ul :class="{trSelected:item.authAction}" class="tbContent">
                <li>{{item.FutureName}}</li>
                <li :style="{'color':item.orderType == '买' ?'#ff6960':'#00bd9a'}">{{item.orderType}}</li>
                <li>{{item.offsetFlag}}</li>
                <li>{{item.orderPrice}}</li>
                <li>{{item.orderQty}}</li>
                <li>{{item.orderTime}}</li>
                <!--<li>{{item.resource}}</li>-->
              </ul>
            </div>
          </div>
        </div>
        <div v-if="noDataImg9" class="noData">
          <img src="../assets/tool/noData.png"/>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <mt-spinner type="fading-circle" :size="20" class="loadingCls" v-show="isLoading" style="margin:110px 0 0 0;padding:0;"></mt-spinner>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
 import Footer from '../components/FooterBar.vue'
 import { MessageBox, Toast } from "mint-ui";
  export default {
    data(){
      return {
        tabSelected:'2',
        noDataImg2:false,
        noDataImg8:true,
        noDataImg7:true,
        noDataImg9:true,
        authList2:[ ], //已报
        authList8:[ ], //已成交
        authList7:[ ], //部分成交
        authList9:[ ], //废单
        isLoading: true,
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
      showAuthAction(index, num){
        if (num == '2'){
          this.authList2[index].authAction = !this.authList2[index].authAction;
        } else if (num == '7'){
          this.authList7[index].authAction = !this.authList7[index].authAction;
        }
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
                }
              }
            }
          }
        }
        return arr;
      },
      /*当日委托查询(lyc)*/
      entrust(){
        let content = {
          functionId:'71000106',
          custCode:sessionStorage.getItem('custAcctCode'),
          token:this.$store.state.futureToken,
          custAcctCode:sessionStorage.getItem('custAcctCode'),
          //exchId:'112',
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
            self.$store.commit('hideLoading');
            self.authList2 = []
            self.authList8 = []
            self.authList7 = []
            self.authList9 = []
            this.isLoading = false;
            if (self.webSocketApi.entrust){
              let data = self.webSocketApi.entrust
              for (let i = 0; i < data.length; i++) {
                let row = {
                  futureCode:data[i].futureCode, //合约名称
                  //orderExecutionStatus:this.orderStatusType(data[i].orderExecutionStatus), //状态
                  orderType:data[i].orderType == '1' ? '买' : '卖', //买卖
                  offsetFlag:data[i].offsetFlag == '1' ? '开仓' : '平仓', //开平
                  orderPrice:data[i].orderPrice, //报单价格
                  orderQty:data[i].orderQty, //手数
                  //orderPriceType:data[i].knockQty - data[i].orderQty, //未成交
                  orderTime:data[i].orderTime, //报单时间

                  numOrderStatus:data[i].orderExecutionStatus,
                  futureOrderId:data[i].futureOrderId,
                  exchId:  data[i].exchId,
                  contractId:  data[i].contractId,
                  authAction:false
                };
                switch (data[i].orderExecutionStatus) {
                  case 2:
                    self.authList2.push(row);
                    break;
                  case 8:
                    self.authList8.push(row);
                    break;
                  case 7:
                    self.authList7.push(row);
                    break;
                  case 9:
                    self.authList9.push(row);
                    break;
                }
              }
              self.authList2 = self.queryFutureName(self.authList2,'futureCode')
              self.authList8 = self.queryFutureName(self.authList8,'futureCode')
              self.authList7 = self.queryFutureName(self.authList7,'futureCode')
              self.authList9 = self.queryFutureName(self.authList9,'futureCode')
              self.noDataImg2 = !(self.authList2.length > 0)
              self.noDataImg8 = !(self.authList8.length > 0)
              self.noDataImg7 = !(self.authList7.length > 0)
              self.noDataImg9 = !(self.authList9.length > 0)
              self.isLoading = false
            }
            self.noDataImg2 = !(self.authList2.length > 0)
            self.noDataImg8 = !(self.authList8.length > 0)
            self.noDataImg7 = !(self.authList7.length > 0)
            self.noDataImg9 = !(self.authList9.length > 0)
            self.isLoading = false
          }, 2000)
        })
      },
      /*委托撤单(lyc)*/
      removerOrder(futureCode, exchId, contractId, futureOrderId){
        MessageBox.confirm("确定撤单吗?").then(action => {
          let params = {
            "functionId": "71000105",
            "custCode":  sessionStorage.getItem('custAcctCode'),
            "futureCode": futureCode,
            "token":  this.$store.state.futureToken,
            "custAcctCode":  sessionStorage.getItem('custAcctCode'),
            "exchId":  parseInt(exchId),
            "contractId":  parseInt(contractId),
            "sessionId":  "80006",
            "futureOrderId":  parseInt(futureOrderId),
            "cancelOrderId":  futureOrderId
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
            }, 2000)
          })
        })
      },
      /*全部撤单*/
      allRemoverOrder(idx){
        MessageBox.confirm("确定全部撤单吗?").then(action => {
          let tokenThis = this;
          let d;
          switch (idx){
            case '2':
              d = this.authList2
              break;
            case '7':
              d = this.authList7
              break;
          }
          let apartTime = 0;
          for (let i = 0; i < d.length; i++) {
            setTimeout(function () {
              let params = {
                "functionId": "71000105",
                "custCode":  sessionStorage.getItem('custAcctCode'),
                "futureCode": d[i].futureCode,
                "token": tokenThis.$store.state.futureToken,
                "custAcctCode":  sessionStorage.getItem('custAcctCode'),
                "exchId":  parseInt(d[i].exchId),
                "contractId":  parseInt(d[i].contractId),
                "sessionId":  "80006",
                "futureOrderId":  parseInt(d[i].futureOrderId),
                "cancelOrderId":  d[i].futureOrderId
              }
              let message = {
                serviceCode: "10000701",
                content:JSON.stringify(params)
              };
              tokenThis.webSocketApi.sendSock(message);
              //let self = this;
              tokenThis.$nextTick(() => {
                setTimeout(() => {
                  tokenThis.$store.commit('hideLoading');
                  //不成功也刷委托数据
                  if (tokenThis.webSocketApi.removerOrder){
                    //成功就刷新一下委托数据
                    tokenThis.entrust()
                    if (tokenThis.webSocketApi.removerOrder != 'failure'){
                      //Toast("撤单成功");
                    }
                  }
                }, 2000)
              })
            }, apartTime);
            apartTime += 100;
          }
        })
      },
      /*tab切换*/
      tabChange(index){
       this.isLoading = true
       this.noDataImg2 = false
       this.noDataImg8 = false
       this.noDataImg7 = false
       this.noDataImg9 = false
       this.authList2 = [ ]//已报
       this.authList8 = [ ]//已成交
       this.authList7 = [ ]//部分成交
       this.authList9 = [ ]//废单
       this.entrust();
      },

    },
    created(){
      if (this.$store.state.token==""){//userToken为空
         this.$store.commit('SELECT_TAB', '')
         this.$router.push('/');
      }else if (this.$store.state.futureToken==""||this.$store.state.futureToken==undefined){//期货toke为空
          MessageBox.alert('请先登录资金账户。')
          this.$store.commit('SELECT_TAB', 'transacton');
      }else{
          /*当日委托查询(lyc)*/
          this.entrust();
          let _footer = this.$store.state.footerVisible;
          if (!_footer) {
            this.$store.commit('TOGGLE_FOOTER');
          }
          this.$store.commit('SELECT_TAB', 'auth')
      }

    }
  }
</script>
<style lang='scss'>
  #auth .loadingCls>div {margin:0 auto;}
    .cancelAllBtn{
      margin:5em 3em;
      width: 80%;
      height: 3em;
      line-height: 3em;
      background: #f9a101;
      border-radius: 2em;
    }
  .authContainer{
    top:6.5em !important;
   .authTableWapper{
     overflow-y: hidden;
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
           width:17%;
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
   position: fixed;top: 150px;left:0;z-index: 100;
   width: 60%;
   margin-left: 20%;
   height: 70%;
   text-align: center;
   img{
     width: auto;
     height: auto;
     max-height: 100%;
     max-width: 100%;
   }
 }
    .loadingCls{
      display: block;
      margin-left: 11em;
      padding: .5em 0;
    }
  #auth h1 {padding:0;}
</style>

