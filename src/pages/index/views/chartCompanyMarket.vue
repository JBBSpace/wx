<template>
  <div class="echart">
    <div class="companyName">
      <span class="label">公司名称：</span><span class="text" @click="selectCompany">{{company.com_name}}</span>
    </div>
    <div class="echartType">
      <span class="label">报表类型：</span><span v-for="item in echartTypeList" :class="[{ active: isActive(item.type) }, 'item']" :key="item.type" @click="toggleType(item.type)">{{item.text}}</span>
    </div>
    <div class="echartType">
      <span class="label">面积金额：</span><span v-for="item in echartTypeList02" :class="[{ active: isActive02(item.type) },'item02']" :key="item.type" @click="toggleType02(item.type)">{{item.text}}</span>
    </div>
    <div class="echartPie">
      <p class="label">饼形报表展示</p>
      <ve-pie :data="chartData" :settings="chartSettings">
        <div v-if="dataEmpty" class="data-empty">没有数据</div>
      </ve-pie>
      <p class="theme"><span></span>饼形统计报表</p>
    </div>
    <div class="echartHistogram">
      <p class="label">柱形报表展示</p>
      <ve-histogram :data="chartData" :extend="extend" :settings="chartSettings02">
        <div v-if="dataEmpty" class="data-empty">没有数据</div>
      </ve-histogram>
      <p class="theme"><span></span>柱形统计报表</p>
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
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
document.title = "公司销售报表";
export default {
  data: function() {
    this.chartSettings = {
      radius: 80,
      offsetY: 290,
      label: {
        fontSize: 8
      }
    };
    this.chartSettings02 = {
      labelMap: {
        money: "金额"
      },
      label: {
        fontSize: 8
      }
    };
    this.extend = {
      "xAxis.0.axisLabel.rotate": 90
    };
    return {
      show: false,
      company: {},
      columns: [],
      curType: "2",
      curType02: "0",
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
      echartTypeList02: [
        {
          text: "每平米销售金额",
          type: "0"
        },
        {
          text: "每1万租金销售金额",
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
      chartApi.initCompanyList().then(res => {
        const { status, message, data } = res.data;
        if (status == 0) {
          this.columns = data;
          this.company = data[0] ? data[0] : "请选择公司名称";
          this.viewreportData();
        } else {
          this.$toast(message);
        }
      });
    },
    viewreportData() {
      const params = {
        Datetype: this.curType,
        qryType: this.curType02,
        company: this.company.com_id ? this.company.com_id : ""
      };
      chartApi.viewreportData({ params: params }).then(res => {
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
        } else {
          this.$toast(message);
        }
      });
    },
    selectCompany() {
      this.show = !this.show;
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
    onConfirm(value, index) {
      this.company = value;
      this.show = !this.show;
      this.viewreportData();
    },
    onCancel() {
      this.show = !this.show;
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
    .item02 {
      width: 240px;
      display: inline-block;
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
  .echartType {
    margin: 50px 0;
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
    .label {
      font-size: 30px;
      padding-left: 50px;
      margin-bottom: 30px;
    }
    .theme {
      text-align: center;
      font-size: 28px;
    }
  }
  .echartPie .label {
    background: url("../assets/pie.png") no-repeat left center;
    background-size: 40px 40px;
  }
  .echartHistogram .label {
    background: url("../assets/zhu.png") no-repeat left center;
    background-size: 40px 40px;
  }
}
</style>  