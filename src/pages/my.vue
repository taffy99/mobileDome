<template>
  <div id="my">
    <mt-header fixed title="策略交易平台">
      <!-- <mt-button class="iconfont icon-exit" slot="right" @click="exit"></mt-button> -->
    </mt-header>
    <div class="container">
      <div class="user-head" @click="showUserDetail">
        <div class="user-img"></div>
        <ul class="user-info">
          <li>PANDA_ZHANG1</li>
          <li>汉文（上期）</li>
        </ul>
        <div></div>
      </div>
      <div class="userContent">
        <div v-show="userDetail">
          <div class="contentItem">
              <p class="title">
                <span>终端及策略</span>
                <i class="iconfont icon-ooedit alRight" @click="editInfo"></i>
              </p>
              <div class="user-option">
                <mt-cell>
                  <span slot="title">风控资金:</span>
                  <!-- <span>管理员</span> -->
                  <input type="text" value="100000" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
                <mt-cell>
                  <span slot="title">账户状态:</span>
                  <!-- <span>18888888888</span> -->
                  <input type="text" value="启用" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
                <mt-cell>
                  <span slot="title">有效日期:</span>
                  <!-- <span>资产管理部</span> -->
                  <input type="text" value="2020-11-07" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
                <mt-cell>
                  <span slot="title">手机号码:</span>
                  <!-- <span>资产管理部</span> -->
                  <input type="text" value="12345678123" :readonly="status?false:'readonly'" :class="{addBorder:status}">
                </mt-cell>
              </div>
          </div>
          <div class="contentItem exitBtn"  @click="exit">
            <input type="button" value="退出登录">
          </div>
        </div>
        <div v-show="strategyDetail">
          <div class="contentItem">
            <p class="title"><span>终端状态</span></p>
            <div class="user-option">
              <div>
              <mt-cell>
                <span slot="title">选择终端:</span>
                <span @click="actionSheet" style="margin-left:-3em;">上期（172.16.5.32:100706）</span>
                <i class="iconfont icon-right"></i>
              </mt-cell>
              </div>
              <div class="row">
                <mt-cell>
                  <span slot="title" class="titleTxt">动态权益:</span>
                  <span class="valueTxt">12,532.10</span>
                </mt-cell>
                <mt-cell>
                  <span slot="title" class="titleTxt">保障金:</span>
                  <span class="valueTxt">4,012.00</span>
                </mt-cell>
              </div>
              <div class="row">
                <mt-cell>
                  <span slot="title" class="titleTxt">平仓盈亏:</span>
                  <span class="valueTxt">0.00</span>
                </mt-cell>
                <mt-cell>
                  <span slot="title" class="titleTxt">浮动盈亏:</span>
                  <span class="valueTxt">30.00</span>
                </mt-cell>
              </div>
            </div>
            <div class="strategyList">
              <ul class="lsTitle"> 
                <li style="width:55%">合约名称</li>
                <li style="width:30%">状态</li>
                <li>操作</li>
              </ul>
              <ul>
                <i class="iconfont icon-checked"></i>
                <li style="width:50%">基本面事件驱动策略</li>
                <li style="width:30%">Python</li>
                <li style="color:#f9a101;">已启动</li>
              </ul>
              <ul>
                <i class="iconfont icon-checked"></i>
                <li style="width:50%">Alpha对冲策略</li>
                <li style="width:30%">C++</li>
                <li style="color:#f9a101;">已启动</li>
              </ul>
              <ul>
                <i class="iconfont icon-check"></i>
                <li style="width:50%">价值轮动量化策略</li>
                <li style="width:30%">C#</li>
                <li style="color:#f9a101;">已启动</li>
              </ul>
              <ul>
                <i class="iconfont icon-check"></i>
                <li style="width:50%">量价关联指数跟踪型策略1号</li>
                <li style="width:30%">Matlap</li>
                <li style="color:#ff6960;">已暂停</li>
              </ul>
              <ul>
                <i class="iconfont icon-check"></i>
                <li style="width:50%">量价关联指数跟踪型策略1号</li>
                <li style="width:30%">Matlap</li>
                <li style="color:#ff6960;">已暂停</li>
              </ul>
            </div>
            <div class="strategyOpt">
                <button>开启</button>
                <button>暂停</button>
                <button>停止</button>
            </div>
          </div>
          
          <!-- <div class="contentItem">
            <p class="title"><span>控制操作</span></p>
            <div class="user-option">
              <mt-cell>
                <span slot="title">选择策略:</span>
                <span>手动控制</span>
                <i class="iconfont icon-right"></i>
              </mt-cell>
            </div>
          
            <div class="accordion">
                <button class="showBtn" @click="isOpen?closeCommand():showCommand()">{{isOpen?"收起命令...":"显示命令..."}}</button>
                <div class="btnList" v-show="isOpen">
                    <button>设置策略</button>
                    <button>重新启动</button>
                    <button>关闭终端</button>
                </div>
            </div>
          </div> -->
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
  export default {
    data(){
      return {
        addressData:[{
            name:'上期 （172.16.5.32:100706）',
            method:this.selectAddress
        }],
        sheetVisible:false,
        isOpen:false,
        status:false,
        userDetail:false,//用户详情
        strategyDetail:true //策略详情
      } 
    },
    components: {
      'footer-bar': Footer
    },
    methods: {
      editInfo(){
        MessageBox.prompt(' ','请输入授权密码:').then(action =>{
            this.status = true;
        })
      },
      showCommand(){
        this.isOpen = true;
      },
      closeCommand(){
        this.isOpen = false;
      },
      exit(){//退出
        MessageBox.confirm('确定退出吗？').then(action =>{
          //返回登录页面
          this.$router.push('/');
        })
      },
      showUserDetail(){ //用户详情
        this.userDetail = true;
        this.strategyDetail = false;
      },
      actionSheet(){
        this.sheetVisible=true;
      }
    },
    created(){
      //this.webSocketApi.sendSock();
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
      this.$store.commit('SELECT_TAB', 'my')
    }
  }
</script>
<style lang='scss'>
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
    height: 100px;
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
    background-image: url("../assets/my/user.png");
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
    padding: .5em;
    ul{
      list-style: none;
      display: flex;
      padding: 1em 0 0 0;
      margin:0;
      i{
        margin-right: 0.5em;
      }
    }
    .lsTitle{
      padding-bottom: 1em;
      border-bottom: 1px solid #4b5367;
      padding-left: 2em;
    }
  }
  .strategyOpt{
    display: flex;
    border-top: 1px solid #4b5367;
    padding: 1em;
    justify-content: space-evenly;
    button{
        width: 5em;
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
</style>

