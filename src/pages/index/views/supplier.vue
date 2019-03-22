<template>
  <div class="chart-commodity-market-two">
    <div class="echart-type">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="报表类型：" :name="1" :border="false">
          <div class="info">
            <span
              v-for="item in echartTypeList"
              :class="[{ active: isActive(item.Datetype) }, 'item']"
              :key="item.Datetype"
              @click="toggleType(item.Datetype)"
            >{{item.text}}</span>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="cp">
        <p>报表类型：</p>
        <div class="info">
            <span
              v-for="item in echart2TypeList"
              :class="[{ active: isActive2(item.order) }, 'item']"
              :key="item.type"
              @click="toggleType2(item.order)"
            >{{item.text}}</span>
          </div>
      </div>
    </div>
      <div class="table">
      <p class="chart-label">供应商排名</p>
      <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>供应商名称</th>
              <th class="right">金额（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
              <td>{{item.supname}}</td>
              <td class="right">{{thousandBitSeparator(item.money)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    return {
      activeNames: 1,
      Datetype: "0",
      order: "P",
      echartTypeList: [
        {
          text: "日报",
          Datetype: "0"
        },
        {
          text: "周报",
          Datetype: "1"
        },
        {
          text: "月报",
          Datetype: "2"
        },
        {
          text: "季度报",
          Datetype: "3"
        },
        {
          text: "半年报",
          Datetype: "4"
        },
        {
          text: "年报",
          Datetype: "5"
        },{
          text: "昨日",
          Datetype: "10"
        },
        {
          text: "上周报",
          Datetype: "11"
        },
        {
          text: "上月报",
          Datetype: "12"
        },
        {
          text: "上季度",
          Datetype: "13"
        },
        {
          text: "上半年",
          Datetype: "14"
        },
        {
          text: "去年",
          Datetype: "15"
        }
      ],
      echart2TypeList:[{
        text: "利润",
        order: "P"
      },{
        text: "销售",
        order: "C"
      }],
      tableData: [],
      dataEmpty: true
    };
  },
  methods: {
    viewreportData() {
      const params = {
        Datetype: this.Datetype,
        company_id: localStorage.getItem("company_id"),
        order: this.order
      };
      chartApi.rep_supplier({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          const lng = data.length;
          if (lng > 0) {
            this.dataEmpty = false;
          }
          this.tableData = data;
        }
      });
    },
    isActive(isActive) {
      return this.Datetype === isActive;
    },
    isActive2(order) {
      return this.order === order;
    },
    toggleType(type) {
      this.Datetype = type;
      this.viewreportData();
    },
    toggleType2(type) {
      this.order = type;
      this.viewreportData();
    },
    thousandBitSeparator(num) {
      return (
        num &&
        (num.toString().indexOf(".") != -1
          ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
              return $1 + ",";
            })
          : num.toString().replace(/(\d)(?=(\d{3}))/g, function($0, $1) {
              return $1 + ",";
            }))
      );
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
    .cp{
      padding:0 30px;
      font-size: 26px;
      display: flex;
      align-items: center;
    }
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
  .table {
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 70px;
      background: url("../assets/table.png") no-repeat left center;
      background-size: 40px 40px;
    }
    .data-empty {
      width: 100%;
      height: calc(100vh - 400px);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.7);
      color: #888;
      font-size: 28px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 28px;
      thead {
        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
          th {
            text-align: center;
            border: 1px solid #ebedf0; /*no*/
            padding: 25px 10px;
            color: #428bca;
            background-color: #f9f9f9;
            &:nth-child(1) {
              width: 130px;
            }
            &.right {
              width: 160px;
            }
          }
        }
      }
      tbody {
        display: block;
        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
          td {
            text-align: center;
            border: 1px solid #ebedf0; /*no*/
            padding: 15px 10px;
            color: #727171;
            &:nth-child(1) {
              width: 130px;
            }
            &.right {
              width: 160px;
              text-align: right;
            }
            &.left {
              text-align: left;
            }
          }
          &:nth-child(odd) {
            background-color: #fff;
          }
          &:nth-child(even) {
            background-color: #f9f9f9;
          }
        }
      }
    }
  }
  }
</style>  