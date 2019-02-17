<template>
  <div id="market">
    <mt-header fixed> 
      <mt-button class="iconfont icon-search" slot="right"  @click="handleClick"></mt-button>
    </mt-header>
    <div class="marketTab">
      <ul>
        <li :class="{active:2===selectItem}" @click="changeTab(2)">自选</li>
        <li :class="{active:1===selectItem}" @click="changeTab(1)">市场</li>
      </ul>
    </div>
    <div v-show = "marketSelect">
      <mt-navbar class="page-part" v-model="tabSelected">
        <mt-tab-item id="1" @click.native="exchChange('111')">中金所</mt-tab-item>
        <mt-tab-item id="2" @click.native="exchChange('114')">郑商所</mt-tab-item>
        <mt-tab-item id="3" @click.native="exchChange('113')">大商所</mt-tab-item>
        <mt-tab-item id="4" @click.native="exchChange('112')">上期所</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="tabSelected">
        <mt-tab-container-item id="1">
          <div class="content">
            <ul class="tableContent">
              <li style="width:35%">名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <div v-for="(item,index) in marketList_111" :key="index">
              <ul class="tableContent d_jump" :class="{trSelected:item.marketAction}" @click="showMarketAction(index)">
                <li style="color:#fff;width:35%">{{item.FutureName}}</li>
                <li :style="{'color':item.color}">{{item.lastPrice}}</li>
                <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
                <li style="color:#fff;">{{item.volume}}</li> 
              </ul>
              <div class="actionList" v-show="item.marketAction">
                  <button @click="maddselfList(index)">加入自选</button>
                  <button @click="futureOrder(index,'marketList_111')">下单</button>
              </div> 
            </div>
          </div>
          <div class="futureCodeList">
            <ul :class="{scollRt:isRt}" @touchstart.stop="isRt=false">
              <li v-for="(item,index) in futureCodeList" :key="index" @click="jump(item)">
                {{item}}
              </li>
            </ul>
            <button class="iconfont icon-right" @click="scrollXR"></button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div class="content">
            <ul class="tableContent">
              <li style="width:35%">名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <div v-for="(item,index) in marketList_114" :key="index">
              <ul class="tableContent d_jump" :class="{trSelected:item.marketAction}" @click="showMarketAction(index)">
                <li style="color:#fff;width:35%">{{item.FutureName}}</li>
                <li :style="{'color':item.color}">{{item.lastPrice}}</li>
                <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
                <li style="color:#fff;">{{item.volume}}</li>
              </ul>
              <div class="actionList" v-show="item.marketAction">
                  <button @click="maddselfList(index)">加入自选</button>
                  <button @click="futureOrder(index,'marketList_114')">下单</button>
              </div>
            </div>
          </div>
          <div class="futureCodeList">
            <ul :class="{scollRt:isRt}" @touchstart.stop="isRt=false">
              <li v-for="(item,index) in futureCodeList" :key="index" @click="jump(item)">
                {{item}}
              </li>
            </ul>
            <button class="iconfont icon-right" @click="scrollXR"></button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <div class="content">
            <ul class="tableContent">
              <li style="width:35%">名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <div v-for="(item,index) in marketList_113" :key="index">
              <ul class="tableContent d_jump" :class="{trSelected:item.marketAction}" @click="showMarketAction(index)">
                <li style="color:#fff;width:35%">{{item.FutureName}}</li>
                <li :style="{'color':item.color}">{{item.lastPrice}}</li>
                <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
                <li style="color:#fff;">{{item.volume}}</li>
              </ul>
              <div class="actionList" v-show="item.marketAction">
                  <button @click="maddselfList(index)">加入自选</button>
                  <button @click="futureOrder(index,'marketList_113')">下单</button>
              </div>
            </div>
          </div>
          <div class="futureCodeList">
            <ul :class="{scollRt:isRt}" @touchstart.stop="isRt=false">
              <li v-for="(item,index) in futureCodeList" :key="index" @click="jump(item)">
                {{item}}
              </li>
            </ul>
            <button class="iconfont icon-right" @click="scrollXR"></button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="4">
          <div class="content">
            <ul class="tableContent">
              <li style="width:35%">名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <div v-for="(item,index) in marketList_112" :key="index">
              <ul class="tableContent d_jump" :class="{trSelected:item.marketAction}" @click="showMarketAction(index)">
                <li style="color:#fff;width:35%">{{item.FutureName}}</li>
                <li :style="{'color':item.color}">{{item.lastPrice}}</li>
                <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
                <li style="color:#fff;">{{item.volume}}</li>
              </ul>
              <div class="actionList" v-show="item.marketAction">
                  <button @click="maddselfList(index)">加入自选</button>
                  <button @click="futureOrder(index,'marketList_112')">下单</button>
              </div>
            </div>
          </div>
          <div class="futureCodeList">
            <ul :class="{scollRt:isRt}" @touchstart.stop="isRt=false">
              <li v-for="(item,index) in futureCodeList" :key="index" @click="jump(item)">
                {{item}}
              </li>
            </ul>
            <button class="iconfont icon-right" @click="scrollXR"></button>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
      <mt-popup v-model="popupVisible" position="right">
        <mt-header fixed>
          <mt-button class="iconfont icon-left-" slot="left" @click="closePopup"></mt-button> 
        </mt-header>
        <mt-search 
            autofocus 
            v-model="value" 
            :result="filterResult"
            placeholder="请输入合约代码">
            <ul  v-for="(item,index) in filterResult" v-bind:key="index" class="searchResult">
              <li style="width:30%">{{item.name}}</li>
              <li style="width:50%">{{item.exchName}}</li>
              <li @click="addselfList(index)"><i :class="[item.addself?starSelect:starUnSelect]"></i></li>
            </ul>
        </mt-search>
      </mt-popup>
    </div>
    <div v-show = "selfSelect">
        <div class="content" style="margin-top:4em;">
            <ul class="tableContent">
              <li style="width:35%">名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <div v-for="(item,index) in selfList" :key="index">
              <ul class="tableContent" :class="{trSelected:item.detailAction}" @click="showDetailAction(index)">
                <li style="color:#fff;width:35%">{{item.FutureName?item.FutureName:item.contractCode}}</li>
                <li :style="{'color':item.color}">{{item.lastPrice}}</li>
                <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
                <li style="color:#fff;">{{item.volume}}</li>
              </ul>
              <div class="actionList" v-show="item.detailAction">
                  <button @click="deleteSelf(index)">删除自选</button>
                  <button @click="futureOrder(index,'selfList')">下单</button>
              </div>
            </div>
          </div>
          <mt-popup v-model="popupVisible" position="right">
        <mt-header fixed>
          <mt-button class="iconfont icon-left-" slot="left" @click="closePopup"></mt-button> 
        </mt-header>
        <mt-search 
            autofocus 
            v-model="value" 
            :result="filterResult"
            placeholder="请输入合约代码">
            <ul  v-for="(item,index) in filterResult" v-bind:key="index" class="searchResult">
              <li style="width:40%">{{item.name}}</li>
              <li style="width:50%">{{item.exchName}}</li>
              <li @click="addselfList(index)"><i :class="[item.addself?starSelect:starUnSelect]"></i></li>
            </ul>
        </mt-search>
      </mt-popup>
    </div>
     <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
  import Footer from '../components/FooterBar.vue'
  import { Toast } from 'mint-ui';
  import { querySelfInfo, addSelfInfo, deleteSelfInfo } from "@/api/base";
  export default {
    data(){
      return {
        selectItem:2,
        tabSelected:'1',
        popupVisible:false,
        marketSelect:false,
        selfSelect:true,
        value: '', 
        detailAction:false, //自选操作
        marketAction:false,//市场操作
        starSelect:"iconfont icon-star_selected",
        starUnSelect:"iconfont icon-star",
        isRt:false,//向右滑动
        marketList_111:[],//行情-中金
        marketList_114:[],//行情-郑商
        marketList_113:[],//行情-大商
        marketList_112:[],//行情-上期
        selfList:[],//自选列表
        isLoading:false,//加载中
        isMoreLoading:true,//加载更多中
        noMore:false, //是否还有更多
        pageInfo:{
            page:1,
            page_size:12,
            total:0,//总条数
            totalPage:1 //总分页数
        },
        // 搜索列表
        searchList: [], 
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
        ],
        futureCodeList:[] //期货合约缩写 
      }
    },
    components: {
      'footer-bar': Footer
    },
    computed:{
      filterResult() {
        return this.searchList.filter(item => new RegExp(this.value, 'i').test(item.code));
      }
    },
    methods: {
        changeTab(index){
            this.selectItem = index;
            if(index===1){//市场
                this.marketSelect = true;
                this.selfSelect = false;
                this.tabSelected = "1";
                this.exchChange("111");
            }else{//自选
                this.marketSelect = false;
                this.selfSelect = true;
                this.querySelfList();
            }
        },
        exchChange(index){
          let self = this;
          let  content = { //单市场行情订阅
              "functionId":"50000106",
              "requestId":"123",
              "req_ans":"req",
              "code": [
                {
                  "exchId":index
                }
              ]  
            };
          let message = {
            serviceCode: "10000702" , 
            content:JSON.stringify(content)
          }
          this.webSocketApi.sendSock(message);
          this.$nextTick(()=>{
              if(index==111){ //中金所
                let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
                this.setSimpleName(futureInfo);
                for(let i in futureInfo){
                    if(futureInfo[i].ExchId == "111"){
                      self.marketList_111.push(futureInfo[i]); 
                    }
                  }
                if(self.marketList_111.length>0){ //为每个合约信息加操作
                  for(let i in self.marketList_111){
                    //初始化市场数据
                    self.$set(self.marketList_111[i],'detailAction',false)
                    self.$set(self.marketList_111[i],'lastPrice',"--");
                    self.$set(self.marketList_111[i],'amountIncrease',"--");
                    self.$set(self.marketList_111[i],'volume',"--");
                  } 
                }
                self.marketList_111 = self.uniqArr(self.marketList_111,"FutureCode"); //对象去重 
                self.marketList_111 = self.sortKey(self.marketList_111,"FutureCode");  //排序
                self.futureCodeList = self.getFutureCodeList(self.marketList_111);//获取合约简称 
                
                self.$nextTick(()=>{
                  setInterval(function(){
                      self.setMarket(self.marketList_111);
                      self.setColor(self.marketList_111); 
                  },1000)
                })
              }else if(index == 114){ //郑商所
                let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
                for(let i in futureInfo){
                    if(futureInfo[i].ExchId == "114"){
                      self.marketList_114.push(futureInfo[i]); 
                    }
                  }
                if(self.marketList_114.length>0){ //为每个合约信息加操作
                  for(let i in self.marketList_114){
                    //初始化市场数据
                    self.$set(self.marketList_114[i],'detailAction',false)
                    self.$set(self.marketList_114[i],'lastPrice',"--");
                    self.$set(self.marketList_114[i],'amountIncrease',"--");
                    self.$set(self.marketList_114[i],'volume',"--");
                  } 
                }
                self.marketList_114 = self.uniqArr(self.marketList_114,"FutureCode");//去重
                self.marketList_114 = self.sortKey(self.marketList_114,"FutureCode");  //排序
                self.futureCodeList = self.getFutureCodeList(self.marketList_114);//获取合约简称 

                self.$nextTick(()=>{
                  setInterval(function(){
                      self.setMarket(self.marketList_114);
                      self.setColor(self.marketList_114);
                  },1000)
                })
              }else if(index == 113){ //大商所
                let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
                for(let i in futureInfo){
                    if(futureInfo[i].ExchId == "113"){
                      self.marketList_113.push(futureInfo[i]);  
                    }
                  }
                if(self.marketList_113.length>0){ //为每个合约信息加操作
                  for(let i in self.marketList_113){
                    self.$set(self.marketList_113[i],'detailAction',false)
                    self.$set(self.marketList_113[i],'lastPrice',"--");
                    self.$set(self.marketList_113[i],'amountIncrease',"--");
                    self.$set(self.marketList_113[i],'volume',"--");
                  } 
                }
                self.marketList_113 = self.uniqArr(self.marketList_113,"FutureCode");//去重
                self.marketList_113 = self.sortKey(self.marketList_113,"FutureCode");  //排序
                self.futureCodeList = self.getFutureCodeList(self.marketList_113);//获取合约简称 

                self.$nextTick(()=>{
                    setInterval(function(){
                      self.setMarket(self.marketList_113);
                      self.setColor(self.marketList_113);
                  },1000)
                })
              }else if(index == 112){ //上期所
                let futureInfo = JSON.parse(sessionStorage.getItem('futureInfo'));
                for(let i in futureInfo){
                    if(futureInfo[i].ExchId == "112"){
                      self.marketList_112.push(futureInfo[i]); 
                    }
                  }
                if(self.marketList_112.length>0){ //为每个合约信息加操作
                  for(let i in self.marketList_112){
                    self.$set(self.marketList_112[i],'detailAction',false);
                    self.$set(self.marketList_112[i],'lastPrice',"--");
                    self.$set(self.marketList_112[i],'amountIncrease',"--");
                    self.$set(self.marketList_112[i],'volume',"--");
                  } 
                }
                self.marketList_112 = self.uniqArr(self.marketList_112,"FutureCode");//去重
                self.marketList_112 = self.sortKey(self.marketList_112,"FutureCode");  //排序
                self.futureCodeList = self.getFutureCodeList(self.marketList_112);//获取合约简称 

                self.$nextTick(()=>{
                  setInterval(function(){
                      self.setMarket(self.marketList_112);
                      self.setColor(self.marketList_112);
                  },1000)
                })
              }
        }) 
        },
        sortKey(arr,key){ //对象排序
            return arr.sort(function(a,b){
              let x = a[key];
              let y = b[key];
              return ((x<y)?-1:(x>y)?1:0)
            })
        },
        addselfList(index){ //加入自选列表
            this.filterResult[index].addself = !this.filterResult[index].addself;
            let msg;
            if(this.filterResult[index].addself){
              msg = this.filterResult[index].name +' 加入自选';
              let self = this;
              addSelfInfo({
                  userId:this.$store.state.userId,
                  contractCode:this.filterResult[index].code
                }).then((res)=>{
                 self.querySelfList();
              })
            }else{
              msg = this.filterResult[index].name + ' 移除自选';
              let self = this;
              deleteSelfInfo({
                userId:this.$store.state.userId,
                contractCode:this.filterResult[index].code
              }).then((res)=>{
                self.querySelfList();
              }) 
            }
            Toast({
              message: msg,
              duration: 1000
            });
        },
        futureOrder(index,flag){
          if(flag=="selfList"){ //自选下单
            sessionStorage.setItem('selfFutureCode',this.selfList[index].contractCode);
            sessionStorage.setItem('selfFutureName',this.selfList[index].FutureName);
            sessionStorage.setItem('selfExchId',this.selfList[index].exchId);
          }else if(flag == "marketList_111"){ //中金所下单
            sessionStorage.setItem('marketFutureCode',this.marketList_111[index].FutureCode);
            sessionStorage.setItem('marketFutureName',this.marketList_111[index].FutureName);
            sessionStorage.setItem('marketExchId',this.marketList_111[index].exchId);
          }else if(flag == "marketList_114"){ //郑商所下单
            sessionStorage.setItem('marketFutureCode',this.marketList_114[index].FutureCode);
            sessionStorage.setItem('marketFutureName',this.marketList_114[index].FutureName);
            sessionStorage.setItem('marketExchId',this.marketList_114[index].exchId);
          }else if(flag == "marketList_113"){ //大商所
            sessionStorage.setItem('marketFutureCode',this.marketList_113[index].futureCode);
            sessionStorage.setItem('marketFutureName',this.marketList_113[index].FutureName);
            sessionStorage.setItem('marketExchId',this.marketList_113[index].exchId);
          }else if(flag == "marketList_112"){ //上期所
            sessionStorage.setItem('marketFutureCode',this.marketList_112[index].futureCode);
            sessionStorage.setItem('marketFutureName',this.marketList_112[index].FutureName);
            sessionStorage.setItem('marketExchId',this.marketList_112[index].exchId);
          }
          this.$router.push('/futures/login')
        },
        maddselfList(index){ //市场行情加入自选
          if(this.tabSelected == "1"){ //中金所
              this.maddSelfInfo(this.marketList_111,index);
          }else if(this.tabSelected == "2"){ //郑商所
              this.maddSelfInfo(this.marketList_114,index);
          }else if(this.tabSelected == "3"){ //大商所 
              this.maddSelfInfo(this.marketList_113,index);
          }else if(this.tabSelected == "4"){ //上期所
              this.maddSelfInfo(this.marketList_112,index); 
          }  
        },
        maddSelfInfo(arr,index){ //市场加入自选通用
            let msg =arr[index].FutureName +'加入自选';
              let self = this;
              addSelfInfo({
                  userId:this.$store.state.userId,
                  contractCode:arr[index].FutureCode
                }).then((res)=>{
                 self.querySelfList();
              })
              Toast({
              message: msg,
              duration: 1000
            });
        },
        querySelfList(){ //查询自选列表
            let self = this;
            querySelfInfo({
              userId:this.$store.state.userId
            }).then((res)=>{
              if(res.data&& res.data.length>0){
                for(let i=0; i<res.data.length;i++){
                  //初始化自选数据
                  self.$set(res.data[i],'detailAction',false)
                  self.$set(res.data[i],'lastPrice',"--");
                  self.$set(res.data[i],'amountIncrease',"--")
                  self.$set(res.data[i],'volume',"--")

                }
                self.selfList = self.uniqArr(res.data,"contractCode");
                self.selfList = self.queryFutureName(self.selfList,"contractCode");
                }
                let code =[];
                for(let j=0;j<self.selfList.length;j++){
                  code.push({
                      "exchId":self.selfList[j].exchId,
                      "futureCode":self.selfList[j].contractCode
                    })
                }
                let content =  { //按照期货代码订阅
                    "functionId":"50000105",
                    "requestId":"123",
                    "req_ans":"req",
                    "code": code
                };
                let message ={
                  serviceCode: "10000702" , 
                  content : JSON.stringify(content)
                }; 
                self.webSocketApi.sendSock(message);
                // let self = this;
                this.$nextTick(()=>{
                  setInterval(function(){
                      let resData = self.webSocketApi.res;
                      for(let i in self.selfList){
                        for(let j in resData){
                          if(self.selfList[i].contractCode == resData[j].instrumentID){
                            self.$set(self.selfList[i],'lastPrice',resData[j].lastPrice);
                            self.$set(self.selfList[i],'preSettlementPrice',resData[j].preSettlementPrice)
                            self.$set(self.selfList[i],'volume',resData[j].volume)
                          }
                        } 
                      }
                      self.setColor(self.selfList);
                  },1000)
                })
            })
        },
        deleteSelf(index){ //删除自选列表 
            let title = this.selfList[index].FutureName;
            deleteSelfInfo({
              userId:this.$store.state.userId,
              contractCode:this.selfList[index].contractCode
            }).then((res)=>{
              this.selfList.splice(index,1);
            })
            Toast({
              message: title+" 移除自选",
              duration: 1000
            });
        },
        handleClick(){
          this.popupVisible = true;
          this.getDefaultResult();
        },
        closePopup(){
          this.popupVisible = false;
        },
        loadMore() {
          this.isMoreLoading = true //设置加载更多
          this.loading = true;//加载中
          setTimeout(() => {
            let last = this.list[this.list.length - 1];
            for (let i = 1; i <= 10; i++) {
              this.list.push(last + i);
            }
            this.loading = false;
          }, 2500);
        },
        scrollXR(){ //向右滚动 
            this.isRt = true;
        },
        setColor(arr){ //行情界面顔色設置
          if(arr && arr.length>0){
                  for(let i=0;i<arr.length;i++){
                  arr[i].lastPrice = Math.round(arr[i].lastPrice*100)/100;
                  if(isNaN(arr[i].lastPrice)){
                    arr[i].lastPrice = "--"
                    arr[i].amountIncrease = "--"
                  }else{
                    arr[i].amountIncrease =((arr[i].lastPrice - arr[i].preSettlementPrice) / arr[i].preSettlementPrice).toFixed(2);
                  } 
                  if(arr[i].amountIncrease<0){
                    arr[i].color = "#00bd9a"
                  }else if(arr[i].amountIncrease>0){
                    arr[i].color = "red";
                  }else{
                    arr[i].color = "#fff";
                  }
                  if(arr[i].volume==null){
                    arr[i].volume = "--";
                  }
                }
              }
        },
        setMarket(arr){ //行情订阅
          let resData = this.webSocketApi.res;
            for(let i in  arr){
              for (let j in resData){
                if(arr[i].FutureCode == resData[j].instrumentID){
                  this.$set(arr[i],'lastPrice',resData[j].lastPrice);
                  this.$set(arr[i],'preSettlementPrice',resData[j].preSettlementPrice)
                  this.$set(arr[i],'volume',resData[j].volume)
                }
              }
            }

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
                  exchName:'中国金融期货交易所',
                  addself:false
                })
              }else if(futureInfo[i].ExchId == "112"){
                this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchName:'上海期货交易所',
                  addself:false
                })
              }else if(futureInfo[i].ExchId == "113"){
                this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchName:'大连商品交易所',
                  addself:false
                })
              }else if(futureInfo[i].ExchId == "114"){
                 this.searchList.push({
                  name:futureInfo[i].FutureName,
                  code:futureInfo[i].FutureCode,
                  exchName:'郑州商品交易所',
                  addself:false
                })
              }
              
            }
          }
          this.searchList = this.uniqArr(this.searchList,"code")
          if(this.selfList.length>0){ //筛选出已自选
              for(let i in this.searchList){
                for (let j in this.selfList){
                  if(this.searchList[i].code == this.selfList[j].contractCode){
                    this.searchList[i].addself = true;
                  }
                }
              }
          }
        },
        uniqArr(arr,key){ //对象数组去重
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
        getFutureCodeList(arr){ //获取合约简称 
            self.futureCodeList=[];
            arr.forEach(item => self.futureCodeList.push(item.FutureName.replace(/[0-9]+/g,"")));
            for(let j=0;j<self.futureCodeList.length;j++){ //去重
              for(let k=j+1;k<self.futureCodeList.length;k++){ 
                if(self.futureCodeList[j] == self.futureCodeList[k]){ 
                  self.futureCodeList.splice(k,1);
                  k--;
                }
                if(self.futureCodeList[k] == "黄大豆号"){
                  self.futureCodeList[k] = "黄大豆";
                }
              } 
            }
            if(self.futureCodeList[0]=="黄大豆"){
              self.futureCodeList.splice(0,1);
            }
            return self.futureCodeList;
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
                  }
                }
            }
            }
          }  
          return arr;   
        },
        setSimpleName(futureInfo){ //期货名称替换简写 
          for(let k in this.simpleFutureName){
              for (let m in futureInfo){
                futureInfo[m].FutureName = futureInfo[m].FutureName.replace(this.simpleFutureName[k].futureName,this.simpleFutureName[k].sName);
              }
          }
          return futureInfo;
        },
        showDetailAction(index){ //显示自选列表操作按钮
            this.selfList[index].detailAction = !this.selfList[index].detailAction;
        },
        showMarketAction(index){ //显示市场列表操作按钮
            if(this.tabSelected == "1" ){
              this.marketList_111[index].marketAction = !this.marketList_111[index].marketAction;
            }else if(this.tabSelected == "2"){
              this.marketList_114[index].marketAction = !this.marketList_114[index].marketAction;
            }else if(this.tabSelected =="3"){
              this.marketList_113[index].marketAction = !this.marketList_113[index].marketAction;
            }else if(this.tabSelected =="4"){
              this.marketList_112[index].marketAction = !this.marketList_112[index].marketAction;
            }
        },
        jump(item){ //滚动跳转
          let jump = document.querySelectorAll(".d_jump");
          let total = 0;
          for(let i in jump){
            if(jump[i].innerText.match(item)!= null && jump[i].innerText.match(item).length>0){ //获取对应位置
              total = jump[i].offsetTop; 
              break;
            }
          }
          document.body.scrollTop = total;
          //$('html body').animate({scrollTop: total}, 100);
        }
    },
   
    created(){ 
      let selfList = this.selfList;
      this.querySelfList();
      if (this.$store.state.token==""){//userToken为空
        this.$store.commit('SELECT_TAB', '')
         this.$router.push('/');
      }else {
          let _footer = this.$store.state.footerVisible;
          if (!_footer) {
            this.$store.commit('TOGGLE_FOOTER');
          }
          this.$store.commit('SELECT_TAB', 'market')
      }
    }
  }
</script>
<style lang='scss'>
   .marketTab{
     z-index: 9;
     position: fixed;
     top:0;
     left: 0;
     width: 92%;
     height: 44px;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .marketTab ul{
       list-style: none 
     }
   .marketTab ul>li{
      float: left;
      width: 6em;
      height: 1.8em;
      line-height: 1.8em;
      text-align: center;
      color:  #f9a101;
      border:2px solid #f9a101;
   }
   .marketTab ul>li:first-child{
     border-right: none;
     border-radius:5px 0 0 5px
   }
   .marketTab ul>li:last-child{
     border-radius:0px 5px 5px 0;
   }
   .active{
     background: #f9a101;
     color: #fff !important;
   }
    .content{
      margin-top:1em;
      padding-bottom: 6em;
      padding-left:0.5em;
      background-image:linear-gradient(0deg, #14171f 0%, #1c2431 100%);
      overflow: auto;
      width: 100%; 
    }
    .futureCodeList{
      background: #1c2431;
      width: 100%;
      height: 2.8em;
      line-height: 2.8em;
      position: fixed;
      bottom: 3.5em;
      overflow-x:auto;
      overflow-y: hidden; 
    }
    .futureCodeList ul{
      position: absolute;
      left:0;
      list-style: none;
      padding:0;
      margin:0;
      white-space: nowrap;
    }
    .futureCodeList ul>li{
      display: inline-block;
      width: 4.2em;
      text-align: center;
    }
    .futureCodeList ul>li:active{
      background-color:rgba(249,161,1,0.26)
    }
    .futureCodeList ul>li:last-child{
      margin-right: 2.5em;
    }
    .futureCodeList .icon-right{
      position: fixed;
      padding-right: 0;
      margin-right: 0;
      background: #1c2431;
      right: 0;
      line-height: 2em;
      z-index: 2;
    }
    .tableContent,.searchResult{
      list-style: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding:0;
      margin:0;
      width: 100%;
    }
    .tableContent li{
        width: 20%;
        color: #979797;
        text-align: center;
        vertical-align: middle;
        height: 3em;
        line-height: 3em;
    }
    .tableContent li:first-child{
      text-align: left;
    }
    .searchResult{
      margin-top:0.5em;
    }
    .searchResult li{
      height: 2em;
      line-height: 2em;
    }
    .scollRt{
      left:-4em !important;
    }
    .colorRed{
      color:red;
    }
    .colorGreen{
      color:rgb(0, 189, 154)
    }
    .trSelected{
        background: rgba(249,161,1,0.26)
    }
    .actionList{
      display: flex;
      height:2.5em;
      line-height: 2.5em;
      background: #060818;
      padding: .5em;
      justify-content: flex-end;
      button{
        width: 50%;
        background: #f9a101;
        border-radius: 100px;
        width: 16%;
        width: 25%;
        margin-right: 1em;

      }
    }
</style>

