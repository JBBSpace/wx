<template>
  <div class="home">
    <div class="head">
      <div class="a"></div>
      <div class="b"></div>
      <div class="c">
        <div class="item"
             @click="scan">
          <img class
               src="../assets/home/scan.png"
               alt>
          <p>扫一扫</p>
        </div>
        <div class="item"
             @click="go('msgList')">
          <span v-if="hasMsg"></span>
          <img class
               src="../assets/home/msg.png"
               alt>
          <p>消息</p>
        </div>
        <div class="item"
             @click="showQrcode">
          <img class
               src="../assets/home/myCard.png"
               alt>
          <p>我的卡片</p>
        </div>
        <div class="item"
             @click="logout()">
          <img class
               src="../assets/home/out.png"
               alt>
          <p>取消绑定</p>
        </div>
      </div>
      <div class="d">用户ID：{{userid}}</div>
    </div>
    <p class="title">我的报表</p>
    <div class="mySubscibe">
      <div class="item"
           v-for="item in mySubscibe"
           :key="item.id"
           v-show="isShow(item.id)"
           @click="go(item.linkName)">
        <img :src="item.imgPath"
             alt>
        <p>{{item.text}}</p>
      </div>
    </div>
    <p class="title">我的操作</p>
    <div class="fnModule">
      <div class="item"
           v-for="item in fnModule"
           :key="item.id"
           v-show="isShow(item.id)"
           @click="go(item.linkName)">
        <img :src="item.imgPath"
             alt>
        <p>{{item.text}}</p>
      </div>
    </div>
    <van-popup v-model="mycardPopup">
      <div class="myCard-Qrcode">
        <canvas id="canvas"></canvas>
        <p>扫一扫上面的二维码图案，加我通讯录</p>
      </div>
    </van-popup>
  </div>
</template>  
  
<script>
import wx from "weixin-js-sdk";
import scanAPI from "@/pages/index/services/scan";
import homeApi from "@/pages/index/services/home";
import Cookies from "js-cookie";
import util from "@/pages/index/helper/util";
import Vue from "vue";
import QRCode from "qrcode";
Vue.use(QRCode);
export default {
  data () {
    return {
      shouldShow: [],
      userid: '',
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
        },
        {
          imgPath: require("../assets/home/storeSales.png"),
          text: "门店销售表",
          linkName: "chartStoreSales",
          id: 13
        },
        {
          imgPath: require("../assets/home/week.png"),
          text: "周销售报表",
          linkName: "chartWeekSales",
          id: 14
        },
        {
          imgPath: require("../assets/home/gys.png"),
          text: "供应商排名",
          linkName: "supplier",
          id: 15
        },
        {
          imgPath: require("../assets/home/kdjzs.png"),
          text: "客单价走势图",
          linkName: "chartrepCjzs",
          id: 17
        }, {
          imgPath: require("../assets/home/gkpj.png"),
          text: "顾客评价",
          linkName: "evaluation",
          id: 19
        },
      ],
      fnModule: [
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
        },
        {
          imgPath: require("../assets/home/10.png"),
          text: "用户菜单配置",
          linkName: "menuSet",
          id: 9
        }, {
          imgPath: require("../assets/home/tz.png"),
          text: "公告通知",
          linkName: "",
          id: 16
        }, {
          imgPath: require("../assets/home/wdgk.png"),
          text: "我的顾客",
          linkName: "myclients",
          id: 18
        }, {
          imgPath: require("../assets/home/EA03437EA852DD2BA4E46D87FB1A9B2A.png"),
          text: "快递列表",
          linkName: "fullcode",
          id: 20
        },
      ],
      hasMsg: false,
      mycardPopup: false,
      checked: true,
    };
  },
  methods: {
    check () {
      // 获取公司company_id
      const company_id = util.getRequest().company_id
        ? util.getRequest().company_id
        : localStorage.getItem("company_id");
      if (!company_id) {
        this.$toast("company_id为空");
        return;
      }
      localStorage.setItem("company_id", company_id);
      // 获取company_id与微信UserId的映射关系
      const curUserId = Cookies.get(company_id) ? Cookies.get(company_id) : "";
      if (curUserId) {
        // 已绑定
        const params = {
          company_id
        };
        // 获取菜单
        homeApi.menus({ params: params }).then(res => {
          const { data } = res.data;
          this.shouldShow = data.menu_list;
          this.userid = data.userid
          localStorage.setItem("role", data.role);
        });
        // 查询消息
        homeApi.hasMsg({ params: params }).then(res => {
          const { status, message, data } = res.data;
          if (status) {
            this.$toast(message);
          } else {
            this.hasMsg = data.totalcount ? true : false;
          }
        });
        // 查询名片
        homeApi.mycard({ params: params }).then(res => {
          const { status, message, data } = res.data;
          if (status) {
            this.$toast(message);
          } else {
            this.mycardInfo = data.card_msg;
          }
        });
      } else {
        // 未绑定
        this.go("login");
        return;
      }
    },
    isShow (id) {
      return this.shouldShow.includes(id);
    },
    showQrcode () {
      this.mycardPopup = true;
      setTimeout(() => {
        this.createQrcode();
      }, 30);
    },
    createQrcode () {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(
        canvas,
        this.mycardInfo,
        function (error) {
          if (error) console.error(error);
        }
      );
    },
    logout () {
      homeApi
        .logout({
          params: {
            company_id: localStorage.getItem("company_id")
          }
        })
        .then(res => {
          const { status, message } = res.data;
          if (status) {
            this.$toast(message);
          } else {
            this.$router.push({
              name: "login"
            });
          }
        });
    },
    go (urlName) {
      if (urlName) {
        this.$router.push({
          name: urlName
        });
      }
    },
    scan: function () {
      const _this = this;
      const params = {
        url: window.location.href,
        company_id: window.localStorage.getItem("company_id")
      };
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
      wx.ready(function () {
        wx.scanQRCode({
          desc: "scanQRCode desc",
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            if (result.slice(0, 3) == "BOX") {
              _this.$router.push({
                name: "scan",
                query: { code: result }
              });
            } else {
              _this.$router.push({
                name: "scanResult",
                params: { code: result }
              });
            }
          }
        });
      });
    }
  },
  activated () {
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
      top: 55px;
      left: 26%;
      margin-left: -60px;
      z-index: 2;
      box-shadow: 0px 8px 10px #6ac3ec;
    }
    .c {
      width: 690px;
      height: 210px;
      padding-top: 35px;
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
        width: 25%;
        height: 200px;
        box-sizing: border-box;
        text-align: center;
        font-size: 26px;
        color: #989898;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        span {
          width: 22px;
          height: 22px;
          border-radius: 100%;
          position: absolute;
          background: #ee5108;
          right: 30%;
          top: 8%;
        }
        img {
          width: 58px;
          height: 58px;
          margin: 0 auto;
        }
      }
    }
    .d {
      position: absolute;
      left: 37%;
      top: 110px;
      color: #ffffff;
      font-size: 28px;
    }
  }
  .title {
    font-size: 30px;
    text-indent: 15px;
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
      font-size: 24px;
      color: rgba(152, 152, 152, 1);
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      border-right: 1px solid #e1eeee;
      border-bottom: 1px solid #e1eeee;
      img {
        width: 64px;
        height: 64px;
        margin: 4px auto;
      }
    }
  }
  .myCard-Qrcode {
    width: 643px;
    height: 618px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    #canvas {
      width: 450px !important;
      height: 450px !important;
      margin-top: 60px;
    }
    p {
      font-size: 32px;
      color: rgba(114, 113, 113, 1);
    }
  }
}
</style>  