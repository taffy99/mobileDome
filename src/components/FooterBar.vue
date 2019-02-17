<template>
  <div id="tab-bar">
    <mt-tabbar v-model="selected" v-show="isShow" fixed class="border-1px-top">
      <mt-tab-item id="my">
        <img :src="img1" slot="icon">策略
      </mt-tab-item>
      <mt-tab-item id="market">
        <img :src="img2" slot="icon">行情
      </mt-tab-item>
      <mt-tab-item id="transacton">
        <img :src="img3" slot="icon">交易
      </mt-tab-item>
      <mt-tab-item id="auth">
        <img :src="img4" slot="icon">委托
      </mt-tab-item>
      <mt-tab-item id="hold">
        <img :src="img5" slot="icon">持仓
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        selected: this.$store.state.selectedTab,
        img1:'',
        img2:'',
        img3:'',
        img4:'',
        img5:''
      }
    },
    created(){
      this.footerSelect();
    },
    computed: {
      isShow: function () {
        return this.$store.state.footerVisible;
      }
    },
    watch: {
      'selected': {
        handler(){
          this.footerSelect();
        }
      }
    },
    methods:{
      footerSelect(){
          if (this.selected === "my") {//策略
            this.$router.push('/my');
            this.img1 = require("../assets/tool/user_selected.png")
          } else {
            this.img1 = require("../assets/tool/user.png")
          }
          if (this.selected === "market") { //行情
            this.$router.push('/market');
            this.img2 = require('../assets/tool/market_selected.png')
          } else {
            this.img2 = require('../assets/tool/market.png')
          }
          if (this.selected === "transacton") { //交易
            this.$router.push('/futures/login');
            this.img3 = require('../assets/tool/transacton_selected.png')
          } else {
            this.img3 = require('../assets/tool/transacton.png')
          }
          if (this.selected === "auth") {//委托
            this.$router.push('/auth');
            this.img4 = require("../assets/tool/form_selected.png")
          } else {
            this.img4 = require("../assets/tool/form.png")
          }
          if (this.selected === "hold") { //持仓
            this.$router.push('/hold');
            this.img5 = require("../assets/tool/hold_selected.png")
          } else {
            this.img5 = require("../assets/tool/hold.png")
          }
      }
    }
  }
</script>

