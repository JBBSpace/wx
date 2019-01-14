<template>
  <div class="chart-commodity-market-two">
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
      <ve-pie :data="chartData" :settings="chartSettings" height="600px">
        <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      </ve-pie>
    </div>
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    this.chartSettings = {
      labelMap: {
        money: "实售金额"
      }
    };
    return {
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
        columns: ["comname", "money"],
        rows: []
      },
      dataEmpty: true
    };
  },
  methods: {
    viewreportData() {
      const params = {
        Datetype: this.curType,
        company_id: localStorage.getItem("company_id"),
        comid: 1
      };
      chartApi.two({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          const lng = data.length;
          if (lng > 0 && lng <= 5) {
            this.chartSettings.offsetY = 160;
          } else if (lng > 5 && lng <= 10) {
            this.chartSettings.offsetY = 260;
          } else if (lng > 10 && lng <= 20) {
            this.chartSettings.offsetY = 420;
          } else {
            this.chartSettings.offsetY = 520;
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
    toggleType(type) {
      this.curType = type;
      this.viewreportData();
    }
  },
  mounted() {
    this.viewreportData();
  }
};
</script>
<style lang="scss" scoped>
.chart-commodity-market-two {
  padding: 30px 15px 0 10px;
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
  .echartPie {
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 70px;
      background: url("../assets/pie.png") no-repeat left center;
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
}
</style>  