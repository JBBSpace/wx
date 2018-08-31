<template>  
  <div class="home" v-show="show">
    <div class="logo">报表</div>
    <div class="discount">
      <div class="item" v-for="item in discount" :key="item.id" v-show="isShow(item.id)" @click="go(item.linkName)">
        <img :src="item.imgPath" alt="">
        <p>{{item.text}}</p>
      </div>
    </div>
    <p class="title">我的订阅</p>
    <div class="mySubscibe">
      <div class="item" v-for="item in mySubscibe" :key="item.id" v-show="isShow(item.id)" @click="go(item.linkName)">
        <img :src="item.imgPath" alt="">
        <p>{{item.text}}</p>
      </div>
    </div>
    <p class="title"></p>
    <div class="fnModule">
      <div class="item" @click="scan">
        <p class="saoma"><van-icon name="saoyisao"/></p>
        <p>扫一扫</p>
      </div>
      <div class="item" @click="menuset">
        <img class="menuset" src="../assets/home/10.png" alt="">
        <p>用户菜单配置</p>
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
          imgPath: require("../assets/home/discount.png"),
          text: "我的折扣券",
          linkName: "discountList",
          id: 1
        },
        {
          imgPath: require("../assets/home/creatediscount.png"),
          text: "生成 折扣券",
          linkName: "createDiscount",
          id: 2
        }
      ],
      mySubscibe: [
        {
          imgPath: require("../assets/home/a.png"),
          text: "门店零售列表",
          linkName: "",
          id: 3
        },
        {
          imgPath: require("../assets/home/b.png"),
          text: "周期销售表",
          linkName: "chartPeriodComparison",
          id: 4
        },
        {
          imgPath: require("../assets/home/c.png"),
          text: "零售外区业绩柱图",
          linkName: "",
          id: 5
        },
        {
          imgPath: require("../assets/home/d.png"),
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
      fnModule: [
        {
          imgPath: require("../assets/home/scan.png"),
          text: "扫一扫",
          id: 8
        },
        {
          imgPath: require("../assets/home/scan.png"),
          text: "用户菜单配置",
          id: 9
        }
      ]
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
        url: window.location.href.split('#')[0],
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
    menuset(){
      this.$router.push({
          name: 'menuSet'
        });
    }
  },
  mounted() {
    this.check();
  }
};
</script>  
  
<style lang="scss" scoped>
.home {
  background: #e5e5e5;
  .logo {
    width: 750px;
    height: 200px;
    background: rgba(81, 184, 203, 1);
    background-image: url("../assets/home/logo.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 120px 120px;
    text-align: center;
    line-height: 200px;
    font-size: 34px;
    color: rgba(255, 255, 255, 1);
  }
  .discount {
    width: 750px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #ffffff;
    .item {
      width: 50%;
      height: 250px;
      box-sizing: border-box;
      text-align: center;
      font-size: 26px;
      color: rgba(114, 113, 113, 1);
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      img {
        width: 104px;
        margin: 6px auto;
      }
      &:nth-child(odd) {
        border-right: 1px solid #e5e5e5;
      }
    }
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
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      .saoma{
        font-size: 58px;
        color:#43a636;
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