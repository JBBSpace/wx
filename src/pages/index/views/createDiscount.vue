<template>
  <div class="createDiscountPage">
    <!-- 折扣切换tab -->
    <van-tabs sticky
              v-model="formData.type"
              @change="step=0"
              class="tabs__content">
      <van-tab title="整单折扣">
        <van-cell-group>
          <van-field label="折扣额度(1-100)% ："
                     v-model="formData.singleDiscount"
                     placeholder="请输入折扣额度"
                     :error-message="err?'':'折扣额度(1-100)%'"
                     center
                     icon="clear"
                     @click-icon="formData.singleDiscount = ''"
                     type="number" />
        </van-cell-group>
      </van-tab>
      <van-tab title="类别折扣">
        <van-cell-group>
          <van-checkbox-group class="checkbox_group"
                              v-model="checkedClass">
            <van-field v-for="(item) in classList"
                       :key="item.classid"
                       center
                       v-model="item.discount"
                       type="number"
                       placeholder="折扣额度(1-100)%"
                       :error-message="discountErr(item)"
                       icon="clear"
                       @click-icon="item.discount = ''">
              <van-checkbox slot="label"
                            :key="item.classid"
                            :name="item.classid">{{ item.name }}</van-checkbox>
            </van-field>
          </van-checkbox-group>
        </van-cell-group>
      </van-tab>
      <van-tab title="现金折扣">
        <van-cell-group>
          <van-field label="折扣金额 ："
                     v-model="formData.cashDiscount"
                     placeholder="请输入折扣额度"
                     center
                     icon="clear"
                     @click-icon="formData.cashDiscount = ''"
                     type="number" />
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <!-- 底部操作按钮 -->
    <van-tabbar>
      <van-button :disabled="submitStatus"
                  type="primary"
                  size="large"
                  @click="toRule">生成折扣券</van-button>
    </van-tabbar>
    <van-popup v-model="notesStatus"
               position="right"
               :overlay="false">
      <van-steps :active="parseInt(step)-1"
                 active-color="#51b8cb">
        <van-step>规则选择</van-step>
        <van-step>添加备注</van-step>
        <van-step>设置过期时间</van-step>
        <van-step>完成</van-step>
      </van-steps>
      <!-- 打折规则选择 -->
      <div class="step2"
           v-if="step===1">
        <div class="notesContain">
          <!-- 内容列表 -->
          <div v-if="ruleList.length"
               class="tags">
            <span v-for="item in ruleList"
                  :class="[item.rollid==rollActive ? 'active' : '', 'tag']"
                  :key="item.rollid"
                  @click="ruleMothed(item)">{{item.rollname}}</span>
          </div>
          <div v-else>本月暂无可选择的折扣规则</div>
        </div>
        <div class="nextStep-contain">
          <span class="nextStep backBtn"
                @click="step=0">取消</span>
          <span class="nextStep"
                @click="toNotes">添加备注</span>
        </div>
      </div>
      <!-- 备注对话框 -->
      <div class="step2"
           v-if="step===2">
        <div class="notesContain">
          <van-field v-model="notes.notes"
                     type="textarea"
                     placeholder="请输入备注信息"
                     rows="8"
                     autosize />
        </div>
        <div class="nextStep-contain">
          <span class="nextStep backBtn"
                @click="step=1">上一步</span>
          <span class="nextStep"
                @click="toTime">过期时间</span>
        </div>
      </div>
      <!-- 时间选择 -->
      <div class="step2"
           v-if="step===3">
        <div class="notesContain">
          <van-datetime-picker v-model="time.expday"
                               type="date"
                               :show-toolbar="false"
                               :min-date="time.minDate" />
        </div>
        <div class="nextStep-contain">
          <span class="nextStep backBtn"
                @click="step=2">上一步</span>
          <span class="nextStep"
                @click="postDiscountData">完成</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>  
  
<script>
import createDiscountApi from "@/pages/index/services/createDiscount";
import BScroll from "better-scroll";
export default {
  data () {
    return {
      formData: {
        type: 1,
        singleDiscount: "",
        cashDiscount: ""
      },
      checkedClass: [],
      classList: [],
      ruleList: [],
      rollActive: "",
      notes: {
        notes: ""
      },
      time: {
        expday: new Date().setDate((new Date()).getDate()+30),
        minDate: new Date()
      },
      step: 0
    };
  },
  computed: {
    err () {
      return (
        this.formData.singleDiscount == "" ||
        (this.formData.singleDiscount >= 1 &&
          this.formData.singleDiscount <= 100)
      );
    },
    submitStatus () {
      if (this.formData.type == 0) {
        return !(
          this.formData.singleDiscount >= 1 &&
          this.formData.singleDiscount <= 100
        );
      } else if (this.formData.type == 1) {
        return !this.checkedClass.length;
      } else {
        return this.formData.cashDiscount == "";
      }
    },
    notesStatus: {
      get () {
        return this.step !== 0;
      },
      set () { }
    }
  },
  methods: {
    getList () {
      const params = {
        company_id: window.localStorage.getItem("company_id"),
        name: "st_class"
      };
      createDiscountApi.rules({ params: { ...params } }).then(res => {
        this.classList = res.data.data;
      });
    },
    getRule () {
      const params = {
        company_id: window.localStorage.getItem("company_id"),
        name: "discount_roll"
      };
      createDiscountApi.rules({ params: { ...params } }).then(res => {
        this.ruleList = res.data.data;
      });
    },
    checkedData () {
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
    toRule () {
      this.step = 1;
    },
    toNotes () {
      if (this.rollActive) {
        this.step = 2;
      } else {
        this.$toast('请选择折扣规则')
      }

    },
    toTime () {
      if (this.time.expday == "") {
        this.time.expday = new Date();
      }
      this.step = 3;
    },
    ruleMothed (item) {
      if (item.max_count) {
        this.rollActive = item.rollid;
      } else {
        this.$toast("本月该规则已用完");
      }
    },

    postDiscountData () {
      const data = {
        company_id: window.localStorage.getItem("company_id"),
        type: this.formData.type,
        notes: this.notes.notes,
        rollid: this.rollActive,
        expday: new Date(
          +new Date(new Date(this.time.expday).toJSON()) + 8 * 3600 * 1000
        )
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "")
      };
      if (data.type == 0) {
        data.discount = this.formData.singleDiscount;
      } else if (data.type == 1) {
        data.class = this.checkedData();
      } else {
        data.discount = this.formData.cashDiscount;
      }
      createDiscountApi.postDiscountData({ data: { ...data } }).then(res => {
        if (res.data.status) {
          this.$toast(res.data.message);
        } else {
          this.step = 0;
          const { barcode, intro, notes, expiry_date, rollname } = res.data.data;
          window.location.href = `/qrcode.html?barcode=${barcode}&intro=${encodeURI(
            intro
          )}&notes=${encodeURI(notes)}&expiry_date=${encodeURI(expiry_date)}&rollname=${encodeURI(rollname)}`;
        }
      });
    },
    discountErr ({ discount, classid }) {
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
          return "折扣额度(1-100)%";
        }
      } else {
        if (idIndex > -1) {
          checkedClass.splice(idIndex, 1);
        }
      }
    }
  },
  mounted () {
    this.getList();
    this.getRule();
  }
};
</script>  
  
<style lang="scss" scoped>
.createDiscountPage {
  .tabs__content {
    padding-bottom: 100px;
  }
  .step2 {
    width: 750px;
    height: calc(100vh - 322px);
    background: #ebedf0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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