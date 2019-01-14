<template>
  <div class="scan">
    <div class="contain">
      <img src="../assets/scan.png" alt>
      <template v-if="status==0">
        <p class="title">{{message}}</p>
        <p class="msg">订单编号:{{orderNumber.c_qrcode}}</p>
        <p class="msg">接单人:{{orderNumber.c_weixin}}</p>
      </template>
      <template v-if="status==4" class="title">
        <p class="title">{{message}}</p>
      </template>
      <p class="msg">继续扫码请点击下面按钮</p>
    </div>
    <div class="scanBtn" @click="scan">
      <img src="../assets/scanicon.png" alt>
      <span>继续扫码</span>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import scanAPI from "@/pages/index/services/scan";
export default {
  data() {
    return {
      scanResultCode: "",
      orderNumber: "",
      show: false,
      status:'',
      message:''
    };
  },
  methods: {
    scan: function() {
      const params = {
        url: window.location.href,
        company_id: window.localStorage.getItem("company_id")
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
            if (result == _this.scanResultCode) {
              // _this.show = false;
              _this.$toast("该码已经扫描过了");
            } else {
              _this.scanResultCode = result;
            }
            // if (result.slice(0, 6) == "hgqc||") {
            //   if (result.slice(6) == _this.scanResultCode) {
            //     _this.show = false;
            //   } else {
            //     _this.scanResultCode = result.slice(6);
            //   }
            // } else {
            //   _this.$toast(`无效二维码:${result}`);
            // }
          }
        });
      });
    },
    getOrderNumber() {
      const data = {
        c_qrcode: this.scanResultCode,
        company_id: localStorage.getItem("company_id")
      };
      scanAPI.fullcode({ data: data }).then(res => {
        const { status, message, data } = res.data;
        this.status = status;
        this.message = message;
        if (status == 3) {
          this.$toast(message);
        }else if (status == 0) {
          this.orderNumber = data;
        }
      });
    }
  },
  created() {
    this.scanResultCode = this.$route.query.code;
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    scanResultCode: function() {
      this.getOrderNumber();
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
      width: 380px;
      height: 308px;
      margin: 48px 0;
    }
    .title {
      font-size: 32px;
      color: #0a9bca;
    }
    .msg {
      font-size: 28px;
      color: #727171;
      padding: 10px 50px;
    }
  }
  .scanBtn {
    width: 340px;
    height: 88px;
    margin: 30px auto;
    background: #51b8cb;
    border-radius: 16px;
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
