<template>
  <div class="customerTagSet">
    <div class="classify" v-for="(lev1,index) in classify" :key="lev1.label_id">
      <div class="title">
        <p class="titlebg">
          <span class="indextitle">{{(index<10)?'0'+Number(index+1):''+Number(index+1)}}</span>
          <span class="texttitle">{{lev1.label_name}}</span>
        </p>
      </div>
      <div class="tags">
        <span
          v-for="tag in lev1.label_item_list"
          :class="[tag.label_item_selected ? 'active' : '', 'tag']"
          :key="tag.label_item_id"
          @click="toggleTag(lev1.label_item_list,tag.label_item_id)"
        >{{tag.label_item_name}}</span>
      </div>
    </div>
    <div class="submitbtn" v-show="!msg_read" @click="submit">提交</div>
  </div>
</template>  
  
<script>
import customerTagSetApi from "@/pages/index/services/customerTagSet";
import "../assets/style/iconfont.css";
export default {
  data() {
    return {
      classify: [],
      msg_read:false
    };
  },
  methods: {
    init() {
      customerTagSetApi
        .labelList({
          url: `/retail/lableinfo/${this.$route.query.id}`,
          params: {
            msg_id: this.$route.query.msg_id,
          }
        })
        .then(res => {
          const { data } = res.data;
          this.classify = data.tag_ls;
          this.msg_read= data.msg_read
        });
    },
    toggleTag(tags, id) {
      tags.map(function(tag) {
        if (tag.label_item_id == id) {
          tag.label_item_selected = !tag.label_item_selected;
        } else {
          tag.label_item_selected = false;
        }
      });
    },
    submit() {
      const label_list = [];
      this.classify.map(function(item) {
        const flag = item.label_item_list.map(function(tag) {
          if (tag.label_item_selected) {
            label_list.push({
              label_id: item.label_id,
              label_item_list: [
                {
                  label_item_id: tag.label_item_id
                }
              ]
            });
          }
        });
      });
      const data = {
        id: this.$route.query.id,
        msg_id: this.$route.query.msg_id,
        label_list: label_list
      };
      customerTagSetApi.setClientLabel({ data: data }).then(res => {
        const { message, status } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.$dialog
            .alert({
              message: "提交成功"
            })
            .then(() => {
              history.back();
            });
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>  
  
<style lang="scss" scoped>
.customerTagSet {
  padding-bottom: 190px;
  .classify {
    .title {
      background-color: #f2f2f2;
      font-size: 32px;
      color: #fff;
      .titlebg {
        height: 85px;
        box-sizing: border-box;
        background: #f2f2f2 url(../assets/customerTagSet/tagtitle.png) no-repeat
          left center;
        background-size: 388px 85px;
        display: flex;
        align-items: center;
        .indextitle {
          width: 80px;
          height: 70px;
          font-size: 55px;
          line-height: 70px;
          text-align: center;
        }
        .texttitle {
          font-size: 32px;
          height: 70px;
          line-height: 70px;
        }
      }
    }
    .tags {
      padding: 25px 25px 0 25px;
      display: flex;
      flex-wrap: wrap;
      .tag {
        width: 204px;
        height: 80px;
        box-sizing: border-box;
        border: 1px solid #ddd9d9d3; /*no*/
        border-radius: 16px;
        text-align: center;
        line-height: 80px;
        letter-spacing: 3px;
        font-size: 28px;
        color: rgba(51, 51, 51, 1);
        margin-right: 44px;
        margin-bottom: 25px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &.active {
          color: #fff;
          border-color: #51b8cb;
          background: #51b8cb;
        }
      }
    }
  }
  .submitbtn {
    width: 689px;
    height: 89px;
    position: fixed;
    bottom: 50px;
    left: 50%;
    margin-left: -345px;
    border-radius: 16px;
    font-size: 32px;
    text-align: center;
    line-height: 89px;
    color: rgba(255, 255, 255, 1);
    background: -webkit-linear-gradient(
      left,
      #51b8cb,
      #2b89f5
    ); /* Safari 5.1 - 6.0 */
    background: linear-gradient(
      to right,
      #51b8cb,
      #2b89f5
    ); /* 标准的语法（必须放在最后） */
  }
}
</style>  