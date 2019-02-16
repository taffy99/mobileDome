<template>
  <div id="app">
    <div class="content-div"> 
        <router-view/>
        <loading v-if='LOADING'></loading>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading'
  import {mapState} from 'vuex'
  export default {
    name: 'app',
    computed:{
      ...mapState([
        'LOADING'
      ])
    },
    components:{
      loading
    }
    
  }
</script>

<style scoped>
  .content-div {
    margin-bottom: 55px;
  }
</style>
