<template>
  <div class="chart-period-comparison">
    <div class="company-name">
      <span class="label">公司名称：</span>
      <span class="select-text" @click="popupShow = !popupShow">{{companyInfo.name}}</span>
    </div>
    <div class="company-name">
      <span class="label">商品类别：</span>
      <span class="select-text" @click="popupShow02 = !popupShow02">{{brandInfo.name}}</span>
    </div>
    <div class="echart-type">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="报表类型：" :name="1" :border="false">
          <div class="info">
            <span
              v-for="item in echartTypeList"
              :class="[{ active: isActive(item.type) }, 'item']"
              :key="item.type"
              @click="toggleType(item.type)"
            >{{item.text}}</span>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="table">
      <p class="chart-label">销售对比表格</p>
      <div class="scroll-x">
        <table>
          <thead>
            <tr>
              <th class="th1">
                <p class="right">销售对比</p>
                <div class="line"></div>
                <p class="left">公司名称</p>
              </th>
              <th>本期</th>
              <th>上期</th>
              <th>环比
                <br>上升
              </th>
              <th>上年
                <br>同期
              </th>
              <th>同比
                <br>上升
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td class="td1">{{item.com_name}}</td>
              <td class="td2">{{item.Thisperiod}}</td>
              <td class="td3">{{item.lastperiod}}</td>
              <td class="td4">{{item.Ringrise}}</td>
              <td class="td3">{{item.periodlastyear}}</td>
              <td class="td4">{{item.lastRingrise}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="echartHistogram">
      <p class="chart-label">销售对比柱形图</p>
      <ve-histogram :data="chartData" :extend="extend" :settings="chartSettings">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-histogram>
    </div>
    <van-popup v-model="popupShow" position="bottom">
      <van-picker
        show-toolbar
        value-key="name"
        :columns="companyList"
        @cancel="popupShow = !popupShow"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-popup v-model="popupShow02" position="bottom">
      <van-picker
        show-toolbar
        value-key="name"
        :columns="brandList"
        @cancel="popupShow02 = !popupShow02"
        @confirm="onConfirmBrand"
      />
    </van-popup>
  </div>
</template>

<script>
import util from "@/pages/index/helper/util";
import createDiscountApi from "@/pages/index/services/createDiscount";
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    this.extend = {
      "xAxis.0.axisLabel.rotate": 90
    };
    this.chartSettings = {
      labelMap: {
        Thisperiod: "本期",
        lastperiod: "同期",
        periodlastyear: "上年同期"
      }
    };
    return {
      popupShow: false,
      popupShow02: false,
      companyInfo: { id: "", name: "请选择公司名称", code: "" },
      brandInfo: { classid: "", name: "请选择商品类别" },
      companyList: [],
      brandList: [],
      curType: "0",
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
          text: "季度报",
          type: "3"
        },
        {
          text: "半年报",
          type: "4"
        },
        {
          text: "年报",
          type: "5"
        }
      ],
      activeNames: 1,
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
      const params = {
        company_id: localStorage.getItem("company_id"),
        name: "st_company"
      };
      chartApi.initCompanyList({ params: params }).then(res => {
        const { status, message, data } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.companyList = data;
          this.companyInfo = data[0]
            ? data[0]
            : { id: "", name: "公司列表获取出错", code: "" };
          this.initBrandList();
        }
      });
    },
    initBrandList() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        name: "st_class"
      };
      createDiscountApi.rules({ params: params }).then(res => {
        const { status, message, data } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.brandList = data;
          this.brandInfo = data[0]
            ? data[0]
            : { classid: "", name: "商品类别获取出错" };
          this.viewreportData();
        }
      });
    },
    viewreportData() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        Datetype: this.curType,
        comid: this.companyInfo.id ? this.companyInfo.id : "",
        class_id: this.brandInfo.classid ? this.brandInfo.classid : ""
      };
      chartApi.viewreportDataCompare({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          this.tableData = data;
          if (data.length > 0) {
            this.dataEmpty = false;
          }
          this.chartData.rows = data;
        }
      });
    },
    isActive(isActive) {
      return this.curType === isActive;
    },
    toggleType(type) {
      this.curType = type;
      this.viewreportData();
    },
    onConfirm(value, index) {
      this.companyInfo = value;
      this.popupShow = !this.popupShow;
      this.initBrandList();
    },
    onConfirmBrand(value, index) {
      this.brandInfo = value;
      this.popupShow02 = !this.popupShow02;
      this.viewreportData();
    }
  },
  mounted() {
    this.initCompanyList();
  }
};
</script>
<style lang="scss" scoped>
.chart-period-comparison {
  padding: 30px 20px 0 20px;
  .label {
    font-size: 30px;
  }
  .company-name {
    display: flex;
    align-items: center;
    padding: 10px 0;
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
  .echart-type {
    .info {
      font-size: 0;
      .item {
        display: inline-block;
        width: 98px;
        line-height: 56px;
        border: 1px solid #ebedf0; /*no*/
        border-radius: 6px;
        margin: 0 10px 6px 0;
        font-size: 26px;
        color: #727171;
        text-align: center;
        &.active {
          background-color: #51b8cb;
          border: 1px solid #51b8cb; /*no*/
          color: white;
        }
      }
    }
  }
}
  .table {
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 80px;
      background: url("../assets/table.png") no-repeat left center;
      background-size: 40px 40px;
    }
    .scroll-x {
      width: 100%;
      overflow-x: scroll;
      table {
        border: 1px solid #ebedf0; /*no*/
        border-collapse: collapse;
        width: 120%;
        font-size: 28px;
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
          text-align: right;
          padding-right: 4px;
        }
        .left {
          text-align: left;
          text-indent: 6px;
        }
        .line {
          position: absolute;
          top: 60%;
          left: -20%;
          width: 300px;
          height: 0;
          border-top: 1px solid #ebedf0; /*no*/
          transform: rotate(28deg);
          -moz-transform: rotate(28deg); /* Firefox */
          -webkit-transform: rotate(28deg); /* Safari 和 Chrome */
        }
      }
      th:nth-child(odd) {
        background: rgba(114, 113, 113, 0.2);
      }
      th:nth-child(n + 2) {
        width: 108px;
        height: 100px;
      }
      th,
      td {
        text-align: center;
        border: 1px solid #ebedf0; /*no*/
      }
      td {
        width: 108px;
        font-size: 24px;
        padding: 28px 0;
        &.td1 {
          color: #666;
          text-align: left;
        }
        &.td2 {
          color: #0e52b9;
        }
        &.td3 {
          color: #db6d01;
        }
        &.td4 {
          color: #129105;
        }
        &:nth-child(n + 2) {
          text-align: right;
        }
      }
    }
  }
  .echartHistogram {
    padding: 20px 0;
    width: 100%;
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 80px;
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