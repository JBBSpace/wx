<template>
  <div id="app">
    <keep-alive>     <!--使用keep-alive会将页面缓存-->
    <router-view v-if="$route.meta.keepAlive"></router-view>
   </keep-alive> 
     <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div id="loading" v-if="loading">
      <van-loading color="white" size="45px"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    loading () {
      return this.$store.state.loading
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
#app {
  width: 750px;
  height: 100%;
  margin: 0 auto;
  #loading {
    position: fixed;
    z-index: 1000000;
    background: #666;
    width: 100%;
    top: 0;
    bottom: 0;
    opacity: 0.4;
    .van-loading{
      position: absolute;
      top:48%;
      left:45%;
    }
  }
}
</style>
