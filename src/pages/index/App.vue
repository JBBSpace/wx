<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
*{
  margin:0;
  padding:0;
}
html,
body {
    height: 100%;
}
#app{
  width:750px;
  overflow: hidden;
  margin:0 auto;
  /* background: #F2F2F2; */
}

</style>
