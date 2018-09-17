<template>
  <div id="app">
    <router-view/>
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

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
#app {
  width: 750px;
  height: 100%;
  margin: 0 auto;
  /* background: #F2F2F2; */
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
    // .van-loading--black circle{
    //   stroke:#51b8cb;
    // }
  }
}
</style>
