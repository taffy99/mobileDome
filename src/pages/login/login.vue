<template>
    <!-- <div class="page has-navbar" v-nav="{ title: '策略交易监控' }">  -->
      
      <div class="page">
          <div class="login-form">
              <h1>策略交易监控</h1>
              <div class="form-cotent">
                      <div class="form-cotent-item" @click="actionSheet">
                          <label v-for="(item,index) in addressList" :key="index">
                              {{item.isSelect?item.name:""}}
                          </label>
                          <i class="iconfont icon-arrow-right alRight"></i>
                      </div>
                      <div class="form-cotent-item">
                          <i class="iconfont icon-user"></i>
                          <input type="text" v-model="userName" id="txtUserId" placeholder="请输入您的用户名" @focus="isBlur1= true" @blur="checkName">
                          <i class="iconfont icon-close alRight" v-show="isBlur1" @click="clearTxt(0)"></i>
                      </div>
                      <div class="form-cotent-item">
                          <i class="iconfont icon-password"></i>
                          <input type="password" v-model="passWord" id="txtPassword" placeholder="请输入您的密码" @focus="isBlur2= true" @blur="checkPassword">
                          <i class="iconfont icon-close alRight" v-show="isBlur2"  @click="clearTxt(1)"></i>
                      </div>
                      <div class="wthree-text">
                          <ul>
                              <li>
                                  <input type="checkbox" id="brand" checked="checked">
                                  <label for="brand"><span></span>记住登录</label>
                              </li>
                              <li><a href="#">忘记密码?</a> </li>
                          </ul>
                          <div class="clear"> </div>
                      </div>
                      <button class="loginBtn" @click="btn_login()" :class="{active:isActive}"  :disabled="isabled">
                       登录
                      </button>
                      <div class="changeBtn">
                          <span>更换登录方式</span>
                      </div>
                </div>
        </div> 
        <mt-actionsheet
            :actions= "addressData"
            v-model="sheetVisible">
        </mt-actionsheet>
      </div>
    <!-- </div> -->
</template>
<script>
  import axios from "axios";
  import { MessageBox } from "mint-ui";
  import { login, getInstitution } from "@/api/base";
  import { setToken } from "@/utils/token";
  import { setUserId } from "@/utils/user";
  export default {
    data(){
      return {
        address:"公网 （139.129.96.68）",//地址
        userName:"", //用户名
        passWord:"", //密码 
        institutionId:"",//机构代码
        institutionName:"",//机构名称
        institution:[], //机构列表
        addressList:
        [
            {
                name: '公网 （139.129.96.68）',
                value:"0",
                isSelect:true
            },
            {
                name: '内测 （172.16.1.73）',
                value:"1",
                isSelect:false
            }

        ],
        isBlur1:false,
        isBlur2:false,
        isabled:true,
        isActive:false,//登录按钮颜色 
        addressData:[{
            name:"",
            method:this.selectAddress
        }],
        sheetVisible:false
      }
    },
    created(){
      let _footer = this.$store.state.footerVisible; 
      if (_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
    },
    computed:{
        
    },
    methods: {
        actionSheet(){
            this.sheetVisible=true;
            for(let i in this.addressList){
                if(!this.addressList[i].isSelect){
                    this.addressData[0].name = this.addressList[i].name
                }
            }
        },
        selectAddress(){
            for(let i in this.addressList){
                this.addressList[i].isSelect = !this.addressList[i].isSelect;
            }
        },
        checkName(){
            if(this.userName.trim()==''){
                this.isBlur1 = false;
            };
            if(this.userName.trim()!=''&& this.passWord.trim()!=''){
                this.isActive = true;
                this.isabled = false;
            }
        },
        checkPassword(){
            if(this.passWord.trim()==''){
                this.isBlur2 = false;
            };
            if(this.userName.trim()!=''&& this.passWord.trim()!=''){
                this.isActive = true;
                this.isabled = false;
            }
        },
        clearTxt(index){
            if(index==0){ //清空userName
                this.userName='';
                this.isBlur1 = false;
                this.isActive = false;
            }else{ //清空password
                this.passWord='';
                this.isBlur2 = false;
                this.isActive = false;
            }
        },
        getInstitutionList(){
            if(this.userName!=undefined && this.userName.trim()!==""){
                getInstitution({
                    loginId:this.userName
                }).then((res)=>{
                    let resData = res.data;
                    this.institutionName = resData.name;
                    this.institutionId = resData.institutionId;
                    console.log(res.data)
            });
           }
        },
       btn_login(){
           if(this.userName.trim() == ""){
                 MessageBox.alert('用户名不能为空');
               return;
           };
           if(this.passWord.trim() == ""){ 
               MessageBox.alert('密码不能为空');
               return;
           };
           this.$router.push({
                    path:'/my'
                })
           //登录接口(已封装@/api/base.js)
        //    login({ 
        //        loginId:this.userName,
        //        password:this.passWord
        //    }).then((res)=>{
        //        console.log(res.data); 
        //        const token = res.data.token; //获取token值
        //        const userId = res.data.loginId;//获取用户代码
        //        setToken(token);//将token存入cookie中
        //        setUserId(userId);//将userId存入cookie中
        //        this.$store.commit('SET_TOKEN',token) //将token存入Vuex中
        //        this.$store.commit('setUserId',userId) //将userId存入Vuex中
        //        this.webSocketApi.subscribeSingle(this.$store.state.userId);
        //        this.$router.push({
        //             path:'/my'
        //         })
        //    })
       }
    }
    
  }
</script>
<style scoped>
@import url('css/login.css');
.page{
    position: absolute;
    top:0;
    bottom:0;
    width: 100%;
    height: 100%;
    background:url('images/bg.png') no-repeat;
    background-size: cover;
}
    
.login-form{
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0,0,0,0.74);
}
.form-cotent{
    padding:1em 2.5em;
}
.form-cotent-item{
    position: relative;
    width: 100%;
    height: 3em;
    line-height: 3em;
    color: #fff;
    background:rgba(216,216,216,0.20);
    border-radius:100px;
    margin-bottom: 1em;
}
.form-cotent-item label{
    margin-left:1em;
}
.form-cotent-item i{
    margin-left:1em;
}
.form-cotent-item input{
    position: absolute;
    height: 100%;
    width: 75%;
}
input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #b9b8b8;
    /* placeholder字体大小  */
    font-size: 1em;
    letter-spacing:0.96px;
}
.loginBtn{
    margin:3em auto 2em;
    text-align: center;
    width: 100%;
    height: 3em;
    line-height: 3em;
    font-size: 1em;
    color: #fff;
    background:rgba(216,216,216,0.40);
    border-radius:100px;
}
.active{
    background:#f9a101 !important;
}
.changeBtn{
    text-align: center;
}
</style>
