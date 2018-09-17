<template>  
  <div class="home" v-show="show">
    <div class="head">
      <div class="a"></div>
      <div class="b"></div>
      <div class="c">
        <div class="item" v-for="item in discount" :key="item.id" v-show="isShow(item.id)" @click="go(item.linkName)">
        <img :src="item.imgPath" alt="">
        <p>{{item.text}}</p>
        </div>
      </div>
    </div>
    <p class="title">我的报表</p>
    <div class="mySubscibe">
      <div class="item" v-for="item in mySubscibe" :key="item.id" v-show="isShow(item.id)" @click="go(item.linkName)">
        <img :src="item.imgPath" alt="">
        <p>{{item.text}}</p>
      </div>
    </div>
    <p class="title">我的操作</p>
    <div class="fnModule">
      <div class="item" @click="scan" v-show="isShow(8)">
        <p class="saoma"><van-icon name="saoyisao"/></p>
        <p>扫一扫</p>
      </div>
      <div class="item" @click="go('menuSet')" v-show="isShow(9)">
        <img class="menuset" src="../assets/home/10.png" alt="">
        <p>用户菜单配置</p>
      </div>
      <div class="item" @click="go('msgList')" v-show="isShow(11)">
        <span v-if="hasMsg"></span>
        <img class="menuset" src="../assets/home/msg.png" alt="">
        <p>消息</p>
      </div>
    </div>
  </div>
</template>  
  
<script>
import util from "@/pages/index/helper/util";
import wx from "weixin-js-sdk";
import scanAPI from "@/pages/index/services/scan";
import homeApi from "@/pages/index/services/home";
export default {
  data() {
    return {
      show: false,
      shouldShow: [],
      discount: [
        {
          imgPath: require("../assets/home/creatediscount.png"),
          text: "我的折扣券",
          linkName: "discountList",
          id: 1
        },
        {
          imgPath: require("../assets/home/discount.png"),
          text: "生成折扣券",
          linkName: "createDiscount",
          id: 2
        },
        {
          imgPath: require("../assets/home/alarm.png"),
          text: "报表闹钟",
          linkName: "alarmList",
          id: 10
        }
      ],
      mySubscibe: [
        {
          imgPath: require("../assets/home/pie.png"),
          text: "商品类别销售",
          linkName: "one",
          id: 3
        },
        {
          imgPath: require("../assets/home/b.png"),
          text: "周期销售表",
          linkName: "chartPeriodComparison",
          id: 4
        },
        {
          imgPath: require("../assets/home/h.png"),
          text: "公司销售分析",
          linkName: "two",
          id: 5
        },
        {
          imgPath: require("../assets/home/g.png"),
          text: "公司销售表",
          linkName: "chartCompanyMarket",
          id: 6
        },
        {
          imgPath: require("../assets/home/e.png"),
          text: "类别销售对比表",
          linkName: "chartCommodityMarket",
          id: 7
        }
      ],
      hasMsg: false
    };
  },
  methods: {
    check() {
      const company_id = util.getRequest().company_id
        ? util.getRequest().company_id
        : window.localStorage.getItem("company_id");
      const wx_userid = util.getCookie("wx_userid");
      util.setStorage("company_id", company_id);
      if (wx_userid) {
        this.show = true;
        const params = {
          company_id: company_id,
          wx_user_id: wx_userid
        };
        homeApi.menus({ params: params }).then(res => {
          const { data } = res.data;
          this.shouldShow = data;
        });
        homeApi.hasMsg({ params: params }).then(res => {
          const { status, message, data } = res.data;
          if (status) {
            this.$toast(message);
          } else {
            this.hasMsg = data.totalcount ? true : false;
          }
        });
      } else {
        homeApi.check({ params: { company_id: company_id } }).then(res => {
          const { status, uri, message } = res.data;
          if (status == "0") {
            window.location.href = uri;
          } else {
            this.$toast(message);
          }
        });
      }
    },
    isShow(id) {
      return this.shouldShow.includes(id);
    },
    go(urlName) {
      if (urlName) {
        this.$router.push({
          name: urlName
        });
      }
    },
    scan: function() {
      const params = {
        url: window.location.href.split("#")[0],
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
            var a = result.split("/");
            _this.$router.push({
              name: "scanResult",
              params: { code: a[a.length - 1] }
            });
          }
        });
      });
    },
  },
  mounted() {
    this.check();
  }
};
</script>  
  
<style lang="scss" scoped>
.home {
  background: #f6f7f7;
  .head {
    width: 750px;
    height: 400px;
    background: #f6f7f7;
    position: relative;
    .a {
      width: 100%;
      height: 240px;
      background-image: url("../assets/home/bg.png");
      background-repeat: no-repeat;
      background-position: center;
    }
    .b {
      width: 120px;
      height: 120px;
      border: 2px solid #fff; /*no*/
      background: #6ac3ec;
      background-image: url("../assets/home/logo.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 80px;
      border-radius: 50%;
      position: absolute;
      top: 70px;
      left: 50%;
      margin-left: -60px;
      z-index: 2;
      box-shadow: 0px 8px 10px #6ac3ec;
    }
    .c {
      width: 690px;
      height: 205px;
      padding-top: 25px;
      box-sizing: border-box;
      border-radius: 30px;
      background: #fff;
      margin: 0 auto;
      position: absolute;
      top: 150px;
      left: 50%;
      margin-left: -345px;
      z-index: 1;
      display: flex;
      box-shadow: 0px 10px 8px #6ac3ec;
      .item {
        width: 33%;
        height: 200px;
        box-sizing: border-box;
        text-align: center;
        font-size: 26px;
        color: #989898;
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
          width: 60px;
          height: 60px;
          margin: 6px auto;
        }
      }
    }
  }
  .discount {
    width: 750px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #ffffff;
  }
  .title {
    font-size: 30px;
    padding: 20px;
    color: rgba(152, 152, 152, 1);
  }
  .mySubscibe,
  .fnModule {
    width: 750px;
    display: flex;
    flex-wrap: wrap;
    background: #ffffff;
    .item {
      width: 250px;
      height: 250px;
      font-size: 26px;
      color: rgba(152, 152, 152, 1);
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      border-right: 1px solid #e1eeee;
      border-bottom: 1px solid #e1eeee;
      .saoma {
        font-size: 58px;
        color: #43a636;
      }
      position: relative;
      span {
        width: 22px;
        height: 22px;
        border-radius: 100%;
        position: absolute;
        background: #ee5108;
        right: 34%;
        top: 25%;
      }
      img {
        width: 60px;
        height: 60px;
        margin: 8px auto;
      }
    }
  }
}
</style>  