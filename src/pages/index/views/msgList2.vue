<template>
  <div class="msg-list">
    <div class="company-name">
      <span class="label">推送类型：</span>
      <span class="select-text"
            @click="popupShow = !popupShow">{{companyInfo.name}}</span>
    </div>
    <van-popup v-model="popupShow"
               position="bottom">
      <van-picker show-toolbar
                  value-key="name"
                  :columns="companyList"
                  @cancel="popupShow = !popupShow"
                  @confirm="onConfirm" />
    </van-popup>
    <div class="wrapper"
         ref="wrapper">
      <!-- 内容列表 -->
      <ul class="content">
        <li class="item"
            v-for="item in filterList"
            :key="item.id"
            @click="go(item)">
          <div class="title">{{item.tag}}</div>
          <div class="time">{{item.msg_time}}</div>
          <div class="name">
            <span v-for="(item,index) in newline(item.msg_content)"
                  :key="index">
              {{item}}
              <br>
            </span>
          </div>
          <span v-if="item.type != 0">
            <span :class="[item.is_read ? '':'active', 'tag']"></span>
            <div class="more">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>  
<script>
import BScroll from "better-scroll";
import msgListApi from "@/pages/index/services/msgList";
export default {
  data () {
    return {
      popupShow: false,
      companyList: [{ id: "all", name: "全部", code: "" }, { id: "0", name: "数据推送", code: "" }, { id: "1", name: "报表订阅", code: "" }, { id: "2", name: "顾客评价", code: "" }],
      companyInfo: { id: "all", name: "全部", code: "" },
      page: 1,
      list: [],
      finished: false,
    };
  },
  computed: {
    filterList: function () {
      if (this.companyInfo.id == "all") {
        return this.list
      }
      const _list = this.list.filter(item => {
        return item.type == this.companyInfo.id
      })
      if (!_list.length) {
        this.$toast("暂无该类型的消息")
      }
      return _list
    }
  },
  created () {
    //调用scroll函数，实现滚动
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll () {
      this.foodsScroll = new BScroll(this.$refs.wrapper, {
        probeType: 3, //让better-scroll监听scroll事件
        click: true //允许better-scroll列表上的点击事件
      });
      this.onLoad();
      this.foodsScroll.on("scrollEnd", pos => {
        if (pos.y <= (this.foodsScroll.maxScrollY + 50)) {
          if (this.finished) {
            this.$toast("没有更多了")
          } else {
            this.onLoad();
          }
        }
      });
    },
    onLoad () {
      const params = {
        company_id: window.localStorage.getItem("company_id"),
        page: this.page
      };
      msgListApi.msgList({ params: params }).then(res => {
        const { status, message, data } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.page++;
          this.list = this.list.concat(data.datas);
          this.loading = false;
          if (this.list.length >= data.totalcount) {
            this.finished = true;
          }
        }
      });
    },
    go (item) {
      if (item.type) {
        this.$router.push({
          path: item.msg_url.split("#")[1]
        });
      }
    },
    newline: function (value) {
      let newlineArr = [];
      if (value.indexOf("###") > 0) {
        newlineArr = value.split("###");
      } else {
        newlineArr[0] = value;
      }
      return newlineArr;
    },
    onConfirm (value, index) {
      this.companyInfo = value;
      this.popupShow = !this.popupShow;
    }
  }
};
</script>  
  
<style lang="scss" scoped>
.msg-list {
  width: 100%;
  height: 100%;
  .company-name {
    display: flex;
    // position: fixed;
    background: #fff;
    z-index: 1000;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    padding: 10px 0;
    font-size: 26px;
    .select-text {
      width: 480px;
      font-size: 26px;
      line-height: 68px;
      color: #727171;
      border: 1px solid #ebedf0; /*no*/
      border-radius: 8px;
      padding-left: 20px;
      background: url("../assets/select.png") no-repeat 440px center;
    }
  }
  .wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 120px;
    overflow: hidden;
    .content {
      width: 100%;
      padding-bottom: 120px;
    }
  }
  .item {
    width: 680px;
    margin: 40px 35px;
    background: #fff;
    padding: 20px 30px 0 30px;
    box-sizing: border-box;
    border: 1px solid rgb(235, 230, 230); /*no*/
    border-radius: 26px;
    box-shadow: 0px 13px 10px rgb(235, 230, 230);
    position: relative;
    overflow: hidden;
    .title {
      font-size: 32px;
      font-weight: 800;
    }
    .time {
      font-size: 26px;
      padding: 10px 0;
      color: #999;
    }
    .name {
      padding-top: 20px;
      font-size: 28px;
      color: #ee5108;
      padding-bottom: 25px;
    }
    .tag {
      width: 100px;
      height: 100px;
      background: rgb(235, 230, 230);
      position: absolute;
      right: -50px;
      top: -50px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    }
    .active {
      background: #ee5108;
    }

    .more {
      font-size: 28px;
      color: #999;
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgb(235, 230, 230); /*no*/
      .van-icon {
        font-size: 32px;
      }
    }
  }
  .bottom-tip {
    width: 100%;
    font-size: 28px;
    line-height: 35px;
    text-align: center;
    color: #777;
    background: #f2f2f2;
    position: absolute;
    bottom: -35px;
    left: 0;
  }
}
</style>  