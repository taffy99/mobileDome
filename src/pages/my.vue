<template>
  <div id="my">
    <mt-header fixed title="策略交易平台">
      <mt-button icon="back" slot="left"  v-show="userDetail" @click="reBack"></mt-button>
    </mt-header>
    <div class="container">
      <div class="user-head" @click="showUserDetail">
        <div class="user-img">
          <img :src="baseAPI+'/img/'+avatar">
        </div>
        <ul class="user-info">
          <li>{{loginId}}</li>
          <li>{{userName}}（{{institutionName}}）</li>
        </ul>
        <div style="position:absolute;right:1em;"><i class="iconfont icon-right" v-show="!userDetail"></i></div>
      </div>
      <div class="userContent">
        <div v-show="userDetail">
          <div class="contentItem">
              <p class="title">
                <span>终端及策略</span>
                <i class="iconfont icon-ooedit alRight"  @click="editInfo"></i>
              </p>
              <div class="user-option" style="border-bottom:none">
                <mt-cell>
                  <span slot="title">资金规模:</span>
                  <!-- <span>管理员</span> -->
                  <input type="text" v-model="amounts" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
                <mt-cell>
                  <span slot="title">账户状态:</span>
                  <!-- <span>18888888888</span> -->
                  <input type="text" v-model="userState" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
                <mt-cell>
                  <span slot="title">有效日期:</span>
                  <!-- <span>资产管理部</span> -->
                  <input type="text" v-model="expireDate" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
                <mt-cell>
                  <span slot="title">手机号码:</span>
                  <!-- <span>资产管理部</span> -->
                  <input type="text" v-model="mobile" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
              </div>
          </div>
          <div class="contentItem exitBtn"  @click="logOut">
            <input type="button" value="退出登录">
          </div>
        </div>
        <div v-show="strategyDetail">
          <div class="contentItem">
            <p class="title">
              <span>终端状态</span>
               <i class="iconfont icon-refresh alRight" :class="{rotate360:isrotate}" @click="rotate"></i>
            </p>
            <div class="user-option">
              <div>
              <mt-cell id="seletTerminal">
                  <span slot="title">选择终端:</span>
                  <span v-for="(item,index) in addressList" :key="index" @click="actionSheet">
                      {{item.isSelect?item.name:""}}
                  </span>
                <i class="iconfont icon-right"></i>
              </mt-cell>
              </div>
              <div class="row">
                <mt-cell>
                  <span slot="title" class="titleTxt">动态权益:</span>
                  <span class="valueTxt">{{fund}}</span>
                </mt-cell>
                <mt-cell>
                  <span slot="title" class="titleTxt" style="text-align:left">保证金:</span>
                  <span class="valueTxt">{{currMargin}}</span>
                </mt-cell>
              </div>
              <div class="row">
                <mt-cell>
                  <span slot="title" class="titleTxt">持仓盈亏:</span>
                  <span class="valueTxt">{{positionProfit}}</span>
                </mt-cell>
                <mt-cell>
                  <span slot="title" class="titleTxt" style="text-align:left">浮动盈亏:</span>
                  <span class="valueTxt">{{positionProfit}}</span>
                </mt-cell>
              </div>
            </div>
            <div class="strategyList">
              <ul class="lsTitle">
                <li style="width:45%">策略名称</li>
                <li style="width:35%">语言类型</li>
                <li style="width:20%;">状态</li>
              </ul>
              <ul v-for="(item,index) in contractList" :key="index">
                <li style="width:50%">{{item.name}}</li>
                <li style="width:30%">{{item.plicyLanguage}}</li>
                <li style="width:20%"><mt-switch v-model="item.value" @change="change(index)"></mt-switch></li>
              </ul>
            </div>
          </div>
          <div class="strategyOpt" v-show="isOpen"> 
                <button @click="startStrategy" :class="{btnActive:playState==0}" :disabled="playState==0">
                  <span v-if="playState==0">已开启</span>
                  <span v-else>开启</span>
                </button> 
                <button @click="pauseStrategy" :class="{btnActive:playState==1}" :disabled="playState==1">
                  <span v-if="playState==1">已暂停</span>
                  <span v-else>暂停</span>
                </button>
                <button @click="endStrategy" :class="{btnActive:playState==2}" :disabled="playState==2">
                  <span v-if="playState==2">已停止</span>
                  <span v-else>停止</span>
                </button>
            </div>
        </div>
      </div>
    </div>
    <mt-actionsheet
        :actions= "addressData"
        v-model="sheetVisible">
    </mt-actionsheet>
     <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
  import { MessageBox  } from "mint-ui";
  import Footer from '../components/FooterBar.vue'
  import { setFutureToken,setToken} from "@/utils/token";
  import { terminalState,strategyAction, logout} from "@/api/base";
  export default {
    data(){
      return {
        isrotate:false,
        loginId:"",//登录名
        userName:"",  //用户名
        institutionName:"",//机构名称
        amounts:"",//资金规模
        userState:"", //账户状态
        expireDate:"",//有效日期
        mobile:"",//手机号码
        ipAddress:"0.0.0.0",//终端IP
        fund:"0.00",//动态权益
        currMargin:"0.00",//保证金
        positionProfit:"0.00",//持仓盈亏
        addressList:[], //地址列表
        addressData:[{
            name:"未启动 （ 0.0.0.0 )",
            method:this.selectAddress
        }],
        sheetVisible:false,
        isOpen:false,
        status:false,
        strategyList:[],//策略列表
        terminalToken:"",//终端token
        playState:"",//策略运行状态
        
        userDetail:false,//用户详情
        strategyDetail:true, //策略详情
        contractList:[],//合约列表
        checkList:[], //选中列表
        plicyLanguage:[
          {
            type: 0,
            name:"C#"
          },
          {
            type: 1,
            name:"Python"
          },
          {
            type: 2,
            name:"Matlab"
          },
          {
            type: 3,
            name:"R语言"
          },
        ],
        avatar:"",
        baseAPI:"",
      }
    },
    computed:{
      bgImg(){
        return {

        }
      }
    },
    components: {
      'footer-bar': Footer
    },
    methods: {
      editInfo(){
        MessageBox.prompt(' ','请输入登录密码:',{
          inputValidator:(value)=>{
            return value == sessionStorage.getItem('password')
          },
          inputErrorMessage:"密码不正确"
        }).then(({value,action}) =>{
            this.status = true;
        }),() =>{
          console.log('cancel');
        }
      },
      selectAddress(){ //地址切换
          for(let i in this.addressList){
              this.addressList[i].isSelect = !this.addressList[i].isSelect;
              if(this.addressList[i].isSelect){
                if(this.strategyList.length>0){
                  this.fund = this.strategyList[i].account.fund;
                  this.currMargin = this.strategyList[i].account.currMargin;
                  this.positionProfit = this.strategyList[i].account.positionProfit;
                  let strategies = this.strategyList[i].strategies;
                  this.playState = strategies.playState;
                  if(strategies.children && strategies.children.length>0){
                    this.contractList = [];
                    for(let j in strategies.children){
                        this.contractList.push(strategies.children[j]); 
                    }
                    for(let k in this.contractList){
                      for(let m in this.plicyLanguage){
                          if(this.contractList[k].type == this.plicyLanguage[m].type){
                            this.$set(this.contractList[k],'plicyLanguage',this.plicyLanguage[m].name);
                            this.$set(this.contractList[k],'value',this.contractList[k].checked);
                          }
                        }
                    }
                  }
                }
              }else if(this.addressList.length==1){ //只有一个地址
                  this.addressList[0].isSelect = true;
                  this.addressData[0].name = this.addressList[0].name;
              }
          }
      },
      getTerminalState(){
        let self = this;
        terminalState({
          loginId:sessionStorage.getItem('loginId')
        }).then((res)=>{
          let resData = res.data;
          if(resData.flag){
            let resValue = JSON.parse(resData.value);
            if(resValue.length>0){
              self.isOpen = true;
              self.strategyList = resValue;
              for(let i in resValue){
                  self.addressList.push({
                    name: resValue[i].innerIP?"内网 ( "+resValue[i].innerIP+" )":"",
                    isSelect:false,
                  })
              }
              let account = resValue[0].account;
              self.addressData[0].name =self.addressList[0].name;
              self.terminalToken = resValue[0].token;
              self.addressList[0].isSelect = true;
              self.fund = account.fund;
              self.currMargin = account.currMargin;
              self.positionProfit = account.positionProfit;

              let strategies = resValue[0].strategies;
              this.playState = strategies.playState;
              if(strategies.children && strategies.children.length>0){
                for(let i in strategies.children){
                    self.contractList.push(strategies.children[i]);
                }
                for(let j in self.contractList){
                  for(let k in self.plicyLanguage){
                      if(self.contractList[j].type == self.plicyLanguage[k].type){
                        self.$set(self.contractList[j],'plicyLanguage',self.plicyLanguage[k].name);
                      }
                    }
                }
              }
            }else{
              self.isOpen = false;
              self.addressList.push({
                    name: "未启动 （ 0.0.0.0 ）",
                    isSelect:true,
                })
            }
          }else{
              MessageBox.alert(resData.message);
          }
          
        })
      },
      startStrategy(){ //开启策略 
        let strategies = [];
        for (let i in this.contractList){
          if(this.contractList[i].value){ 
            strategies.push(this.contractList[i].id); 
          }
        }
        //MessageBox.alert(strategies);
        MessageBox.confirm("确定开启吗?", "提示",{
            confirmButtonText: '开启',
          }).then(action=>{
            strategyAction({
              playState:"0",
              loginId:sessionStorage.getItem('loginId'),
              token: this.terminalToken,
              strategies:strategies
            }).then((res)=>{
              let reDate = JSON.parse(res.data);
              if(reDate.flag){
                this.playState=0;
              }else{
                MessageBox.alert(reDate.message);
              }
            })
        }).catch(err=>{
          console.log("");
        });
      },
      pauseStrategy(){ //暂停策略
        let strategies = [];
        for (let i in this.contractList){
          if(this.contractList[i].value){
            strategies.push(this.contractList[i].id);
          }
        }
        MessageBox.confirm("确定暂停吗?", "提示",{
            confirmButtonText: '暂停',
          }).then(action=>{
            strategyAction({
              playState:"1",
              loginId:sessionStorage.getItem('loginId'),
              token: this.terminalToken,
              strategies:strategies
            }).then((res)=>{
              let reDate = JSON.parse(res.data);
              if(reDate.flag){
                this.playState=1;
              }else{
                MessageBox.alert(reDate.message);
              }
            })
        }).catch(err=>{
          console.log("");
        });
      },
      endStrategy(){ //停止策略
        let strategies = [];
        for (let i in this.contractList){
          if(this.contractList[i].value){
            strategies.push(this.contractList[i].id);
          }
        }
        //MessageBox.alert(strategies);
        MessageBox.confirm("确定停止吗?", "提示",{
            confirmButtonText: '停止',
          }).then(action=>{
            strategyAction({
              playState:"2",
              loginId:sessionStorage.getItem('loginId'),
              token: this.terminalToken,
              strategies:strategies
            }).then((res)=>{
              let reDate = JSON.parse(res.data);
              if(reDate.flag){
                this.playState=2;
              }else{
                MessageBox.alert(reDate.message);
              }
            })
        }).catch(err=>{
          console.log("");
        });
      },
      change(index){//切换
        //MessageBox.alert(this.contractList[index].value);
      },
      rotate(){ //刷新
          this.isrotate = true;
          setTimeout(()=>{
              this.isrotate = false;
          },1000)
          this.contractList = []; //初始化地址列表
          this.addressList = []; //初始化策略列表
          this.getTerminalState();
      },
      logOut(){//退出
        let self = this;
        MessageBox.confirm('确定退出吗？').then(action =>{
          //返回登录页面
          logout({
            userId:this.$store.state.userId
          }).then((res)=>{
            setFutureToken("");
            setToken(""); 
            this.$store.commit('SET_TOKEN',"");
            this.$store.commit('SET_FUTURETOKEN',"");
            sessionStorage.setItem('custAcctCode',"");
            sessionStorage.setItem('companyName',"");
            sessionStorage.setItem('futureInfo',"");
            sessionStorage.setItem('amounts',"");
            sessionStorage.setItem('end_datetime',"");
            sessionStorage.setItem('institutionName',"");
            sessionStorage.setItem('loginId',"");
            sessionStorage.setItem('userName',"");
            sessionStorage.setItem('userState',"");
            sessionStorage.setItem('mobile',"");
            sessionStorage.setItem('password',"");
            sessionStorage.setItem('avatar',"");
            self.$router.push("/");
             //删除URL参数
            window.location.href = window.location.href.split("?")[0];
        })
      });
    },
      showUserDetail(){ //用户详情
        this.userDetail = true;
        this.strategyDetail = false;
      },
      reBack(){
        this.userDetail = false;
        this.strategyDetail = true;
      },
      actionSheet(){
          this.sheetVisible=true;
          if(this.addressList.length>1){
            for(let i in this.addressList){
              if(!this.addressList[i].isSelect){
                  this.addressData[0].name = this.addressList[i].name
              }
            }
          }else if(this.addressList.length==1){
            this.addressList[0].isSelect = true;
            this.addressData[0].name = this.addressList[0].name;
          }

      },
      formatDate(date){ //日期格式
        let reDate = date.toString();
        return reDate.substr(0,4)+"-"+reDate.substr(4,2)+"-"+reDate.substr(6,2)
      }
    },
    created(){
      if(this.$store.state.token==""){
        this.$store.commit('SELECT_TAB', '')
        this.$router.push('/');
      }else{
         let _footer = this.$store.state.footerVisible;
          if (!_footer) {
            this.$store.commit('TOGGLE_FOOTER');
          }
          this.$store.commit('SELECT_TAB', 'my')
      }
    },
    mounted(){
      this.loginId = sessionStorage.getItem('loginId');
      this.userName = sessionStorage.getItem('userName');
      this.institutionName = sessionStorage.getItem('institutionName');
      this.amounts = sessionStorage.getItem('amounts');
      this.userState = sessionStorage.getItem('userState');
      this.expireDate = this.formatDate(sessionStorage.getItem('end_datetime'));
      this.mobile = sessionStorage.getItem('mobile');
      this.avatar = sessionStorage.getItem('avatar');
      this.baseAPI = process.env.BASE_API;
      this.getTerminalState();
    }
  }
</script>
<style lang='scss'>
  #seletTerminal{
     .mint-cell-value{
       margin-left:-2.5em;
     }
  }
  .rotate360{
    -webkit-transform:rotate(720deg);
    transform:rotate(720deg);
    -webkit-transition:-webkit-transform 2s linear;
    transition:transform 2s linear;
  }
  .container {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
  }
  .user-head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top:1em;
    height: 5.5em;
    width: 100%;
    background-image:linear-gradient(-180deg, #1c2431 0%, #14171f 100%);
  }
  .userContent .contentItem{
    margin:1em 0;
    background-image:linear-gradient(-180deg, #1c2431 0%, #14171f 100%);
    .title{
      border-bottom:1px solid #4b5367;
      padding:1em 0 1em 2em;
      span{
        border-left:3px solid #f9a103;
        box-sizing: border-box;
        padding:0 .7em 0;
      }

    }
    .user-option {
      padding:0 0 .5em;
      width: 100%;
      overflow: hidden;
      border-bottom: 1px solid #4b5367;
    }
    .showBtn{
      width: 100%;
      color: #2e85e4;
      font-size: .9em;
      margin-bottom:1em;
    }
  }
  .exitBtn{
      text-align: center;
      height: 3em;
      line-height: 3em;
      font-size: 1em;
      margin-bottom: 3em;
    }
  .user-img {
    //background-image: url("../assets/my/user.png");
    background-repeat: no-repeat;
    /**正方形区域**/
    width: 50px;
    height: 50px;
    /**border半径要是边长的一半，这样就能画出一个圆**/
    border-radius:8px;
    /**设置边框**/
    border: solid #ffffff 2px;
    /**设置为flex布局，并且内部项目都居中显示**/
    display: flex;
    justify-content: center;
    align-items: center;
    margin:0 1.5em 0 2em;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .user-info{
    list-style: none;
    padding:0;
  }
  .user-info li{
    margin-bottom: 0.5em;
  }
  .mgT15{
    margin-top:15px;
  }

  .right-arrow {
    margin-left: 10px;
  }

  .user-option span {
    font-size: 14px;
  }
  .btnList{
    display: flex;
    height: 3em;
    padding-bottom: 1em;
    justify-content:flex-end;
    font-size:14px;
    button{
      border:1px solid #4b5367 !important;
      border-radius:4px;
      padding:.5em;
      margin-right: 1em;
    }
  }
  .mint-cell-value input{
    background: transparent;
    border: none;
    height: 2em;
    width: 90%;
    color: #fff;

  }
  .addBorder{
     border-bottom: 1px solid #4b5367 !important;
  }
  .strategyList{
    padding: 0.5em 1em 2em 1em;
    ul{
      list-style: none;
      display: flex;
      padding: 1em 0 0 1em;
      margin:0;
      i{
        margin-right: 0.5em;
      }
    }
    .lsTitle{
      padding-bottom: 1em;
      border-bottom: 1px solid #4b5367;
      padding-left: 1em;
    }
  }
  .strategyOpt{
    position: fixed;
    z-index:222;
    width: 100%;
    bottom:3.5em;
    background-image: linear-gradient(-180deg, #1c2431 0%, #14171f 100%);
    display: flex;
    border-top: 1px solid #4b5367;
    padding: .5em;
    justify-content: space-evenly;
    button{
        width: 23%;
        height: 2em;
        line-height: 2em;
        border: 1px solid #727c96 !important;
        border-radius: 100px;
    }
  }
  .row{
    display: flex;
    justify-content: space-around;
    padding-left: 0.5em;
  }
  .titleTxt{
    display: inline-block;
    width: 5em;
    text-align: right;
  }
  .valueTxt{
    display: inline-block;
    width: 5em;
    text-align: left;
    margin-left: .5em;
  }
  .btnActive{
    background: rgba(249, 161, 1, 0.26);
    border: none !important
  }
</style>

