<template>
  <div class="chart-commodity-market">
    <div class="company-name">
      <span class="label">公司名称：</span>
      <span class="select-text" @click="popupShow = !popupShow">{{companyInfo.name}}</span>
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
    <div class="echartPie">
      <p class="chart-label">销售金额占比</p>
      <ve-pie :data="chartData" :settings="chartSettings">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-pie>
    </div>
    <div class="echartHistogram">
      <p class="chart-label">销售金额</p>
      <ve-histogram :data="chartData" :extend="extend" :settings="chartSettings02">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-histogram>
    </div>
    <div class="echartHistogram">
      <p class="chart-label">销售数量</p>
      <ve-histogram :data="chartDataNumber" :extend="extend" :settings="chartSettings02">
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
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    this.chartSettings = {
      radius: 80,
      offsetY: 290,
      label: {
        formatter: "{b} : {d}%"
      }
    };
    this.chartSettings02 = {
      labelMap: {
        money: "",
        number: ""
      }
    };
    this.extend = {
      "xAxis.0.axisLabel.rotate": 90
    };
    return {
      popupShow: false,
      companyInfo: { id: "", name: "请选择公司名称", code: "" },
      companyList: [],
      activeNames: 1,
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
        },{
          text: "昨日",
          type: "10"
        },
        {
          text: "上周报",
          type: "11"
        },
        {
          text: "上月报",
          type: "12"
        },
        {
          text: "上季度",
          type: "13"
        },
        {
          text: "上半年",
          type: "14"
        },
        {
          text: "去年",
          type: "15"
        }
      ],
      chartData: {
        columns: ["cls_name", "money"],
        rows: []
      },
      chartDataNumber: {
        columns: ["cls_name", "number"],
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
          this.viewreportData();
        }
      });
    },
    viewreportData() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        Datetype: this.curType,
        comid: this.companyInfo.id ? this.companyInfo.id : ""
      };
      chartApi.viewreportDataClass({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status == 0) {
          const lng = data.length;
          if (lng > 0 && lng <= 5) {
            this.chartSettings.offsetY = 160;
          } else if (lng > 5 && lng <= 10) {
            this.chartSettings.offsetY = 230;
          } else if (lng > 10 && lng <= 20) {
            this.chartSettings.offsetY = 300;
          } else {
            this.chartSettings.offsetY = 320;
          }
          if (lng > 0) {
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
    this.initCompanyList();
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