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
        <mt-tab-item id="1"><span @click="exchChange('111')">中金所</span></mt-tab-item>
        <mt-tab-item id="2"><span @click="exchChange('114')">郑商所</span></mt-tab-item>
        <mt-tab-item id="3"><span @click="exchChange('113')">大商所</span></mt-tab-item>
        <mt-tab-item id="4"><span @click="exchChange('112')">上期所</span></mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="tabSelected">
        <mt-tab-container-item id="1">
          <div class="content">
            <ul class="tableContent">
              <li>名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <ul class="tableContent" v-for="(item,index) in marketList_111" :key="index">
              <li style="color:#fff;">{{item.instrumentID}}</li>
              <li :style="{'color':item.color}">{{item.lastPrice}}</li>
              <li :style="{'color':item.color}">{{item.amountIncrease  }}</li>
              <li style="color:#fff;">{{item.volume}}</li>
            </ul>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div class="content">
            <ul class="tableContent">
              <li>名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <ul class="tableContent" v-for="(item,index) in marketList_114" :key="index">
              <li style="color:#fff;">{{item.instrumentID}}</li>
              <li :style="{'color':item.color}">{{item.lastPrice}}</li>
              <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
              <li style="color:#fff;">{{item.volume}}</li>
            </ul>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <div class="content">
            <ul class="tableContent">
              <li>名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <ul class="tableContent" v-for="(item,index) in marketList_113" :key="index">
              <li style="color:#fff;">{{item.instrumentID}}</li>
              <li :style="{'color':item.color}">{{item.lastPrice}}</li>
              <li :style="{'color':item.color}">{{item.amountIncrease  }}</li>
              <li style="color:#fff;">{{item.volume}}</li>
            </ul>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="4">
          <div class="content">
            <ul class="tableContent">
              <li>名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <ul class="tableContent" v-for="(item,index) in marketList_112" :key="index">
              <li style="color:#fff;">{{item.instrumentID}}</li>
              <li :style="{'color':item.color}">{{item.lastPrice}}</li>
              <li :style="{'color':item.color}">{{item.amountIncrease}}</li>
              <li style="color:#fff;">{{item.volume}}</li>
            </ul>
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
            :result="filterResult">
            <ul  v-for="(item,index) in filterResult" v-bind:key="index" class="searchResult">
              <li style="width:30%">{{item.title}}</li>
              <li style="width:50%">{{item.value}}</li>
              <li @click="addselfList(index)"><i :class="[item.addself?starSelect:starUnSelect]"></i></li>
            </ul>
        </mt-search>
      </mt-popup>
      <div class="futureCodeList">
        <ul :class="{scollRt:isRt}" @touchstart.stop="isRt=false">
          <li>IF</li>
          <li>IH</li>
          <li>IC</li>
          <li>二债</li>
          <li>五债</li>
          <li>十债</li>
          <li>IC</li>
        </ul>
        <button class="iconfont icon-right" @click="scrollXR"></button>
      </div>
    </div>
    <div v-show = "selfSelect">
        <div class="content" style="margin-top:4em;">
            <ul class="tableContent">
              <li>名称</li>
              <li>最新</li>
              <li>涨幅(%)</li>
              <li>成交量</li>
            </ul>
            <div v-for="(item,index) in selfList" :key="index">
              <ul class="tableContent" :class="{trSelected:item.detailAction}" @click="showDetailAction(index)">
                <li style="color:#fff;">{{item.contractCode}}</li>
                <li :style="{'color':item.color}">{{item.lastPrice}}</li>
                <li :style="{'color':item.color}">{{item.amountIncrease  }}</li>
                <li style="color:#fff;">{{item.volume}}</li>
              </ul>
              <div class="actionList" v-show="item.detailAction">
                  <button @click="deleteSelf(index)">删除自选</button>
                  <button>下单</button>
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
            :result="filterResult">
            <ul  v-for="(item,index) in filterResult" v-bind:key="index" class="searchResult">
              <li style="width:30%">{{item.title}}</li>
              <li style="width:50%">{{item.value}}</li>
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
        value: 'if', 
        detailAction:false,
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
        //默认搜索数据
        defaultResult:[]
      }
    },
    components: {
      'footer-bar': Footer
    },
    computed:{
        filterResult() {
        return this.searchList.filter(item => new RegExp(this.value, 'i').test(item.title));
      }
    },
    methods: {
        changeTab(index){
            this.selectItem = index;
            if(index===1){//市场
                this.marketSelect = true;
                this.selfSelect = false;
                let self = this;
                this.$nextTick(()=>{
                    let arr =[];//搜索列表
                    window.setInterval(function(){
                      self.marketList_111 = self.webSocketApi.res;
                      self.setColor(self.marketList_111);
                      self.defaultResult = self.getDefaultResult(111,self.marketList_111)
                  },1000)
                })
            }else{//自选
                this.marketSelect = false;
                this.selfSelect = true;
                this.querySelfList();
            }
        },
        exchChange(index){
          let self = this;
          let  content = {
              "functionId":"50000102",
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
            content:JSON.stringify(content),
            token: this.$store.state.token
          }
          this.webSocketApi.sendSock(message);
          this.webSocketApi.subscribeSingle(this.$store.state.userId);
          this.$nextTick(()=>{
             window.setInterval(function(){
               if(index==111){
                 self.defaultResult=[];
                 self.marketList_111 = self.webSocketApi.res; 
                 self.setColor(self.marketList_111);
                 self.defaultResult = self.getDefaultResult(index,self.marketList_111)
               }else if(index == 114){
                 self.defaultResult = [];
                 self.marketList_114 = self.webSocketApi.res;
                 self.setColor(self.marketList_114);
                 self.defaultResult = self.getDefaultResult(index,self.marketList_111)
               }else if(index == 113){
                 self.defaultResult = [];
                 self.marketList_113 = self.webSocketApi.res;
                 self.setColor(self.marketList_113);
                 self.defaultResult = self.getDefaultResult(index,self.marketList_111)
               }else if(index == 112){
                 self.defaultResult = [];
                 self.marketList_112 = self.webSocketApi.res;
                 self.setColor(self.marketList_112);
                 self.defaultResult = self.getDefaultResult(index,self.marketList_111)
               }
          },1000)
        }) 
        },
        addselfList(index){ //加入自选列表
            this.filterResult[index].addself = !this.filterResult[index].addself;
            let msg;
            if(this.filterResult[index].addself){
              msg = '加入自选';
              addSelfInfo({
                  userId:this.$store.state.userId,
                  contractCode:this.filterResult[index].title
                }).then((res)=>{
                 console.log(res);
              })
            }else{
              msg = '移除自选';
            }
            Toast({
              message: msg,
              duration: 1000
            });
        },
        querySelfList(){ //查询自选列表
            querySelfInfo().then((res)=>{
              if(res.data&& res.data.length>0){
                for(let j=0; j<res.data.length;j++){
                  this.$set(res.data[j],'detailAction',false)
                  this.selfList.push(res.data[j]);
                }
                this.selfList = this.uniqArr(res.data,"contractCode"); 
              } 
            })
        },
        deleteSelf(index){ //删除自选列表 
            let title = this.selfList[index].contractCode;
            deleteSelfInfo({
              userId:this.$store.state.userId,
              contractCode:this.selfList[index].contractCode
            }).then((res)=>{
              this.selfList.splice(index,1);
            })
            Toast({
              message: title+"已从自选中移除",
              duration: 1000
            });
        },
        handleClick(){
          this.popupVisible = true;
          this.searchList=[]; 
          if(this.defaultResult && this.defaultResult.length >0){
            for(let j=0; j<this.defaultResult.length;j++){
              this.$set(this.defaultResult[j],'addself',false)
              this.searchList.push(this.defaultResult[j]);
            }
            this.searchList = this.uniqArr(this.searchList,"title");
          }
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
                  arr[i].amountIncrease =((arr[i].lastPrice - arr[i].preSettlementPrice) / arr[i].preSettlementPrice).toFixed(2);
                  if(arr[i].amountIncrease<0){
                    arr[i].color = "#00bd9a"
                  }else if(arr[i].amountIncrease>0){
                    arr[i].color = "red";
                  }else{
                    arr[i].color = "#fff";
                  }
                }
              }
        },
        getDefaultResult(index,arr){ //获取搜索列表
          let searchList = [];
          if(arr && arr.length>0){
            for(let i=0;i<arr.length;i++){
              if(index==111){
                searchList.push({
                  title:arr[i].instrumentID,
                  value: "中国金融期货交易所",
                  instrumentID:arr[i].instrumentID,
                  
                })
              }else if(index==114){
                searchList.push({
                  title:arr[i].instrumentID,
                  value: "郑州商品交易所"
                })
              }else if(index==113){
                searchList.push({
                  title:arr[i].instrumentID,
                  value: "大连商品交易所"
                })
              }else if(index==112){
                searchList.push({
                  title:arr[i].instrumentID,
                  value: "上海期货交易所"
                })
              }
            }
          }
          return searchList;
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
        showDetailAction(index){ //显示列表操作按钮
            this.selfList[index].detailAction = !this.selfList[index].detailAction;
        }

    },
    mounted(){ 
        this.querySelfList();
    },
    created(){
      let content =  {
          "functionId":"50000102",
          "requestId":"123",
          "req_ans":"req",
          "code": [
            {
              "exchId":"111"
            }
          ]  
      };
      let message ={
        serviceCode: "10000702" , 
        content : JSON.stringify(content),
        token: this.$store.state.token
      }; 
      this.webSocketApi.subscribeSingle(this.$store.state.userId);
      this.webSocketApi.sendSock(message);
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
      this.$store.commit('SELECT_TAB', 'market')
    }
  }
</script>
<style lang='scss'>
   .marketTab{
     z-index: 9;
     position: fixed;
     top:0;
     left: 0;
     width: 90%;
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
      margin-bottom: 6em;
      background-image:linear-gradient(0deg, #14171f 0%, #1c2431 100%);
      overflow: auto;
      width: 100%; 
    }
    .futureCodeList{
      background: #1c2431;
      width: 100%;
      height: 2em;
      line-height: 2em;
      position: fixed;
      bottom: 3.5em;
      overflow-y:hidden;
      overflow-x: auto;
    }
    .futureCodeList ul{
      position: absolute;
      left:0;
      list-style: none;
      width: 120%;
      padding:0;
      margin:0;
    }
    .futureCodeList ul>li{
      float: left;
      width: 4em;
      text-align: center;
    }
    .futureCodeList ul>li:last-child{
      padding-right: 1em;
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
        width: 25%;
        color: #979797;
        text-align: center;
        vertical-align: middle;
        height: 3em;
        line-height: 3em;
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
      width: 100%;
      height:2em;
      line-height: 2em;
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

