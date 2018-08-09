<template>
  <div class="discountPage">  
    <van-tabs sticky v-model="formData.type">
      <van-tab title="类别折扣">
        <van-cell-group>
          <van-checkbox-group class="checkbox_group" v-model="checkedClass">
            <van-field
              v-for="(item) in classList"
              :key="item.classid"
              center
              v-model="item.discount"
              type='number'
              placeholder="请输入折扣额度"
              :error-message="discountErr(item)"
              icon="clear"
              @click-icon="item.discount = ''">
              <van-checkbox
                slot="label"
                :key="item.classid"
                :name="item.classid">
                {{ item.name }}
              </van-checkbox>
            </van-field>
          </van-checkbox-group> 
        </van-cell-group>
        <van-tabbar>
          <van-button :disabled="checkedClass.length>0?false:true" type="primary" size="large" @click="checkedData">生成折扣券</van-button>
        </van-tabbar>
      </van-tab>
      <van-tab title="整单折扣">
        <van-cell-group>
          <van-field label="折扣额度(1-100%) :" v-model="formData.discount" placeholder="请输入折扣额度" center icon="clear" @click-icon="formData.discount = ''" type='number'/>
          <p v-show="!err" class="errMsg">折扣额度(1-100%)</p>
        </van-cell-group>
        <van-tabbar>
          <van-button :disabled="formData.discount&&err?false:true" type="primary" size="large" @click="postDiscountData">生成折扣券</van-button>
        </van-tabbar>
      </van-tab>
      <van-tab title="现金折扣">
        <van-cell-group>
          <van-field label="折扣金额 :" v-model="formData.discount" placeholder="请输入折扣额度" center  icon="clear" @click-icon="formData.discount = ''" type='number'/>
        </van-cell-group>
        <van-tabbar>
          <van-button :disabled="formData.discount?false:true" type="primary" size="large" @click="postDiscountData">生成折扣券</van-button>
        </van-tabbar>
      </van-tab>
    </van-tabs>
    </div>
</template>  
  
<script>
import { Toast, ContactCard } from "vant";
import util from "@/pages/index/helper/util";
import createDiscountApi from "@/pages/index/services/createDiscount";
document.title = "生成 折扣券";
export default {
  data() {
    return {
      formData: {
        type: 0,
        discount: ""
      },
      checkedClass: [],
      classList: []
    };
  },
  computed: {
    err() {
      return (
        this.formData.discount == "" ||
        (this.formData.discount >= 1 && this.formData.discount <= 100)
      );
    }
  },
  methods: {
    createQrcode() {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, "" + this.url, function(error) {
        if (error) console.error(error);
      });
      this.show = true;
    },
    getList() {
      const code = this.$route.query.code ? this.$route.query.code : "";
      const params = {
        code: code,
        userid: util.getCookie("userid"),
        type: 0
      };
      createDiscountApi.getList({ params: { ...params } }).then(res => {
        this.classList = res.data.data;
      });
    },
    checkedData() {
      const classObj = [];
      let flag = true;
      this.classList.map(item => {
        if (this.checkedClass.indexOf(item.classid) > -1) {
          if (item.discount && item.discount >= 1 && item.discount <= 100) {
            classObj.push({ class_id: item.classid, discount: item.discount });
          } else {
            Toast(`请输入${item.name}的折扣额度(1-100%)`);
            flag = false;
            return;
          }
        }
      });
      if (flag) {
        this.postDiscountData(classObj);
      }
    },
    postDiscountData(classObj) {
      const data = {
        userid: util.getCookie("userid"),
        type: this.formData.type
      };
      if (data.type == 0) {
        data.class = classObj;
      } else {
        data.discount = this.formData.discount;
      }
      createDiscountApi.postDiscountData({ data: { ...data } }).then(res => {
        if (res.data.status != 0) {
          Toast(res.data.message);
        } else {
          const { barcode } = res.data.data;
          window.location.href = `/static/userinfo/qrcode.html?barcode=${barcode}`;
        }
      });
    },
    discountErr({ discount, classid }) {
      const idIndex = this.checkedClass.indexOf(classid);
      const checkedClass = this.checkedClass;
      if (discount) {
        if (discount >= 1 && discount <= 100) {
          if (idIndex == -1) {
            checkedClass.push(classid);
          }
          return "";
        } else {
          if (idIndex > -1) {
            checkedClass.splice(idIndex, 1);
          }
          return "折扣额度(1-100%)";
        }
      } else {
        if (idIndex > -1) {
          checkedClass.splice(idIndex, 1);
        }
      }
    }
  },
  mounted() {
    this.getList();
  }
};
</script>  
  
<style lang="scss">
.discountPage {
  .van-tabs__line {
    background-color: #06bf04;
  }
  .van-tab--active {
    color: #06bf04;
  }
  .van-field .van-cell__title {
    max-width: 375px;
  }
  .van-tabs__content {
    padding-bottom: 120px;
    .van-dialog__header {
      color: #008400;
    }
    .qrcoderContain {
      text-align: center;
      #canvas {
        width: 400px !important;
        height: 400px !important;
      }
      p {
        padding-bottom: 30px;
        font-size: 34px;
        color: rgba(114, 113, 113, 1);
      }
    }
  }
  .van-cell-group {
    .van-cell {
      padding: 22px 15px;
    }
  }
  .van-checkbox__label {
    font-size: 30px;
  }
  .errMsg {
    text-align: center;
    color: red;
    font-size: 22px;
    padding: 10px 0;
  }
}
</style>  