<template>
  <div id="main">
    <div class="content-div">
      <!--<transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">-->
      <!--</transition>-->
    </div>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>

<script>
  import Footer from '../components/FooterBar.vue'
  export default {
    name: 'main',
    components: {
      'footer-bar': Footer
    },
    computed: {}
  }
</script>

<style scoped>
  .content-div {
    margin-bottom: 55px;
  }
</style>
