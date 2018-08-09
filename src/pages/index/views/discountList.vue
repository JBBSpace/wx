/*
 * @Author: 姬兵兵 
 * @Date: 2018-06-12 13:26:04 
 * @Last Modified by: 姬兵兵
 * @Last Modified time: 2018-08-06 14:19:57
 */
<template>
  <div>
    <div class="row" style="padding:15px 16px;">
      <span class="item discount">折扣</span>
      <span class="item type">类型</span>
      <span class="item createdate">生成日期</span>
      <span class="item operation">操作</span>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      @load="getTable"
    >
      <van-cell v-for="item in list" :key="item.id" @click="detailInfo(item)">
        <span class="item discount">{{item.discount}}{{ item.discount=="--"?"":"%"}}</span>
        <span class="item type">{{item.type}}</span>
        <span class="item createdate">{{item.createdate}}</span>
        <template v-if="item.userflag === 1">
          <span class="item operation usered">已使用</span>
        </template>
        <template v-else-if="item.userflag === 0">
          <span class="item operation"><van-button size="mini" @click.stop="invalid(item.id)">作废</van-button>
          </span>
        </template>
        <template v-else>
          <span class="item operation disabled">已作废</span>
        </template>
      </van-cell>
    </van-list>
    <van-dialog
      v-model="show"
      title="折扣券使用信息"
    >
      <p class="msgInfo">
        <span v-for="(item,index) in dialog.ClassInfo" :key="index">
          {{item.classname}} : {{item.ratio}}%
        </span>
      </p>
      <p class="msgInfo"><span>折扣码 ：</span>{{dialog.discountcode}}</p>
      <p class="msgInfo"><span>使用时间 ：</span>{{dialog.userdate}}</p>
      <p class="msgInfo"><span>门店 ：</span>{{dialog.c_comname}}</p>
      <p class="msgInfo"><span>订单编号 ：</span>{{dialog.retailcode}}</p>
    </van-dialog>
  </div>
</template>

<script>
import discountListApi from "@/pages/index/services/discountList";
import util from "@/pages/index/helper/util";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      show: false,
      dialog: {}
    };
  },
  methods: {
    // 初始化表格数据
    getTable() {
      const params = {
        count: this.list.length + 1,
        userid: util.getCookie("userid")
      };
      discountListApi.getTable({ params: { ...params } }).then(
        res => {
          const { status, message } = res.data;
          if (res.data.status == 0) {
            this.list = this.list.concat(res.data.data);
            this.loading = false;
            if (this.list.length >= res.data.totalcount) {
              this.finished = true;
            }
          } else if (res.data.status == 5) {
            this.$router.push({
              name: 'login'
            });
          } else {
            this.$toast(message);
            this.loading = false;
            this.finished = true;
          }
        },
        () => {
          this.$toast("请求出错了, 稍后重试");
        }
      );
    },
    // 作废操作
    invalid(id) {
      discountListApi
        .invalid({
          data: {
            id
          }
        })
        .then(
          res => {
            const { status, message } = res.data;
            if (res.data.status == 0) {
              this.list.forEach(item => {
                if (item.id == id) {
                  item.userflag = 2;
                }
              });
            }
            this.$toast(message);
          },
          () => {
            this.$toast("请求出错了, 稍后重试");
          }
        );
    },
    // 弹框展示使用明细
    detailInfo(row) {
      if (row.userflag == 1) {
        this.show = true;
        this.dialog = row;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  font-size: 0;
  background: #06bf04;
  color: white;
  position: fixed;
  z-index: 1;
}
.van-list {
  padding-top: 100px;
}
.item {
  display: inline-block;
  text-align: center;
  font-size: 30px;
  letter-spacing: 2px;
  .van-button--mini {
    width: 120px;
    height: 50px;
    font-size: 28px;
  }
}
.van-cell {
  font-size: 0;
}
.discount {
  width: 15%;
}
.type {
  width: 20%;
}
.createdate {
  width: 40%;
}
.operation {
  width: 25%;
}
.usered {
  color: #06bf04;
}
.disabled {
  color: #999;
  text-decoration: line-through;
}
.msgInfo {
  color: #666;
  font-size: 20px;
  padding: 10px;
  span {
    display: inline-block;
    padding-left: 20px;
  }
}
</style>