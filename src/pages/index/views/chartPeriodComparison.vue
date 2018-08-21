<template>
  <div class="echart">
    <div class="companyName">
      <span class="label">公司名称：</span><span class="text" @click="selectCompany">{{company.com_name}}</span>
    </div>
    <div class="companyName brandName">
      <span class="label">品牌名称：</span><span class="text" @click="selectBrand">{{brand.name}}</span>
    </div>
    <div class="echartType">
      <span class="label">报表类型：</span><span v-for="item in echartTypeList" :class="[{ active: isActive(item.type) }, 'item']" :key="item.type" @click="toggleType(item.type)">{{item.text}}</span>
    </div>
    <div class="echartPie">
      <p class="label">销售对比表格</p>
      <div class="scroll">
      <table>
        <thead class="fixedThead">
          <tr>
            <th class="th1">
              <p class="right">销售对比 </p>
              <div class="line"></div>
              <p class="left">公司名称</p>
            </th>
            <th class="th_odd">本期</th>
            <th class="th_even">上期</th>
            <th class="th_odd">环比<br/> 上升</th>
            <th class="th_even"> 上年<br/> 同期 </th>
            <th class="th_odd">环比<br/>上升</th>
          </tr>
        </thead>
        <tbody class="scrollTbody">
          <tr v-for="item in tableData" :key="item.id">
            <td class="td1">{{item.com_name}}</td>
            <td class="td2">{{item.Thisperiod}}</td>
            <td class="td3">{{item.lastperiod}}</td>
            <td class="td4">{{item.Ringrise}}%</td>
            <td class="td3">{{item.periodlastyear}}</td>
            <td class="td4">{{item.lastRingrise}}%</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    <div class="echartHistogram">
      <p class="label">销售对比柱形图</p>
      <div class="scroll">
        <ve-histogram :data="chartData" width="700px" :extend="extend" :settings="chartSettings02">
          <div v-if="dataEmpty" class="data-empty">没有数据</div>
        </ve-histogram>
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <van-picker
        show-toolbar
        value-key="com_name"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-popup v-model="showClass" position="bottom">
      <van-picker
        show-toolbar
        value-key="name"
        :columns="columnsClass"
        @cancel="onCancel"
        @confirm="onConfirmClass"
      />
    </van-popup>
  </div>
</template>

<script>
import createDiscountApi from "@/pages/index/services/createDiscount";
import chartApi from "@/pages/index/services/chart";
import util from "@/pages/index/helper/util";
document.title = "周期销售对比报表";
export default {
  data: function() {
    this.extend = {
      "xAxis.0.axisLabel.rotate": 90
    };
    this.chartSettings02 = {
      labelMap: {
        Thisperiod: "本期",
        lastperiod: "同期",
        periodlastyear:"上年同期"
      },
      label: {
        fontSize: 8
      }
    };
    return {
      show: false,
      showClass: false,
      company: {},
      brand: {},
      columns: [],
      columnsClass: [],
      curType: "2",
      echartTypeList: [
        {
          text: "日报",
          type: "0"
        },
        {
          text: "周报",
          type: "1"
        },
        {
          text: "月报",
          type: "2"
        },
        {
          text: "年报",
          type: "3"
        }
      ],
      tableData: [],
      chartData: {
        columns: ["com_name", "Thisperiod", "lastperiod", "periodlastyear"],
        rows: []
      },
      dataEmpty: true
    };
  },
  methods: {
    initCompanyList() {
      chartApi.initCompanyList().then(res => {
        const { status, message, data } = res.data;
        if (status == 0) {
          this.columns = data;
          this.company = data[0] ? data[0] : "请选择公司名称";
          this.initBrandList();
        } else {
          this.$toast(message);
        }
      });
    },
    initBrandList() {
      const code = this.$route.query.code ? this.$route.query.code : "";
      const params = {
        code: code,
        userid: util.getCookie("wx_userid"),
        type:1
      };
      createDiscountApi.getList({ params: { ...params } }).then(res => {
        const { status, message, data } = res.data;
        if (status == 0) {
          this.columnsClass = data;
          this.brand = data[0] ? data[0] : "请选择品牌名称";
          this.viewreportData();
        } else {
          this.$toast(message);
        }
      });
    },
    viewreportData() {
      const params = {
        Datetype: this.curType,
        company: this.company.com_id ? this.company.com_id : "",
        classid: this.brand.classid ? this.brand.classid : ""
      };
      chartApi.viewreportDataCompare({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status == 0) {
          this.tableData = data;
          if(data.length > 0){
            this.dataEmpty = false;
            this.chartData.rows = data;
          }
        } else {
          this.$toast(message);
        }
      });
    },
    selectCompany() {
      this.show = !this.show;
    },
    selectBrand() {
      this.showClass = !this.showClass;
    },
    isActive(isActive) {
      return this.curType === isActive;
    },
    toggleType(type) {
      this.curType = type;
      this.viewreportData();
    },
    onConfirm(value, index) {
      this.company = value;
      this.show = !this.show;
      this.viewreportData();
    },
    onConfirmClass(value, index) {
      this.brand = value;
      this.showClass = !this.showClass;
      this.viewreportData();
    },
    onCancel() {
      this.show = false;
      this.showClass = false;
    }
  },
  mounted() {
    this.initCompanyList();
  }
};
</script>
<style lang="scss">
.van-picker__toolbar {
  font-size: 32px;
  color: #666;
}
.echart {
  padding: 60px 25px;
  .scroll {
    width: 100%;
    overflow-x: scroll;
    table {
      border: 1px solid #ccc; /*no*/
      border-collapse: collapse;
      width: 120%;
      font-size: 28px;
      // .fixedThead {
      //   display: block;
      //   width: 100%;
      // }
      // .scrollTbody {
      //   display: block;
      //   height: 550px;
      //   overflow: auto;
      //   width: 100%;
      // }
    }
    .th1 {
      width: 150px;
      min-width: 150px;
      height: 80px;
      position: relative;
      overflow: hidden;
      font-size: 24px;
      background: rgba(114, 113, 113, 0.2); /*no*/
      .right {
        height: 40px;
        line-height: 30px;
        text-align: right;
        padding-right: 4px;
      }
      .left {
        text-align: left;
        padding-top: 10px;
        text-indent: 6px;
      }
      .line {
        position: absolute;
        top: 60%;
        left: -20%;
        width: 280px;
        height: 0;
        border-top: 1px solid #ccc; /*no*/
        transform: rotate(30deg);
        -moz-transform: rotate(30deg); /* Firefox */
        -webkit-transform: rotate(29deg); /* Safari 和 Chrome */
      }
    }
    .th_even,
    .th_odd {
      width: 108px;
      height: 100px;
    }
    .th_even {
      background: rgba(114, 113, 113, 0.2);
    }
    th,
    td {
      text-align: center;
      border: 1px solid #ccc; /*no*/
    }
    td {
      width: 108px;
      font-size: 24px;
      padding: 28px 0;
    }
    .td1 {
      color: #666;
    }
    .td2 {
      color: #0e52b9;
    }
    .td3 {
      color: #db6d01;
    }
    .td4 {
      color: #129105;
    }
  }

  .companyName,
  .echartType {
    height: 68px;
    line-height: 68px;
    .label {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      width: 481px;
      height: 68px;
      border: 1px solid #727171; /*no*/
      border-radius: 8px;
      color: #727171;
      font-size: 26px;
      padding-left: 16px;
      box-sizing: border-box;
      background: url("../assets/select.png") no-repeat 430px center;
    }
    .item {
      display: inline-block;
      width: 98px;
      height: 56px;
      border: 1px solid #727171; /*no*/
      border-radius: 6px;
      margin-right: 30px;
      font-size: 28px;
      color: #727171;
      text-align: center;
      line-height: 56px;
      vertical-align: middle;
      &.active {
        background-color: #51b8cb;
        border: 1px solid #51b8cb; /*no*/
        color: white;
      }
    }
  }
  .brandName {
    padding-top: 40px;
  }
  .echartType {
    margin: 50px 0;
  }
  .echartPie,
  .echartHistogram {
    .label {
      font-size: 30px;
      padding-left: 50px;
      margin-bottom: 30px;
    }
  }
  .echartHistogram {
    width: 750px;
    padding-top: 30px;
  }
  .echartPie .label {
    background: url("../assets/table.png") no-repeat left center;
    background-size: 40px 40px;
  }
  .echartHistogram .label {
    background: url("../assets/compare.png") no-repeat left center;
    background-size: 40px 40px;
  }
  .data-empty {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
    color: #888;
    font-size: 28px;
  }
}
</style>  