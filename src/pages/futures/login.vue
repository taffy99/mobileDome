<template>
  <div>
    <div id="futureLogin" v-show="isLogin && !alreadyLogin">
      <mt-header fixed title="登录期货账户">
      </mt-header>
      <div class="loginForm">
        <a class="mint-cell mint-field" @click="selectCompanyFun()">
          <div class="mint-cell-left"></div>
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">开户公司</span>
            </div>
            <div class="mint-cell-value">
              <input type="text" class="mint-field-core" v-model="companyName" readonly placeholder="请选择">
              <div class="mint-field-clear" style="display: none;">
                <i class="mintui mintui-field-error"></i>
              </div>
              <span class="mint-field-state is-default">
                <i class="mintui mintui-field-default"></i>
              </span>
              <div class="mint-field-other">
                <i class="iconfont icon-search"></i>
              </div>
            </div>
          </div><div class="mint-cell-right"></div>
        </a>

          <mt-field label="资金账户"  v-model="accountCode" placeholder="请输入资金账户">
            <i class="iconfont icon-close" @click="clearAccount"></i>
          </mt-field>
          <mt-field label="账号密码"  type="password" v-model="accountPwd" placeholder="请输入密码">
            <i class="iconfont icon-password"></i>
          </mt-field>
      </div>
      <button id="futureLoginBtn" class="futureLoginBtn" @click="futureLogin">登录交易</button>
    </div>

    <!--选择开户公司-->
    <mt-popup v-model="popupCompanyVisible" position="right">
      <mt-header fixed title="选择开户公司">
        <mt-button class="iconfont icon-left-" slot="left" @click="closePopupCompany"></mt-button>
        <mt-button class="iconfont icon-search" slot="right"  @click="handleClick()"></mt-button>
      </mt-header>
      <div style="padding-top:44px;height:100%;overflow-y: scroll;" id="selectCompany" v-on:scroll="funScroll">
        <ul class="selectCompany">
          <li v-for="(item,idx) in companyList" :key="idx">
            <div class="d_jump">{{item.A_Z}}</div>
            <ul>
              <li v-for="(listItem,index) in item.list" :key="index" @click = 'listItemFun(listItem.id,listItem.name)'>{{listItem.name}}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="rightMenuFixed">
        <ul style="transform: translateY(-50%); ">
          <li v-for=" (item,index) in companyList" :key="index" class="liActive" :id="index == 0 ? 'liActive':''" @click = 'jump(index)'>{{item.A_Z}}</li>
        </ul>
      </div>
    </mt-popup>
    <!--选择交易接口-->
    <mt-popup
      v-model="popupInterfaceVisible"
      position="right"
      popup-transition="popup-fade">
      <div class="parentInterface">
        <div class="selInterface">
          <div class="title">
            选择交易接口
            <i @click="closeInterfacePopFun"><img src="../login/images/close.png" alt=""></i>
          </div>
          <ul>
            <li v-for="(item, idx) in interfaceList" :key="idx" @click="selInterfaceFun(item.id,item.name)">{{item.name}}</li>
          </ul>
        </div>
      </div>
    </mt-popup>
    <!--搜索交易接口-->
    <mt-popup v-model="popupSearchVisible" position="right" class="searchInterface">
      <mt-header fixed>
        <mt-button class="iconfont icon-left-" slot="left" @click="closeSearchPopup"></mt-button>
      </mt-header>
      <mt-search
        autofocus
        v-model="value"
        :result="filterResult">
        <ul  v-for="(item,index) in filterResult" v-bind:key="index" class="searchResult">
          <li @click="selSearchFun(item.id,item.name)" style="width:100%;">
            <span style="text-align: left;">{{item.name}}</span>
          </li>
        </ul>
      </mt-search>
    </mt-popup>

    <transaction
        v-if="!isLogin && alreadyLogin"
        v-on:reLogin="reLogin"
        :companyName = "companyName">
    </transaction>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
 import Footer from '../../components/FooterBar.vue'
 import Transaction from '@/pages/futures/transaction.vue'
 import { brokerList } from '@/api/base'
 import { setFutureToken} from "@/utils/token";
 import { MessageBox } from "mint-ui";
  export default {
    data(){
      return {
        companyName:"",
        accountCode:"",//091673
        accountPwd:"",//rx123456
        isLogin:true, //登录界面
        alreadyLogin:false, //已登录
        holdList:[], //持仓列表

        //搜索交易接口 搜索列表searchList、默认搜索数据defaultResult
        popupSearchVisible:false,
        searchList: [],
        defaultResult:[
          /*{interfaceId:1, interfaceName:'要和期货——VFD', companyId:1, companyName:'国内期货'},defaultResult*/
        ],
        value:'',
        //选择交易interface
        popupInterfaceVisible:false,
        interfaceId:'',
        interfaceList:[{id:'1', name:'按量期货v_8TZ'},],
        //选择开户公司
        popupCompanyVisible:false,
        d_jump_arr:[],
        d_boolean:true,
        companyIdMoment: '',
        companyNameMoment: '',
        companyList:[
          /*{A_Z:'A',list:[{id:'1', name:'保存期货'},]},*/
        ],
        companyListBefore:[]
      }
    },
    components: {
      'footer-bar': Footer,
      'transaction':Transaction
    },
    mounted(){
      window.onresize = () =>{
        let h = document.body.clientHeight; 
        let u = navigator.userAgent;
        if(u.indexOf('Android')>-1){
          if(h <= window.screen.availHeight/2){
            $("#futureLoginBtn").hide();
            $("#tab-bar").hide();
          }else{
            $("#futureLoginBtn").show();
            $("#tab-bar").show();
          }
        }
      }
    },
    methods: {
      funScroll(){
        let d_jump = $('.d_jump');
        if (this.d_boolean){
          for (let i = 0; i < d_jump.length; i++) {
            this.d_jump_arr.push(d_jump[i].offsetTop)
          }
          this.d_boolean = false
        }
        let distanceTop = $("#selectCompany").scrollTop() + 60;
        for (let i = 0; i < this.d_jump_arr.length; i++) {
          if (i == this.d_jump_arr.length - 1 && distanceTop >= this.d_jump_arr[i]){
            $("#liActive").attr('id', '')
            $($(".liActive")[i]).attr('id', 'liActive')
            break;
          } else {
            if (distanceTop >= this.d_jump_arr[i] && distanceTop < this.d_jump_arr[i + 1]){
              $("#liActive").attr('id', '')
              $($(".liActive")[i]).attr('id', 'liActive')
              break;
            }
          }
        }
      },
      jump (index) {
        $("#liActive").attr('id', '')
        $($('.liActive')[index]).attr('id', 'liActive')
        let d_jump = $('.d_jump');
        let jump = document.querySelectorAll('.d_jump')
        // 获取需要滚动的距离
        let total = jump[index].offsetTop - 44
        $('#selectCompany').animate({scrollTop: total}, 500, function () {
          $("#liActive").attr('id', '')
          $($('.liActive')[index]).attr('id', 'liActive')
        });
      },
      //选择开户公司
      selectCompanyFun(){
        this.companyList = [];
        this.companyListBefore = [];
        this.defaultResult = [];
        brokerList().then(response => {
          let data = response.data;
          for (let i = 0; i < data.length; i++) {
            this.companyListBefore.push(data[i].name + "^^" + data[i].id)
            this.defaultResult.push({id:data[i].id, name:data[i].name})
          }
          let newArr = this.pySegSort(this.companyListBefore)
          for (let i = 0; i < newArr.length; i++) {
            let arrList = {
              A_Z:newArr[i].letter.toUpperCase(),
              list:[]
            }
            let childData = newArr[i].data
            for (let j = 0; j < childData.length; j++) {
                arrList.list.push({id:childData[j].split('^^')[1], name:childData[j].split('^^')[0]})
            }
            this.companyList.push(arrList)
          }
        }).catch(() => {
          console.log('error');
        })
        this.popupCompanyVisible = true;
      },
      closePopupCompany(){
        this.popupCompanyVisible = false;
      },
      listItemFun(id, name){
        this.companyId = id
        this.companyName = name
        this.popupCompanyVisible = false
        //this.popupInterfaceVisible = true
      },
      //选择交易接口 Moment
      closeInterfacePopFun(){
        this.popupInterfaceVisible = false
      },
      selInterfaceFun(id, name){
        this.defaultResult = [];
        brokerList().then(response => {
          let data = response.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].id == id){
              for (let j = 0; j < data[i].resourceList.length; j++) {

              }
            }
          }
        }).catch(() => {
          console.log('error');
        })
        this.interfaceId = id
        this.companyId = this.companyIdMoment
        this.companyName = this.companyNameMoment
        this.popupInterfaceVisible = false
        this.popupCompanyVisible = false
      },
      //搜索交易接口
      handleClick(){
        this.popupSearchVisible = true;
        this.searchList = [];
      },
      closeSearchPopup(){
        this.popupSearchVisible = false;
      },
      selSearchFun(i,n){
        this.popupSearchVisible = false
        this.popupCompanyVisible = false
        this.companyId = i
        this.companyName = n
      },
      clearAccount(){
        this.accountCode = "";
      },
      futureLogin(){
        if(this.companyName.trim() == ""){
            MessageBox.alert('请选择开户公司');
            return;
        };
        if(this.accountCode.trim() == ""){
            MessageBox.alert('资金账户不能为空');
            return;
        };
        if(this.accountPwd.trim() == ""){
            MessageBox.alert('密码不能为空');
            return;
        };
        let content = {
            "functionId":"71000101",
            "custAcctCode":this.accountCode,
            "password":this.accountPwd,
            "companyId":this.companyId,
            "userProductInfo": "1111",
            "authCode":"1111",
            "autoConfirm":1
        };
        let message = { //期货登录
          serviceCode: "10000701",
          content:JSON.stringify(content)
      };
      this.$store.commit('showLoading');
      this.webSocketApi.sendSock(message);
      let self = this;
      window.setTimeout(() => {
        if(self.webSocketApi.futureLogin!=undefined && self.webSocketApi.futureLogin.token!=undefined){
          setFutureToken(self.webSocketApi.futureLogin.token);
          sessionStorage.setItem('custAcctCode',this.accountCode);
          sessionStorage.setItem('companyName',this.companyName);
          self.$store.commit('SET_FUTURETOKEN', self.webSocketApi.futureLogin.token) //将token存入Vuex中
          self.isLogin = false;
          self.alreadyLogin = true;
          self.$store.commit('hideLoading');
         }else{
          self.$store.commit('hideLoading');
         }
        }, 2000)
      },
      reLogin(){
        MessageBox.confirm("确定退出资金账户吗？").then(action=>{
          this.isLogin = true;
          this.alreadyLogin = false;
          setFutureToken("");
          this.$store.commit('SET_FUTURETOKEN',"");
          sessionStorage.setItem('custAcctCode',"")
          sessionStorage.setItem('companyName',"")
        })
      },
      //拼音排序
      pySegSort(arr, empty) {
        if (!String.prototype.localeCompare) { return null; }
        let letters = "*abcdefghjklmnopqrstwxyz".split('');
        let zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
        let segs = [];
        let curr;
        $.each(letters, function(i){
          curr = {letter: this, data:[]};
          $.each(arr, function() {
            if ((!zh[i - 1] || zh[i - 1].localeCompare(this, "zh") <= 0) && this.localeCompare(zh[i], "zh") == -1) {
              curr.data.push(this);
            }
          });
          if (empty || curr.data.length) {
            segs.push(curr);
            curr.data.sort(function(a, b){
              return a.localeCompare(b, "zh");
            });
          }
        });
        return segs;
      }
    },
    created(){
      if (this.$store.state.futureToken){//已登录
        this.isLogin = false;
        this.alreadyLogin = true;
      }
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
      this.$store.commit('SELECT_TAB', 'transacton')
    },
    computed:{
      filterResult() {
        return this.defaultResult.filter(item => new RegExp(this.value, 'i').test(item.name));
      }
    }
  }
</script>
<style lang='scss'>
  .futuresLogin {
    .mint-popup-right {background-color: rgba(6,8,24,.6);}
  }
  .loginForm{position: absolute;top:20%;width: 100%;}
  .futureLoginBtn{position: absolute;top:60%;left:10%;width: 80%;height: 3em;line-height: 3em;background: #f9a101;border-radius: 2em;}

  ul,ul>li {margin:0;padding:0;list-style: none;}
  //rightMenuFixed
  .mint-header.is-fixed {z-index: 3!important;}
  .rightMenuFixed {position: fixed;z-index: 1;top: 44px;right:10px;height:100%;display: flex;align-items: center;justify-content: center;}
  .rightMenuFixed>ul>li {font-size: 12px;width:25px;height:25px;border-radius:100%;text-align: center;line-height: 27px;}
  .rightMenuFixed>ul>li:active {color:#f9a101;background-color:rgba(255,255,255,.3) ;}
  //selectCompany
  .selectCompany {padding:20px 35px 20px 0;}
  .selectCompany>li{overflow: hidden;margin-bottom: 20px;}
  .selectCompany>li:last-child{margin-bottom: 40px;}
  .selectCompany >li>div,
  .selectCompany >li>ul {float: left;overflow: hidden;box-sizing: border-box;}
  .selectCompany >li>div{width:10%;padding-left:10px;padding-top: 3px;font-weight: bold;font-size: 18px;}
  .selectCompany >li>ul{width:90%;}
  .selectCompany >li>ul>li{float:left;padding:5px 10px ;font-size: 15px;text-align: center;border-radius:4px;}
  .selectCompany >li>ul>li:active{color:#f9a101;background-color:rgba(255,255,255,.3) ;}
  #liActive {color:#f9a101;background-color:rgba(255,255,255,.3) ;}
  //选择交易接口
  .parentInterface{width:100%;height:100%;display: flex;align-items: center;justify-content: center;}
  .selInterface {width:80%;/*height:300px;*/background-color: #dfdfdf;margin:0 auto;border-radius: 10px;padding-bottom: 50px;}
  .selInterface .title{position:relative;font-size:18px;font-weight:bold;color:#000;text-align: center;border-bottom: 1px solid #4d4d4d;line-height:44px;height:44px;}
  .selInterface .title i{position:absolute;right:10px;top:8px;width: 25px;height:25px;}
  .selInterface .title img{width:100%;height:100%;}
  .selInterface ul > li {height:402em;line-height: 2em;border-bottom: 1px solid #8d8d8d;color:#333;padding:0 10px;}
  .selInterface ul > li:active {background-color: #cfcfcf;color:#f9a101;}
  /*搜索交易接口*/
  .mint-searchbar {z-index: 111;}
  .searchInterface .searchResult li {overflow:hidden;border-bottom: 1px solid #999;}
  .searchInterface .searchResult li:active {color:#f9a101;}
  .searchInterface .searchResult li>span{float:left;line-height: 2em;height:2em;padding:0 20px;box-sizing: border-box;font-size: 15px;}
  .searchInterface .searchResult li>span:first-child{width:50%;}
  .searchInterface .searchResult li>span:last-child{width:50%;text-align: right;}
</style>

