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
* {
  margin: 0;
  padding: 0;
}
html,
body {
  background: #51b8cb;
}
#app{
  width:750px;
  height:100%;
  overflow: hidden;
  margin:0 auto;
}
</style>
