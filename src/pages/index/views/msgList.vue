<template>  
<div class="msgList">
  <van-list
  v-model="loading"
  :finished="finished"
  @load="onLoad"
>
  <div class="item" v-for="item in list" :key="item.id" @click="go(item.msg_url)">
    <div class="title">{{item.tag}}</div>
    <div class="time">{{item.msg_time}}</div>
    <div class="name">{{item.msg_content}}</div>
    <div class="more"><span>更多</span><van-icon name="arrow" /></div>
  </div>
</van-list>
</div>
</template>  
<script>
import util from "@/pages/index/helper/util";
import msgListApi from "@/pages/index/services/msgList";
export default {
  data() {
    return {
      page: 1,
      list: [],
      loading: false,
      finished: false
    };
  },
  methods: {
    onLoad() {
      const params = {
        company_id: window.localStorage.getItem("company_id"),
        wx_user_id: util.getCookie("wx_userid"),
        page: this.page
      };
      msgListApi.msgList({ params: params }).then(res => {
        const { status, message, data } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.page ++;
          this.list = this.list.concat(data.datas);
          this.loading = false;
          if (this.list.length >= data.totalcount) {
            this.finished = true;
          }
        }
      });
    },
    go(url){
      if (url) {
        this.$router.push({
          path: url.split('#')[1]
        });
      }
    }
  }
};
</script>  
  
<style lang="scss" scoped>
.msgList {
  width: 750px;
  height: 100vh;
  overflow-y: auto;
  background: #f6f7f7;
  border: 1px solid transparent;
  .item {
    width: 680px;
    margin: 40px 35px;
    background: #fff;
    padding: 20px 30px 0 30px;
    box-sizing: border-box;
    border: 1px solid rgb(235, 230, 230); /*no*/
    border-radius: 26px;
    box-shadow: 0px 13px 10px rgb(235, 230, 230);
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
      color: rgb(238, 81, 8);
      padding-bottom: 25px;
      border-bottom: 1px solid rgb(235, 230, 230); /*no*/
    }
    .more {
      font-size: 28px;
      color: #999;
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .van-icon {
        font-size: 32px;
      }
    }
  }
}
</style>  