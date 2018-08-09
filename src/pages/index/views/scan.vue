<template>
    <div class="scan">
      <div class="contain">
        <img src="../assets/scan.png" alt="">
        <p class="title">扫码登录手机查看商品信息</p>
      </div>
      <div class="scanBtn" @click="scan">
        <img src="../assets/scanicon.png" alt="">
        <span>扫码查询</span>
      </div>
    </div>
</template>
<script>
import wx from "weixin-js-sdk";
import scanAPI from "@/pages/index/services/scan";
document.title = "扫码查询商品信息";
export default {
  data() {
    return {};
  },
  methods: {
    scan: function() {
      const params = {
        url: window.location.href
      };
      const _this = this;
      scanAPI.wxSdkConfig({ data: params }).then(res => {
        const { data } = res.data;
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          // debug: true,
          // 必填，公众号的唯一标识
          appId: res.data.appid,
          // 必填，生成签名的时间戳
          timestamp: data.timestamp,
          // 必填，生成签名的随机串
          nonceStr: data.nonceStr,
          // 必填，签名
          signature: data.signature,
          // 必填，需要使用的JS接口列表，所有JS接口列表
          jsApiList: ["scanQRCode"]
        });
      });

      wx.ready(function() {
        wx.scanQRCode({
          desc: "scanQRCode desc",
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function(res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            var a = result.split("/");
            _this.$router.push({
              name: "scanResult",
              params: { code: a[a.length - 1] }
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.scan {
  .contain {
    display: flex;
    display: -webkit-flex; /* Safari */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 377px;
      height: 377px;
      margin: 48px 0;
    }
    .title {
      font-size: 30px;
      color: rgba(114, 113, 113, 1);
    }
  }
  .scanBtn {
    width: 400px;
    height: 88px;
    margin: 60px auto;
    background: #51b8cb;
    border-radius: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 52px;
      height: 52px;
    }
    span {
      text-indent: 16px;
      font-size: 34px;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
