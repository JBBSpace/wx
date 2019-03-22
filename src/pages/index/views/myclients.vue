<template>
  <div class="chart-week-sales">
    <div class="table">
      <p class="chart-label">我的顾客</p>
      <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      <div v-else>
        <div class="scroll-x">
          <table>
            <thead>
              <tr>
                <th>顾客姓名</th>
                <th class="wdth">近半年<br/>消费次数</th>
                <th>近半年<br/>消费金额</th>
                <th>最近订单<br/>成交日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.com_name">
                <td>{{item.c_clientname}}</td>
                <td class="wdth">{{item.c_retailcode}}</td>
                <td class="right">{{item.money}}</td>
                <td>{{item.c_shou_date}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    return {
      data: [],
      dataEmpty: true
    };
  },
  methods: {
    viewreportData() {
      const params = {
        company_id: localStorage.getItem("company_id"),
      };
      chartApi.myclients({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          if (data.length) {
            this.dataEmpty = false;
            this.data = data;
          }
        }
      });
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
.chart-week-sales {
  padding: 5px 20px 0 20px;
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
    .scroll-x {
      width: 100%;
      overflow-x: scroll;
      table {
        width:100%;
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
              &.wdth {
                width: 120px;
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
              text-align: center;
              &.wdth {
                width: 120px;
              }
              &.right {
                text-align: right;
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
}
</style>  