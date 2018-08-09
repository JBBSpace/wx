<template>
  <div class="qrcodeContain">
    <p class="title">折扣券二维码生成成功!</p>
    <canvas id="canvas"></canvas>
    <p>编号：{{url}}</p>
  </div>
</template>
<script>
import Vue from "vue";
import QRCode from "qrcode";
Vue.use(QRCode);
export default {
  computed: {
    url() {
      if (window.location.search.indexOf("&")) {
        return window.location.search.split("&")[0].split("=")[1];
      } else {
        console.log("console");
        return window.location.search.split("=")[1];
      }
    }
  },
  methods: {
    createQrcode() {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, "" + this.url, function(error) {
        if (error) console.error(error);
      });
    },
  },
  mounted() {
    this.createQrcode();
  }
};
</script>
<style lang="scss">
.qrcodeContain {
  width:700px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 34px;
  background: #fff;
  margin: 50px 30px;
  padding-bottom: 40px;
  letter-spacing: 1px; /*no*/
  border-radius: 15px;
  box-shadow: 0px 10px 10px #888888;
  #canvas {
    width: 400px !important;
    height: 400px !important;
  }
  p {
    padding: 40px 0;
    color: rgba(114, 113, 113, 1);
  }
  .title {
    color: #008400;
  }
  .saveImg{
    color: #008400;
  }
}
</style>