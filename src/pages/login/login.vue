<template>
    <!-- <div class="page has-navbar" v-nav="{ title: '策略交易监控' }">  -->
      <div class="page" v-show="!isWxConnect">
          <div class="login-form">
              <h1>睿歆量化策略平台</h1>
              <div class="form-cotent">
                      <!-- <div class="form-cotent-item" @click="actionSheet">
                          <label v-for="(item,index) in addressList" :key="index">
                              {{item.isSelect?item.name:""}}
                          </label>
                          <i class="iconfont icon-arrow-right alRight"></i>
                      </div> -->
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
                      <!-- <div class="wthree-text">
                          <ul>
                              <li>
                                  <input type="checkbox" id="brand" checked="checked">
                                  <label for="brand"><span></span>记住登录</label>
                              </li>
                              <li><a href="#">忘记密码?</a> </li>
                          </ul>
                          <div class="clear"> </div>
                      </div> -->
                      <!-- <button class="loginBtn" @click="btn_login()" :class="{active:isActive}"  :disabled="isabled"> -->
                      <button class="loginBtn active" @click="btn_login()">
                       登录
                      </button>
                      <!-- <div class="changeBtn">
                          <span>更换登录方式</span>
                      </div> -->
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
  import { login, getInstitution, userComfirm, getUserWx, loginByUserId, addUserWx} from "@/api/base";
  import { setToken } from "@/utils/token";
  import { setUserId } from "@/utils/user";
  
  export default {
    data(){
      return {
        isWxConnect:false,//关联微信
        address:"公网 （139.129.96.68）",//地址
        userName:"", //用户名
        passWord:"", //密码 
        institutionId:"",//机构代码
        institutionName:"",//机构名称
        institution:[], //机构列表
        openId:"",//微信认证ID
        wxImgUrl:"",//微信认证头像
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
      let url = window.location.href;
      if(url.indexOf("?")!=-1){ //参数传入
          let openidStr = url.split("?")[1].split("&")[0].split("=")[1];
          let wxImgUrlStr = url.split("?")[1].split("&")[1].split("=")[1].replace("th//://","")
          this.openId = openidStr;
          this.wxImgUrl = wxImgUrlStr;
          console.log("微信认证 openId："+this.openId+"\n imgurl："+this.wxImgUrl);
          //按照openid查询UIC当前的用户列表 ：读取openid和userId 的关系表
          getUserWx({
              wxOpenId:this.openId
          }).then((res)=>{
              if(res.data != null){ //查询到用户
                //获取用户的用户名/密码并登陆
                let userId = res.data.userId;
                this.isWxConnect = true;
                this.$store.commit('showLoading');
                loginByUserId({
                    userId:userId
                }).then((res)=>{
                    console.log(res.data);
                    const token = res.data.token; //获取token值
                    const userId = res.data.userId;//获取用户代码
                    const userName = res.data.name; //获取用户名称
                    const password = res.data.password;//密码
                    const loginId = res.data.loginId;//登录名
                    const institutionId = res.data.institutionId;//机构ID
                    const mobile = res.data.mobile;//手机号码
                    const avatar = res.data.avatar;//头像
                    
                    setToken(token);//将token存入cookie中
                    setUserId(userId);//将userId存入cookie中
                    this.$store.commit('SET_TOKEN',token) //将token存入Vuex中
                    this.$store.commit('setUserId',userId) //将userId存入Vuex中
                    sessionStorage.setItem('loginId',loginId);
                    sessionStorage.setItem('password',password)
                    sessionStorage.setItem('userName',userName);
                    sessionStorage.setItem('mobile',mobile);
                    sessionStorage.setItem('avatar',avatar);
                    this.webSocketApi.initWebSocket(token);

                    userComfirm({ //用户认证
                            loginId:loginId,
                            password:password,
                            institutionId:institutionId
                    }).then((res)=>{ 
                            let resData = res.data;
                            sessionStorage.setItem('amounts',resData.amounts);//资金规模
                            sessionStorage.setItem('userState',resData.status==0?"无效":"有效");//客户状态
                            sessionStorage.setItem('end_datetime',resData.end_datetime);//有效日期
                    });
                    getInstitution({  //机构查询
                            userId:userId
                        }).then((res)=>{
                            let resData = res.data;
                            this.institutionName = resData.name;
                            this.institutionId = resData.institutionId;
                            sessionStorage.setItem('institutionName',this.institutionName);
                            //跳转首页
                            setTimeout(() => { 
                                this.$store.commit('hideLoading');
                                this.$router.push({ 
                                    path:'/my'
                                }) 
                            }, 500);
                        }); 
                        //查询所有的合约信息
                        let content =  {
                            "functionId":"50000104",
                            "requestId":"123",
                            "req_ans":"req",
                        };
                        let message ={
                        serviceCode: "10000702" , 
                        content : JSON.stringify(content)
                        };
                        this.webSocketApi.sendSock(message); 

                        //获取期货合约信息
                        let self = this;
                        window.setTimeout(()=>{
                            let futureInfo = JSON.stringify(self.webSocketApi.futureInfo);
                            sessionStorage.setItem('futureInfo',futureInfo)//将合约信息存入sessionStorage中 
                        },3000)
                })
              }
          })
      }

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
       btn_login(){
           if(this.userName.trim() == ""){
                 MessageBox.alert('用户名不能为空');
               return;
           };
           if(this.passWord.trim() == ""){ 
               MessageBox.alert('密码不能为空');
               return;
           };
           this.$store.commit('showLoading');
           login({ 
               loginId:this.userName,
               password:this.passWord
           }).then((res)=>{
               console.log(res.data); 
              
               const token = res.data.token; //获取token值
               const userId = res.data.userId;//获取用户代码
               const userName = res.data.name; //获取用户名称
               const password = res.data.password;//密码
               const loginId = res.data.loginId;//登录名
               const institutionId = res.data.institutionId;//机构ID
               const mobile = res.data.mobile;//手机号码
               const avatar = res.data.avatar;//头像
               setToken(token);//将token存入cookie中
               setUserId(userId);//将userId存入cookie中
               this.$store.commit('SET_TOKEN',token) //将token存入Vuex中
               this.$store.commit('setUserId',userId) //将userId存入Vuex中
               sessionStorage.setItem('loginId',loginId);
               sessionStorage.setItem('password',password)
               sessionStorage.setItem('userName',userName);
               sessionStorage.setItem('mobile',mobile);
               sessionStorage.setItem('avatar',avatar);
               this.webSocketApi.initWebSocket(token);
               if(this.openId){//微信认证ID存在
                    addUserWx({
                        userId:userId,
                        wxOpenId:this.openId,
                        wxImgUrl:this.wxImgUrl
                    }).then((res)=>{

                    })
               }
               userComfirm({ //用户认证
                    loginId:loginId,
                    password:password,
                    institutionId:institutionId
               }).then((res)=>{ 
                    let resData = res.data;
                    sessionStorage.setItem('amounts',resData.amounts);//资金规模
                    sessionStorage.setItem('userState',resData.status==0?"无效":"有效");//客户状态
                    sessionStorage.setItem('end_datetime',resData.end_datetime);//有效日期
               });
               getInstitution({  //机构查询
                    userId:userId
                }).then((res)=>{
                    let resData = res.data;
                    this.institutionName = resData.name;
                    this.institutionId = resData.institutionId;
                    sessionStorage.setItem('institutionName',this.institutionName);
                    //跳转首页
                    setTimeout(() => {
                        this.$store.commit('hideLoading');
                        this.$router.push({ 
                            path:'/my'
                        }) 
                    }, 500);
                }); 
                //查询所有的合约信息
                let content =  {
                    "functionId":"50000104",
                    "requestId":"123",
                    "req_ans":"req",
                };
                let message ={
                serviceCode: "10000702" , 
                content : JSON.stringify(content)
                };
                this.webSocketApi.sendSock(message); 

                //获取期货合约信息
                let self = this;
                window.setTimeout(()=>{
                    let futureInfo = JSON.stringify(self.webSocketApi.futureInfo);
                    sessionStorage.setItem('futureInfo',futureInfo)//将合约信息存入sessionStorage中
                },3000)
           })
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
    background:url('images/bg.jpg') no-repeat;
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
