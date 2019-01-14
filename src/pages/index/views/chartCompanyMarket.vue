<template>
  <div class="chart-company-market">
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
    <div class="echartType">
      <div class="label">面积金额：</div>
      <div class="info">
        <span
          v-for="item in echartTypeList02"
          :class="[{ active: isActive02(item.type) },'item02']"
          :key="item.type"
          @click="toggleType02(item.type)"
        >{{item.text}}</span>
      </div>
    </div>
    <div class="echartPie">
      <p class="chart-label">公司销售占比</p>
      <ve-pie :data="chartData" :settings="chartSettings" :height="hgh">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-pie>
    </div>
    <div class="echartHistogram">
      <p class="chart-label">公司销售</p>
      <div class="scroll">
        <ve-histogram :data="chartData" :extend="extend" :settings="chartSettings" :width="wth">
          <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
        </ve-histogram>
      </div>
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
      offsetY: 290
    };
    this.chartSettings = {
      labelMap: {
        money: "实售金额"
      },
      label: {
        fontSize: 8
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
      curType02: "0",
      wth: "600px",
      hgh: "600px",
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
      echartTypeList02: [
        {
          text: "每平米",
          type: "0"
        },
        {
          text: "每万租金",
          type: "1"
        }
      ],
      chartData: {
        columns: ["com_name", "money"],
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
      const urlStr =
        this.curType02 == "0" ? "/report/rep_rentA/" : "/report/rep_rentB/";
      chartApi.viewreportData({ url: urlStr, params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          const lng = data.length;
          if (lng > 0 && lng <= 10) {
            this.chartSettings.offsetY = 250;
            this.wth = "350px";
            this.heigh = "400px";
          } else if (lng > 10 && lng <= 15) {
            this.chartSettings.offsetY = 270;
            this.wth = "400px";
            this.hgh = "450px";
          } else if (lng > 15 && lng <= 20) {
            this.chartSettings.offsetY = 330;
            this.wth = "400px";
            this.hgh = "500px";
          } else if (lng > 20 && lng <= 30) {
            this.chartSettings.offsetY = 450;
            this.wth = "500px";
            this.hgh = "600px";
          } else {
            this.chartSettings.offsetY = 500;
            this.wth = "600px";
            this.hgh = "600px";
          }
          if (lng > 0) {
            this.dataEmpty = false;
          }
          this.chartData.rows = data;
        }
      });
    },
    isActive(isActive) {
      return this.curType === isActive;
    },
    isActive02(isActive) {
      return this.curType02 === isActive;
    },
    toggleType(type) {
      this.curType = type;
      this.viewreportData();
    },
    toggleType02(type) {
      this.curType02 = type;
      this.viewreportData();
    },
    onConfirm(value) {
      this.company = value;
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
.chart-company-market {
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
  .echartType {
    padding: 15px 0;
    font-size: 0;
    display: flex;
    align-items: center;
    .label {
      float: left; /*子元素*/
    }
    .info {
      overflow: hidden; /*子元素*/
      .item02 {
        width: 200px;
        display: inline-block;
        line-height: 56px;
        border: 1px solid #ebedf0; /*no*/
        border-radius: 6px;
        margin-right: 30px;
        font-size: 28px;
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
  .echartPie,
  .echartHistogram {
    height: auto;
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 70px;
    }
    .scroll {
      width: 100%;
      overflow-x: scroll;
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