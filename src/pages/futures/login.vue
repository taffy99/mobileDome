<template>
  <div>
    <div id="futureLogin" v-show="isLogin">
      <mt-header fixed title="登录期货账户">
      </mt-header>
      <div class="loginForm">
          <mt-field label="开户公司"  v-model="companyName">
            <i class="iconfont icon-search"></i>
          </mt-field>
          <mt-field label="资金账户"  v-model="accountCode">
            <i class="iconfont icon-close"></i>
          </mt-field>
          <mt-field label="账号密码"  type="password" v-model="accountPwd">
            <i class="iconfont icon-password"></i>
          </mt-field>
      </div>
      <button class="futureLoginBtn" @click="futureLogin">登录交易</button>
      </div>
    <transaction v-show="isTransaction" v-on:reLogin="reLogin"></transaction>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>
<script>
 import Footer from '../../components/FooterBar.vue'
 import Transaction from '@/pages/futures/transaction.vue'
  export default {
    data(){
      return {
        companyName:"文化内盘模拟",
        accountCode:"1108800765",
        accountPwd:"11232323",
        isLogin:true, //登录界面
        isTransaction:false  //交易界面
      }
    },
    components: {
      'footer-bar': Footer,
      'transaction':Transaction
    },
    methods: {
      futureLogin(){
        this.isLogin = false;
        this.isTransaction = true;
        let content={
            "functionId":"71000101",
            "custAcctCode":"119699",
            "password":"rx123456",
            "companyId":"1234",
            "userProductInfo": "1111",
            "authCode":"1111",
            "autoConfirm":1
        };
        let message ={
          serviceCode: "10000701", 
          content:JSON.stringify(content),
          token: this.$store.state.token
      };  
      this.webSocketApi.sendSock(message);
      this.webSocketApi.subscribeSingle(this.$store.state.userId);
      },
      reLogin(){
        this.isLogin = true;
        this.isTransaction = false;
      }
    },
    created(){
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
      this.$store.commit('SELECT_TAB', 'transacton')
    }
  }
</script>
<style lang='scss'>
    .loginForm{
      position: absolute;
      top:20%;
      width: 100%;
    }
    .futureLoginBtn{
      position: absolute;
      top:60%;
      left:10%;
      width: 80%;
      height: 3em;
      line-height: 3em;
      background: #f9a101;
      border-radius: 2em;
    }
</style>

