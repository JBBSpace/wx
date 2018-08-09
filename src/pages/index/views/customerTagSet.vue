<template>  
<div class="customerTagSet">
  <div class="classify" v-for="lev1 in classify" :key="lev1.label_id">
    <p class="title">{{lev1.label_name}}</p>
    <div class="tags">
      <span v-for="tag in lev1.label_item_list" :class="[tag.label_item_selected ? 'active' : '', 'tag']" 
      :key="tag.label_item_id" @click="toggleTag(lev1.label_item_list,tag.label_item_id)">{{tag.label_item_name}}</span>
    </div>
  </div>
  <div class="submitbtn" @click="submit">提交</div>
</div>
</template>  
  
<script>
import customerTagSetApi from "@/pages/index/services/customerTagSet";
export default {
  data() {
    return {
      classify: [
        {
          label_id: "1",
          label_name: "年龄段",
          label_item_list: [
            {
              label_item_selected: false,
              label_item_name: "少年",
              label_item_id: "1.1"
            },
            {
              label_item_selected: false,
              label_item_name: "中年",
              label_item_id: "1.2"
            },
            {
              label_item_selected: false,
              label_item_name: "老年",
              label_item_id: "1.3"
            }
          ]
        },
        {
          label_id: "2",
          label_name: "消费能力",
          label_item_list: [
            {
              label_item_selected: false,
              label_item_name: "低",
              label_item_id: "2.1"
            },
            {
              label_item_selected: false,
              label_item_name: "中",
              label_item_id: "2.2"
            },
            {
              label_item_selected: false,
              label_item_name: "高",
              label_item_id: "2.3"
            }
          ]
        },
        {
          label_id: "3",
          label_name: "顾客亲和力",
          label_item_list: [
            {
              label_item_selected: true,
              label_item_name: "差",
              label_item_id: "3.1"
            },
            {
              label_item_selected: false,
              label_item_name: "一般",
              label_item_id: "3.2"
            },
            {
              label_item_selected: false,
              label_item_name: "好",
              label_item_id: "3.3"
            }
          ]
        },
        {
          label_id: "4",
          label_name: "顾客职业",
          label_item_list: [
            {
              label_item_selected: true,
              label_item_name: "学生",
              label_item_id: "4.1"
            },
            {
              label_item_selected: false,
              label_item_name: "白领",
              label_item_id: "4.2"
            },
            {
              label_item_selected: false,
              label_item_name: "医生",
              label_item_id: "4.3"
            },
            {
              label_item_selected: false,
              label_item_name: "教师",
              label_item_id: "4.4"
            },
            {
              label_item_selected: false,
              label_item_name: "文员",
              label_item_id: "4.5"
            },
            {
              label_item_selected: false,
              label_item_name: "工厂",
              label_item_id: "4.6"
            }
          ]
        },
        {
          label_id: "5",
          label_name: "顾客类型",
          label_item_list: [
            {
              label_item_selected: true,
              label_item_name: "商务人士",
              label_item_id: "5.1"
            },
            {
              label_item_selected: false,
              label_item_name: "潮流人士",
              label_item_id: "5.2"
            },
            {
              label_item_selected: false,
              label_item_name: "时尚达人",
              label_item_id: "5.3"
            },
            {
              label_item_selected: false,
              label_item_name: "奢侈品用户",
              label_item_id: "5.4"
            },
            {
              label_item_selected: false,
              label_item_name: "新消费人士",
              label_item_id: "5.5"
            }
          ]
        }
      ]
    };
  },
  methods: {
    init() {
      const params = { client_id: "0508170430001" };
      customerTagSetApi.labelList({ params: params }).then(res => {
        const { data } = res.data;
        this.classify = data;
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
        client_id: "0508170430001",
        label_list: label_list
      };
      customerTagSetApi.setClientLabel({ data: data }).then(res => {
        const { message } = res.data;
        this.$toast(message);
      });
    }
  },
  mounted(){
    this.init();
  }
};
</script>  
  
<style lang="scss" scoped>
.customerTagSet {
  padding-bottom: 190px;
  .classify {
    .title {
      font-size: 32px;
      color: rgba(102, 102, 102, 1);
      padding: 25px;
    }
    .tags {
      background: #fff;
      padding: 25px 25px 0 25px;
      display: flex;
      flex-wrap: wrap;
      .tag {
        width: 204px;
        height: 80px;
        box-sizing: border-box;
        border: 1px solid #f2f2f2; /*no*/
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
          color: #4976cc;
          border-color: #4976cc;
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
      #00baff,
      #482bf5
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
      right,
      #00baff,
      #482bf5
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
      right #00baff,
      #482bf5
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(
      to right,
      #00baff,
      #482bf5
    ); /* 标准的语法（必须放在最后） */
  }
}
</style>  