<template>
  <div class="qrcodeContain">
    <p class="title">折扣券二维码</p>
    <canvas id="canvas"></canvas>
    <div class="detail">
      <div class="label">编号：</div>
      <div class="info">{{url}}</div>
    </div>
    <div class="detail">
      <div class="label">使用规则：</div>
      <div class="info">{{rollname}}</div>
    </div>
    <div class="detail">
      <div class="label">过期时间：</div>
      <div class="info">{{expiry_date}}</div>
    </div>
    <div class="detail">
      <div class="label">备注：</div>
      <div class="info">{{decodeURI(intro)}}<br/>{{decodeURI(notes)}}</div>
    </div>
    <div class="detail msg">温馨提示：折扣券二维码请提前出示给店员</div>
  </div>
</template>
<script>
import Vue from "vue";
import QRCode from "qrcode";
Vue.use(QRCode);
import util from "@/pages/index/helper/util";
export default {
  computed: {
    url() {
      return util.getRequest().barcode;
    },
    expiry_date() {
      return decodeURI(util.getRequest().expiry_date);
    },
    intro() {
      return decodeURI(util.getRequest().intro);
    },
    notes() {
      return decodeURI(util.getRequest().notes);
    },
    rollname() {
      return decodeURI(util.getRequest().rollname);
    }
  },
  methods: {
    createQrcode() {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, "" + this.url, function(error) {
        if (error) console.error(error);
      });
    }
  },
  mounted() {
    this.createQrcode();
  }
};
</script>
<style lang="scss">
.qrcodeContain {
  width: 700px;
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
  box-shadow: 0px 15px 25px #888888;
  #canvas {
    width: 450px !important;
    height: 450px !important;
  }
  .title {
    text-align: center;
    padding: 40px 0 0 0;
  }
  .detail {
    width: 90%;
    padding: 10px 0;
    align-items: flex-start;
    overflow: hidden; /*父元素*/
    color: rgba(114, 113, 113, 1);
    .label {
      float: left; /*子元素*/
      font-size: 30px;
    }
    .info {
      overflow: hidden; /*子元素*/
      font-size: 30px;
    }
  }
  .msg {
    font-size: 24px;
    color: #51b8cb;
  }
}
</style>