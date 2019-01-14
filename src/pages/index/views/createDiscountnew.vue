<template>
  <div class="createDiscountPage">
    <!-- 折扣切换tab -->
    <van-tabs sticky v-model="tabType" @change="step=0">
      <van-tab title="整单折扣">
        <div v-if="step">
          <van-cell-group>
            <van-field
              :label="label"
              v-model="rules[0].discount"
              :error-message="err?'':label"
              placeholder="请输入折扣额度"
              center
              type="number"
            />
          </van-cell-group>
        </div>
        <div v-else class="rule">
          <div v-if="rules[0].list.length" class="tags">
            <span
              v-for="item in rules['0'].list"
              :class="[item.rollid==rules[0].roll.rollid ? 'active' : '', 'tag']"
              :key="item.rollid"
              @click="ruleMothed(item)"
            >{{item.rollname}}</span>
          </div>
          <div v-else class="noTag">本月暂无可选择的折扣规则</div>
        </div>
      </van-tab>
      <van-tab title="类别折扣">
        <div v-if="step">
          <van-checkbox-group class="checkbox_group" v-model="checkedClass">
            <van-field
              v-for="(item) in classList"
              :key="item.classid"
              center
              v-model="item.discount"
              type="number"
              :placeholder="labelClass"
              :error-message="discountErr(item)"
            >
              <van-checkbox slot="label" :key="item.classid" :name="item.classid">{{ item.name }}</van-checkbox>
            </van-field>
          </van-checkbox-group>
        </div>
        <div v-else class="rule">
          <div v-if="rules[1].list.length" class="tags">
            <span
              v-for="item in rules['1'].list"
              :class="[item.rollid==rules[1].roll.rollid ? 'active' : '', 'tag']"
              :key="item.rollid"
              @click="ruleMothed(item)"
            >{{item.rollname}}</span>
          </div>
          <div v-else class="noTag">本月暂无可选择的折扣规则</div>
        </div>
      </van-tab>
      <van-tab title="现金折扣">
        <div v-if="step">
          <van-cell-group>
            <van-field
              :label="labelCash"
              v-model="rules[2].discount"
              :error-message="errCash?'':labelCash"
              placeholder="请输入折扣额度"
              center
              type="number"
            />
          </van-cell-group>
        </div>
        <div v-else class="rule">
          <div v-if="rules[2].list.length" class="tags">
            <span
              v-for="item in rules['2'].list"
              :class="[item.rollid==rules[2].roll.rollid ? 'active' : '', 'tag']"
              :key="item.rollid"
              @click="ruleMothed(item)"
            >{{item.rollname}}</span>
          </div>
          <div v-else class="noTag">本月暂无可选择的折扣规则</div>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 底部操作按钮 -->
    <van-tabbar>
      <van-button
        v-if="step==0"
        :disabled="rules[this.tabType].roll==''"
        type="primary"
        size="large"
        @click="setDiscount"
      >去设置折扣</van-button>
      <van-button
        v-if="step==1"
        :disabled="disabled"
        type="primary"
        size="large"
        @click="setNotes"
      >添加备注</van-button>
    </van-tabbar>
    <van-popup v-model="isShow" position="right" :overlay="false">
      <van-steps :active="parseInt(step-2)" active-color="#51b8cb">
        <van-step>添加备注</van-step>
        <van-step>设置过期时间</van-step>
        <van-step>完成</van-step>
      </van-steps>
      <!-- 备注对话框 -->
      <div class="step2" v-if="step===2">
        <div class="notesContain">
          <van-field v-model="notes.notes" type="textarea" placeholder="请输入备注信息" rows="8" autosize/>
        </div>
        <div class="nextStep-contain">
          <span class="nextStep backBtn" @click="step=1">上一步</span>
          <span class="nextStep" @click="toTime">过期时间</span>
        </div>
      </div>
      <!-- 时间选择 -->
      <div class="step2" v-if="step===3">
        <div class="notesContain">
          <van-datetime-picker
            v-model="time.expday"
            type="date"
            :show-toolbar="false"
            :min-date="time.minDate"
          />
        </div>
        <div class="nextStep-contain">
          <span class="nextStep backBtn" @click="step=2">上一步</span>
          <span class="nextStep" @click="postDiscountData">完成</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>  
  
<script>
import createDiscountApi from "@/pages/index/services/createDiscount";
export default {
  data() {
    return {
      step: 0,
      tabType: 1,
      rules: {
        "0": { list: "", roll: "", discount: "" },
        "1": { list: "", roll: "", discount: "" },
        "2": { list: "", roll: "", discount: "" }
      },
      classList: [],
      checkedClass: [],
      notes: {
        notes: ""
      },
      time: {
        expday: "",
        minDate: new Date()
      }
    };
  },
  computed: {
    err() {
      return (
        this.rules[0].discount == "" ||
        (this.rules[0].discount >= this.rules[0].roll.beg_discount &&
          this.rules[0].discount <= this.rules[0].roll.end_discount)
      );
    },
    errCash() {
      if (
        this.rules[2].discount == "" ||
        this.rules[2].roll.max_money == "AllUser"
      ) {
        return true;
      } else {
        return this.rules[2].discount <= this.rules[2].roll.max_money;
      }
    },
    label() {
      return `折扣额度(${this.rules[0].roll.beg_discount} - ${
        this.rules[0].roll.end_discount
      })% ：`;
    },
    labelCash() {
      return this.rules[2].roll.max_money === "AllUser"
        ? "折扣金额"
        : `最高折扣${this.rules[2].roll.max_money}元`;
    },
    labelClass() {
      return `折扣额度(${this.rules[1].roll.beg_discount} - ${
        this.rules[1].roll.end_discount
      })% ：`;
    },
    isShow: {
      get() {
        return this.step !== 0 && this.step !== 1;
      },
      set() {}
    },
    disabled() {
      if (this.tabType == 0) {
        return this.rules[0].discount == "" || !this.err;
      } else if (this.tabType == 1) {
        return !this.checkedClass.length;
      } else {
        return this.rules[2].discount == "" || !this.errCash;
      }
    }
  },
  watch: {
    tabType: function() {
      if (this.rules[this.tabType].list === "") {
        this.getRules();
      }
    }
  },
  methods: {
    getRules() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        name: "discount_roll",
        type: this.tabType,
        time: (new Date()).getTime()
      };
      createDiscountApi.rules({ params }).then(res => {
        this.rules[this.tabType].list = res.data.data;
      });
    },
    ruleMothed(item) {
      if (this.tabType == 2) {
        if (item.max_money) {
          this.rules[this.tabType].roll = item;
        } else {
          this.$toast("本月该规则已用完");
        }
      } else {
        if (item.max_count) {
          this.rules[this.tabType].roll = item;
        } else {
          this.$toast("本月该规则已用完");
        }
      }
    },
    setDiscount() {
      this.step = 1;
      if (this.tabType == 1) {
        this.getClassList();
      }
    },
    getClassList() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        name: "st_class"
      };
      createDiscountApi.rules({ params }).then(res => {
        console.log(res.data);
        this.classList = res.data.data;
      });
    },
    discountErr({ discount, classid }) {
      const idIndex = this.checkedClass.indexOf(classid);
      const checkedClass = this.checkedClass;
      if (discount) {
        if (
          discount >= this.rules[1].roll.beg_discount &&
          discount <= this.rules[1].roll.end_discount
        ) {
          if (idIndex == -1) {
            checkedClass.push(classid);
          }
          return "";
        } else {
          if (idIndex > -1) {
            checkedClass.splice(idIndex, 1);
          }
          return this.labelClass;
        }
      } else {
        if (idIndex > -1) {
          checkedClass.splice(idIndex, 1);
        }
      }
    },
    setNotes() {
      this.step = 2;
    },
    toTime() {
      if (this.time.expday == "") {
        this.time.expday = new Date();
      }
      this.step = 3;
    },
    checkedData() {
      const classObj = [];
      this.classList.map(item => {
        if (this.checkedClass.indexOf(item.classid) > -1) {
          if (item.discount && item.discount >= 1 && item.discount <= 100) {
            classObj.push({
              class_id: item.classid,
              discount: item.discount,
              class_name: item.name
            });
          }
        }
      });
      return classObj;
    },
    postDiscountData() {
      const data = {
        company_id: window.localStorage.getItem("company_id"),
        type: this.tabType,
        notes: this.notes.notes,
        rollid: this.rules[this.tabType].roll.rollid,
        expday: new Date(
          +new Date(new Date(this.time.expday).toJSON()) + 8 * 3600 * 1000
        )
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "")
      };
      if (data.type == 0) {
        data.discount = this.rules[0].discount;
      } else if (data.type == 1) {
        data.class = this.checkedData();
      } else {
        data.discount = this.rules[2].discount;
      }
      createDiscountApi.postDiscountData({ data: { ...data } }).then(res => {
        if (res.data.status) {
          this.$toast(res.data.message);
        } else {
          this.step = 0;
          const {
            barcode,
            intro,
            notes,
            expiry_date,
            rollname
          } = res.data.data;
          window.location.href = `/qrcode.html?barcode=${barcode}&intro=${encodeURI(
            intro
          )}&notes=${encodeURI(notes)}&expiry_date=${encodeURI(
            expiry_date
          )}&rollname=${encodeURI(rollname)}`;
        }
      });
    }
  },
  activated() {
    this.getRules();
  }
};
</script>  
  
<style lang="scss" scoped>
.createDiscountPage {
  .rule {
    .tags {
      overflow-y: auto;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .tag {
        height: 80px;
        padding: 0 25px;
        margin: 24px;
        box-sizing: border-box;
        border: 1px solid #ddd9d9d3; /*no*/
        border-radius: 16px;
        text-align: center;
        line-height: 80px;
        letter-spacing: 3px;
        font-size: 26px;
        color: rgba(51, 51, 51, 1);
        &.active {
          color: #fff;
          border-color: #51b8cb;
          background: #51b8cb;
        }
      }
    }
    .noTag{
      text-align: center;
      font-size: 30px;
      color: #666;
      padding:300px 0;
    }
  }
  .step2 {
    width: 750px;
    height: calc(100vh - 322px);
    background: #ebedf0;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-around;
    -webkit-justify-content: space-around;
    align-items: center;
    .notesContain {
      width: 700px;
      height: 700px;
      position: relative;
      text-align: center;
      line-height: 700px;
      font-size: 32px;
      .tags {
        overflow-y: auto;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .tag {
          height: 80px;
          padding: 0 25px;
          margin: 6px;
          box-sizing: border-box;
          border: 1px solid #ddd9d9d3; /*no*/
          border-radius: 16px;
          text-align: center;
          line-height: 80px;
          letter-spacing: 3px;
          font-size: 26px;
          color: rgba(51, 51, 51, 1);
          &.active {
            color: #fff;
            border-color: #51b8cb;
            background: #51b8cb;
          }
        }
      }
    }
    .nextStep-contain {
      height: 160px;
      line-height: 160px;
      text-align: center;
      .nextStep {
        padding: 20px 100px;
        background-color: #51b8cb;
        border-radius: 50px;
        border: #51b8cb solid 1px; /*no*/
        color: white;
        font-size: 32px;
        letter-spacing: 4px;
      }
      .backBtn {
        background: #fff;
        border: #ddd9d9d3 solid 1px; /*no*/
        color: #696161;
        margin-right: 20px;
      }
    }
  }
}
</style>  