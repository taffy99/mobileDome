<template>
  <div id="app">
    <div class="content-div"> 
        <router-view v-if="isRouterAlive"/> 
        <loading v-if='LOADING'></loading>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading'
  import {mapState} from 'vuex'
  export default {
    name: 'app',
    data(){
      return{
        isRouterAlive:true
      }
    },
    // provide/inject方式: 父组件中通过provider来提供变量，然后在子组件中通过inject来注入变量
    provide(){
      return {
        reload:this.reload
      }
    },
    computed:{
      ...mapState([
        'LOADING'
      ])
    },
    components:{
      loading
    },
    methods:{
      reload(){
        this.isRouterAlive = false;
        this.$nextTick(()=>{
          this.isRouterAlive = true;
        })
      }
    }

  }
</script>

<style scoped>
  .content-div {
    margin-bottom: 55px;
  }
</style>
