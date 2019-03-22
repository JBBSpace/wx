<template>
  <div class="chart-commodity-market">
    <div class="company-name">
      <span class="label">门店名称：</span>
      <span class="select-text" @click="popupShow = !popupShow">{{companyInfo.com_name}}</span>
    </div>
    <div class="echartHistogram">
      <p class="chart-label">销售总额</p>
      <ve-line :data="chartData" :settings="chartSettings">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-line>
    </div>
    <div class="echartHistogram">
      <p class="chart-label">平均客单价</p>
      <ve-line :data="chartDataNumber" :settings="chartSettings">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-line>
    </div>
    <van-popup v-model="popupShow" position="bottom">
      <van-picker
        show-toolbar
        value-key="com_name"
        :columns="companyList"
        @cancel="popupShow = !popupShow"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    this.chartSettings = {
      labelMap: {
        sum_money: "公司销售总额",
        shop_money: "门店销售总额",
        shop_average:"门店客均单价",
        sum_average:"公司客均单价"
      }
    };
    return {
      popupShow: false,
      companyInfo: { c_com: "", com_name: "请选择门店名称", code: "" },
      companyList: [],
      chartData: {
        columns: ["month", "sum_money","shop_money"],
        rows: []
      },
      chartDataNumber: {
        columns: ["month", "sum_average","shop_average"],
        rows: []
      },
      dataEmpty: true
    };
  },
  methods: {
    initShopList() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        name: "st_shop"
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
          this.viewreportData();
        }
      });
    },
    viewreportData() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        Datetype: 5,
        comid: this.companyInfo.c_com ? this.companyInfo.c_com : ""
      };
      chartApi.rep_cjzs({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status == 0) {
          if (data.length> 0) {
            this.dataEmpty = false;
          }
          this.chartData.rows = data;
          this.chartDataNumber.rows = data;
        } else {
          this.$toast(message);
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
      this.viewreportData();
    }
  },
  mounted() {
    this.initShopList();
  }
};
</script>
<style lang="scss" scoped>
.chart-commodity-market {
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
  .echartPie,
  .echartHistogram {
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
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 70px;
    }
  }
  .echartPie .chart-label {
    background: url("../assets/pie.png") no-repeat left center;
    background-size: 40px 40px;
  }
  .echartHistogram .chart-label {
    background: url("../assets/zhu.png") no-repeat left center;
    background-size: 40px 40px;
  }
}
</style>  